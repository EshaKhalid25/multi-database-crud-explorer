const { getUsersCollection, validateUser, emailExists, prepareUserData } = require('../model/User');

/**
 * Controller: Create a new user
 * POST /api/users
 * 
 * @param {Object} req.body - { name, email, age?, active? }
 * @returns {Object} - { id, name, email, age, active, createdAt, updatedAt }
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
    const exists = await emailExists(userData.email);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Prepare user data with timestamps
    const preparedData = prepareUserData(userData, false);

    // Add user to Firestore
    const usersRef = getUsersCollection();
    const docRef = await usersRef.add(preparedData);

    // Retrieve the created document
    const docSnap = await docRef.get();
    const createdUser = {
      id: docSnap.id,
      ...docSnap.data(),
    };

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: createdUser,
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
 * GET /api/users?page=1&limit=10
 * 
 * @returns {Array} - List of users
 */
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const usersRef = getUsersCollection();
    
    // Get all users ordered by createdAt
    const snapshot = await usersRef.orderBy('createdAt', 'desc').get();

    // Manual pagination (Firestore doesn't have built-in offset)
    const allUsers = [];
    snapshot.forEach(doc => {
      allUsers.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: allUsers.length,
        totalPages: Math.ceil(allUsers.length / limit),
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
 * @param {string} req.params.id - User document ID
 * @returns {Object} - User data
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const usersRef = getUsersCollection();
    const docSnap = await usersRef.doc(id).get();

    if (!docSnap.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = {
      id: docSnap.id,
      ...docSnap.data(),
    };

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
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
 * @param {string} req.params.id - User document ID
 * @param {Object} req.body - Updated user data
 * @returns {Object} - Updated user data
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if user exists
    const usersRef = getUsersCollection();
    const docSnap = await usersRef.doc(id).get();

    if (!docSnap.exists) {
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
    if (updateData.email) {
      const exists = await emailExists(updateData.email, id);
      if (exists) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists',
        });
      }
    }

    // Prepare update data with timestamp
    const preparedData = prepareUserData(updateData, true);

    // Update user document
    await usersRef.doc(id).update(preparedData);

    // Retrieve updated document
    const updatedSnap = await usersRef.doc(id).get();
    const updatedUser = {
      id: updatedSnap.id,
      ...updatedSnap.data(),
    };

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
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
 * @param {string} req.params.id - User document ID
 * @returns {Object} - Success message
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const usersRef = getUsersCollection();
    const docSnap = await usersRef.doc(id).get();

    if (!docSnap.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete user document
    await usersRef.doc(id).delete();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {
        id,
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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
