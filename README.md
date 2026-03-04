# Multi-Database CRUD Explorer - DynamoDB Branch

This branch demonstrates **CRUD operations** using **AWS DynamoDB** (NoSQL Key-Value and Document Database) with Node.js and Express.js.

## Table of Contents

- [Overview](#overview)
- [DynamoDB vs Other Databases](#dynamodb-vs-other-databases)
- [Prerequisites](#prerequisites)
- [DynamoDB Setup Options](#dynamodb-setup-options)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Code Examples](#code-examples)
- [DynamoDB Features](#dynamodb-features)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Overview

**Amazon DynamoDB** is a fully managed **NoSQL database service** that provides fast and predictable performance with seamless scalability. It's designed for applications that need consistent, single-digit millisecond latency at any scale.

### Key Features:
- Fully managed serverless database
- Automatic scaling
- Built-in security and backup
- Global tables for multi-region replication
- Event-driven programming with DynamoDB Streams
- Low latency for mission-critical applications

---

## DynamoDB vs Other Databases

| Feature | DynamoDB | MongoDB | Firebase | MySQL/PostgreSQL |
|---------|----------|---------|----------|------------------|
| **Type** | NoSQL Key-Value | NoSQL Document | NoSQL Document | SQL Relational |
| **Hosting** | AWS Cloud | Self/Cloud | Google Cloud | Self/Cloud |
| **Schema** | Flexible | Flexible | Flexible | Fixed |
| **Queries** | Key-based, GSI | Rich queries | Limited | Complex joins |
| **Scaling** | Automatic | Manual/Atlas | Automatic | Manual |
| **Pricing** | Pay-per-use | Server-based | Pay-per-use | Server-based |
| **Performance** | Single-digit ms | Fast | Fast | Varies |
| **Best For** | High-scale apps | Complex queries | Mobile/Web | Relational data |

---

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **AWS Account** (for production) - [Sign up](https://aws.amazon.com/)
- **Git** - [Download](https://git-scm.com/)
- **Postman** or **cURL** (for API testing)

For local development:
- **Java Runtime Environment** (JRE 8.x or higher) - Required for DynamoDB Local
- **DynamoDB Local** - [Download](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)

---

## DynamoDB Setup Options

You have two options for running DynamoDB:

### Option 1: DynamoDB Local (Recommended for Development)

DynamoDB Local is a downloadable version that runs on your computer for development and testing.

**Download DynamoDB Local:**

1. Visit: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html
2. Download the archive (.zip or .tar.gz)
3. Extract to a folder (e.g., `C:\DynamoDB` or `~/dynamodb`)

**Start DynamoDB Local:**

Windows:
```bash
cd C:\DynamoDB
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

Mac/Linux:
```bash
cd ~/dynamodb
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

**Options:**
- `-sharedDb` - Use a single database file (useful for development)
- `-inMemory` - Don't save data to disk
- `-port 8000` - Port number (default: 8000)

DynamoDB Local will run on: `http://localhost:8000`

### Option 2: AWS DynamoDB Cloud

For production or AWS-integrated applications:

1. Create an AWS account
2. Go to DynamoDB console
3. Create a table
4. Configure IAM credentials

**Required AWS Credentials:**
- Access Key ID
- Secret Access Key
- Region (e.g., us-east-1)

---

## Installation

### 1. Clone Repository and Switch Branch

```bash
git clone <repository-url>
cd multi-database-crud-explorer
git checkout dynamodb
```

### 2. Install Dependencies

```bash
npm install
```

**Installed packages:**
- `@aws-sdk/client-dynamodb` (3.1001.0) - AWS SDK v3 DynamoDB client
- `@aws-sdk/lib-dynamodb` (3.1001.0) - Document client wrapper
- `uuid` (11.0.5) - Generate unique user IDs
- `express` (5.2.1) - Web framework
- `dotenv` (17.3.1) - Environment variables
- `cors` (2.8.6) - Cross-Origin Resource Sharing
- `nodemon` (3.1.14) - Dev auto-restart (dev dependency)

---

## Configuration

### 1. Create `.env` File

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

**For Local DynamoDB:**
```env
# AWS DynamoDB Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
DYNAMODB_TABLE_NAME=users
DYNAMODB_ENDPOINT=http://localhost:8000

# Server Configuration
PORT=3000
NODE_ENV=development
```

**For AWS Cloud DynamoDB:**
```env
# AWS DynamoDB Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-actual-access-key-id
AWS_SECRET_ACCESS_KEY=your-actual-secret-access-key
DYNAMODB_TABLE_NAME=users
# DYNAMODB_ENDPOINT=  (leave commented for AWS Cloud)

# Server Configuration
PORT=3000
NODE_ENV=production
```

**Important Notes:**
- For local development, use dummy credentials (`test`)
- For AWS Cloud, use real IAM credentials
- Never commit real credentials to Git

---

## Create DynamoDB Table

### Method 1: AWS CLI (Recommended)

**Install AWS CLI:**
- Windows: [Download installer](https://aws.amazon.com/cli/)
- Mac: `brew install awscli`
- Linux: `sudo apt install awscli`

**Create Table:**

```bash
aws dynamodb create-table \
    --table-name users \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=email,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --global-secondary-indexes \
        "[{\"IndexName\": \"EmailIndex\",\"KeySchema\":[{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}], \
        \"Projection\":{\"ProjectionType\":\"ALL\"}, \
        \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}}]" \
    --endpoint-url http://localhost:8000
```

**For Windows PowerShell:**
```powershell
aws dynamodb create-table `
    --table-name users `
    --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=email,AttributeType=S `
    --key-schema AttributeName=userId,KeyType=HASH `
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 `
    --global-secondary-indexes "[{\"IndexName\": \"EmailIndex\",\"KeySchema\":[{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}]" `
    --endpoint-url http://localhost:8000
```

**Remove `--endpoint-url` for AWS Cloud**

### Method 2: Using Node.js Script

Create a file `createTable.js`:

```javascript
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

const params = {
  TableName: 'users',
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'email', AttributeType: 'S' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'EmailIndex',
      KeySchema: [
        { AttributeName: 'email', KeyType: 'HASH' }
      ],
      Projection: { ProjectionType: 'ALL' },
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

const createTable = async () => {
  try {
    const command = new CreateTableCommand(params);
    const response = await client.send(command);
    console.log('Table created successfully:', response.TableDescription.TableName);
  } catch (error) {
    console.error('Error creating table:', error.message);
  }
};

createTable();
```

Run:
```bash
node createTable.js
```

### Method 3: AWS Console

1. Go to [DynamoDB Console](https://console.aws.amazon.com/dynamodb/)
2. Click **"Create table"**
3. Table name: `users`
4. Partition key: `userId` (String)
5. Click **"Create table"**
6. After creation, go to **Indexes** tab
7. Create Global Secondary Index:
   - Index name: `EmailIndex`
   - Partition key: `email` (String)
   - Projection type: All

---

## Project Structure

```
multi-database-crud-explorer/
├── src/
│   ├── config/
│   │   └── database.js          # DynamoDB client initialization
│   ├── controllers/
│   │   └── userController.js    # CRUD controller functions
│   ├── model/
│   │   └── User.js               # User model & validation
│   └── routes/
│       └── userRoutes.js         # API route definitions
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── index.js                      # Server entry point
├── package.json                  # Dependencies & scripts
└── README.md                     # Documentation
```

---

## Running the Application

### 1. Start DynamoDB Local

```bash
cd C:\DynamoDB
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

### 2. Create Table (if not already created)

```bash
# Run the AWS CLI command or Node.js script from above
```

### 3. Start the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### Expected Output

```
Initializing DynamoDB...
DynamoDB client initialized successfully
Region: us-east-1
Endpoint: http://localhost:8000
DynamoDB connection test successful

Server started successfully
Running on: http://localhost:3000
Database: AWS DynamoDB
Table: users
Environment: development

API Endpoints:
   GET    /                - Welcome message
   GET    /health          - Health check
   POST   /api/users       - Create user
   GET    /api/users       - Get all users
   GET    /api/users/:id   - Get user by ID
   PUT    /api/users/:id   - Update user
   DELETE /api/users/:id   - Delete user

Ready to accept requests!
```

---

## API Documentation

Base URL: `http://localhost:3000`

### 1. Create User

**POST** `/api/users`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "active": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "active": true,
    "createdAt": 1709568000000,
    "updatedAt": 1709568000000
  }
}
```

---

### 2. Get All Users

**GET** `/api/users?limit=10&lastKey=...`

**Query Parameters:**
- `limit` (optional): Items per page (default: 10)
- `lastKey` (optional): JSON string for pagination

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "active": true,
      "createdAt": 1709568000000,
      "updatedAt": 1709568000000
    }
  ],
  "pagination": {
    "count": 1,
    "lastKey": null,
    "hasMore": false
  }
}
```

**Pagination Example:**
```bash
# First page
curl http://localhost:3000/api/users?limit=2

# Next page (use lastKey from previous response)
curl "http://localhost:3000/api/users?limit=2&lastKey=%7B%22userId%22%3A%22abc%22%7D"
```

---

### 3. Get User by ID

**GET** `/api/users/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "active": true,
    "createdAt": 1709568000000,
    "updatedAt": 1709568000000
  }
}
```

---

### 4. Update User

**PUT** `/api/users/:id`

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "age": 31,
  "active": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "age": 31,
    "active": false,
    "createdAt": 1709568000000,
    "updatedAt": 1709568100000
  }
}
```

---

### 5. Delete User

**DELETE** `/api/users/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## Code Examples

### Using cURL

**Create User:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"age\":28}"
```

**Get All Users:**
```bash
curl http://localhost:3000/api/users?limit=5
```

**Get User by ID:**
```bash
curl http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000
```

**Update User:**
```bash
curl -X PUT http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice Updated\",\"age\":29}"
```

**Delete User:**
```bash
curl -X DELETE http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000
```

---

## DynamoDB Features

### Partition Key (Hash Key)

DynamoDB uses `userId` as the partition key:
- Uniquely identifies each item
- Used for direct lookups (fast)
- Automatically distributed across partitions

### Global Secondary Index (GSI)

EmailIndex GSI allows querying by email:
- Fast email lookups and uniqueness checks
- Separate provisioned capacity
- Eventually consistent

**Without GSI:** Must scan entire table (slow)
**With GSI:** Direct query (fast)

### Timestamps

Unix timestamps (milliseconds since epoch):
```javascript
createdAt: 1709568000000  // March 4, 2026
updatedAt: 1709568100000
```

### Auto-generated IDs

Uses UUID v4 for user IDs:
```javascript
userId: "550e8400-e29b-41d4-a716-446655440000"
```

### Pagination

DynamoDB returns a `LastEvaluatedKey` for pagination:
```javascript
{
  "data": [...],
  "pagination": {
    "lastKey": {"userId": "abc-123"},
    "hasMore": true
  }
}
```

---

## Troubleshooting

### Error: "Cannot find module '@aws-sdk/client-dynamodb'"

**Solution:**
```bash
npm install
```

---

### Error: "ResourceNotFoundException: Cannot do operations on a non-existent table"

**Cause:** Table doesn't exist

**Solution:** Create the table using AWS CLI or Node.js script (see above)

---

### Error: "connect ECONNREFUSED 127.0.0.1:8000"

**Cause:** DynamoDB Local is not running

**Solution:**
```bash
cd C:\DynamoDB
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

---

### Error: "Unable to locate credentials"

**Cause:** Missing AWS credentials in `.env`

**Solution:**
For local development, use dummy credentials:
```env
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

For AWS Cloud, use real IAM credentials

---

### Warning: "EmailIndex not found, using scan"

**Cause:** Global Secondary Index not created

**Impact:** Slow email uniqueness checks (scans entire table)

**Solution:** Create EmailIndex GSI (see table creation above)

---

### Port 3000 already in use

**Solution:**

Change port in `.env`:
```env
PORT=3001
```

Or kill process on port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## Best Practices

### 1. Use UUIDs for IDs

- Ensures uniqueness across distributed systems
- No auto-increment issues
- Better partition distribution

### 2. Create GSIs for Queries

- Index frequently queried attributes
- Enables fast lookups
- Avoid full table scans

### 3. Handle Pagination

- Use `LastEvaluatedKey` for next page
- Don't load all items at once
- Implement efficient pagination in UI

### 4. Use Provisioned vs On-Demand

**Provisioned:**
- Predictable workload
- Lower cost if traffic is consistent
- Requires capacity planning

**On-Demand:**
- Unpredictable traffic
- Pay per request
- No capacity planning

### 5. Monitor Costs

DynamoDB charges for:
- Read/Write capacity units
- Storage
- Data transfer
- GSI capacity

Use AWS Cost Explorer to monitor spending

### 6. Security

- Never hardcode credentials
- Use IAM roles in production
- Enable encryption at rest
- Use VPC endpoints for private access

---

## DynamoDB vs MongoDB

| Feature | DynamoDB | MongoDB |
|---------|----------|---------|
| **Primary Key** | Required (Hash + optional Sort) | Optional _id |
| **Queries** | Key-based + GSI | Rich query language |
| **Joins** | Not supported | $lookup operator |
| **Transactions** | Supported | Supported |
| **Scaling** | Automatic | Manual/Atlas |
| **Cost Model** | Pay-per-request | Server-based |
| **Schema** | Schemaless | Schemaless |
| **Best For** | AWS ecosystem, high scale | Complex queries, flexibility |

---

## Useful Resources

- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
- [AWS SDK v3 for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [DynamoDB Pricing](https://aws.amazon.com/dynamodb/pricing/)

---

## Notes

- **Partition Key:** `userId` (UUID v4)
- **GSI:** `EmailIndex` on `email` attribute
- **Timestamps:** Unix epoch milliseconds
- **Pagination:** Use `LastEvaluatedKey`
- **Local Development:** Use DynamoDB Local on port 8000
- **Production:** Use AWS DynamoDB with real credentials

---

## Next Steps

1. Start DynamoDB Local
2. Create the `users` table with EmailIndex GSI
3. Configure `.env` file
4. Run `npm install`
5. Start server with `npm run dev`
6. Test API endpoints with Postman/cURL
7. Explore AWS DynamoDB console
8. Learn about DynamoDB Streams
9. Implement caching with DynamoDB DAX
10. Deploy to AWS Lambda + API Gateway

---

**Happy Coding!**
