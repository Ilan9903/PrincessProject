import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { mockDb, resetStore, seedCollection } from './mocks/firestore.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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

beforeEach(async () => {
  resetStore();
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

const loginAndGetCookies = async () => {
  const res = await request
    .post('/api/auth/login')
    .send({ email: 'prince@test.com', password: 'password123' });
  return res.headers['set-cookie'];
};

// ============================
// authenticateToken
// ============================

describe('Middleware authenticateToken', () => {
  it('devrait refuser sans token (pas de cookie)', async () => {
    const res = await request.get('/api/coupons');
    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Token');
  });

  it('devrait refuser un token invalide', async () => {
    const res = await request
      .get('/api/coupons')
      .set('Cookie', ['princess_token=un-faux-token']);

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('invalide');
  });

  it('devrait refuser un token expiré', async () => {
    const expiredToken = jwt.sign(
      { userId: 'user-prince', email: 'prince@test.com', role: 'prince' },
      process.env.JWT_SECRET,
      { expiresIn: '-1s' }
    );

    const res = await request
      .get('/api/coupons')
      .set('Cookie', [`princess_token=${expiredToken}`]);

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('expiré');
  });

  it('devrait refuser un token blacklisté', async () => {
    // Login pour obtenir un vrai token
    const cookies = await loginAndGetCookies();
    const tokenMatch = cookies[0].match(/princess_token=([^;]+)/);
    const token = tokenMatch[1];

    // Blacklister le token
    seedCollection('token_blacklist', [{
      id: token,
      blacklistedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }]);

    const res = await request
      .get('/api/coupons')
      .set('Cookie', cookies);

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('révoqué');
  });

  it('devrait accepter un token valide', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .get('/api/quiz/statistics')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
  });
});

// ============================
// validate (Joi middleware)
// ============================

describe('Middleware validate', () => {
  it('devrait laisser passer des données valides', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/coupons')
      .set('Cookie', cookies)
      .send({ title: 'Massage', type: 'massage' });

    expect(res.status).toBe(201);
  });

  it('devrait rejeter avec détails pour champs manquants', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/coupons')
      .set('Cookie', cookies)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation échouée');
    expect(res.body.details).toBeInstanceOf(Array);
    expect(res.body.details.length).toBeGreaterThan(0);
    expect(res.body.details[0]).toHaveProperty('field');
    expect(res.body.details[0]).toHaveProperty('message');
  });

  it('devrait rejeter avec messages personnalisés', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/quiz/questions')
      .set('Cookie', cookies)
      .send({ question: 'Q', options: ['A'], correctAnswer: 'A' });

    expect(res.status).toBe(400);
    // question trop courte (min 5) + options min 2
    expect(res.body.details.length).toBeGreaterThanOrEqual(2);
  });

  it('devrait strip les champs inconnus (stripUnknown)', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/coupons')
      .set('Cookie', cookies)
      .send({
        title: 'Massage',
        type: 'massage',
        champInconnu: 'devrait être ignoré',
        hack: true
      });

    expect(res.status).toBe(201);
  });

  it('devrait appliquer les valeurs par défaut', async () => {
    const cookies = await loginAndGetCookies();

    // Créer un coupon sans type → doit recevoir 'experience' par défaut
    const createRes = await request
      .post('/api/coupons')
      .set('Cookie', cookies)
      .send({ title: 'Sans type' });

    expect(createRes.status).toBe(201);
    const id = createRes.body.id;

    // Vérifier via GET
    const getRes = await request
      .get(`/api/coupons/${id}`)
      .set('Cookie', cookies);

    expect(getRes.status).toBe(200);
    expect(getRes.body.type).toBe('experience');
  });
});

// ============================
// errorHandler
// ============================

