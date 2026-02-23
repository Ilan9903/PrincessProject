# 💖 PRINCESS PROJECT - Documentation Complète du Projet

> **Application Web Full-Stack d'Amour**  
> **Version**: 2.0.0  
> **Date**: 23 Février 2026  
> **Auteur**: The Prince

---

## 📋 Table des Matières

1. [Vue d'Ensemble du Projet](#vue-densemble-du-projet)
2. [Architecture Globale](#architecture-globale)
3. [Stack Technologique Complète](#stack-technologique-complète)
4. [Structure du Projet](#structure-du-projet)
5. [Flow de Données Complet](#flow-de-données-complet)
6. [Authentification End-to-End](#authentification-end-to-end)
7. [Toutes les Fonctionnalités](#toutes-les-fonctionnalités)
8. [Schéma Base de Données](#schéma-base-de-données)
9. [Communication Frontend-Backend](#communication-frontend-backend)
10. [Sécurité Globale](#sécurité-globale)
11. [Déploiement Complet](#déploiement-complet)
12. [Guide de Développement](#guide-de-développement)

---

## 🎯 Vue d'Ensemble du Projet

### Description
**Princess Project** est une application web full-stack romantique conçue pour célébrer une relation amoureuse. Elle combine plusieurs fonctionnalités interactives : demandes de St-Valentin, messages "Open When", bons cadeaux, planification de dates, quiz couple, playlist musicale, et bien plus.

### Objectifs
- 💝 Créer une expérience digitale romantique unique
- 🎨 Design élégant et animations fluides
- 🔐 Sécurisé avec authentification JWT
- 📱 Progressive Web App (installable)
- 🚀 Performant et scalable

### Résumé Technique
```
Frontend:  React 19.2.0 + Vite + Tailwind CSS + Framer Motion
Backend:   Node.js + Express 5.2.1 + Firebase Firestore
Auth:      JWT (7 jours) avec blacklist
API:       RESTful (42 endpoints)
Database:  7 collections Firestore
Design:    Pink/Rose palette, Playfair Display
PWA:       Installable, offline-capable
```

---

## 🏗️ Architecture Globale

### Diagramme Système
```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  ┌────────────────────────────────────────────────────┐    │
│  │              REACT FRONTEND                         │    │
│  │  - 13 Pages (Login + 12 protégées)                 │    │
│  │  - 6 Composants réutilisables                      │    │
│  │  - Framer Motion animations                        │    │
│  │  - Tailwind CSS styling                            │    │
│  │  - PWA (Service Worker)                            │    │
│  └────────────────────────────────────────────────────┘    │
│                         ↕                                    │
│                    HTTP/HTTPS                               │
│                  (JWT in Headers)                           │
└─────────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────────┐
│                      SERVER                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │              EXPRESS BACKEND                        │    │
│  │  - 8 Routes modules (42 endpoints)                 │    │
│  │  - JWT Authentication                               │    │
│  │  - Joi Validation                                   │    │
│  │  - Winston Logging                                  │    │
│  │  - CORS + Helmet + Rate Limiting                   │    │
│  └────────────────────────────────────────────────────┘    │
│                         ↕                                    │
│                   Firebase SDK                              │
└─────────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE                                 │
│  ┌────────────────────────────────────────────────────┐    │
│  │            FIREBASE FIRESTORE                       │    │
│  │  - 7 Collections                                    │    │
│  │    1. valentine (demandes)                          │    │
│  │    2. messages (Open When)                          │    │
│  │    3. coupons (bons cadeaux)                        │    │
│  │    4. planning (événements)                         │    │
│  │    5. quiz_questions                                │    │
│  │    6. quiz_answers                                  │    │
│  │    7. playlist (chansons)                           │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Frontend (Détaillée)
```
src/
├── main.jsx                         # createRoot
│   └── App.jsx                      # BrowserRouter
│       ├── ScrollToTop              # Auto-scroll
│       ├── MusicPlayer              # Global player (UI)
│       ├── InstallPrompt            # PWA prompt
│       └── AnimatedRoutes
│           ├── /login → Login.jsx
│           ├── / → Home.jsx
│           │   ├── FloatingHearts
│           │   ├── RelationshipCounter
│           │   └── 10 Navigation Buttons
│           ├── /valentine → Valentine-request.jsx
│           │   └── FloatingHearts + PageTransition
│           ├── /success → Valentine-success.jsx
│           ├── /date-ideas → DateIdeas.jsx
│           ├── /open-when → OpenWhen.jsx
│           ├── /our-story → OurStory.jsx
│           ├── /reasons → Reasons.jsx
│           ├── /coupons → Coupons.jsx
│           ├── /wheel → Wheel.jsx
│           ├── /quiz → Quiz.jsx
│           ├── /scratch → ScratchGame.jsx
│           └── /playlist → Playlist.jsx
└── Utils/
    └── api.js
        ├── getToken()
        ├── setToken()
        ├── removeToken()
        ├── isAuthenticated()
        ├── login()
        ├── verifyToken()
        ├── logout()
        └── authenticatedFetch()
```

### Architecture Backend (Détaillée)
```
src/
├── index.js                         # Express server
│   ├── Helmet (security headers)
│   ├── CORS (multi-origins)
│   ├── Rate Limiter (100 req/15min)
│   ├── Body Parser (10mb)
│   ├── Morgan (HTTP logs)
│   └── Routes (/api/*)
│       └── routes/index.js
│           ├── /health → health check
│           ├── /auth → auth.js
│           │   ├── POST /login
│           │   ├── GET /verify
│           │   └── POST /logout
│           ├── /valentine → valentine.js (5 routes)
│           ├── /messages → messages.js (5 routes)
│           ├── /coupons → coupons.js (7 routes)
│           ├── /planning → planning.js (5 routes)
│           ├── /quiz → quiz.js (9 routes)
│           └── /playlist → playlist.js (7 routes)
├── middleware/
│   ├── auth.js (authenticateToken)
│   ├── validate.js (Joi schemas + validate)
│   └── errorHandler.js (centralized)
├── config/
│   ├── firebase.js (Admin SDK + getDb)
│   └── swagger.js (OpenAPI docs)
└── utils/
    ├── logger.js (Winston)
    └── tokenBlacklist.js (Set)
```

---

## 🛠️ Stack Technologique Complète

### Frontend Stack
| Technologie | Version | Rôle |
|-------------|---------|------|
| **React** | 19.2.0 | UI Framework |
| **Vite** | 7.3.1 | Build Tool |
| **React Router** | 7.13.0 | Routing |
| **Framer Motion** | 12.34.0 | Animations |
| **Tailwind CSS** | 4.1.18 | Styling |
| **Axios** | 1.13.5 | HTTP Client |
| **Canvas Confetti** | 1.9.4 | Confettis |
| **PWA Plugin** | 1.2.0 | PWA Support |

### Backend Stack
| Technologie | Version | Rôle |
|-------------|---------|------|
| **Node.js** | >= 18.0.0 | Runtime |
| **Express** | 5.2.1 | Web Framework |
| **Firebase Admin** | 13.6.1 | Database SDK |
| **JWT** | 9.0.3 | Authentication |
| **Bcrypt** | 6.0.0 | Password Hashing |
| **Joi** | 18.0.2 | Validation |
| **Helmet** | 8.1.0 | Security |
| **CORS** | 2.8.6 | Cross-Origin |
| **Rate Limit** | 8.2.1 | DDoS Protection |
| **Winston** | 3.19.0 | Logging |
| **Swagger** | 6.2.8 + 5.0.1 | API Docs |

### Database
| Technologie | Rôle |
|-------------|------|
| **Firebase Firestore** | NoSQL Database |
| **7 Collections** | Structured data |
| **Real-time updates** | Optional |
| **Serverless** | Google Cloud |

### DevOps & Tools
| Outil | Usage |
|-------|-------|
| **Nodemon** | Dev auto-reload |
| **ESLint** | Code quality |
| **Git** | Version control |
| **npm** | Package manager |
| **dotenv** | Environment vars |

---

## 📁 Structure du Projet (Vue Complète)

```
Princess Project/
│
├── README.md                        # Documentation principale
├── CORRECTIONS.md                   # Historique des corrections
├── BACKEND.md                       # Doc backend détaillée
├── FRONTEND.md                      # Doc frontend détaillée
├── PROJECT.md                       # Ce fichier (vue globale)
│
├── backend/
│   ├── src/
│   │   ├── index.js                # Point d'entrée serveur
│   │   ├── config/
│   │   │   ├── firebase.js         # Firebase Admin init
│   │   │   └── swagger.js          # OpenAPI config
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification
│   │   │   ├── validate.js         # Joi schemas
│   │   │   └── errorHandler.js     # Error handling
│   │   ├── routes/
│   │   │   ├── index.js            # Main router
│   │   │   ├── auth.js             # 3 routes
│   │   │   ├── valentine.js        # 5 routes
│   │   │   ├── messages.js         # 5 routes
│   │   │   ├── coupons.js          # 7 routes
│   │   │   ├── planning.js         # 5 routes
│   │   │   ├── quiz.js             # 9 routes
│   │   │   └── playlist.js         # 7 routes
│   │   └── utils/
│   │       ├── logger.js           # Winston logger
│   │       └── tokenBlacklist.js   # Revoked tokens
│   ├── seed-coupons.js             # Seed 6 coupons
│   ├── seed-messages.js            # Seed 7 messages
│   ├── seed-planning.js            # Seed 5 events
│   ├── seed-quiz.js                # Seed 8 questions
│   ├── seed-playlist.js            # Seed 7 songs
│   ├── test-api.js                 # API tests
│   ├── package.json                # Backend deps
│   ├── .env                        # Environment vars
│   ├── .env.example                # Template
│   ├── .eslintrc.js                # ESLint config
│   └── princess-project-xxx.json   # Firebase service account
│
└── frontend/
    ├── public/
    │   └── favicon_assets/         # PWA icons
    ├── src/
    │   ├── assets/                 # Images (empty)
    │   ├── components/
    │   │   ├── FloatingHearts.jsx
    │   │   ├── InstallPrompt.jsx
    │   │   ├── MusicPlayer.jsx
    │   │   ├── PageTransition.jsx
    │   │   ├── RelationshipCounter.jsx
    │   │   └── ScrollToTop.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Home.jsx
    │   │   ├── Valentine-request.jsx
    │   │   ├── Valentine-success.jsx
    │   │   ├── DateIdeas.jsx
    │   │   ├── OpenWhen.jsx
    │   │   ├── OurStory.jsx
    │   │   ├── Reasons.jsx
    │   │   ├── Coupons.jsx
    │   │   ├── Wheel.jsx
    │   │   ├── Quiz.jsx
    │   │   ├── ScratchGame.jsx
    │   │   └── Playlist.jsx
    │   ├── Utils/
    │   │   └── api.js              # API client
    │   ├── App.jsx                 # Main router
    │   ├── App.css                 # Global styles
    │   ├── main.jsx                # Entry point
    │   └── index.css               # Tailwind imports
    ├── index.html                  # HTML template
    ├── vite.config.js              # Vite + PWA config
    ├── tailwind.config.js          # Tailwind theme
    ├── eslint.config.js            # ESLint rules
    ├── package.json                # Frontend deps
    ├── .env                        # Dev env vars
    ├── .env.production             # Prod env vars
    └── .env.example                # Template
```

---

## 🔄 Flow de Données Complet

### 1. Initialisation de l'Application
```
User ouvre navigateur
    ↓
index.html chargé
    ↓
main.jsx exécuté
    ↓
React.createRoot(document.getElementById('root'))
    ↓
<App /> monté
    ↓
BrowserRouter initialisé
    ↓
ScrollToTop activé
    ↓
ProtectedRoute vérifie auth
    ↓
Si token existe → verifyToken() API call
    ├─ Valid → Continue to route
    └─ Invalid → Redirect /login
```

### 2. Flow de Login
```
User sur /login
    ↓
Entre password dans input
    ↓
Clique "Se connecter"
    ↓
handleSubmit(e)
    ↓
e.preventDefault()
    ↓
login(password) from api.js
    ↓
fetch(POST /api/auth/login, { password })
    ↓
Backend reçoit requête
    ↓
Compare bcrypt(password) avec APP_PASSWORD
    ├─ Match → Génère JWT (7 jours)
    │   ↓
    │   jwt.sign({ authenticated: true }, JWT_SECRET)
    │   ↓
    │   Retourne { success: true, token: "..." }
    │   ↓
    │   Frontend: setToken(token)
    │   ↓
    │   localStorage.setItem('princess_token', token)
    │   ↓
    │   navigate('/')
    │   ↓
    │   Home page rendered
    └─ No Match → Retourne { success: false, error: "Mot de passe incorrect" }
        ↓
        Frontend: setError(error)
        ↓
        Affiche message d'erreur
```

### 3. Flow de Requête Protégée (Exemple: GET Coupons)
```
User sur /coupons
    ↓
Coupons.jsx monte
    ↓
useEffect(() => fetchCoupons())
    ↓
authenticatedFetch('/api/coupons')
    ↓
getToken() de localStorage
    ↓
fetch(GET /api/coupons, {
  headers: { Authorization: Bearer ${token} }
})
    ↓
Backend reçoit requête
    ↓
authenticateToken middleware
    ↓
Vérifie token présent
    ↓
Vérifie token pas dans blacklist
    ↓
jwt.verify(token, JWT_SECRET)
    ├─ Valid → req.user = decoded, next()
    │   ↓
    │   Route handler: GET /api/coupons
    │   ↓
    │   db.collection('coupons').get()
    │   ↓
    │   Firestore retourne documents
    │   ↓
    │   Format data (timestamps → ISO strings)
    │   ↓
    │   res.json({ coupons: [...] })
    │   ↓
    │   Frontend reçoit response
    │   ↓
    │   const data = await response.json()
    │   ↓
    │   setCoupons(data.coupons)
    │   ↓
    │   Re-render avec coupons affichés
    └─ Invalid → res.status(401).json({ error: "..." })
        ↓
        Frontend catch error
        ↓
        Redirect /login ou affiche erreur
```

### 4. Flow de Mutation (Exemple: PATCH Redeem Coupon)
```
User clique "Utiliser ce coupon"
    ↓
handleRedeem(couponId)
    ↓
authenticatedFetch(`/api/coupons/${couponId}/redeem`, {
  method: 'PATCH'
})
    ↓
Backend authenticateToken
    ↓
Route handler: PATCH /api/coupons/:id/redeem
    ↓
Récupère coupon: db.collection('coupons').doc(id).get()
    ↓
Vérifie isRedeemed === false
    ├─ True → Continue
    │   ↓
    │   Update: doc.update({
    │     isRedeemed: true,
    │     redeemedAt: serverTimestamp()
    │   })
    │   ↓
    │   Récupère coupon mis à jour
    │   ↓
    │   res.json({ success: true, coupon: {...} })
    │   ↓
    │   Frontend reçoit response
    │   ↓
    │   setCoupons(coupons.map(c =>
    │     c.id === couponId ? updatedCoupon : c
    │   ))
    │   ↓
    │   Re-render avec coupon grayed out
    └─ False (déjà utilisé) → res.status(400).json({ error: "..." })
        ↓
        Frontend affiche message d'erreur
```

### 5. Flow de Logout
```
User clique bouton "Déconnexion"
    ↓
handleLogout()
    ↓
logout() from api.js
    ↓
token = getToken()
    ↓
fetch(POST /api/auth/logout, {
  headers: { Authorization: Bearer ${token} }
})
    ↓
Backend authenticateToken
    ↓
Route handler: POST /api/auth/logout
    ↓
tokenBlacklist.add(token)
    ↓
res.json({ success: true })
    ↓
Frontend reçoit response
    ↓
removeToken()
    ↓
localStorage.removeItem('princess_token')
    ↓
navigate('/login')
    ↓
Login page rendered
```

---

## 🔐 Authentification End-to-End

### Vue d'Ensemble
```
┌──────────────────────────────────────────────────────────┐
│                    AUTHENTIFICATION                       │
├──────────────────────────────────────────────────────────┤
│ Type:         JWT (JSON Web Token)                       │
│ Durée:        7 jours                                    │
│ Algorithme:   HS256                                      │
│ Stockage:     localStorage (frontend)                    │
│ Blacklist:    Set in-memory (backend)                   │
│ Password:     Bcrypt hashed (APP_PASSWORD)              │
└──────────────────────────────────────────────────────────┘
```

### Composants d'Authentification

#### Frontend (Utils/api.js)
```javascript
// Token Management
const TOKEN_KEY = 'princess_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Login
export const login = async (password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  
  const data = await response.json();
  
  if (data.success && data.token) {
    setToken(data.token);
    return { success: true };
  }
  
  return { success: false, error: data.error || 'Erreur de connexion' };
};

// Verify Token
export const verifyToken = async () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.valid) {
      removeToken();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur vérification token:', error);
    removeToken();
    return false;
  }
};

// Logout
export const logout = async () => {
  const token = getToken();
  
  if (token) {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  }
  
  removeToken();
};

// Authenticated Fetch (utilisé partout)
export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Non authentifié');
  }
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
  return fetch(`${API_URL}${endpoint}`, mergedOptions);
};
```

#### Backend (middleware/auth.js)
```javascript
import jwt from 'jsonwebtoken';
import { tokenBlacklist } from '../utils/tokenBlacklist.js';

export const authenticateToken = (req, res, next) => {
  // 1. Extraire token des headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // 2. Vérifier présence token
  if (!token) {
    return res.status(401).json({ 
      error: 'Token d\'authentification manquant' 
    });
  }

  // 3. Vérifier si token blacklisté (logout)
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ 
      error: 'Token révoqué. Veuillez vous reconnecter.' 
    });
  }

  // 4. Vérifier validité signature + expiration
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. Attacher user au request
    req.user = decoded;
    
    // 6. Continuer vers la route
    next();
  } catch (error) {
    // Token expiré
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expiré. Veuillez vous reconnecter.' 
      });
    }
    
    // Token invalide (signature, format, etc.)
    return res.status(403).json({ 
      error: 'Token invalide' 
    });
  }
};
```

#### Backend (routes/auth.js)
```javascript
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/auth.js';
import { tokenBlacklist } from '../utils/tokenBlacklist.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { password } = req.body;
    
    // Comparer avec APP_PASSWORD (bcrypt pour production)
    const isValid = password === process.env.APP_PASSWORD;
    // Ou: const isValid = await bcrypt.compare(password, hashedPassword);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Mot de passe incorrect'
      });
    }
    
    // Générer JWT
    const token = jwt.sign(
      { authenticated: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    logger.info('Login réussi', { ip: req.ip });
    
    res.json({
      success: true,
      token,
      message: 'Connexion réussie'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/verify
router.get('/verify', authenticateToken, async (req, res) => {
  // Si on arrive ici, le token est valide (grâce au middleware)
  res.json({
    valid: true,
    user: req.user
  });
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  
  // Ajouter token à la blacklist
  tokenBlacklist.add(token);
  
  logger.info('Logout', { ip: req.ip });
  
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

export default router;
```

#### Backend (utils/tokenBlacklist.js)
```javascript
// Set simple en mémoire pour tokens révoqués
export const tokenBlacklist = new Set();

// Note: En production, utiliser Redis ou une table database
// pour persister la blacklist entre redémarrages
```

### Sécurité Additionnelle

#### Password Hashing (Bcrypt)
```javascript
// Génération hash (une fois)
import bcrypt from 'bcrypt';
const saltRounds = 10;
const hash = await bcrypt.hash('mon_mot_de_passe', saltRounds);
// Stocker hash dans .env: APP_PASSWORD_HASH=...

// Vérification (à chaque login)
const isValid = await bcrypt.compare(password, process.env.APP_PASSWORD_HASH);
```

#### JWT Secret Generation
```bash
# Générer secret fort (32+ caractères)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# → Stocker dans .env: JWT_SECRET=...
```

---

## 🎨 Toutes les Fonctionnalités

### Tableau Complet des Fonctionnalités

| # | Nom | Page | Backend Collections | Endpoints Utilisés | Description |
|---|-----|------|---------------------|-------------------|-------------|
| 1 | **Login** | Login.jsx | - | `POST /auth/login` | Authentification par mot de passe unique |
| 2 | **Menu Principal** | Home.jsx | - | - | Hub central avec 10 boutons de navigation |
| 3 | **Compteur Relation** | Home.jsx | - | - | Temps écoulé depuis début relation |
| 4 | **St-Valentin** | Valentine-request.jsx, Valentine-success.jsx | `valentine` | `POST /valentine`, `GET /valentine` | Créer/voir demandes de St-Valentin |
| 5 | **Open When Messages** | OpenWhen.jsx | `messages` | `GET /messages` | Messages à ouvrir selon humeur (7 catégories) |
| 6 | **Idées de Dates** | DateIdeas.jsx | `planning` | `GET /planning?upcoming=true`, `POST /planning`, `PATCH /planning/:id` | Suggestions + planification événements |
| 7 | **Notre Histoire** | OurStory.jsx | - | - | Timeline événements clés du couple |
| 8 | **100 Raisons** | Reasons.jsx | - | - | Liste des 100 raisons de t'aimer |
| 9 | **Bons Cadeaux** | Coupons.jsx | `coupons` | `GET /coupons`, `PATCH /coupons/:id/redeem` | Cartes flip 3D avec coupons utilisables |
| 10 | **Roue Surprise** | Wheel.jsx | - | - | Roue des activités aléatoires |
| 11 | **Quiz Couple** | Quiz.jsx | `quiz_questions`, `quiz_answers` | `GET /quiz/questions`, `POST /quiz/answers`, `GET /quiz/statistics` | Questions/réponses sur le couple |
| 12 | **Jeu à Gratter** | ScratchGame.jsx | - | - | Carte à gratter interactive (canvas) |
| 13 | **Notre Playlist** | Playlist.jsx | `playlist` | `GET /playlist`, `PATCH /playlist/:id/favorite`, `PATCH /playlist/:id/play` | Chansons du couple avec Spotify |
| 14 | **PWA Install** | InstallPrompt.jsx | - | - | Prompt installation Progressive Web App |
| 15 | **Music Player** | MusicPlayer.jsx | - | - | Lecteur audio global (UI uniquement) |

### Détail des Fonctionnalités Majeures

#### 1. Système d'Authentification
- ✅ Login par mot de passe unique
- ✅ JWT avec expiration 7 jours
- ✅ Token blacklist pour logout
- ✅ Auto-vérification token au chargement
- ✅ Redirect automatique si non authentifié
- ✅ Gestion erreurs (token expiré, invalide)

#### 2. Messages "Open When"
- ✅ 7 catégories d'humeurs
- ✅ Messages verrouillés par date
- ✅ Couleurs personnalisées par message
- ✅ Modal d'affichage contenu
- ✅ Animations entrée/sortie

#### 3. Bons Cadeaux (Coupons)
- ✅ Cartes flip 3D (recto/verso)
- ✅ 6 coupons seedés par défaut
- ✅ Utilisation → grayed out
- ✅ Timestamp redeemedAt
- ✅ Vérification expiration (si date définie)
- ✅ Animation flip CSS 3D

#### 4. Planification Dates
- ✅ CRUD événements complet
- ✅ Filtres par catégorie
- ✅ Vue événements à venir uniquement
- ✅ Marquer événement comme "fait"
- ✅ Dates formatées lisiblement
- ✅ Icônes par catégorie

#### 5. Quiz Couple
- ✅ 8 questions seedées
- ✅ 4 options par question
- ✅ Validation réponse côté backend
- ✅ Feedback immédiat (correct/incorrect)
- ✅ Score en temps réel
- ✅ Statistiques globales
- ✅ Historique des réponses

#### 6. Playlist Musicale
- ✅ 7 chansons seedées
- ✅ Liens Spotify
- ✅ Toggle favorite
- ✅ Compteur de lectures
- ✅ Tri par titre, artiste, playCount
- ✅ Filtrer favorites
- ✅ Raison d'ajout affichée

#### 7. Progressive Web App (PWA)
- ✅ Installable sur mobile/desktop
- ✅ Service Worker (offline capable)
- ✅ Icônes iOS/Android
- ✅ Splash screen
- ✅ Standalone mode
- ✅ Theme color
- ✅ Prompt installation personnalisé

#### 8. Design & Animations
- ✅ FloatingHearts sur toutes les pages
- ✅ PageTransition avec Framer Motion
- ✅ Spring physics cohérent (260/20)
- ✅ Stagger animations (Home buttons)
- ✅ Hover effects (scale, shadow)
- ✅ Scroll animations (Reasons, OurStory)
- ✅ 3D transforms (Coupons)
- ✅ Confettis (Valentine, Quiz)

---

## 🗄️ Schéma Base de Données

### Firebase Firestore - 7 Collections

#### 1. Collection: `valentine`
**Description**: Demandes de St-Valentin  
**Documents**: Variable (CRUD complet)

**Structure**:
```javascript
{
  id: "auto-generated-id",
  date: "2026-02-14T12:00:00.000Z",         // Date de la demande
  description: "Veux-tu être ma Valentine ?", // Message de la demande
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Schéma Joi**:
```javascript
{
  date: Joi.date().iso().required(),
  description: Joi.string().min(1).max(500).required()
}
```

**Endpoints**:
- `POST /api/valentine` - Créer demande
- `GET /api/valentine` - Lister demandes
- `GET /api/valentine/:id` - Détail demande
- `PUT /api/valentine/:id` - Modifier demande
- `DELETE /api/valentine/:id` - Supprimer demande

---

#### 2. Collection: `messages`
**Description**: Messages "Open When"  
**Documents**: 7 (seedés)

**Structure**:
```javascript
{
  id: "auto-generated-id",
  title: "Ouvre quand tu es triste 💙",
  category: "triste",  // triste|manque|fachee|rire|doute|motivation|special
  content: "Mon amour, je suis là pour toi même quand je ne suis pas physiquement présent...",
  lockedUntil: 1740000000000,  // Timestamp millisecondes (null = déverrouillé)
  backgroundColor: "#E3F2FD",
  createdAt: Timestamp
}
```

**Catégories & Couleurs**:
```javascript
const categories = {
  triste: { emoji: "😢", bg: "#E3F2FD" },      // Bleu clair
  manque: { emoji: "💔", bg: "#FCE4EC" },      // Rose clair
  fachee: { emoji: "😠", bg: "#FFEBEE" },      // Rouge clair
  rire: { emoji: "😂", bg: "#FFF9C4" },        // Jaune clair
  doute: { emoji: "🤔", bg: "#E0F2F1" },       // Vert clair
  motivation: { emoji: "💪", bg: "#E8F5E9" },  // Vert
  special: { emoji: "🎁", bg: "#F3E5F5" }      // Violet clair
};
```

**Schéma Joi**:
```javascript
{
  title: Joi.string().min(1).max(100).required(),
  category: Joi.string().valid('triste', 'manque', 'fachee', 'rire', 'doute', 'motivation', 'special').required(),
  content: Joi.string().min(1).max(2000).required(),
  lockedUntil: Joi.number().optional().allow(null),
  backgroundColor: Joi.string().optional()
}
```

**Seed Data (seed-messages.js)**:
```javascript
[
  { title: "Ouvre quand tu es triste 💙", category: "triste", lockedUntil: null },
  { title: "Ouvre quand je te manque 💔", category: "manque", lockedUntil: null },
  { title: "Ouvre quand tu es fâchée 😠", category: "fachee", lockedUntil: null },
  { title: "Ouvre quand tu as besoin de rire 😂", category: "rire", lockedUntil: null },
  { title: "Ouvre quand tu as des doutes 🤔", category: "doute", lockedUntil: null },
  { title: "Ouvre quand tu as besoin de motivation 💪", category: "motivation", lockedUntil: null },
  { title: "Message Secret 🎁", category: "special", lockedUntil: new Date('2027-02-14').getTime() }
]
```

**Endpoints**:
- `POST /api/messages` - Créer message
- `GET /api/messages` - Lister messages (query: `?category=triste`)
- `GET /api/messages/:id` - Détail message
- `PUT /api/messages/:id` - Modifier message
- `DELETE /api/messages/:id` - Supprimer message

---

#### 3. Collection: `coupons`
**Description**: Bons cadeaux utilisables  
**Documents**: 6 (seedés)

**Structure**:
```javascript
{
  id: "auto-generated-id",
  title: "Massage VIP",
  description: "Valable pour 30 min de massage relaxant (dos ou pieds au choix).",
  icon: "💆‍♀️",
  isRedeemed: false,              // true = déjà utilisé
  expirationDate: null,           // ISO date ou null
  createdAt: Timestamp,
  redeemedAt: Timestamp | null    // Quand utilisé
}
```

**Schéma Joi**:
```javascript
{
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  icon: Joi.string().optional(),
  expirationDate: Joi.string().isoDate().optional().allow(null, '')
}
```

**Seed Data (seed-coupons.js)**:
```javascript
[
  { title: "Massage VIP", icon: "💆‍♀️", description: "30 min de massage relaxant..." },
  { title: "Soirée Sans Vaisselle", icon: "🍽️", description: "Je m'occupe de tout..." },
  { title: "Resto Surprise", icon: "🍷", description: "Dîner dans ton resto préféré..." },
  { title: "Joker 'J'ai Raison'", icon: "⚖️", description: "Gagne instantanément tout débat..." },
  { title: "Petit Déj au Lit", icon: "🥐", description: "Croissants, café, amour..." },
  { title: "Grands Câlins Illimités", icon: "🫂", description: "Tendresse infinie..." }
]
```

**Endpoints**:
- `POST /api/coupons` - Créer coupon
- `GET /api/coupons` - Lister coupons (query: `?status=available`)
- `GET /api/coupons/:id` - Détail coupon
- `PUT /api/coupons/:id` - Modifier coupon
- `PATCH /api/coupons/:id/redeem` - Utiliser coupon
- `PATCH /api/coupons/:id/reset` - Réinitialiser coupon
- `DELETE /api/coupons/:id` - Supprimer coupon

---

#### 4. Collection: `planning`
**Description**: Événements/dates planifiés  
**Documents**: 5 (seedés)

**Structure**:
```javascript
{
  id: "auto-generated-id",
  title: "Ciné Date Night 🎬",
  description: "On va voir le dernier film que tu veux !",
  date: "2026-03-15T19:00:00.000Z",
  location: "Cinéma Gaumont",
  category: "cinema",  // cinema|restaurant|voyage|sport|culture|autre
  status: "planned",   // planned|done|cancelled
  createdAt: Timestamp
}
```

**Catégories**:
```javascript
const categories = [
  "cinema",      // 🎬
  "restaurant",  // 🍽️
  "voyage",      // ✈️
  "sport",       // ⚽
  "culture",     // 🎭
  "autre"        // 🎉
];
```

**Schéma Joi**:
```javascript
{
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  date: Joi.string().isoDate().required(),
  location: Joi.string().allow('').optional(),
  category: Joi.string().valid('cinema', 'restaurant', 'voyage', 'sport', 'culture', 'autre').default('autre'),
  status: Joi.string().valid('planned', 'done', 'cancelled').default('planned')
}
```

**Seed Data (seed-planning.js)**:
```javascript
[
  { title: "Ciné Date Night 🎬", category: "cinema", date: "2026-03-15T19:00", status: "planned" },
  { title: "Resto Italien 🍝", category: "restaurant", date: "2026-03-22T20:00", status: "planned" },
  { title: "Weekend à Paris ✈️", category: "voyage", date: "2026-04-10T10:00", status: "planned" },
  { title: "Randonnée Forêt 🌲", category: "sport", date: "2026-04-05T09:00", status: "planned" },
  { title: "Concert Jazz 🎷", category: "culture", date: "2026-05-01T21:00", status: "planned" }
]
```

**Endpoints**:
- `POST /api/planning` - Créer événement
- `GET /api/planning` - Lister événements (queries: `?upcoming=true`, `?category=cinema`, `?status=done`)
- `GET /api/planning/:id` - Détail événement
- `PUT /api/planning/:id` - Modifier événement
- `DELETE /api/planning/:id` - Supprimer événement

---

#### 5. Collection: `quiz_questions`
**Description**: Questions du quiz couple  
**Documents**: 8 (seedés)

**Structure**:
```javascript
{
  id: "auto-generated-id",
  question: "Quelle est ma couleur préférée ?",
  options: ["Rose", "Bleu", "Vert", "Rouge"],
  correctAnswer: "Rose",
  difficulty: "easy",  // easy|medium|hard
  createdAt: Timestamp
}
```

**Schéma Joi**:
```javascript
{
  question: Joi.string().required(),
  options: Joi.array().items(Joi.string()).length(4).required(),
  correctAnswer: Joi.string().required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium')
}
```

**Seed Data (seed-quiz.js)**:
```javascript
[
  { question: "Quelle est ma couleur préférée ?", options: ["Rose", "Bleu", "Vert", "Rouge"], correctAnswer: "Rose", difficulty: "easy" },
  { question: "Quel est mon plat préféré ?", options: ["Pâtes", "Pizza", "Sushi", "Burger"], correctAnswer: "Pâtes", difficulty: "easy" },
  { question: "Quel est mon film préféré ?", options: ["Titanic", "La La Land", "Inception", "Avatar"], correctAnswer: "La La Land", difficulty: "medium" },
  // ... 5 autres questions
]
```

**Endpoints**:
- `POST /api/quiz/questions` - Créer question
- `GET /api/quiz/questions` - Lister questions (query: `?difficulty=easy`)
- `GET /api/quiz/questions/random` - Question aléatoire
- `GET /api/quiz/questions/:id` - Détail question
- `PUT /api/quiz/questions/:id` - Modifier question
- `DELETE /api/quiz/questions/:id` - Supprimer question

---

#### 6. Collection: `quiz_answers`
**Description**: Réponses soumises au quiz  
**Documents**: Variable (créés dynamiquement)

**Structure**:
```javascript
{
  id: "auto-generated-id",
  questionId: "q123",
  answer: "Rose",
  isCorrect: true,
  answeredAt: Timestamp
}
```

**Schéma Joi**:
```javascript
{
  questionId: Joi.string().required(),
  answer: Joi.string().required(),
  isCorrect: Joi.boolean().required()
}
```

**Endpoints**:
- `POST /api/quiz/answers` - Soumettre réponse
- `GET /api/quiz/statistics` - Stats globales (total, score, etc.)
- `GET /api/quiz/history` - Historique réponses (query: `?limit=10`)

---

#### 7. Collection: `playlist`
**Description**: Chansons du couple  
**Documents**: 7 (seedés)

**Structure**:
```javascript
{
  id: "auto-generated-id",
  title: "Perfect",
  artist: "Ed Sheeran",
  album: "÷ (Divide)",
  duration: "4:23",
  reason: "Notre chanson, celle qui nous fait danser 💕",
  spotifyUrl: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
  isFavorite: true,
  playCount: 42,
  lastPlayedAt: Timestamp | null,
  createdAt: Timestamp
}
```

**Schéma Joi**:
```javascript
{
  title: Joi.string().required(),
  artist: Joi.string().required(),
  album: Joi.string().allow('').optional(),
  duration: Joi.string().pattern(/^\d+:\d{2}$/).optional(),
  reason: Joi.string().allow('').optional(),
  spotifyUrl: Joi.string().uri().optional().allow(''),
  isFavorite: Joi.boolean().default(false)
}
```

**Seed Data (seed-playlist.js)**:
```javascript
[
  { title: "Perfect", artist: "Ed Sheeran", album: "÷", duration: "4:23", reason: "Notre chanson..." },
  { title: "Thinking Out Loud", artist: "Ed Sheeran", album: "x", duration: "4:41", reason: "Première danse..." },
  { title: "All of Me", artist: "John Legend", album: "Love in the Future", duration: "4:29", reason: "Tu es tout pour moi..." },
  // ... 4 autres chansons
]
```

**Endpoints**:
- `POST /api/playlist` - Ajouter chanson
- `GET /api/playlist` - Lister chansons (queries: `?sortBy=playCount`, `?favorite=true`)
- `GET /api/playlist/:id` - Détail chanson
- `PUT /api/playlist/:id` - Modifier chanson
- `PATCH /api/playlist/:id/favorite` - Toggle favorite
- `PATCH /api/playlist/:id/play` - Incrémenter playCount
- `DELETE /api/playlist/:id` - Supprimer chanson

---

## 🔗 Communication Frontend-Backend

### Matrice des Communications

| Page Frontend | Backend Route(s) | Collections | Opérations |
|---------------|------------------|-------------|-----------|
| **Login** | `POST /api/auth/login` | - | Authentification |
| **Home** | - | - | Navigation seule |
| **Valentine** | `POST /api/valentine`<br>`GET /api/valentine` | `valentine` | CREATE, READ |
| **Success** | - | - | Affichage statique |
| **DateIdeas** | `GET /api/planning?upcoming=true`<br>`POST /api/planning`<br>`PATCH /api/planning/:id` | `planning` | READ, CREATE, UPDATE (status) |
| **OpenWhen** | `GET /api/messages` | `messages` | READ |
| **OurStory** | - | - | Affichage statique |
| **Reasons** | - | - | Affichage statique |
| **Coupons** | `GET /api/coupons`<br>`PATCH /api/coupons/:id/redeem` | `coupons` | READ, UPDATE (redeem) |
| **Wheel** | - | - | Client-only |
| **Quiz** | `GET /api/quiz/questions`<br>`POST /api/quiz/answers`<br>`GET /api/quiz/statistics` | `quiz_questions`<br>`quiz_answers` | READ, CREATE, READ |
| **Scratch** | - | - | Client-only (canvas) |
| **Playlist** | `GET /api/playlist?sortBy=X`<br>`PATCH /api/playlist/:id/favorite`<br>`PATCH /api/playlist/:id/play` | `playlist` | READ, UPDATE (favorite), UPDATE (playCount) |

### Patterns de Communication

#### 1. READ Pattern (GET)
```javascript
// Frontend
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('/api/endpoint');
      const data = await response.json();
      setData(data.items || []);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

// Backend
router.get('/endpoint', authenticateToken, async (req, res, next) => {
  try {
    const snapshot = await db.collection('items').get();
    const items = [];
    snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    res.json({ items });
  } catch (error) {
    next(error);
  }
});
```

#### 2. CREATE Pattern (POST)
```javascript
// Frontend
const handleCreate = async (formData) => {
  try {
    const response = await authenticatedFetch('/api/endpoint', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      const data = await response.json();
      setItems([...items, data.item]);
      setSuccess('Créé avec succès !');
    }
  } catch (error) {
    setError(error.message);
  }
};

// Backend
router.post('/endpoint', authenticateToken, validate(schema), async (req, res, next) => {
  try {
    const docRef = await db.collection('items').add({
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).json({
      success: true,
      id: docRef.id
    });
  } catch (error) {
    next(error);
  }
});
```

#### 3. UPDATE Pattern (PATCH)
```javascript
// Frontend
const handleUpdate = async (id, updates) => {
  try {
    const response = await authenticatedFetch(`/api/endpoint/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    
    if (response.ok) {
      const data = await response.json();
      setItems(items.map(item => 
        item.id === id ? { ...item, ...data.item } : item
      ));
    }
  } catch (error) {
    setError(error.message);
  }
};

// Backend
router.patch('/endpoint/:id', authenticateToken, async (req, res, next) => {
  try {
    const docRef = db.collection('items').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Non trouvé' });
    }
    
    await docRef.update({
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});
```

---

## 🔒 Sécurité Globale

### Layers de Sécurité

#### 1. Infrastructure
```
┌─────────────────────────────────────┐
│  HTTPS/TLS (Production)             │
│  - Certificat SSL                   │
│  - Encryption transit                │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  CORS Policy                        │
│  - Origines whitelistées            │
│  - *.vercel.app autorisé            │
│  - Credentials: true                │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Rate Limiting                      │
│  - 100 req / 15 min par IP          │
│  - Prévient brute force             │
└─────────────────────────────────────┘
```

#### 2. Application
```
┌─────────────────────────────────────┐
│  Helmet Security Headers            │
│  - X-Frame-Options: DENY            │
│  - X-Content-Type-Options: nosniff  │
│  - HSTS                             │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  JWT Authentication                 │
│  - Token signé (HS256)              │
│  - Expiration 7 jours               │
│  - Vérification signature           │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Token Blacklist                    │
│  - Tokens révoqués (logout)         │
│  - Vérification à chaque requête    │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Input Validation (Joi)             │
│  - Schemas stricts                  │
│  - Sanitization automatique         │
│  - Type checking                    │
└─────────────────────────────────────┘
```

#### 3. Data Layer
```
┌─────────────────────────────────────┐
│  Firebase Rules (Firestore)         │
│  - Auth required                    │
│  - Server-side validation           │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Bcrypt Password Hashing            │
│  - Salt rounds: 10                  │
│  - APP_PASSWORD hashé               │
└─────────────────────────────────────┘
```

### Best Practices Implémentées

#### Environment Variables
```bash
# Backend .env
JWT_SECRET=strong_random_32+_characters
APP_PASSWORD=strong_password_here
FIREBASE_PRIVATE_KEY="..." (jamais commit dans Git)

# Frontend .env
VITE_API_URL=https://backend-url.com (pas de secrets exposés)
```

#### .gitignore
```
.env
.env.local
.env.production
*.json (pour Firebase service account)
node_modules/
dist/
logs/
```

#### Security Headers (Helmet)
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

## 🚀 Déploiement Complet

### Architecture de Déploiement

```
┌─────────────────────────────────────────────────┐
│              PRODUCTION                          │
├─────────────────────────────────────────────────┤
│                                                  │
│  Frontend (Vercel)                              │
│  ├─ URL: https://princess-project.vercel.app   │
│  ├─ Auto-deploy from Git                       │
│  ├─ CDN global                                  │
│  └─ VITE_API_URL → Backend URL                 │
│                                                  │
│  Backend (Railway/Render)                       │
│  ├─ URL: https://princess-api.railway.app      │
│  ├─ Node.js 18+                                 │
│  ├─ Auto-deploy from Git                       │
│  ├─ Environment variables set                   │
│  └─ Connected to Firestore                     │
│                                                  │
│  Database (Firebase)                            │
│  ├─ Firestore NoSQL                            │
│  ├─ Global distribution                         │
│  ├─ Auto-scaling                                │
│  └─ Security rules                              │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Déploiement Frontend (Vercel)

#### 1. Configuration
**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### 2. Environment Variables (Vercel Dashboard)
```bash
VITE_API_URL=https://princess-api.railway.app
```

#### 3. Build Settings
```bash
Root Directory: frontend/
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 4. Déploiement
```bash
# Via Git (automatique)
git push origin main

# Via Vercel CLI
cd frontend
vercel --prod
```

---

### Déploiement Backend (Railway)

#### 1. Configuration
**railway.json** (optionnel):
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 2. Environment Variables (Railway Dashboard)
```bash
# Port
PORT=2106

# Auth
APP_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_32_chars

# Firebase
FIREBASE_PROJECT_ID=princess-project-210622
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...iam.gserviceaccount.com

# CORS
FRONTEND_URL=https://princess-project.vercel.app

# Env
NODE_ENV=production
```

#### 3. Start Command
```bash
npm start
# ou
node src/index.js
```

#### 4. Déploiement
```bash
# Via Git (automatique)
git push origin main

# Via Railway CLI
railway up
```

---

### Déploiement Firebase

#### 1. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Par défaut: deny all
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Accès backend uniquement (via Firebase Admin SDK)
    // Pas de règles publiques car app utilise backend comme proxy
  }
}
```

#### 2. Firebase Config
- ✅ Firestore activé
- ✅ Service Account créé
- ✅ Clé privée téléchargée
- ✅ Variables d'environnement configurées

---

### Checklists de Déploiement

#### Frontend Checklist
- [ ] Build réussit (`npm run build`)
- [ ] VITE_API_URL pointe vers backend prod
- [ ] PWA manifest configuré
- [ ] Icons générés (192x192, 512x512)
- [ ] .env.production créé
- [ ] Git ignore .env*
- [ ] Vercel project créé
- [ ] Environment variables set
- [ ] Domain configuré (optionnel)
- [ ] HTTPS activé

#### Backend Checklist
- [ ] Tests API passent
- [ ] Environment variables complètes
- [ ] JWT_SECRET généré (32+ chars)
- [ ] Firebase service account configuré
- [ ] CORS origins mis à jour
- [ ] FRONTEND_URL correct
- [ ] NODE_ENV=production
- [ ] Railway/Render project créé
- [ ] Auto-deploy configuré
- [ ] Logs accessibles
- [ ] Health check répond (`/api/health`)

#### Database Checklist
- [ ] Firestore activé
- [ ] Collections créées (via seed scripts)
- [ ] Security rules déployées
- [ ] Indexes créés (si queries complexes)
- [ ] Backup configuré (optionnel)

---

## 👨‍💻 Guide de Développement

### Installation Initiale

#### 1. Cloner le Projet
```bash
git clone <repo-url>
cd Princess\ Project
```

#### 2. Configuration Backend
```bash
cd backend

# Installer dépendances
npm install

# Copier .env.example vers .env
cp .env.example .env

# Éditer .env avec vraies valeurs
nano .env

# Ajouter Firebase service account JSON
# (télécharger depuis Firebase Console)

# Tester connexion
node src/index.js
# → Devrait afficher "Serveur démarré sur port 2106"
```

#### 3. Configuration Frontend
```bash
cd ../frontend

# Installer dépendances
npm install

# Copier .env.example vers .env
cp .env.example .env

# Éditer .env (VITE_API_URL)
nano .env

# Lancer dev server
npm run dev
# → Devrait ouvrir http://localhost:1308
```

#### 4. Seeder la Base de Données
```bash
cd ../backend

# Exécuter tous les seed scripts
node seed-coupons.js
node seed-messages.js
node seed-planning.js
node seed-quiz.js
node seed-playlist.js

# Vérifier dans Firebase Console
# → Collections devraient contenir les données
```

---

### Workflow de Développement

#### Développement Simultané Frontend + Backend
```bash
# Terminal 1 - Backend
cd backend
npm run dev  # Nodemon auto-reload

# Terminal 2 - Frontend
cd frontend
npm run dev  # Vite HMR
```

#### Pattern de Développement
```
1. Créer nouvelle feature
   ├─ Définir schéma Joi (backend/src/middleware/validate.js)
   ├─ Créer route (backend/src/routes/*.js)
   ├─ Tester avec curl/Postman
   ├─ Créer page React (frontend/src/pages/*.jsx)
   ├─ Intégrer authenticatedFetch
   └─ Tester flow complet

2. Git workflow
   ├─ git checkout -b feature/nom-feature
   ├─ Développer feature
   ├─ npm run lint (frontend + backend)
   ├─ git commit -m "feat: description"
   └─ git push origin feature/nom-feature
```

---

### Commandes Utiles

#### Backend
```bash
# Dev avec auto-reload
npm run dev

# Production
npm start

# Linting
npm run lint

# Tests API
npm run test:api

# Seed une collection
node seed-coupons.js
```

#### Frontend
```bash
# Dev server (HMR)
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

#### Debugging
```bash
# Backend logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log

# Firebase logs
firebase functions:log

# Network debugging (Chrome DevTools)
# → Network tab → Filter: Fetch/XHR
```

---

### Testing

#### Manual Testing
```bash
# 1. Test Health Check
curl http://localhost:2106/api/health

# 2. Test Login
curl -X POST http://localhost:2106/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your_password"}'

# 3. Test Protected Route
TOKEN="your_jwt_token"
curl http://localhost:2106/api/coupons \
  -H "Authorization: Bearer $TOKEN"
```

#### Automated Tests (test-api.js)
```bash
cd backend
node test-api.js
# → Teste tous les endpoints automatiquement
```

---

### Troubleshooting Commun

#### Erreur: "Token manquant"
**Solution**: Vérifier que `princess_token` existe dans localStorage  
```javascript
localStorage.getItem('princess_token')
```

#### Erreur: "CORS policy"
**Solution**: Vérifier CORS config backend + FRONTEND_URL  
```javascript
// backend/src/index.js
const allowedOrigins = ['http://localhost:1308', ...];
```

#### Erreur: "Firebase not initialized"
**Solution**: Vérifier variables d'environnement Firebase  
```bash
echo $FIREBASE_PROJECT_ID
```

#### Frontend ne trouve pas backend
**Solution**: Vérifier VITE_API_URL  
```bash
# frontend/.env
VITE_API_URL=http://localhost:2106
```

---

## 📊 Métriques & Statistiques

### Taille du Projet

#### Lignes de Code
```
Backend:  ~5,000 lignes
Frontend: ~4,500 lignes
Total:    ~9,500 lignes
```

#### Fichiers
```
Backend:  25 fichiers JS
Frontend: 20 fichiers JSX + 3 CSS
Total:    48 fichiers source
```

#### Collections & Data
```
Collections Firestore: 7
Seed data items:       33 (6+7+5+8+7)
Routes API:            42
Pages React:           13
Composants React:      6
```

---

## 🎯 Points Clés pour IA - Résumé Final

### Architecture
- **Pattern**: Full-stack MERN-like (React + Express + Firestore)
- **Auth**: JWT (7 jours) avec blacklist
- **API**: RESTful (42 endpoints, 8 modules)
- **Database**: 7 collections Firestore (33 items seedés)

### Technologies
- **Frontend**: React 19.2.0, Vite 7.3.1, Tailwind 4.1.18, Framer Motion 12.34.0
- **Backend**: Express 5.2.1, Firebase Admin 13.6.1, JWT 9.0.3, Joi 18.0.2
- **Sécurité**: Helmet, CORS, Rate Limiting, Bcrypt

### Fonctionnalités (13 pages)
1. Login - Authentification
2. Home - Menu navigation
3. Valentine - Demandes St-Valentin
4. Success - Confirmation
5. DateIdeas - Planning événements
6. OpenWhen - Messages conditionnels
7. OurStory - Timeline couple
8. Reasons - 100 raisons
9. Coupons - Bons cadeaux flip 3D
10. Wheel - Roue activités
11. Quiz - Questions/réponses couple
12. Scratch - Carte à gratter
13. Playlist - Chansons Spotify

### Design
- **Palette**: Pink/Rose (#ff69b4, #fce7f3)
- **Font**: Playfair Display (serif)
- **Animations**: Framer Motion (spring 260/20)
- **Composants**: FloatingHearts (toutes pages), PageTransition (toutes pages)
- **PWA**: Installable, offline-capable

### Patterns
- **authenticatedFetch** (client API unifié)
- **authenticateToken** (protection routes)
- **validate(schema)** (Joi validation)
- **Seed scripts** (Firebase direct, pattern uniforme)
- **Error handling** (centralisé middleware)
- **Logging** (Winston, tous événements)

### Déploiement
- **Frontend**: Vercel (CDN global)
- **Backend**: Railway/Render (Node.js)
- **Database**: Firebase Firestore (serverless)
- **HTTPS**: Activé (production)
- **CI/CD**: Auto-deploy from Git

---

**Date de dernière mise à jour**: 23 Février 2026  
**Version**: 2.0.0  
**Auteur**: The Prince  
**Pour**: Ma Princess 💖

---

## 📚 Ressources & Documentation

### Liens Utiles
- **Frontend Dev**: http://localhost:1308
- **Backend Dev**: http://localhost:2106
- **API Docs**: http://localhost:2106/api-docs
- **Firebase Console**: https://console.firebase.google.com/project/princess-project-210622

### Documentation Externe
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Express Docs](https://expressjs.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind Docs](https://tailwindcss.com/)
- [JWT Docs](https://jwt.io/)

---

**FIN DU DOCUMENT**
