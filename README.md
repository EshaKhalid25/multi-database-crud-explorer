# Multi-Database CRUD Explorer - Firebase/Firestore Branch 🔥

This branch demonstrates **CRUD operations** using **Firebase Cloud Firestore** (NoSQL Document Database) with Node.js and Express.js.

## 📋 Table of Contents

- [Overview](#overview)
- [Firebase vs Other Databases](#firebase-vs-other-databases)
- [Prerequisites](#prerequisites)
- [Firebase Setup](#firebase-setup)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Code Examples](#code-examples)
- [Firebase Features](#firebase-features)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## 🎯 Overview

**Firebase Firestore** is a flexible, scalable **NoSQL cloud database** from Google for mobile, web, and server development. It stores data in **documents** organized into **collections**.

### Key Features:
- ☁️ **Cloud-hosted** - No server management required
- 🔄 **Real-time synchronization** - Changes sync instantly across clients
- 📱 **Offline support** - Works offline, syncs when online
- 🔒 **Built-in security** - Granular security rules
- 🌍 **Global CDN** - Low latency worldwide
- 📊 **Automatic scaling** - Handles millions of users

---

## 🆚 Firebase vs Other Databases

| Feature | Firebase Firestore | MongoDB | MySQL/PostgreSQL |
|---------|-------------------|---------|------------------|
| **Type** | NoSQL Document DB | NoSQL Document DB | SQL Relational DB |
| **Hosting** | Cloud-based | Self-hosted/Cloud | Self-hosted/Cloud |
| **Schema** | Flexible | Flexible | Fixed Schema |
| **Queries** | Limited (no joins) | Rich query language | Complex joins |
| **Real-time** | ✅ Built-in | ✅ Change Streams | ❌ Requires polling |
| **Scaling** | Automatic | Manual/Atlas | Manual |
| **Cost Model** | Pay-per-use | Server-based | Server-based |
| **Offline** | ✅ Native support | ❌ No | ❌ No |
| **Best For** | Mobile/Web apps | Complex queries | Relational data |

---

## ✅ Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google/Firebase Account** - [Sign up](https://console.firebase.google.com/)
- **Git** - [Download](https://git-scm.com/)
- **Postman** or **cURL** (for API testing)

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., `multi-db-explorer`)
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

### Step 2: Create Firestore Database

1. In Firebase Console, select your project
2. Click **"Firestore Database"** in left sidebar
3. Click **"Create database"**
4. Choose **"Start in test mode"** (for development)
   - Test mode allows all reads/writes for 30 days
   - For production, configure proper security rules
5. Select a location (choose closest to your users)
6. Click **"Enable"**

### Step 3: Generate Service Account Key

Firebase Admin SDK requires a service account key for server-side authentication.

1. In Firebase Console, click **⚙️ (Settings)** > **"Project settings"**
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** - A JSON file will download
5. **⚠️ Keep this file secure!** It contains sensitive credentials

**Downloaded JSON structure:**
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/..."
}
```

### Step 4: Extract Required Values

You need these three values from the JSON file:
- `project_id`
- `private_key`
- `client_email`

---

## 📦 Installation

### 1. Clone Repository and Switch Branch

```bash
git clone <repository-url>
cd multi-database-crud-explorer
git checkout firebase
```

### 2. Install Dependencies

```bash
npm install
```

**Installed packages:**
- `express` (5.2.1) - Web framework
- `firebase-admin` (13.7.0) - Firebase Admin SDK
- `dotenv` (17.3.1) - Environment variables
- `cors` (2.8.6) - Cross-Origin Resource Sharing
- `nodemon` (3.1.14) - Dev auto-restart (dev dependency)

---

## ⚙️ Configuration

### 1. Create `.env` File

Copy the example and create your `.env`:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Open `.env` and replace with your Firebase credentials:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# Firebase Database URL
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# Server Configuration
PORT=3000
NODE_ENV=development
```

### ⚠️ Important Notes:

**Private Key Formatting:**
- Must be wrapped in double quotes
- Keep `\n` as literal `\n` (don't replace with actual newlines)
- Include the full key from `-----BEGIN PRIVATE KEY-----` to `-----END PRIVATE KEY-----`

**Example:**
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFuvwxyz...\n-----END PRIVATE KEY-----\n"
```

**Database URL:**
- Format: `https://YOUR-PROJECT-ID.firebaseio.com`
- Replace `YOUR-PROJECT-ID` with your actual project ID

---

## 📁 Project Structure

```
multi-database-crud-explorer/
├── src/
│   ├── config/
│   │   └── database.js          # Firebase initialization & config
│   ├── controllers/
│   │   └── userController.js    # CRUD controller functions
│   ├── model/
│   │   └── User.js               # User model & validation
│   └── routes/
│       └── userRoutes.js         # API route definitions
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── index.js                      # Server entry point
├── package.json                  # Dependencies & scripts
└── README.md                     # Documentation (this file)
```

---

## 🚀 Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Expected Output

```
🔥 Initializing Firebase...
✅ Firebase Admin SDK initialized successfully
✅ Firebase connection test successful

🚀 Server started successfully
📍 Running on: http://localhost:3000
🔥 Database: Firebase Firestore
🌍 Environment: development

📚 API Endpoints:
   GET    /                - Welcome message
   GET    /health          - Health check
   POST   /api/users       - Create user
   GET    /api/users       - Get all users
   GET    /api/users/:id   - Get user by ID
   PUT    /api/users/:id   - Update user
   DELETE /api/users/:id   - Delete user

✨ Ready to accept requests!
```

---

## 📖 API Documentation

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
    "id": "auto-generated-document-id",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "active": true,
    "createdAt": {
      "_seconds": 1234567890,
      "_nanoseconds": 123000000
    },
    "updatedAt": {
      "_seconds": 1234567890,
      "_nanoseconds": 123000000
    }
  }
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `email`: Required, valid email format
- `age`: Optional, number between 0-150
- `active`: Optional, boolean (default: true)

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email must be a valid email address"
  ]
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### 2. Get All Users

**GET** `/api/users?page=1&limit=10`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "doc-id-1",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "active": true,
      "createdAt": { "_seconds": 1234567890, "_nanoseconds": 0 },
      "updatedAt": { "_seconds": 1234567890, "_nanoseconds": 0 }
    },
    {
      "id": "doc-id-2",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "age": 25,
      "active": true,
      "createdAt": { "_seconds": 1234567850, "_nanoseconds": 0 },
      "updatedAt": { "_seconds": 1234567850, "_nanoseconds": 0 }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
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
    "id": "doc-id-1",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "active": true,
    "createdAt": { "_seconds": 1234567890, "_nanoseconds": 0 },
    "updatedAt": { "_seconds": 1234567890, "_nanoseconds": 0 }
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "User not found"
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
    "id": "doc-id-1",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "age": 31,
    "active": false,
    "createdAt": { "_seconds": 1234567890, "_nanoseconds": 0 },
    "updatedAt": { "_seconds": 1234568000, "_nanoseconds": 0 }
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "User with this email already exists"
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
    "id": "doc-id-1"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 6. Health Check

**GET** `/health`

**Response (200 OK):**
```json
{
  "status": "healthy",
  "database": "Firebase Firestore",
  "timestamp": "2026-03-04T10:30:00.000Z"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "unhealthy",
  "database": "Firebase Firestore",
  "timestamp": "2026-03-04T10:30:00.000Z"
}
```

---

## 💻 Code Examples

### Using cURL

**Create User:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","age":28}'
```

**Get All Users:**
```bash
curl http://localhost:3000/api/users?page=1&limit=5
```

**Get User by ID:**
```bash
curl http://localhost:3000/api/users/doc-id-123
```

**Update User:**
```bash
curl -X PUT http://localhost:3000/api/users/doc-id-123 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Updated","age":29}'
```

**Delete User:**
```bash
curl -X DELETE http://localhost:3000/api/users/doc-id-123
```

---

### Using JavaScript (fetch)

```javascript
// Create User
const createUser = async () => {
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Bob',
      email: 'bob@example.com',
      age: 35,
      active: true
    })
  });
  const data = await response.json();
  console.log(data);
};

