# Multi-Database CRUD Explorer - MongoDB

This branch demonstrates basic CRUD (Create, Read, Update, Delete) operations using **Node.js**, **Express.js**, and **MongoDB** with **Mongoose**.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Choose one option:
  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Local installation)
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud-based, free tier available)
- **npm** (comes with Node.js)
- **Postman** or any API testing tool (optional, for testing endpoints)

## 🚀 Getting Started

### 1. Installation

Clone the repository and switch to the MongoDB branch:

```bash
git clone https://github.com/EshaKhalid25/multi-database-crud-explorer.git
cd multi-database-crud-explorer
git checkout mongodb
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `mongoose` - MongoDB ODM (Object Data Modeling)
- `dotenv` - Environment variable management
- `cors` - Cross-Origin Resource Sharing
- `nodemon` - Auto-restart server during development (dev dependency)

### 3. MongoDB Setup

#### Option A: Local MongoDB

1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **Windows**: MongoDB runs as a service automatically
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
3. Verify MongoDB is running on `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Set up database access:
   - Create a database user with username and password
   - Add your IP address to the IP whitelist (or allow access from anywhere: `0.0.0.0/0`)
4. Get your connection string from the "Connect" button
5. Replace `<username>`, `<password>`, and database name in the connection string

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your MongoDB connection details:

```env
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/multi-db-explorer

# OR for MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/multi-db-explorer?retryWrites=true&w=majority

PORT=3000
NODE_ENV=development
```

### 5. Run the Application

**Development mode** (auto-restart on file changes):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
multi-database-crud-explorer/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection configuration
│   ├── controllers/
│   │   └── userController.js # CRUD operation handlers
│   ├── model/
│   │   └── User.js           # User schema and model
│   └── routes/
│       └── userRoutes.js     # API route definitions
├── .env                       # Environment variables (create this)
├── .env.example               # Environment template
├── .gitignore
├── index.js                   # Main server file
├── package.json
└── README.md
```

## 🔌 API Endpoints

Base URL: `http://localhost:3000`

### Root Endpoint
- **GET** `/` - Welcome message and API documentation

### User Endpoints

| Method |      Endpoint    |   Description     |
|--------|------------------|-------------------|
| POST   | `/api/users`     | Create a new user |
| GET    | `/api/users`     | Get all users     |
| GET    | `/api/users/:id` | Get user by ID    |
| PUT    | `/api/users/:id` | Update user by ID |
| DELETE | `/api/users/:id` | Delete user by ID |

## 📝 API Usage Examples

### 1. Create a User
```http
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "active": true,
    "createdAt": "2026-02-28T10:00:00.000Z",
    "updatedAt": "2026-02-28T10:00:00.000Z"
  }
}
```

### 2. Get All Users
```http
GET http://localhost:3000/api/users
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 30,
      "active": true
    },
    {
      "_id": "507f191e810c19729de860ea",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "age": 25,
      "active": true
    }
  ]
}
```

### 3. Get User by ID
```http
GET http://localhost:3000/api/users/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "active": true
  }
}
```

### 4. Update User
```http
PUT http://localhost:3000/api/users/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "name": "John Updated",
  "age": 31
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john.doe@example.com",
    "age": 31,
    "active": true,
    "updatedAt": "2026-02-28T11:00:00.000Z"
  }
}
```

### 5. Delete User
```http
DELETE http://localhost:3000/api/users/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "data": {},
  "message": "User deleted successfully"
}
```

## 🗄️ Database Schema

### User Model

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validated: true (email format)
  },
  age: {
    type: Number,
    min: 0,
    max: 150
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: Date,    // Automatically generated
  updatedAt: Date     // Automatically updated
}
```

## 🧪 Testing the API

### Using cURL

```bash
# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":30}'

# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/YOUR_USER_ID

# Update user
curl -X PUT http://localhost:3000/api/users/YOUR_USER_ID \
  -H "Content-Type: application/json" \
  -d '{"age":31}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/YOUR_USER_ID
```

### Using Postman

1. Import the collection or create requests manually
2. Set the base URL to `http://localhost:3000`
3. For POST and PUT requests, set body type to `raw` and format to `JSON`
4. Add the JSON data in the request body

## ⚙️ MongoDB Features Used

- **Mongoose ODM**: Object Data Modeling for MongoDB
- **Schema Validation**: Enforce data structure and types
- **Schema Middleware**: Automatic timestamps (createdAt, updatedAt)
- **Indexing**: Unique email constraint
- **Query Methods**: find(), findById(), findByIdAndUpdate(), findByIdAndDelete()

## 🔍 Monitoring MongoDB

### Using MongoDB Compass
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your connection string
3. View collections, documents, and run queries visually

### Using MongoDB CLI
```bash
# Connect to local MongoDB
mongosh

# Switch to database
use multi-db-explorer

# View all collections
show collections

# View all users
db.users.find()

# View users formatted
db.users.find().pretty()

# Count documents
db.users.countDocuments()
```

## ❗ Common Issues & Solutions

### Issue: Cannot connect to MongoDB
- **Solution**: Ensure MongoDB service is running
- Check the connection string in `.env` file
- For Atlas: Verify IP whitelist and credentials

### Issue: "User validation failed"
- **Solution**: Check required fields (name, email)
- Ensure email format is valid
- Age must be between 0-150

### Issue: "E11000 duplicate key error"
- **Solution**: Email already exists in database
- Use a different email address

### Issue: Port 3000 already in use
- **Solution**: Change PORT in `.env` file
- Or kill the process using port 3000

## 📚 Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)

## 🤝 Contributing

Feel free to fork this repository and submit pull requests!

---

**Next Database**: Check out the other branches to explore CRUD operations with Firebase, MySQL, PostgreSQL, and DynamoDB!
