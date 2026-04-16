/**
 * Setup de test : mock les modules Firebase AVANT tout import
 * Utilise le mock Firestore en mémoire
 */
import { jest } from '@jest/globals';
import { mockDb, mockAdmin, resetStore } from './mocks/firestore.js';

// Mock firebase config module
jest.unstable_mockModule('../src/config/firebase.js', () => ({
  default: mockAdmin,
  getDb: () => mockDb
}));

// Mock logger pour ne pas polluer la console
jest.unstable_mockModule('../src/utils/logger.js', () => ({
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }
}));

// Set test env vars
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jest-princess-project';
process.env.FIREBASE_PROJECT_ID = 'test-project';

export { resetStore };
