# Multi-Database CRUD Explorer - MySQL

This branch demonstrates basic CRUD (Create, Read, Update, Delete) operations using **Node.js**, **Express.js**, and **MySQL** with the **mysql2** driver.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)
- **Postman** or any API testing tool (optional, for testing endpoints)

## 🚀 Getting Started

### 1. Installation

Clone the repository and switch to the MySQL branch:

```bash
git clone https://github.com/EshaKhalid25/multi-database-crud-explorer.git
cd multi-database-crud-explorer
git checkout mysql
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `mysql2` - MySQL client for Node.js (with Promise support)
- `dotenv` - Environment variable management
- `cors` - Cross-Origin Resource Sharing
- `nodemon` - Auto-restart server during development (dev dependency)

### 3. MySQL Setup

#### For Windows:

1. **Download MySQL**: Visit [MySQL Downloads](https://dev.mysql.com/downloads/installer/)
2. **Run MySQL Installer**: Double-click the `.msi` file
3. **Installation steps**:
   - Choose **Developer Default** or **Server Only**
   - Click **Next** through prerequisites
   - Click **Execute** to download components
   - **MySQL Server Configuration**:
     - Config Type: Development Computer
     - Authentication: Use Strong Password Encryption (recommended)
     - **Set root password** (remember this!)
     - Create MySQL user account (optional)
   - Complete installation

4. **Verify Installation**:
   ```powershell
   mysql --version
   ```

#### For Mac:

```bash
# Using Homebrew
brew install mysql
brew services start mysql

# Secure installation
mysql_secure_installation

# Verify installation
mysql --version
```

#### For Linux (Ubuntu/Debian):

```bash
# Install MySQL
sudo apt update
sudo apt install mysql-server

# Start service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation

# Verify installation
mysql --version
```

### 4. Create Database

Connect to MySQL and create your database:

**All Platforms:**
```bash
mysql -u root -p
```

Enter your root password, then run:
```sql
-- Create database
CREATE DATABASE multi_db_explorer;

-- Use the database
USE multi_db_explorer;

-- Verify
SELECT DATABASE();

-- Exit
EXIT;
```

### 5. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your MySQL credentials:

```env
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=multi_db_explorer

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Important**: Replace `your_password_here` with the root password you set during MySQL installation.

### 6. Run the Application

**Development mode** (auto-restart on file changes):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will:
1. Connect to MySQL
2. Automatically create the `users` table if it doesn't exist
3. Start on `http://localhost:3000`

## 📁 Project Structure

```
multi-database-crud-explorer/
├── src/
│   ├── config/
│   │   └── database.js       # MySQL connection pool
│   ├── controllers/
│   │   └── userController.js # CRUD operation handlers
│   ├── model/
│   │   └── User.js           # User table schema
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

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create a new user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user by ID |
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
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "active": 1,
    "created_at": "2026-03-04T10:00:00.000Z",
    "updated_at": "2026-03-04T10:00:00.000Z"
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
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 30,
      "active": 1,
      "created_at": "2026-03-04T10:00:00.000Z",
      "updated_at": "2026-03-04T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "age": 25,
      "active": 1,
      "created_at": "2026-03-04T10:05:00.000Z",
      "updated_at": "2026-03-04T10:05:00.000Z"
    }
  ]
}
```

### 3. Get User by ID
```http
GET http://localhost:3000/api/users/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "active": 1,
    "created_at": "2026-03-04T10:00:00.000Z",
    "updated_at": "2026-03-04T10:00:00.000Z"
  }
}
```

### 4. Update User
```http
PUT http://localhost:3000/api/users/1
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
    "id": 1,
    "name": "John Updated",
    "email": "john.doe@example.com",
    "age": 31,
    "active": 1,
    "created_at": "2026-03-04T10:00:00.000Z",
    "updated_at": "2026-03-04T11:00:00.000Z"
  }
}
```

### 5. Delete User
```http
DELETE http://localhost:3000/api/users/1
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

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  age INT CHECK (age >= 0 AND age <= 150),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Auto-incrementing primary key
- `name` - User's name (max 50 characters, required)
- `email` - User's email (max 100 characters, unique, required)
- `age` - User's age (0-150, optional)
- `active` - Account status (boolean/tinyint, default: true/1)
- `created_at` - Record creation timestamp (auto-set)
- `updated_at` - Record last update timestamp (auto-updates)

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
curl http://localhost:3000/api/users/1

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"age":31}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

### Using Postman

1. Import the collection or create requests manually
2. Set the base URL to `http://localhost:3000`
3. For POST and PUT requests, set body type to `raw` and format to `JSON`
4. Add the JSON data in the request body

