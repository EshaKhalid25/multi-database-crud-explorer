const { getFirestore } = require('../config/database');
const { FieldValue } = require('firebase-admin').firestore;

/**
 * Firestore User Collection
 * Collection name: users
 * 
 * Document Structure:
 * {
 *   name: string (required)
 *   email: string (required, unique)
 *   age: number (optional)
 *   active: boolean (default: true)
 *   createdAt: timestamp
 *   updatedAt: timestamp
 * }
 */

const COLLECTION_NAME = 'users';

/**
 * Get users collection reference
 * @returns {FirebaseFirestore.CollectionReference}
 */
const getUsersCollection = () => {
  const db = getFirestore();
  return db.collection(COLLECTION_NAME);
};

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
 * Check if email already exists
 * @param {string} email - Email to check
 * @param {string} excludeId - User ID to exclude from check (for updates)
 * @returns {Promise<boolean>}
 */
const emailExists = async (email, excludeId = null) => {
  try {
    const usersRef = getUsersCollection();
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (snapshot.empty) {
      return false;
    }

    // If excludeId is provided, check if the found document is not the same user
    if (excludeId) {
      const docs = snapshot.docs.filter(doc => doc.id !== excludeId);
      return docs.length > 0;
    }

    return true;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw error;
  }
};

/**
 * Prepare user data for Firestore
 * Adds timestamps and default values
 * @param {Object} userData - Raw user data
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} - Prepared user data
 */
const prepareUserData = (userData, isUpdate = false) => {
  const prepared = { ...userData };

  if (!isUpdate) {
    // For new users, add createdAt and default values
    prepared.createdAt = FieldValue.serverTimestamp();
    prepared.active = prepared.active !== undefined ? prepared.active : true;
  }

  // Always update the updatedAt timestamp
  prepared.updatedAt = FieldValue.serverTimestamp();

  // Remove undefined values
  Object.keys(prepared).forEach(key => {
    if (prepared[key] === undefined) {
      delete prepared[key];
    }
  });

  return prepared;
};

module.exports = {
  COLLECTION_NAME,
  getUsersCollection,
  validateUser,
  emailExists,
  prepareUserData,
  FieldValue,
};
