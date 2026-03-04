const admin = require('firebase-admin');
require('dotenv').config();

/**
 * Firebase Admin SDK Configuration
 * Initializes the Firebase Admin SDK with service account credentials
 */

let db = null;

const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // Initialize Firebase Admin with service account credentials
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace escaped newlines in private key
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });

      console.log('Firebase Admin SDK initialized successfully');
    }

    // Get Firestore database instance
    db = admin.firestore();
    
    // Configure Firestore settings
    db.settings({
      timestampsInSnapshots: true,
      ignoreUndefinedProperties: true,
    });

    return db;
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    throw error;
  }
};

/**
 * Get Firestore database instance
 * @returns {admin.firestore.Firestore} Firestore database instance
 */
const getFirestore = () => {
  if (!db) {
    return initializeFirebase();
  }
  return db;
};

/**
 * Test Firebase connection
 */
const testConnection = async () => {
  try {
    const firestore = getFirestore();
    // Try to access a collection to verify connection
    await firestore.collection('_health_check').limit(1).get();
    console.log('Firebase connection test successful');
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error.message);
    return false;
  }
};

module.exports = {
  initializeFirebase,
  getFirestore,
  testConnection,
  admin, // Export admin for additional Firebase services
};
