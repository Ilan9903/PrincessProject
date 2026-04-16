import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { mockDb, resetStore, seedCollection } from './mocks/firestore.js';
import bcrypt from 'bcrypt';

// Mock modules BEFORE importing app
jest.unstable_mockModule('../src/config/firebase.js', () => ({
  default: {
    firestore: {
      FieldValue: {
        serverTimestamp: () => new Date().toISOString()
      }
    }
  },
  getDb: () => mockDb
}));

jest.unstable_mockModule('../src/utils/logger.js', () => ({
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() }
}));

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jest-princess-project';
process.env.FIREBASE_PROJECT_ID = 'test-project';

let app, request;

beforeAll(async () => {
  const supertest = await import('supertest');
  const appModule = await import('../src/index.js');
  app = appModule.default;
  request = supertest.default(app);
});

beforeEach(() => {
  resetStore();
});

describe('POST /api/auth/register', () => {
  it('devrait créer un compte et retourner un cookie', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({
        email: 'test@princess.com',
        password: 'password123',
        displayName: 'Test Princess'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('test@princess.com');
    expect(res.body.user.displayName).toBe('Test Princess');
    expect(res.body.user.role).toBe('princess');
    // Vérifier le cookie HttpOnly
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('princess_token');
  });

  it('devrait refuser un email déjà existant', async () => {
    const hashedPw = await bcrypt.hash('password123', 12);
    seedCollection('users', [{
      id: 'existing-user',
      email: 'test@princess.com',
      password: hashedPw,
      displayName: 'Existing',
      role: 'princess'
    }]);

    const res = await request
      .post('/api/auth/register')
      .send({
        email: 'test@princess.com',
        password: 'password123',
        displayName: 'Duplicate'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('existe déjà');
  });

  it('devrait refuser sans email', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({ password: 'password123', displayName: 'Test' });

    expect(res.status).toBe(400);
  });

  it('devrait refuser un mot de passe trop court', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({
        email: 'test@princess.com',
        password: '12345',
        displayName: 'Test'
      });

    expect(res.status).toBe(400);
  });

  it('devrait accepter un PIN optionnel à 4 chiffres', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({
        email: 'pin@princess.com',
        password: 'password123',
        displayName: 'Pin User',
        pin: '1234'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('devrait refuser un PIN invalide', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({
        email: 'pin@princess.com',
        password: 'password123',
        displayName: 'Pin User',
        pin: 'abcd'
      });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    const hashedPw = await bcrypt.hash('password123', 12);
    const hashedPin = await bcrypt.hash('9999', 12);
    seedCollection('users', [{
      id: 'user-prince',
      email: 'prince@test.com',
      password: hashedPw,
      pin: hashedPin,
      displayName: 'Le Prince',
      role: 'prince',
      lastLogin: null
    }]);
  });

  it('devrait connecter avec email + mot de passe', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: 'prince@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('prince@test.com');
    expect(res.body.user.role).toBe('prince');
    const cookies = res.headers['set-cookie'];
    expect(cookies[0]).toContain('princess_token');
  });

  it('devrait refuser un mauvais mot de passe', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: 'prince@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('incorrect');
  });

  it('devrait refuser un email inexistant', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: 'unknown@test.com', password: 'password123' });

    expect(res.status).toBe(401);
  });

  it('devrait connecter avec PIN', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ pin: '9999' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.displayName).toBe('Le Prince');
  });

  it('devrait refuser un mauvais PIN', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ pin: '0000' });

    expect(res.status).toBe(401);
  });

  it('devrait refuser sans identifiants', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/verify', () => {
  it('devrait valider un token actif', async () => {
    // D'abord se connecter pour obtenir un cookie
    const hashedPw = await bcrypt.hash('password123', 12);
    seedCollection('users', [{
      id: 'user-1',
      email: 'test@test.com',
      password: hashedPw,
      displayName: 'Test',
      role: 'princess'
    }]);

    const loginRes = await request
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' });

    const cookies = loginRes.headers['set-cookie'];

    const res = await request
      .get('/api/auth/verify')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('test@test.com');
  });

  it('devrait refuser sans token', async () => {
    const res = await request.get('/api/auth/verify');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/logout', () => {
  it('devrait déconnecter et supprimer le cookie', async () => {
    const hashedPw = await bcrypt.hash('password123', 12);
    seedCollection('users', [{
      id: 'user-1',
      email: 'test@test.com',
      password: hashedPw,
      displayName: 'Test',
      role: 'princess'
    }]);

    const loginRes = await request
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' });

    const cookies = loginRes.headers['set-cookie'];

    const res = await request
      .post('/api/auth/logout')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('devrait refuser sans token', async () => {
    const res = await request.post('/api/auth/logout');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('devrait retourner le profil utilisateur', async () => {
    const hashedPw = await bcrypt.hash('password123', 12);
    seedCollection('users', [{
      id: 'user-prince',
      email: 'prince@test.com',
      password: hashedPw,
      displayName: 'Le Prince',
      role: 'prince',
      createdAt: '2026-01-01',
      lastLogin: null
    }]);

    const loginRes = await request
      .post('/api/auth/login')
      .send({ email: 'prince@test.com', password: 'password123' });

    const cookies = loginRes.headers['set-cookie'];

    const res = await request
      .get('/api/auth/me')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('prince@test.com');
    expect(res.body.displayName).toBe('Le Prince');
    expect(res.body.role).toBe('prince');
  });

  it('devrait refuser sans authentification', async () => {
    const res = await request.get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