// Get All Users
const getUsers = async () => {
  const response = await fetch('http://localhost:3000/api/users?page=1&limit=10');
  const data = await response.json();
  console.log(data);
};

// Update User
const updateUser = async (userId) => {
  const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Bob Updated',
      age: 36
    })
  });
  const data = await response.json();
  console.log(data);
};

// Delete User
const deleteUser = async (userId) => {
  const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  console.log(data);
};
```

---

## 🔥 Firebase Features

### Document-Based Storage

Firestore stores data in **documents** (similar to JSON objects) organized into **collections**.

**Structure:**
```
users (collection)
  ├── doc-id-1 (document)
  │   ├── name: "John"
  │   ├── email: "john@example.com"
  │   └── age: 30
  ├── doc-id-2 (document)
  │   ├── name: "Jane"
  │   └── email: "jane@example.com"
```

### Automatic IDs

Firestore auto-generates unique document IDs:
- `doc-id-1`, `doc-id-2`, etc.
- You can also set custom IDs with `.doc('custom-id')`

### Timestamps

Firestore provides server-side timestamps:
```javascript
createdAt: FieldValue.serverTimestamp()
```

This ensures consistent timestamps across different timezones.

### Queries

Firestore supports various query operations:

```javascript
// Simple query
await usersRef.where('age', '>', 25).get();