describe('Middleware errorHandler', () => {
  it('devrait retourner 404 pour une route inexistante', async () => {
    const res = await request.get('/api/route-inexistante');
    expect(res.status).toBe(404);
  });

  it('ne devrait pas exposer la stack en mode test/production', async () => {
    // Forcer une erreur avec un body malformé sur une route POST
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/coupons')
      .set('Cookie', cookies)
      .set('Content-Type', 'application/json')
      .send('{"invalid json');

    // Le parser JSON de Express renvoie 400
    expect(res.status).toBe(400);
    expect(res.body.stack).toBeUndefined();
  });
});

// ============================
// Schemas Joi (validation unitaire)
// ============================

describe('Schemas Joi', () => {
  let valentineSchema, messageSchema, couponSchema, planningSchema, quizSchema, answerSchema, playlistSchema;

  beforeAll(async () => {
    const mod = await import('../src/middleware/validate.js');
    valentineSchema = mod.valentineSchema;
    messageSchema = mod.messageSchema;
    couponSchema = mod.couponSchema;
    planningSchema = mod.planningSchema;
    quizSchema = mod.quizSchema;
    answerSchema = mod.answerSchema;
    playlistSchema = mod.playlistSchema;
  });

  describe('couponSchema', () => {
    it('devrait valider un coupon minimal', () => {
      const { error } = couponSchema.validate({ title: 'Test' });
      expect(error).toBeUndefined();
    });

    it('devrait rejeter un titre vide', () => {
      const { error } = couponSchema.validate({ title: '' });
      expect(error).toBeDefined();
    });

    it('devrait rejeter un type invalide', () => {
      const { error } = couponSchema.validate({ title: 'Test', type: 'invalide' });
      expect(error).toBeDefined();
    });

    it('devrait accepter tous les types valides', () => {
      const types = ['massage', 'restaurant', 'cinema', 'experience', 'other'];
      types.forEach(type => {
        const { error } = couponSchema.validate({ title: 'Test', type });
        expect(error).toBeUndefined();
      });
    });
  });

  describe('quizSchema', () => {
    it('devrait valider une question complète', () => {
      const { error } = quizSchema.validate({
        question: 'Notre première sortie ?',
        options: ['Cinéma', 'Restaurant'],
        correctAnswer: 'Cinéma'
      });
      expect(error).toBeUndefined();
    });

    it('devrait rejeter une question trop courte', () => {
      const { error } = quizSchema.validate({
        question: 'Q?',
        options: ['A', 'B'],
        correctAnswer: 'A'
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter plus de 6 options', () => {
      const { error } = quizSchema.validate({
        question: 'Question valide ?',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        correctAnswer: 'A'
      });
      expect(error).toBeDefined();
    });
  });

  describe('messageSchema', () => {
    it('devrait valider un message complet', () => {
      const { error } = messageSchema.validate({
        title: 'Mon message',
        content: 'Contenu du message'
      });
      expect(error).toBeUndefined();
    });

    it('devrait rejeter sans contenu', () => {
      const { error } = messageSchema.validate({ title: 'Titre seul' });
      expect(error).toBeDefined();
    });
  });

  describe('planningSchema', () => {
    it('devrait valider un événement', () => {
      const { error } = planningSchema.validate({
        title: 'Dîner',
        date: '2026-02-14'
      });
      expect(error).toBeUndefined();
    });

    it('devrait rejeter un format de date invalide', () => {
      const { error } = planningSchema.validate({
        title: 'Dîner',
        date: '14/02/2026'
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter un format de temps invalide', () => {
      const { error } = planningSchema.validate({
        title: 'Dîner',
        date: '2026-02-14',
        time: '25:00'
      });
      expect(error).toBeDefined();
    });
  });

  describe('playlistSchema', () => {
    it('devrait valider une chanson', () => {
      const { error } = playlistSchema.validate({
        title: 'Perfect',
        artist: 'Ed Sheeran'
      });
      expect(error).toBeUndefined();
    });

    it('devrait rejeter sans artiste', () => {
      const { error } = playlistSchema.validate({ title: 'Seul titre' });
      expect(error).toBeDefined();
    });
  });
});
