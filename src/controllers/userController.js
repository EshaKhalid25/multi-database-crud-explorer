const { 
  getDocClient, 
  getTableName,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand 
} = require('../config/database');
const { validateUser, prepareUserData } = require('../model/User');
const { QueryCommand } = require('@aws-sdk/lib-dynamodb');

/**
 * Controller: Create a new user
 * POST /api/users
 * 
 * @param {Object} req.body - { name, email, age?, active? }
 * @returns {Object} - { userId, name, email, age, active, createdAt, updatedAt }
 */
const createUser = async (req, res) => {
  try {
    const userData = req.body;

    // Validate user data
    const validation = validateUser(userData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(userData.email);
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Prepare user data with UUID and timestamps
    const preparedData = prepareUserData(userData, false);

    // Insert into DynamoDB
    const docClient = getDocClient();
    const tableName = getTableName();

    const command = new PutCommand({
      TableName: tableName,
      Item: preparedData,
    });

    await docClient.send(command);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: preparedData,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message,
    });
  }
};

/**
 * Controller: Get all users with pagination
 * GET /api/users?limit=10&lastKey=...
 * 
 * @returns {Array} - List of users
 */
const getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const lastKey = req.query.lastKey ? JSON.parse(req.query.lastKey) : undefined;

    const docClient = getDocClient();
    const tableName = getTableName();

    const params = {
      TableName: tableName,
      Limit: limit,
    };

    if (lastKey) {
      params.ExclusiveStartKey = lastKey;
    }

    const command = new ScanCommand(params);
    const response = await docClient.send(command);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: response.Items || [],
      pagination: {
        count: response.Items?.length || 0,
        lastKey: response.LastEvaluatedKey,
        hasMore: !!response.LastEvaluatedKey,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

/**
 * Controller: Get user by ID
 * GET /api/users/:id
 * 
 * @param {string} req.params.id - User ID (userId)
 * @returns {Object} - User data
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const docClient = getDocClient();
    const tableName = getTableName();

    const command = new GetCommand({
      TableName: tableName,
      Key: { userId: id },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: response.Item,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

/**
 * Controller: Update user by ID
 * PUT /api/users/:id
 * 
 * @param {string} req.params.id - User ID
 * @param {Object} req.body - Updated user data
 * @returns {Object} - Updated user data
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if user exists
    const docClient = getDocClient();
    const tableName = getTableName();

    const getCommand = new GetCommand({
      TableName: tableName,
      Key: { userId: id },
    });

    const existingUser = await docClient.send(getCommand);

    if (!existingUser.Item) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Validate update data
    const validation = validateUser(updateData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Check if email already exists (excluding current user)
    if (updateData.email && updateData.email !== existingUser.Item.email) {
      const emailExists = await checkEmailExists(updateData.email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists',
        });
      }
    }

    // Build update expression
    const preparedData = prepareUserData(updateData, true);
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(preparedData).forEach((key, index) => {
      if (key !== 'userId') {
        updateExpression.push(`#attr${index} = :val${index}`);
        expressionAttributeNames[`#attr${index}`] = key;
        expressionAttributeValues[`:val${index}`] = preparedData[key];
      }
    });

    const updateCommand = new UpdateCommand({
      TableName: tableName,
      Key: { userId: id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(updateCommand);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: response.Attributes,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

/**
 * Controller: Delete user by ID
 * DELETE /api/users/:id
 * 
 * @param {string} req.params.id - User ID
 * @returns {Object} - Success message
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const docClient = getDocClient();
    const tableName = getTableName();

    // Check if user exists
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: { userId: id },
    });

    const existingUser = await docClient.send(getCommand);

    if (!existingUser.Item) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete user
    const deleteCommand = new DeleteCommand({
      TableName: tableName,
      Key: { userId: id },
    });

    await docClient.send(deleteCommand);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {
        userId: id,
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

/**
 * Helper: Check if email exists in database
 * Uses Global Secondary Index (EmailIndex) if available
 * @param {string} email - Email to check
 * @returns {Promise<boolean>}
 */
const checkEmailExists = async (email) => {
  try {
    const docClient = getDocClient();
    const tableName = getTableName();

    // Try to query using EmailIndex GSI
    const command = new QueryCommand({
      TableName: tableName,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
      Limit: 1,
    });

    const response = await docClient.send(command);
    return response.Items && response.Items.length > 0;
  } catch (error) {
    // If EmailIndex doesn't exist, fallback to scan (not recommended for production)
    if (error.name === 'ValidationException' || error.name === 'ResourceNotFoundException') {
      console.warn('EmailIndex not found, using scan (slow). Please create EmailIndex GSI.');
      const scanCommand = new ScanCommand({
        TableName: getTableName(),
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
        Limit: 1,
      });
      const docClient = getDocClient();
      const response = await docClient.send(scanCommand);
      return response.Items && response.Items.length > 0;
    }
    throw error;
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