// Compound query
await usersRef.where('age', '>', 25).where('active', '==', true).get();

// Ordering
await usersRef.orderBy('createdAt', 'desc').get();

// Limiting
await usersRef.limit(10).get();
```

**Limitations:**
- No joins between collections
- Limited to one range filter per query
- Requires indexes for complex queries

### Real-time Updates (Not in this API)

Firestore can listen to real-time changes:

```javascript
// Listen to collection changes
usersRef.onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      console.log('New user:', change.doc.data());
    }
    if (change.type === 'modified') {
      console.log('Modified user:', change.doc.data());
    }
    if (change.type === 'removed') {
      console.log('Removed user:', change.doc.data());
    }
  });
});
```

This branch uses REST API pattern, but you can extend it with WebSockets for real-time features.

---

## 🔒 Security Rules

### Default Test Mode (30 days)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 4, 3);
    }
  }
}
```

### Production Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      
      // Allow create if email is unique
      allow create: if request.auth != null 
                    && request.resource.data.keys().hasAll(['name', 'email']);
      
      // Allow update/delete only for own document
      allow update, delete: if request.auth != null 
                            && request.auth.uid == userId;
    }
  }
}
```

**Update Rules:**
1. Go to Firebase Console
2. Select **"Firestore Database"**
3. Go to **"Rules"** tab
4. Paste your rules
5. Click **"Publish"**

---

## 🛠️ Troubleshooting

### Error: "Failed to parse private key"

**Cause:** Private key formatting issue in `.env`

**Solution:**
1. Ensure private key is wrapped in double quotes
2. Keep `\n` as literal text (don't replace with actual newlines)
3. Include full key from `BEGIN` to `END`

**Correct format:**
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```

---

### Error: "Permission denied" or "PERMISSION_DENIED"

**Cause:** Firestore security rules blocking access

**Solutions:**

1. **Check Security Rules:**
   - Go to Firebase Console → Firestore → Rules
   - Ensure rules allow read/write

2. **Enable Test Mode (Development):**
   ```javascript
   allow read, write: if true;
   ```

3. **Use Service Account (This app does):**
   - Firebase Admin SDK bypasses security rules
   - Ensure service account credentials are correct

---

### Error: "Firebase app already initialized"

**Cause:** Trying to initialize Firebase multiple times

**Solution:**
This app checks `admin.apps.length` before initialization:
```javascript
if (admin.apps.length === 0) {
  admin.initializeApp({ ... });
}
```

---

### Error: "Cannot find module 'firebase-admin'"

**Cause:** Dependencies not installed

**Solution:**
```bash
npm install
```

---

### Error: "Port 3000 already in use"

**Cause:** Another process is using port 3000

**Solutions:**

**Option 1: Change port in `.env`:**
```env
PORT=3001
```

**Option 2: Kill process on port 3000:**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Windows CMD
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

### Error: "Firebase connection test failed"

**Possible Causes:**
1. Invalid credentials in `.env`
2. No internet connection
3. Firebase project doesn't exist
4. Service account doesn't have permissions

