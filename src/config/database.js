const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

/**
 * AWS DynamoDB Configuration
 * Initializes DynamoDB client with AWS SDK v3
 */

let dynamoDB = null;
let docClient = null;

/**
 * Initialize DynamoDB client
 * @returns {DynamoDBDocumentClient}
 */
const initializeDynamoDB = () => {
  try {
    const config = {
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    };

    // For local DynamoDB development
    if (process.env.DYNAMODB_ENDPOINT) {
      config.endpoint = process.env.DYNAMODB_ENDPOINT;
    }

    dynamoDB = new DynamoDBClient(config);
    
    // Create document client for easier data handling
    docClient = DynamoDBDocumentClient.from(dynamoDB, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertEmptyValues: false,
      },
      unmarshallOptions: {
        wrapNumbers: false,
      },
    });

    console.log('DynamoDB client initialized successfully');
    console.log(`Region: ${config.region}`);
    console.log(`Endpoint: ${config.endpoint || 'AWS Cloud'}`);

    return docClient;
  } catch (error) {
    console.error('DynamoDB initialization error:', error.message);
    throw error;
  }
};

/**
 * Get DynamoDB document client
 * @returns {DynamoDBDocumentClient}
 */
const getDocClient = () => {
  if (!docClient) {
    return initializeDynamoDB();
  }
  return docClient;
};

/**
 * Test DynamoDB connection
 * @returns {Promise<boolean>}
 */
const testConnection = async () => {
  try {
    const client = getDocClient();
    const tableName = process.env.DYNAMODB_TABLE_NAME;

    // Try to scan with limit 1 to test connection
    const command = new ScanCommand({
      TableName: tableName,
      Limit: 1,
    });

    await client.send(command);
    console.log('DynamoDB connection test successful');
    return true;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      console.warn(`Warning: Table '${process.env.DYNAMODB_TABLE_NAME}' not found. Please create it first.`);
      return false;
    }
    console.error('DynamoDB connection test failed:', error.message);
    return false;
  }
};

/**
 * Get table name from environment
 * @returns {string}
 */
const getTableName = () => {
  return process.env.DYNAMODB_TABLE_NAME || 'users';
};

module.exports = {
  initializeDynamoDB,
  getDocClient,
  testConnection,
  getTableName,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
};
