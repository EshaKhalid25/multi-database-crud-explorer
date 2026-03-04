# Multi-Database CRUD Explorer - PostgreSQL

This branch demonstrates basic CRUD (Create, Read, Update, Delete) operations using **Node.js**, **Express.js**, and **PostgreSQL** with the **pg** driver.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)
- **Postman** or any API testing tool (optional, for testing endpoints)

## 🚀 Getting Started

### 1. Installation

Clone the repository and switch to the PostgreSQL branch:

```bash
git clone https://github.com/EshaKhalid25/multi-database-crud-explorer.git
cd multi-database-crud-explorer
git checkout postgresql
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `pg` - PostgreSQL client for Node.js
- `dotenv` - Environment variable management
- `cors` - Cross-Origin Resource Sharing
- `nodemon` - Auto-restart server during development (dev dependency)

### 3. PostgreSQL Setup

#### For Windows:

1. **Download PostgreSQL**: Visit [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
2. **Run the installer**: Double-click the `.exe` file
3. **Installation steps**:
   - Select installation directory (default: `C:\Program Files\PostgreSQL\18`)
   - Select components (PostgreSQL Server, pgAdmin, Command Line Tools)
   - Set data directory (default is fine)
   - **Set password for postgres user** (remember this!)
   - Set port: `5432` (default)
   - Complete installation

4. **Verify Installation**:
   ```powershell
   psql --version
   ```

#### For Mac:

```bash
# Using Homebrew
brew install postgresql@18
brew services start postgresql@18

# Verify installation
psql --version
```

#### For Linux (Ubuntu/Debian):

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### 4. Create Database

Connect to PostgreSQL and create your database:

**Windows (PowerShell/CMD):**
```bash
psql -U postgres
```

**Mac/Linux:**
```bash
sudo -u postgres psql
```

Then run these SQL commands:
```sql
-- Create database
CREATE DATABASE multi_db_explorer;

-- Connect to the database
\c multi_db_explorer

-- Verify connection
SELECT current_database();

-- Exit
\q
```

### 5. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your PostgreSQL credentials:

```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=multi_db_explorer

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Important**: Replace `your_password_here` with the password you set during PostgreSQL installation.

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
1. Connect to PostgreSQL
2. Automatically create the `users` table if it doesn't exist
3. Start on `http://localhost:3000`

## 📁 Project Structure

```
multi-database-crud-explorer/
├── src/
│   ├── config/
│   │   └── database.js       # PostgreSQL connection pool
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
    "active": true,
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
      "active": true,
      "created_at": "2026-03-04T10:00:00.000Z",
      "updated_at": "2026-03-04T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "age": 25,
      "active": true,
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
    "active": true,
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
    "active": true,
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
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  age INTEGER CHECK (age >= 0 AND age <= 150),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Auto-incrementing primary key
- `name` - User's name (max 50 characters, required)
- `email` - User's email (max 100 characters, unique, required)
- `age` - User's age (0-150, optional)
- `active` - Account status (boolean, default: true)
- `created_at` - Record creation timestamp
- `updated_at` - Record last update timestamp

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

## ⚙️ PostgreSQL Features Used

- **Connection Pooling**: Efficient connection management with `pg.Pool`
- **Parameterized Queries**: Protection against SQL injection using `$1, $2` placeholders
- **Serial Primary Key**: Auto-incrementing ID field
- **Constraints**: 
  - UNIQUE constraint on email
  - CHECK constraint on age
  - NOT NULL constraints
- **Default Values**: Automatic timestamps and boolean defaults
- **Transactions**: Database operations are atomic

## 🔍 Monitoring PostgreSQL

### Using psql (Command Line)

```bash
# Connect to database
psql -U postgres -d multi_db_explorer

# List all tables
\dt

# Describe users table
\d users

# View all users
SELECT * FROM users;

# Count users
SELECT COUNT(*) FROM users;

# View recent users
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;

# Exit
\q
```

### Using pgAdmin (GUI)

1. Open **pgAdmin** (installed with PostgreSQL)
2. Connect to your server
3. Navigate to: Servers → PostgreSQL → Databases → multi_db_explorer → Schemas → public → Tables → users
4. Right-click on users table → View/Edit Data → All Rows

### Useful PostgreSQL Queries

```sql
-- View table structure
SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users';

-- Check for duplicate emails
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Get active users only
SELECT * FROM users WHERE active = true;

-- Search users by name
SELECT * FROM users WHERE name ILIKE '%john%';

-- Get user statistics
SELECT 
  COUNT(*) as total_users,
  AVG(age) as average_age,
  MIN(age) as youngest,
  MAX(age) as oldest
FROM users;
```

## ❗ Common Issues & Solutions

### Issue: "psql: command not found"
- **Solution**: Add PostgreSQL to your system PATH
- **Windows**: Add `C:\Program Files\PostgreSQL\18\bin` to PATH
- **Mac**: `echo 'export PATH="/opt/homebrew/opt/postgresql@18/bin:$PATH"' >> ~/.zshrc`

### Issue: "password authentication failed for user 'postgres'"
- **Solution**: Update `DB_PASSWORD` in `.env` file
- Or reset PostgreSQL password:
  ```sql
  ALTER USER postgres WITH PASSWORD 'new_password';
  ```

### Issue: "database 'multi_db_explorer' does not exist"
- **Solution**: Create the database first:
  ```sql
  CREATE DATABASE multi_db_explorer;
  ```

### Issue: Port 5432 already in use
- **Solution**: Check if another PostgreSQL instance is running
  ```bash
  # Windows
  netstat -ano | findstr :5432
  
  # Mac/Linux
  lsof -i :5432
  ```

### Issue: "role 'postgres' does not exist"
- **Solution**: Create the postgres user:
  ```sql
  CREATE USER postgres WITH PASSWORD 'your_password' SUPERUSER;
  ```

## 📚 PostgreSQL vs MongoDB

| Feature | PostgreSQL | MongoDB |
|---------|------------|---------|
| Type | SQL (Relational) | NoSQL (Document) |
| Schema | Fixed schema | Flexible schema |
| Data Structure | Tables with rows/columns | Collections with documents |
| Query Language | SQL | MongoDB Query Language |
| Relationships | JOINs, Foreign Keys | Embedded docs, refs |
| Transactions | ACID compliant | ACID compliant |
| Best For | Complex queries, data integrity | Flexible data, rapid dev |

## 📚 Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

Feel free to fork this repository and submit pull requests!

---

**Next Database**: Check out the other branches to explore CRUD operations with MongoDB, Firebase, MySQL, and DynamoDB!