**Solutions:**

1. **Verify credentials:**
   - Check `FIREBASE_PROJECT_ID` matches your project
   - Verify `FIREBASE_CLIENT_EMAIL` is correct
   - Ensure `FIREBASE_PRIVATE_KEY` is properly formatted

2. **Check Firebase Console:**
   - Go to Firebase Console and verify project exists
   - Verify Firestore is enabled

3. **Regenerate service account key:**
   - Firebase Console → Settings → Service Accounts
   - Generate new private key
   - Update `.env` with new credentials

4. **Check internet connection:**
   ```bash
   ping firebase.google.com
   ```

---

### Firestore Data Not Showing in Console

**Cause:** Documents might exist but not visible due to permissions

**Solution:**
- Go to Firebase Console → Firestore Database
- Click on collections and documents to browse manually
- Use Firebase Console to verify data exists

---

## ✨ Best Practices

### 1. Environment Variables

- ✅ **NEVER** commit `.env` to Git
- ✅ Use `.env.example` as a template
- ✅ Keep sensitive credentials secure
- ✅ Use different Firebase projects for dev/staging/prod

### 2. Error Handling

- ✅ Always validate input data
- ✅ Handle Firestore errors gracefully
- ✅ Return meaningful error messages
- ✅ Log errors for debugging

### 3. Data Modeling

**Good Practice:**
```javascript
// Flat structure (better for Firestore)
users/{userId}
  name: "John"
  email: "john@example.com"
  age: 30
```

**Avoid:**
```javascript
// Deep nesting (harder to query)
users/{userId}
  profile: {
    personal: {
      name: "John"
      age: 30
    }
  }
```

### 4. Querying

- ✅ Create indexes for complex queries
- ✅ Use pagination for large datasets
- ✅ Limit results with `.limit()`
- ✅ Use server-side timestamps

### 5. Security

- ✅ Configure proper security rules
- ✅ Validate data on both client and server
- ✅ Use Firebase Authentication for user management
- ✅ Regularly rotate service account keys

### 6. Cost Optimization

Firestore charges based on:
- **Reads:** Each document read
- **Writes:** Each document create/update/delete
- **Deletes:** Each document deletion
- **Storage:** Data stored

**Tips:**
- Use `.limit()` to reduce reads
- Batch writes when possible
- Delete unused data
- Monitor usage in Firebase Console

---

## 📊 Firebase vs MongoDB

| Feature | Firebase Firestore | MongoDB |
|---------|-------------------|---------|
| **Setup** | Cloud-based, instant | Requires installation |
| **Scaling** | Automatic | Manual configuration |
| **Real-time** | Native support | Change Streams |
| **Querying** | Limited (no joins) | Rich aggregation pipeline |
| **Transactions** | ✅ Supported | ✅ Supported |
| **Offline** | ✅ Native | ❌ Requires custom logic |
| **Cost** | Pay-per-use | Server-based |
| **Learning Curve** | Easy | Moderate |
| **Best For** | Mobile/web apps | Complex backend systems |

---

## 🔗 Useful Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Pricing](https://firebase.google.com/pricing)
- [Firebase YouTube Channel](https://www.youtube.com/firebase)

---

## 📝 Notes

- **Document IDs:** Auto-generated by Firestore (e.g., `doc-id-123`)
- **Timestamps:** Use `FieldValue.serverTimestamp()` for consistency
- **Pagination:** Manual implementation (Firestore doesn't have offset)
- **Email Uniqueness:** Enforced at application level (not database constraint)
- **Connection Pooling:** Not needed (Firebase handles connections)

---

## 🚦 Next Steps

1. ✅ Set up Firebase project
2. ✅ Generate service account key
3. ✅ Configure `.env` file
4. ✅ Run `npm install`
5. ✅ Start server with `npm run dev`
6. ✅ Test API endpoints with Postman
7. 🔄 Configure production security rules
8. 🔄 Add Firebase Authentication
9. 🔄 Explore real-time features
10. 🔄 Deploy to cloud platform

---

## 📞 Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review [Firebase Documentation](https://firebase.google.com/docs)
- Check [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

---

**Happy Coding! 🔥**
