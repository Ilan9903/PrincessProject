import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { mockDb, resetStore, seedCollection } from './mocks/firestore.js';
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

// ========================
// QUESTIONS CRUD
// ========================

describe('POST /api/quiz/questions', () => {
  it('devrait créer une question', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/quiz/questions')
      .set('Cookie', cookies)
      .send({
        question: 'Quelle est notre chanson préférée ?',
        options: ['Chanson A', 'Chanson B', 'Chanson C', 'Chanson D'],
        correctAnswer: 'Chanson B',
        category: 'fun',
        difficulty: 'medium'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.id).toBeDefined();
  });

  it('devrait refuser sans question', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/quiz/questions')
      .set('Cookie', cookies)
      .send({
        options: ['A', 'B'],
        correctAnswer: 'A'
      });

    expect(res.status).toBe(400);
  });

  it('devrait refuser avec moins de 2 options', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/quiz/questions')
      .set('Cookie', cookies)
      .send({
        question: 'Test ?',
        options: ['Seule option'],
        correctAnswer: 'Seule option'
      });

    expect(res.status).toBe(400);
  });

  it('devrait refuser sans authentification', async () => {
    const res = await request
      .post('/api/quiz/questions')
      .send({
        question: 'Test ?',
        options: ['A', 'B'],
        correctAnswer: 'A'
      });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/quiz/questions', () => {
  beforeEach(() => {
    seedCollection('quiz_questions', [
      {
        id: 'q1',
        question: 'Question fun 1',
        options: ['A', 'B', 'C'],
        correctAnswer: 'B',
        category: 'fun',
        difficulty: 'easy',
        createdAt: '2026-01-01'
      },
      {
        id: 'q2',
        question: 'Question sérieuse',
        options: ['X', 'Y'],
        correctAnswer: 'X',
        category: 'serious',
        difficulty: 'hard',
        createdAt: '2026-01-02'
      },
      {
        id: 'q3',
        question: 'Question fun 2',
        options: ['1', '2', '3'],
        correctAnswer: '3',
        category: 'fun',
        difficulty: 'medium',
        createdAt: '2026-01-03'
      }
    ]);
  });

  it('devrait retourner les questions paginées (sans réponses)', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .get('/api/quiz/questions')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.pagination.total).toBe(3);
    // Vérifier qu'il n'y a pas de correctAnswer exposée
    res.body.data.forEach(q => {
      expect(q.correctAnswer).toBeUndefined();
    });
  });

  it('devrait refuser sans authentification', async () => {
    const res = await request.get('/api/quiz/questions');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/quiz/questions/:id', () => {
  beforeEach(() => {
    seedCollection('quiz_questions', [{
      id: 'q-detail',
      question: 'Question détaillée ?',
      options: ['A', 'B', 'C'],
      correctAnswer: 'B',
      category: 'fun',
      difficulty: 'easy',
      createdAt: '2026-01-01'
    }]);
  });

  it('devrait retourner une question avec la réponse correcte', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .get('/api/quiz/questions/q-detail')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.question).toBe('Question détaillée ?');
    expect(res.body.correctAnswer).toBe('B');
  });

  it('devrait retourner 404 pour un ID inexistant', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .get('/api/quiz/questions/inexistant')
      .set('Cookie', cookies);

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/quiz/questions/:id', () => {
  beforeEach(() => {
    seedCollection('quiz_questions', [{
      id: 'q-edit',
      question: 'Ancien texte ?',
      options: ['A', 'B'],
      correctAnswer: 'A',
      category: 'fun',
      difficulty: 'easy',
      createdAt: '2026-01-01'
    }]);
  });

  it('devrait modifier une question', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .put('/api/quiz/questions/q-edit')
      .set('Cookie', cookies)
      .send({
        question: 'Nouveau texte ?',
        options: ['X', 'Y', 'Z'],
        correctAnswer: 'Z',
        category: 'memories',
        difficulty: 'hard'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('devrait retourner 404 pour un ID inexistant', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .put('/api/quiz/questions/inexistant')
      .set('Cookie', cookies)
      .send({
        question: 'Test ?',
        options: ['A', 'B'],
        correctAnswer: 'A'
      });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/quiz/questions/:id', () => {
  beforeEach(() => {
    seedCollection('quiz_questions', [{
      id: 'q-delete',
      question: 'À supprimer ?',
      options: ['A', 'B'],
      correctAnswer: 'A',
      category: 'fun',
      difficulty: 'easy',
      createdAt: '2026-01-01'
    }]);
  });

  it('devrait supprimer une question', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .delete('/api/quiz/questions/q-delete')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('devrait retourner 404 pour un ID inexistant', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .delete('/api/quiz/questions/inexistant')
      .set('Cookie', cookies);

    expect(res.status).toBe(404);
  });
});

// ========================
// RÉPONSES
// ========================

describe('POST /api/quiz/answers', () => {
  beforeEach(() => {
    seedCollection('quiz_questions', [{
      id: 'q-answer',
      question: 'Notre premier rendez-vous ?',
      options: ['Cinéma', 'Restaurant', 'Parc'],
      correctAnswer: 'Restaurant',
      category: 'memories',
      difficulty: 'easy',
      createdAt: '2026-01-01'
    }]);
  });

  it('devrait enregistrer une bonne réponse', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/quiz/answers')
      .set('Cookie', cookies)
      .send({
        questionId: 'q-answer',
        selectedAnswer: 'Restaurant'
      });

    expect(res.status).toBe(201);
    expect(res.body.isCorrect).toBe(true);
    expect(res.body.message).toContain('Bonne');
  });

  it('devrait enregistrer une mauvaise réponse', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/quiz/answers')
      .set('Cookie', cookies)
      .send({
        questionId: 'q-answer',
        selectedAnswer: 'Cinéma'
      });

    expect(res.status).toBe(201);
    expect(res.body.isCorrect).toBe(false);
    expect(res.body.correctAnswer).toBe('Restaurant');
  });

  it('devrait retourner 404 pour une question inexistante', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .post('/api/quiz/answers')
      .set('Cookie', cookies)
      .send({
        questionId: 'inexistant',
        selectedAnswer: 'Test'
      });

    expect(res.status).toBe(404);
  });
});