## ⚙️ MySQL Features Used

- **Connection Pooling**: Efficient connection management with `mysql2.createPool()`
- **Parameterized Queries**: Protection against SQL injection using `?` placeholders
- **Auto-Increment Primary Key**: Automatic ID generation
- **Constraints**: 
  - UNIQUE constraint on email
  - CHECK constraint on age
  - NOT NULL constraints
- **Auto Timestamps**: 
  - `created_at` - Auto-set on INSERT
  - `updated_at` - Auto-updates on UPDATE
- **Promise Support**: Using `mysql2/promise` for async/await syntax

## 🔍 Monitoring MySQL

### Using MySQL CLI

```bash
# Connect to database
mysql -u root -p -D multi_db_explorer

# List all tables
SHOW TABLES;

# Describe users table
DESCRIBE users;

# View all users
SELECT * FROM users;

# Count users
SELECT COUNT(*) FROM users;

# View recent users
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;

# Exit
EXIT;
```

### Using MySQL Workbench (GUI)

1. Download [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
2. Open MySQL Workbench
3. Connect to your local MySQL server
4. Navigate to `multi_db_explorer` database
5. Browse tables and data visually

### Useful MySQL Queries

```sql
-- View table structure
SHOW CREATE TABLE users;

-- Check for duplicate emails
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Get active users only
SELECT * FROM users WHERE active = 1;

-- Search users by name (case-insensitive)
SELECT * FROM users WHERE name LIKE '%john%';

-- Get user statistics
SELECT 
  COUNT(*) as total_users,
  AVG(age) as average_age,
  MIN(age) as youngest,
  MAX(age) as oldest
FROM users;

-- Get recently updated users
SELECT * FROM users 
ORDER BY updated_at DESC 
LIMIT 10;
```

## ❗ Common Issues & Solutions

### Issue: "mysql: command not found"
- **Solution**: Add MySQL to your system PATH
- **Windows**: Add `C:\Program Files\MySQL\MySQL Server 8.0\bin` to PATH
- **Mac**: `echo 'export PATH="/usr/local/mysql/bin:$PATH"' >> ~/.zshrc`

### Issue: "Access denied for user 'root'@'localhost'"
- **Solution**: Update `DB_PASSWORD` in `.env` file with correct password
- Or reset MySQL root password:
  ```bash
  # Stop MySQL service
  # Windows: Services → MySQL → Stop
  # Mac: brew services stop mysql
  
  # Start in safe mode and reset password
  mysqld --skip-grant-tables
  mysql -u root
  ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
  FLUSH PRIVILEGES;
  ```

### Issue: "Unknown database 'multi_db_explorer'"
- **Solution**: Create the database first:
  ```sql
  CREATE DATABASE multi_db_explorer;
  ```

### Issue: Port 3306 already in use
- **Solution**: Check if another MySQL instance is running
  ```bash
  # Windows
  netstat -ano | findstr :3306
  
  # Mac/Linux
  lsof -i :3306
  ```

### Issue: "ER_NOT_SUPPORTED_AUTH_MODE"
- **Solution**: MySQL 8.0 uses new authentication. Change it:
  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
  FLUSH PRIVILEGES;
  ```

## 📚 MySQL vs PostgreSQL

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| Type | SQL (Relational) | SQL (Relational) |
| Performance | Faster for reads | Better for complex queries |
| ACID Compliance | Yes | Yes |
| JSON Support | Good | Excellent |
| Auto-Increment | AUTO_INCREMENT | SERIAL |
| Placeholder | `?` | `$1, $2` |
| Case Sensitivity | Case-insensitive by default | Case-sensitive |
| Best For | Web apps, read-heavy | Analytics, complex queries |

## 📚 Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [mysql2 npm Package](https://www.npmjs.com/package/mysql2)
- [MySQL Tutorial](https://www.mysqltutorial.org/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

Feel free to fork this repository and submit pull requests!

---

**Next Database**: Check out the other branches to explore CRUD operations with MongoDB, PostgreSQL, Firebase, and DynamoDB!
