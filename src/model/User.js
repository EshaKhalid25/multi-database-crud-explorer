const { v4: uuidv4 } = require('uuid');

/**
 * DynamoDB User Model
 * 
 * Table Structure:
 * {
 *   userId: string (Partition Key - UUID)
 *   name: string (required)
 *   email: string (required, unique via GSI)
 *   age: number (optional)
 *   active: boolean (default: true)
 *   createdAt: number (timestamp)
 *   updatedAt: number (timestamp)
 * }
 * 
 * Note: For email uniqueness, you should create a Global Secondary Index (GSI)
 * on the 'email' attribute in DynamoDB.
 */

/**
 * Validate user data
 * @param {Object} userData - User data to validate
 * @returns {Object} - { valid: boolean, errors: Array }
 */
const validateUser = (userData) => {
  const errors = [];

  // Name validation
  if (!userData.name || typeof userData.name !== 'string' || userData.name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }

  // Email validation
  if (!userData.email || typeof userData.email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      errors.push('Email must be a valid email address');
    }
  }

  // Age validation (optional)
  if (userData.age !== undefined && userData.age !== null) {
    if (typeof userData.age !== 'number' || userData.age < 0 || userData.age > 150) {
      errors.push('Age must be a number between 0 and 150');
    }
  }

  // Active validation (optional)
  if (userData.active !== undefined && typeof userData.active !== 'boolean') {
    errors.push('Active must be a boolean value');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Prepare user data for DynamoDB
 * @param {Object} userData - Raw user data
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} - Prepared user data
 */
const prepareUserData = (userData, isUpdate = false) => {
  const timestamp = Date.now();
  const prepared = { ...userData };

  if (!isUpdate) {
    // For new users
    prepared.userId = uuidv4();
    prepared.createdAt = timestamp;
    prepared.active = prepared.active !== undefined ? prepared.active : true;
  }

  // Always update the updatedAt timestamp
  prepared.updatedAt = timestamp;

  // Remove undefined values
  Object.keys(prepared).forEach(key => {
    if (prepared[key] === undefined) {
      delete prepared[key];
    }
  });

  return prepared;
};

/**
 * Create DynamoDB table schema
 * This is for documentation - table should be created manually or via AWS CLI
 */
const getTableSchema = () => {
  return {
    TableName: 'users',
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' } // For GSI
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };
};

module.exports = {
  validateUser,
  prepareUserData,
  getTableSchema,
};