// ========================
// STATISTIQUES
// ========================

describe('GET /api/quiz/statistics', () => {
  beforeEach(() => {
    seedCollection('quiz_questions', [
      { id: 'q1', question: 'Q1?', options: ['A', 'B'], correctAnswer: 'A', category: 'fun', difficulty: 'easy', createdAt: '2026-01-01' },
      { id: 'q2', question: 'Q2?', options: ['A', 'B'], correctAnswer: 'B', category: 'serious', difficulty: 'hard', createdAt: '2026-01-02' }
    ]);
    seedCollection('quiz_answers', [
      { id: 'a1', questionId: 'q1', selectedAnswer: 'A', correctAnswer: 'A', isCorrect: true, answeredBy: 'user-prince', answeredAt: '2026-01-05' },
      { id: 'a2', questionId: 'q2', selectedAnswer: 'A', correctAnswer: 'B', isCorrect: false, answeredBy: 'user-prince', answeredAt: '2026-01-06' },
      { id: 'a3', questionId: 'q1', selectedAnswer: 'A', correctAnswer: 'A', isCorrect: true, answeredBy: 'other-user', answeredAt: '2026-01-07' }
    ]);
  });

  it('devrait retourner les stats de l\'utilisateur', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .get('/api/quiz/statistics')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.totalQuestions).toBe(2);
    expect(res.body.totalAnswers).toBe(2); // seulement celles de user-prince
    expect(res.body.correctAnswers).toBe(1);
    expect(res.body.wrongAnswers).toBe(1);
    expect(res.body.accuracy).toBe(50);
    expect(res.body.categoriesAvailable).toEqual({ fun: 1, serious: 1 });
  });
});

// ========================
// HISTORIQUE
// ========================

describe('GET /api/quiz/history', () => {
  beforeEach(() => {
    seedCollection('quiz_questions', [
      { id: 'q-h1', question: 'Q hist 1?', options: ['A', 'B'], correctAnswer: 'A', category: 'fun', difficulty: 'easy', createdAt: '2026-01-01' }
    ]);
    seedCollection('quiz_answers', [
      { id: 'ah1', questionId: 'q-h1', selectedAnswer: 'A', correctAnswer: 'A', isCorrect: true, answeredBy: 'user-prince', answeredAt: '2026-01-10' }
    ]);
  });

  it('devrait retourner l\'historique paginé', async () => {
    const cookies = await loginAndGetCookies();
    const res = await request
      .get('/api/quiz/history')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].question).toBe('Q hist 1?');
    expect(res.body.data[0].isCorrect).toBe(true);
  });

  it('devrait retourner vide sans historique', async () => {
    // Reset answers pour cet utilisateur
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

    const cookies = await loginAndGetCookies();
    const res = await request
      .get('/api/quiz/history')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.pagination.total).toBe(0);
  });
});
