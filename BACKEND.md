# 🔥 BACKEND - Princess Project - Documentation Complète

> **Version**: 2.0.0  
> **Node.js**: >= 18.0.0  
> **Framework**: Express 5.2.1  
> **Base de données**: Firebase Firestore  
> **Port**: 2106

---

## 📋 Table des Matières

1. [Architecture Générale](#architecture-générale)
2. [Stack Technologique](#stack-technologique)
3. [Structure des Fichiers](#structure-des-fichiers)
4. [Configuration & Variables d'Environnement](#configuration--variables-denvironnement)
5. [Authentification JWT](#authentification-jwt)
6. [API Routes - Toutes les Endpoints](#api-routes---toutes-les-endpoints)
7. [Schémas de Validation](#schémas-de-validation)
8. [Middleware](#middleware)
9. [Base de Données Firestore](#base-de-données-firestore)
10. [Seed Scripts](#seed-scripts)
11. [Sécurité](#sécurité)
12. [Logging](#logging)
13. [Gestion des Erreurs](#gestion-des-erreurs)
14. [Scripts NPM](#scripts-npm)

---

## 🏗️ Architecture Générale

### Pattern MVC Modulaire
```
backend/
├── src/
│   ├── config/          # Configuration (Firebase, Swagger)
│   ├── middleware/      # Authentification, validation, error handler
│   ├── routes/          # Toutes les routes API (8 modules)
│   ├── utils/           # Utilitaires (logger, tokenBlacklist)
│   └── index.js         # Point d'entrée principal
├── seed-*.js            # Scripts de population de données
├── test-api.js          # Tests des endpoints
├── package.json
└── .env                 # Variables d'environnement
```

### Flux de Requête
```
Client Request
    ↓
CORS Middleware (allowedOrigins check)
    ↓
Rate Limiter (100 req/15min)
    ↓
Helmet (Security Headers)
    ↓
Body Parser (JSON)
    ↓
Routes (/api/*)
    ↓
authenticateToken (JWT verification)
    ↓
validate(schema) (Joi validation)
    ↓
Controller Logic
    ↓
Firestore Database
    ↓
Response (JSON)
    ↓
Error Handler (if error)
    ↓
Logger (Winston)
```

---

## 🛠️ Stack Technologique

### Dependencies Principales
```json
{
  "express": "^5.2.1",              // Framework web
  "firebase-admin": "^13.6.1",      // SDK Firebase
  "jsonwebtoken": "^9.0.3",         // JWT authentication
  "bcrypt": "^6.0.0",                // Hash passwords
  "joi": "^18.0.2",                  // Validation schemas
  "helmet": "^8.1.0",                // Security headers
  "cors": "^2.8.6",                  // CORS policy
  "express-rate-limit": "^8.2.1",   // Rate limiting
  "winston": "^3.19.0",              // Logging
  "swagger-jsdoc": "^6.2.8",        // API documentation
  "swagger-ui-express": "^5.0.1",   // Swagger UI
  "dotenv": "^17.3.1",               // Environment variables
  "morgan": "^1.10.1",               // HTTP request logger
  "axios": "^1.13.5"                 // HTTP client
}
```

### DevDependencies
```json
{
  "nodemon": "^3.1.14",             // Auto-reload dev server
  "eslint": "^10.0.1"               // Code linting
}
```

---

## 📁 Structure des Fichiers (Détaillée)

```
backend/
│
├── src/
│   ├── index.js                          # Point d'entrée, configuration Express
│   │
│   ├── config/
│   │   ├── firebase.js                   # Firebase Admin SDK init, getDb()
│   │   └── swagger.js                    # Configuration Swagger/OpenAPI
│   │
│   ├── middleware/
│   │   ├── auth.js                       # authenticateToken (JWT verification)
│   │   ├── validate.js                   # validate(schema) + tous les schémas Joi
│   │   └── errorHandler.js               # Gestionnaire d'erreurs centralisé
│   │
│   ├── routes/
│   │   ├── index.js                      # Routes principales + /health
│   │   ├── auth.js                       # Login, logout, verify (3 routes)
│   │   ├── valentine.js                  # Demandes St-Valentin (5 routes)
│   │   ├── messages.js                   # Messages "Open When" (5 routes)
│   │   ├── coupons.js                    # Bons cadeaux (7 routes)
│   │   ├── planning.js                   # Événements/dates (5 routes)
│   │   ├── quiz.js                       # Quiz questions + réponses (9 routes)
│   │   └── playlist.js                   # Chansons playlist (7 routes)
│   │
│   └── utils/
│       ├── logger.js                     # Winston logger configuré
│       └── tokenBlacklist.js             # Set() pour tokens révoqués
│
├── seed-coupons.js                       # Seed 6 coupons
├── seed-messages.js                      # Seed 7 messages
├── seed-planning.js                      # Seed 5 événements
├── seed-quiz.js                          # Seed 8 questions
├── seed-playlist.js                      # Seed 7 chansons
├── test-api.js                           # Tests endpoints
├── package.json                          # Dépendances NPM
├── .env                                  # Variables d'environnement
├── .env.example                          # Template .env
├── .eslintrc.js                          # Config ESLint
└── princess-project-...-adminsdk.json   # Clé Firebase Service Account
```

---

## ⚙️ Configuration & Variables d'Environnement

### .env (Fichier complet requis)
```bash
# Port du serveur
PORT=2106

# Sécurité - Authentification
APP_PASSWORD=your_secure_password_here
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Firebase Configuration
FIREBASE_PROJECT_ID=princess-project-210622
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@princess-project.iam.gserviceaccount.com

# CORS - Frontend URL
FRONTEND_URL=http://localhost:1308

# Environnement
NODE_ENV=development  # ou 'production'
```

### Configuration Firebase (src/config/firebase.js)
```javascript
import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Mode PRODUCTION : Variables d'environnement
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    })
  });
}
// Mode DEVELOPMENT : Fichier JSON
else {
  const serviceAccount = await import('../princess-project-xxx-adminsdk.json', {
    assert: { type: 'json' }
  });
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount.default)
  });
}

export const getDb = () => admin.firestore();
export default admin;
```

### Configuration Swagger (src/config/swagger.js)
```javascript
// Documentation OpenAPI 3.0
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Princess Project API',
      version: '2.0.0',
      description: 'API sécurisée pour Princess Project'
    },
    servers: [
      { url: 'http://localhost:2106/api', description: 'Dev server' },
      { url: 'https://your-production-url.com/api', description: 'Production' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};
```

---

## 🔐 Authentification JWT

### Système de Token
- **Type**: JSON Web Token (JWT)
- **Durée de vie**: 7 jours (`expiresIn: '7d'`)
- **Algorithme**: HS256
- **Secret**: `process.env.JWT_SECRET` (min 32 caractères)
- **Stockage client**: localStorage (`princess_token`)

### Flow d'Authentification
```
1. Login (POST /api/auth/login)
   Client envoie: { "password": "xxx" }
   ↓
   Serveur compare bcrypt(password) avec APP_PASSWORD
   ↓
   Si OK: Génère JWT avec payload { authenticated: true }
   ↓
   Retourne: { "success": true, "token": "eyJhbG..." }

2. Requêtes Protégées (avec authenticateToken middleware)
   Client envoie: Header "Authorization: Bearer eyJhbG..."
   ↓
   Serveur vérifie:
     - Token présent ?
     - Token dans blacklist ?
     - Token valide (signature + expiration) ?
   ↓
   Si OK: req.user = decoded payload, next()
   Si KO: res.status(401).json({ error: "..." })

3. Logout (POST /api/auth/logout)
   Client envoie token dans header
   ↓
   Serveur ajoute token à tokenBlacklist (Set)
   ↓
   Retourne: { "success": true }
```

### Middleware authenticateToken (src/middleware/auth.js)
```javascript
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token d\'authentification manquant' });
  }

  // Vérifier si token blacklisté (logout)
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token révoqué' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    return res.status(403).json({ error: 'Token invalide' });
  }
};
```

---

## 🛣️ API Routes - Toutes les Endpoints (43 routes)

### 📊 Vue d'ensemble
| Module | Nombre Routes | Authentification |
|--------|---------------|------------------|
| Health | 1 | ❌ Non |
| Auth | 3 | ⚠️ Partielle |
| Valentine | 5 | ✅ Oui |
| Messages | 5 | ✅ Oui |
| Coupons | 7 | ✅ Oui |
| Planning | 5 | ✅ Oui |
| Quiz | 9 | ✅ Oui |
| Playlist | 7 | ✅ Oui |
| **TOTAL** | **42** | - |

---

### 🩺 Health (1 route)
**Base URL**: `/api/health`

#### GET `/api/health`
- **Auth**: ❌ Non
- **Description**: Vérifier l'état du serveur
- **Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-02-23T20:00:00.000Z",
  "uptime": 3600,
  "modules": {
    "auth": true,
    "valentine": true,
    "messages": true,
    "planning": true,
    "coupons": true,
    "quiz": true,
    "playlist": true
  }
}
```

---

### 🔑 Auth (3 routes)
**Base URL**: `/api/auth`

#### POST `/api/auth/login`
- **Auth**: ❌ Non
- **Description**: S'authentifier avec le mot de passe
- **Body**:
```json
{
  "password": "your_secure_password"
}
```
- **Response Success (200)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Connexion réussie"
}
```
- **Response Error (401)**:
```json
{
  "success": false,
  "error": "Mot de passe incorrect"
}
```

#### GET `/api/auth/verify`
- **Auth**: ✅ Oui (Bearer Token)
- **Description**: Vérifier la validité du token
- **Response Success (200)**:
```json
{
  "valid": true,
  "user": { "authenticated": true }
}
```
- **Response Error (401/403)**:
```json
{
  "valid": false,
  "error": "Token invalide"
}
```

#### POST `/api/auth/logout`
- **Auth**: ✅ Oui (Bearer Token)
- **Description**: Déconnexion (blacklist le token)
- **Response Success (200)**:
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

### 💝 Valentine (5 routes)
**Base URL**: `/api/valentine`

#### POST `/api/valentine`
- **Auth**: ✅ Oui
- **Description**: Créer une nouvelle demande de St-Valentin
- **Body**:
```json
{
  "from": "Prince",
  "to": "Princess",
  "message": "Veux-tu être ma Valentine ?",
  "status": "pending"
}
```
- **Response (201)**:
```json
{
  "success": true,
  "id": "abc123xyz",
  "message": "Demande créée avec succès"
}
```

#### GET `/api/valentine`
- **Auth**: ✅ Oui
- **Description**: Récupérer toutes les demandes Valentine
- **Query Params**: `?status=accepted` (optional: pending/accepted/rejected)
- **Response (200)**:
```json
[
  {
    "id": "abc123",
    "from": "Prince",
    "to": "Princess",
    "message": "Veux-tu être ma Valentine ?",
    "status": "accepted",
    "createdAt": "2026-02-14T12:00:00.000Z",
    "updatedAt": "2026-02-14T13:00:00.000Z"
  }
]
```

#### GET `/api/valentine/:id`
- **Auth**: ✅ Oui
- **Description**: Récupérer une demande spécifique
- **Response (200)**: Objet Valentine complet

#### PUT `/api/valentine/:id`
- **Auth**: ✅ Oui
- **Description**: Modifier une demande existante
- **Body**: Mêmes champs que POST
- **Response (200)**:
```json
{
  "success": true,
  "message": "Demande mise à jour"
}
```

#### DELETE `/api/valentine/:id`
- **Auth**: ✅ Oui
- **Description**: Supprimer une demande
- **Response (200)**:
```json
{
  "success": true,
  "message": "Demande supprimée"
}
```

---

### ✉️ Messages "Open When" (5 routes)
**Base URL**: `/api/messages`

#### POST `/api/messages`
- **Auth**: ✅ Oui
- **Description**: Créer un nouveau message
- **Body**:
```json
{
  "title": "Ouvre quand tu es triste",
  "category": "triste",
  "content": "Mon amour, je suis là...",
  "lockedUntil": 1740000000000,
  "backgroundColor": "#FFE5E5"
}
```
- **Response (201)**: ID du message créé

#### GET `/api/messages`
- **Auth**: ✅ Oui
- **Description**: Récupérer tous les messages
- **Query Params**: `?category=triste` (optional)
- **Response (200)**:
```json
{
  "messages": [
    {
      "id": "msg123",
      "title": "Ouvre quand tu es triste",
      "category": "triste",
      "content": "Mon amour...",
      "isLocked": false,
      "lockedUntil": null,
      "backgroundColor": "#FFE5E5",
      "createdAt": "2026-02-23T10:00:00.000Z"
    }
  ]
}
```

#### GET `/api/messages/:id`
- **Auth**: ✅ Oui
- **Description**: Récupérer un message spécifique
- **Response (200)**: Objet Message complet

#### PUT `/api/messages/:id`
- **Auth**: ✅ Oui
- **Description**: Modifier un message
- **Body**: Mêmes champs que POST
- **Response (200)**: Confirmation

#### DELETE `/api/messages/:id`
- **Auth**: ✅ Oui
- **Description**: Supprimer un message
- **Response (200)**: Confirmation

---

### 🎟️ Coupons (7 routes)
**Base URL**: `/api/coupons`

#### POST `/api/coupons`
- **Auth**: ✅ Oui
- **Description**: Créer un nouveau coupon
- **Body**:
```json
{
  "title": "Massage VIP",
  "description": "30 min de massage relaxant",
  "icon": "💆‍♀️",
  "expirationDate": null
}
```

#### GET `/api/coupons`
- **Auth**: ✅ Oui
- **Description**: Récupérer tous les coupons
- **Query Params**: `?status=available` (optional: available/redeemed/expired)
- **Response (200)**:
```json
{
  "coupons": [
    {
      "id": "coup123",
      "title": "Massage VIP",
      "description": "30 min de massage",
      "icon": "💆‍♀️",
      "isRedeemed": false,
      "expirationDate": null,
      "createdAt": "2026-02-23T10:00:00.000Z",
      "redeemedAt": null
    }
  ]
}
```

#### GET `/api/coupons/:id`
- **Auth**: ✅ Oui
- **Description**: Récupérer un coupon spécifique

#### PUT `/api/coupons/:id`
- **Auth**: ✅ Oui
- **Description**: Modifier un coupon

#### PATCH `/api/coupons/:id/redeem`
- **Auth**: ✅ Oui
- **Description**: Utiliser un coupon (marquer comme utilisé)
- **Response (200)**:
```json
{
  "success": true,
  "message": "Coupon utilisé avec succès ! Profitez-en bien 💖",
  "coupon": { /* coupon avec isRedeemed: true */ }
}
```

#### PATCH `/api/coupons/:id/reset`
- **Auth**: ✅ Oui
- **Description**: Réinitialiser un coupon (le rendre disponible)

#### DELETE `/api/coupons/:id`
- **Auth**: ✅ Oui
- **Description**: Supprimer un coupon

---

### 📅 Planning (5 routes)
**Base URL**: `/api/planning`

#### POST `/api/planning`
- **Auth**: ✅ Oui
- **Description**: Créer un nouvel événement
- **Body**:
```json
{
  "title": "Cinéma",
  "description": "Voir le dernier Marvel",
  "date": "2026-03-15T19:00:00.000Z",
  "location": "Cinéma Gaumont",
  "category": "cinema",
  "status": "planned"
}
```

#### GET `/api/planning`
- **Auth**: ✅ Oui
- **Description**: Récupérer tous les événements
- **Query Params**: 
  - `?upcoming=true` (seulement événements futurs)
  - `?category=cinema` (filtrer par catégorie)
  - `?status=done` (filtrer par status: planned/done/cancelled)
- **Response (200)**:
```json
{
  "events": [
    {
      "id": "evt123",
      "title": "Cinéma",
      "description": "Voir Marvel",
      "date": "2026-03-15T19:00:00.000Z",
      "location": "Gaumont",
      "category": "cinema",
      "status": "planned",
      "createdAt": "2026-02-23T10:00:00.000Z"
    }
  ]
}
```

#### GET `/api/planning/:id`
- **Auth**: ✅ Oui
- **Description**: Récupérer un événement spécifique

#### PUT `/api/planning/:id`
- **Auth**: ✅ Oui
- **Description**: Modifier un événement

#### DELETE `/api/planning/:id`
- **Auth**: ✅ Oui
- **Description**: Supprimer un événement

---

### 🎮 Quiz (9 routes)
**Base URL**: `/api/quiz`

#### POST `/api/quiz/questions`
- **Auth**: ✅ Oui
- **Description**: Créer une nouvelle question
- **Body**:
```json
{
  "question": "Quelle est ma couleur préférée ?",
  "options": ["Rose", "Bleu", "Vert", "Rouge"],
  "correctAnswer": "Rose",
  "difficulty": "easy"
}
```

#### GET `/api/quiz/questions`
- **Auth**: ✅ Oui
- **Description**: Récupérer toutes les questions
- **Query Params**: `?difficulty=easy` (optional: easy/medium/hard)
- **Response (200)**:
```json
{
  "questions": [
    {
      "id": "q123",
      "question": "Quelle est ma couleur préférée ?",
      "options": ["Rose", "Bleu", "Vert", "Rouge"],
      "correctAnswer": "Rose",
      "difficulty": "easy",
      "createdAt": "2026-02-23T10:00:00.000Z"
    }
  ]
}
```

#### GET `/api/quiz/questions/random`
- **Auth**: ✅ Oui
- **Description**: Récupérer une question aléatoire
- **Query Params**: `?difficulty=medium` (optional)

#### GET `/api/quiz/questions/:id`
- **Auth**: ✅ Oui
- **Description**: Récupérer une question spécifique

#### PUT `/api/quiz/questions/:id`
- **Auth**: ✅ Oui
- **Description**: Modifier une question

#### DELETE `/api/quiz/questions/:id`
- **Auth**: ✅ Oui
- **Description**: Supprimer une question

#### POST `/api/quiz/answers`
- **Auth**: ✅ Oui
- **Description**: Soumettre une réponse et l'enregistrer
- **Body**:
```json
{
  "questionId": "q123",
  "answer": "Rose",
  "isCorrect": true
}
```
- **Response (201)**:
```json
{
  "success": true,
  "isCorrect": true,
  "message": "Bonne réponse ! 🎉"
}
```

#### GET `/api/quiz/statistics`
- **Auth**: ✅ Oui
- **Description**: Récupérer les statistiques globales
- **Response (200)**:
```json
{
  "totalQuestions": 8,
  "totalAnswers": 15,
  "correctAnswers": 12,
  "score": 80
}
```

#### GET `/api/quiz/history`
- **Auth**: ✅ Oui
- **Description**: Récupérer l'historique des réponses
- **Query Params**: `?limit=10` (optional)
- **Response (200)**:
```json
{
  "history": [
    {
      "id": "ans123",
      "questionId": "q123",
      "question": "Quelle est ma couleur préférée ?",
      "answer": "Rose",
      "isCorrect": true,
      "answeredAt": "2026-02-23T10:00:00.000Z"
    }
  ]
}
```

---

### 🎵 Playlist (7 routes)
**Base URL**: `/api/playlist`

#### POST `/api/playlist`
- **Auth**: ✅ Oui
- **Description**: Ajouter une nouvelle chanson
- **Body**:
```json
{
  "title": "Our Song",
  "artist": "Taylor Swift",
  "album": "Taylor Swift",
  "duration": "3:22",
  "reason": "Notre première danse",
  "spotifyUrl": "https://open.spotify.com/track/xxx",
  "isFavorite": true
}
```

#### GET `/api/playlist`
- **Auth**: ✅ Oui
- **Description**: Récupérer toutes les chansons
- **Query Params**: 
  - `?sortBy=playCount` (default: createdAt, options: title/artist/playCount)
  - `?favorite=true` (seulement les favorites)
- **Response (200)**:
```json
{
  "songs": [
    {
      "id": "song123",
      "title": "Our Song",
      "artist": "Taylor Swift",
      "album": "Taylor Swift",
      "duration": "3:22",
      "reason": "Notre première danse",
      "spotifyUrl": "https://open.spotify.com/track/xxx",
      "isFavorite": true,
      "playCount": 42,
      "lastPlayedAt": "2026-02-23T10:00:00.000Z",
      "createdAt": "2026-02-01T10:00:00.000Z"
    }
  ]
}
```

#### GET `/api/playlist/:id`
- **Auth**: ✅ Oui
- **Description**: Récupérer une chanson spécifique

#### PUT `/api/playlist/:id`
- **Auth**: ✅ Oui
- **Description**: Modifier une chanson

#### PATCH `/api/playlist/:id/favorite`
- **Auth**: ✅ Oui
- **Description**: Toggle le statut favorite d'une chanson
- **Response (200)**:
```json
{
  "success": true,
  "isFavorite": true
}
```

#### PATCH `/api/playlist/:id/play`
- **Auth**: ✅ Oui
- **Description**: Incrémenter le compteur de lecture
- **Response (200)**:
```json
{
  "success": true,
  "playCount": 43
}
```

#### DELETE `/api/playlist/:id`
- **Auth**: ✅ Oui
- **Description**: Supprimer une chanson

---

## ✅ Schémas de Validation (Joi)

### Tous les schémas (src/middleware/validate.js)

```javascript
// Valentine Schema
export const valentineSchema = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  message: Joi.string().required(),
  status: Joi.string().valid('pending', 'accepted', 'rejected').default('pending')
});

// Login Schema
export const loginSchema = Joi.object({
  password: Joi.string().required().min(6)
});

// Message Schema
export const messageSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().valid('triste', 'manque', 'fachee', 'rire', 'doute', 'motivation', 'special').required(),
  content: Joi.string().required(),
  lockedUntil: Joi.number().optional().allow(null),
  backgroundColor: Joi.string().optional()
});

// Planning Schema
export const planningSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  date: Joi.string().isoDate().required(),
  location: Joi.string().allow('').optional(),
  category: Joi.string().valid('cinema', 'restaurant', 'voyage', 'sport', 'culture', 'autre').default('autre'),
  status: Joi.string().valid('planned', 'done', 'cancelled').default('planned')
});

// Coupon Schema
export const couponSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  icon: Joi.string().optional(),
  expirationDate: Joi.string().isoDate().optional().allow(null, '')
});

// Quiz Question Schema
export const quizSchema = Joi.object({
  question: Joi.string().required(),
  options: Joi.array().items(Joi.string()).length(4).required(),
  correctAnswer: Joi.string().required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium')
});

// Quiz Answer Schema
export const answerSchema = Joi.object({
  questionId: Joi.string().required(),
  answer: Joi.string().required(),
  isCorrect: Joi.boolean().required()
});

// Playlist Song Schema
export const playlistSchema = Joi.object({
  title: Joi.string().required(),
  artist: Joi.string().required(),
  album: Joi.string().allow('').optional(),
  duration: Joi.string().pattern(/^\d+:\d{2}$/).optional(),
  reason: Joi.string().allow('').optional(),
  spotifyUrl: Joi.string().uri().optional().allow(''),
  isFavorite: Joi.boolean().default(false)
});
```

### Middleware validate
```javascript
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        error: 'Validation échouée',
        details: errors
      });
    }

    req.body = value;
    next();
  };
};
```

---

## 🔒 Middleware

### 1. authenticateToken (src/middleware/auth.js)
```javascript
import jwt from 'jsonwebtoken';
import { tokenBlacklist } from '../utils/tokenBlacklist.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token d\'authentification manquant' });
  }

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token révoqué' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    return res.status(403).json({ error: 'Token invalide' });
  }
};
```

### 2. Error Handler (src/middleware/errorHandler.js)
```javascript
const errorHandler = (err, req, res, next) => {
  // Log l'erreur
  logger.error('Erreur serveur', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip
  });

  // Erreur de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation échouée',
      details: err.details
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token invalide' });
  }

  // Erreur générique
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
```

---

## 🗄️ Base de Données Firestore

### Collections Firebase

#### 1. Collection: `valentine`
```javascript
{
  id: "auto-generated",
  from: "Prince",
  to: "Princess",
  message: "Veux-tu être ma Valentine ?",
  status: "pending" | "accepted" | "rejected",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 2. Collection: `messages`
```javascript
{
  id: "auto-generated",
  title: "Ouvre quand tu es triste",
  category: "triste" | "manque" | "fachee" | "rire" | "doute" | "motivation" | "special",
  content: "Mon amour, je suis là pour toi...",
  lockedUntil: 1740000000000 | null,  // Timestamp en millisecondes
  backgroundColor: "#FFE5E5",
  createdAt: Timestamp
}
```

#### 3. Collection: `coupons`
```javascript
{
  id: "auto-generated",
  title: "Massage VIP",
  description: "30 min de massage relaxant",
  icon: "💆‍♀️",
  isRedeemed: false,
  expirationDate: "2026-12-31" | null,
  createdAt: Timestamp,
  redeemedAt: Timestamp | null
}
```

#### 4. Collection: `planning`
```javascript
{
  id: "auto-generated",
  title: "Cinéma",
  description: "Voir le dernier Marvel",
  date: "2026-03-15T19:00:00.000Z",
  location: "Cinéma Gaumont",
  category: "cinema" | "restaurant" | "voyage" | "sport" | "culture" | "autre",
  status: "planned" | "done" | "cancelled",
  createdAt: Timestamp
}
```

#### 5. Collection: `quiz_questions`
```javascript
{
  id: "auto-generated",
  question: "Quelle est ma couleur préférée ?",
  options: ["Rose", "Bleu", "Vert", "Rouge"],
  correctAnswer: "Rose",
  difficulty: "easy" | "medium" | "hard",
  createdAt: Timestamp
}
```

#### 6. Collection: `quiz_answers`
```javascript
{
  id: "auto-generated",
  questionId: "q123",
  answer: "Rose",
  isCorrect: true,
  answeredAt: Timestamp
}
```

#### 7. Collection: `playlist`
```javascript
{
  id: "auto-generated",
  title: "Our Song",
  artist: "Taylor Swift",
  album: "Taylor Swift",
  duration: "3:22",
  reason: "Notre première danse",
  spotifyUrl: "https://open.spotify.com/track/xxx",
  isFavorite: true,
  playCount: 42,
  lastPlayedAt: Timestamp,
  createdAt: Timestamp
}
```

### Opérations Firestore Communes
```javascript
import { getDb } from './config/firebase.js';
import admin from './config/firebase.js';

const db = getDb();

// CREATE
const docRef = await db.collection('coupons').add({
  title: "Massage",
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});
console.log('Created with ID:', docRef.id);

// READ ALL
const snapshot = await db.collection('coupons').get();
snapshot.forEach(doc => {
  console.log(doc.id, doc.data());
});

// READ ONE
const doc = await db.collection('coupons').doc('abc123').get();
if (doc.exists) {
  console.log(doc.data());
}

// UPDATE
await db.collection('coupons').doc('abc123').update({
  isRedeemed: true,
  redeemedAt: admin.firestore.FieldValue.serverTimestamp()
});

// DELETE
await db.collection('coupons').doc('abc123').delete();

// QUERY
const querySnapshot = await db.collection('coupons')
  .where('isRedeemed', '==', false)
  .orderBy('createdAt', 'desc')
  .limit(10)
  .get();
```

---

## 🌱 Seed Scripts

### Pattern Uniforme (Tous les scripts)
Tous les 5 seed scripts suivent le même pattern depuis les corrections :
- ✅ Connexion directe à Firebase (pas de HTTP)
- ✅ Ajout de `createdAt: admin.firestore.FieldValue.serverTimestamp()`
- ✅ Pas besoin du backend lancé
- ✅ Logs clairs avec émojis

### 1. seed-coupons.js (6 coupons)
```javascript
import admin from './src/config/firebase.js';
import { getDb } from './src/config/firebase.js';

const db = getDb();

const coupons = [
  {
    title: "Massage VIP",
    description: "Valable pour 30 min de massage relaxant (dos ou pieds au choix).",
    icon: "💆‍♀️",
    expirationDate: null,
    isRedeemed: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  // ... 5 autres coupons
];

async function seedCoupons() {
  console.log('🎟️ Création des coupons...');
  
  for (const coupon of coupons) {
    await db.collection('coupons').add(coupon);
    console.log(`✅ 🎁 ${coupon.title}`);
  }
  
  console.log('🎉 Tous les coupons ont été créés avec succès !');
  process.exit(0);
}

seedCoupons();
```

### 2. seed-messages.js (7 messages)
```javascript
// 6 messages déverrouillés + 1 message secret verrouillé
const messages = [
  {
    title: "Ouvre quand tu es triste 💙",
    category: "triste",
    content: "Mon amour...",
    lockedUntil: null,
    backgroundColor: "#E3F2FD",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  // ... 5 autres messages déverrouillés
  {
    title: "Message Secret 🎁",
    category: "special",
    content: "Ce message sera déverrouillé le 14 février 2027 💖",
    lockedUntil: new Date('2027-02-14').getTime(),
    backgroundColor: "#F3E5F5",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];
```

### 3. seed-planning.js (5 événements)
```javascript
const events = [
  {
    title: "Ciné Date Night 🎬",
    description: "On va voir le dernier film que tu veux !",
    date: new Date('2026-03-15T19:00:00').toISOString(),
    location: "Cinéma Gaumont",
    category: "cinema",
    status: "planned",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  // ... 4 autres événements
];
```

### 4. seed-quiz.js (8 questions)
```javascript
const questions = [
  {
    question: "Quelle est ma couleur préférée ?",
    options: ["Rose", "Bleu", "Vert", "Rouge"],
    correctAnswer: "Rose",
    difficulty: "easy",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  // ... 7 autres questions
];
```

### 5. seed-playlist.js (7 chansons)
```javascript
const songs = [
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: "4:23",
    reason: "Notre chanson, celle qui nous fait danser 💕",
    spotifyUrl: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
    isFavorite: true,
    playCount: 0,
    lastPlayedAt: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  // ... 6 autres chansons
];
```

### Commandes d'exécution
```bash
cd backend

# Exécuter individuellement
node seed-coupons.js
node seed-messages.js
node seed-planning.js
node seed-quiz.js
node seed-playlist.js

# Ou exécuter tous d'un coup (PowerShell)
"seed-coupons", "seed-messages", "seed-planning", "seed-quiz", "seed-playlist" | ForEach-Object { node "$_.js" }
```

---

## 🔐 Sécurité

### 1. Helmet (Headers HTTP sécurisés)
```javascript
import helmet from 'helmet';
app.use(helmet());

// Ajoute automatiquement:
// - X-DNS-Prefetch-Control
// - X-Frame-Options: DENY
// - Strict-Transport-Security
// - X-Content-Type-Options: nosniff
// - X-XSS-Protection
```

### 2. CORS (Cross-Origin Resource Sharing)
```javascript
const allowedOrigins = [
  'http://localhost:1308',
  process.env.FRONTEND_URL,
  'https://princess-project-chi.vercel.app'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.includes('vercel.app')) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
```

### 3. Rate Limiting (Protection DDoS)
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requêtes max
  message: 'Trop de requêtes, réessayez plus tard',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);
```

### 4. Trust Proxy (Déploiement)
```javascript
app.set('trust proxy', 1);
// Important pour Railway, Heroku, Vercel
// Permet d'obtenir la vraie IP du client
```

### 5. Body Size Limit
```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### 6. Token Blacklist (Logout sécurisé)
```javascript
// src/utils/tokenBlacklist.js
export const tokenBlacklist = new Set();

// Lors du logout
tokenBlacklist.add(token);

// Vérification dans authenticateToken
if (tokenBlacklist.has(token)) {
  return res.status(401).json({ error: 'Token révoqué' });
}
```

---

## 📝 Logging (Winston)

### Configuration (src/utils/logger.js)
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'princess-project-backend' },
  transports: [
    // Fichier d'erreurs
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    // Fichier combiné
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Logs console en développement
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
```

### Utilisation dans les routes
```javascript
import logger from '../utils/logger.js';

// Info
logger.info('Coupon créé', { 
  id: docRef.id, 
  title: 'Massage VIP',
  ip: req.ip 
});

// Erreur
logger.error('Erreur création coupon', { 
  error: error.message,
  stack: error.stack,
  ip: req.ip 
});

// Debug
logger.debug('Requête reçue', { 
  method: req.method,
  path: req.path 
});
```

---

## 🛠️ Scripts NPM

```json
{
  "scripts": {
    "start": "node src/index.js",         // Production
    "dev": "nodemon src/index.js",        // Dev avec auto-reload
    "test": "echo \"No tests yet\"",      // Placeholder
    "test:api": "node test-api.js",       // Tests endpoints
    "lint": "eslint src/"                 // Linting ESLint
  }
}
```

### Commandes d'utilisation
```bash
# Développement (avec nodemon)
npm run dev

# Production
npm start

# Linting
npm run lint

# Tests API
npm run test:api
```

---

## 🚀 Déploiement

### Variables d'environnement requises
```bash
PORT=2106
APP_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_32_chars_minimum
FIREBASE_PROJECT_ID=princess-project-210622
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Plateformes recommandées
- **Railway**: Excellent pour Node.js + Firebase
- **Render**: Alternative gratuite
- **Heroku**: Option classique
- **Vercel**: Possible avec serverless functions

### Checklist pré-déploiement
- [ ] Variables d'environnement configurées
- [ ] Clé Firebase Service Account ajoutée
- [ ] FRONTEND_URL mis à jour
- [ ] JWT_SECRET fort (32+ caractères)
- [ ] NODE_ENV=production
- [ ] Seed scripts exécutés
- [ ] Logs configurés
- [ ] CORS configuré pour production

---

## 📚 Documentation Swagger

**URL locale**: `http://localhost:2106/api-docs`

Documentation OpenAPI 3.0 complète avec tous les endpoints, schémas, exemples de requêtes/réponses.

Interface interactive permettant de tester les endpoints directement depuis le navigateur.

---

## 🎯 Points Clés pour IA

1. **Architecture**: MVC modulaire avec 8 modules de routes
2. **Authentification**: JWT avec blacklist, durée 7 jours
3. **Base de données**: Firebase Firestore, 7 collections
4. **Validation**: Joi schemas pour toutes les entrées
5. **Sécurité**: Helmet + CORS + Rate Limiting + Trust Proxy
6. **Total routes**: 42 endpoints (41 protégés + 1 publique)
7. **Seed data**: 33 items au total (6+7+5+8+7)
8. **Logging**: Winston pour tous les événements
9. **Documentation**: Swagger UI à `/api-docs`
10. **Pattern uniforme**: Tous les seed scripts utilisent Firebase direct

---

## 🔗 Liens Importants

- **Health Check**: `GET http://localhost:2106/api/health`
- **Swagger Docs**: `http://localhost:2106/api-docs`
- **Firebase Console**: `https://console.firebase.google.com/project/princess-project-210622`

---

**Date de dernière mise à jour**: 23 février 2026  
**Auteur**: The Prince  
**Version**: 2.0.0
