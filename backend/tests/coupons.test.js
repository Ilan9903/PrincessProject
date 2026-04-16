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

// Helper : se connecter et récupérer les cookies
const loginAndGetCookies = async () => {
  const res = await request
    .post('/api/auth/login')
    .send({ email: 'prince@test.com', password: 'password123' });
  return res.headers['set-cookie'];
};

beforeAll(async () => {
  const supertest = await import('supertest');
  const appModule = await import('../src/index.js');
  app = appModule.default;
  request = supertest.default(app);
});

beforeEach(async () => {
  resetStore();
  // Créer un utilisateur pour l'auth
  const hashedPw = await bcrypt.hash('password123', 12);
  seedCollection('users', [{
    id: 'user-prince',
    email: 'prince@test.com',
    password: hashedPw,
    displayName: 'Le Prince',
    role: 'prince',
    lastLogin: null
  }]);
});

describe('POST /api/coupons', () => {
  it('devrait créer un coupon', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/coupons')
      .set('Cookie', cookies)
      .send({
        title: 'Massage relaxant',
        description: '1h de massage aux huiles essentielles',
        type: 'massage'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.id).toBeDefined();
  });

  it('devrait refuser un coupon sans titre', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/coupons')
      .set('Cookie', cookies)
      .send({ description: 'Sans titre' });

    expect(res.status).toBe(400);
    expect(res.body.details).toBeDefined();
  });

  it('devrait refuser un type invalide', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/coupons')
      .set('Cookie', cookies)
      .send({ title: 'Test', type: 'invalide' });

    expect(res.status).toBe(400);
  });

  it('devrait refuser sans authentification', async () => {
    const res = await request
      .post('/api/coupons')
      .send({ title: 'Test' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/coupons', () => {
  beforeEach(() => {
    seedCollection('coupons', [
      {
        id: 'coupon-1',
        title: 'Massage',
        description: 'Relaxant',
        type: 'massage',
        status: 'available',
        isRedeemed: false,
        createdAt: '2026-01-01',
        expirationDate: null
      },
      {
        id: 'coupon-2',
        title: 'Restaurant',
        description: 'Dîner',
        type: 'restaurant',
        status: 'available',
        isRedeemed: false,
        createdAt: '2026-01-02',
        expirationDate: null
      },
      {
        id: 'coupon-3',
        title: 'Cinéma',
        description: 'Film',
        type: 'cinema',
        status: 'redeemed',
        isRedeemed: true,
        createdAt: '2026-01-03',
        expirationDate: null,
        redeemedAt: '2026-01-05'
      }
    ]);
  });

  it('devrait retourner les coupons paginés', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .get('/api/coupons')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBe(3);
  });

  it('devrait respecter la pagination', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .get('/api/coupons?page=1&limit=2')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.totalPages).toBe(2);
  });

  it('devrait refuser sans authentification', async () => {
    const res = await request.get('/api/coupons');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/coupons/:id', () => {
  beforeEach(() => {
    seedCollection('coupons', [{
      id: 'coupon-detail',
      title: 'Massage VIP',
      description: 'Premium',
      type: 'massage',
      status: 'available',
      isRedeemed: false,
      createdAt: '2026-01-01',
      expirationDate: null
    }]);
  });

  it('devrait retourner un coupon par ID', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .get('/api/coupons/coupon-detail')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Massage VIP');
  });

  it('devrait retourner 404 pour un ID inexistant', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .get('/api/coupons/inexistant')
      .set('Cookie', cookies);

    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/coupons/:id/redeem', () => {
  beforeEach(() => {
    seedCollection('coupons', [
      {
        id: 'coupon-available',
        title: 'Massage',
        type: 'massage',
        status: 'available',
        isRedeemed: false,
        createdAt: '2026-01-01',
        expirationDate: null
      },
      {
        id: 'coupon-used',
        title: 'Déjà utilisé',
        type: 'cinema',
        status: 'redeemed',
        isRedeemed: true,
        createdAt: '2026-01-01',
        redeemedAt: '2026-01-02',
        expirationDate: null
      },
      {
        id: 'coupon-expired',
        title: 'Expiré',
        type: 'restaurant',
        status: 'available',
        isRedeemed: false,
        createdAt: '2026-01-01',
        expirationDate: '2020-01-01'
      }
    ]);
  });

  it('devrait utiliser un coupon disponible', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .patch('/api/coupons/coupon-available/redeem')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.coupon.isRedeemed).toBe(true);
  });

  it('devrait refuser un coupon déjà utilisé', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .patch('/api/coupons/coupon-used/redeem')
      .set('Cookie', cookies);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('déjà été utilisé');
  });

  it('devrait refuser un coupon expiré', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .patch('/api/coupons/coupon-expired/redeem')
      .set('Cookie', cookies);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('expiré');
  });

  it('devrait retourner 404 pour un ID inexistant', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .patch('/api/coupons/inexistant/redeem')
      .set('Cookie', cookies);

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/coupons/:id', () => {
  beforeEach(() => {
    seedCollection('coupons', [{
      id: 'coupon-edit',
      title: 'Ancien titre',
      description: 'Ancienne desc',
      type: 'massage',
      status: 'available',
      isRedeemed: false,
      createdAt: '2026-01-01'
    }]);
  });

  it('devrait modifier un coupon', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .put('/api/coupons/coupon-edit')
      .set('Cookie', cookies)
      .send({
        title: 'Nouveau titre',
        description: 'Nouvelle desc',
        type: 'restaurant'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('devrait retourner 404 pour un ID inexistant', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .put('/api/coupons/inexistant')
      .set('Cookie', cookies)
      .send({ title: 'Test', type: 'massage' });

    expect(res.status).toBe(404);
  });
});
