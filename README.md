# 👑 Princess Project

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-pink.svg?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)
![License](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)

**Une application web romantique full-stack pour célébrer l'amour** 💕

[✨ Demo](#-demo) • [🚀 Installation](#-installation) • [📚 Documentation](#-documentation) • [🎯 Fonctionnalités](#-fonctionnalités)

</div>

---

## 📖 Description

**Princess Project** est une application web full-stack moderne et romantique conçue pour célébrer une relation amoureuse de manière unique et interactive. Elle combine **13 pages interactives**, une **API RESTful complète** avec **42 endpoints**, et une **base de données Firestore** avec **7 collections**.

L'application offre des fonctionnalités variées : demandes de Saint-Valentin animées, messages "Open When" personnalisés, bons cadeaux utilisables, planification d'événements, quiz couple, playlist musicale collaborative, roue de décision, jeu à gratter, et bien plus encore - le tout dans une interface élégante avec des animations fluides propulsées par **Framer Motion**.

---

## ✨ Demo

### 📸 Screenshots

> 🚧 *Screenshots seront ajoutés après le déploiement*

<div align="center">

| Page d'accueil | Messages Open When | Bons Cadeaux |
|:--------------:|:------------------:|:------------:|
| ![Home](docs/screenshots/home.png) | ![Messages](docs/screenshots/messages.png) | ![Coupons](docs/screenshots/coupons.png) |

| Quiz Couple | Playlist | Roue Décision |
|:-----------:|:--------:|:-------------:|
| ![Quiz](docs/screenshots/quiz.png) | ![Playlist](docs/screenshots/playlist.png) | ![Wheel](docs/screenshots/wheel.png) |

</div>

---

## 🎯 Fonctionnalités

### 🌟 Fonctionnalités Principales

<table>
<tr>
<td width="50%">

#### 💝 Pages Interactives (13)
- **🏠 Accueil** - Hub central avec 10 boutons de navigation
- **🌹 Saint-Valentin** - Demande animée avec confettis
- **💌 Open When** - 7 messages selon humeur (triste, manque, etc.)
- **📅 Idées de Dates** - Planning d'événements avec filtres
- **📖 Notre Histoire** - Timeline de la relation
- **💯 100 Raisons** - Liste des raisons de t'aimer
- **🎫 Bons Cadeaux** - 6 coupons flip 3D utilisables

</td>
<td width="50%">

#### 🎮 Expériences Ludiques
- **🎡 Roue Surprise** - Roue animée pour activités aléatoires
- **🧠 Quiz Couple** - Questions/réponses avec stats
- **🎰 Jeu à Gratter** - Carte interactive en canvas
- **🎵 Notre Playlist** - Chansons avec Spotify + favoris
- **📱 PWA** - Installable sur mobile/desktop
- **🎨 Animations** - Framer Motion partout

</td>
</tr>
</table>

### 🔐 Système Complet

- **Authentification JWT** (7 jours, blacklist logout)
- **Backend RESTful** (42 endpoints, 8 modules)
- **Base de données Firestore** (7 collections, 33 items seedés)
- **Validation Joi** (schémas stricts pour toutes les entrées)
- **Sécurité** (Helmet, CORS, Rate Limiting, Bcrypt)
- **Logging** (Winston avec niveaux info/error)
- **Documentation API** (Swagger UI interactive)

### 🎨 Design & UX

- **Design System cohérent** - Palette pink/rose (#ff69b4)
- **Typography élégante** - Playfair Display
- **Animations fluides** - Spring physics (260/20)
- **Responsive design** - Mobile, tablet, desktop
- **FloatingHearts** - Cœurs animés sur toutes les pages
- **PageTransition** - Transitions douces entre pages
- **Dark patterns** - Pas de dark patterns, tout est clair

---

## 🛠️ Stack Technologique

<table>
<tr>
<td width="50%" valign="top">

### Frontend
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?logo=tailwind-css)

- **React 19.2.0** - UI Library
- **Vite 7.3.1** - Build tool ultra-rapide
- **React Router 7.13.0** - Routing SPA
- **Framer Motion 12.34.0** - Animations fluides
- **Tailwind CSS 4.1.18** - Utility-first CSS
- **Axios 1.13.5** - HTTP client
- **Canvas Confetti 1.9.4** - Confettis animés
- **Vite PWA 1.2.0** - Progressive Web App

</td>
<td width="50%" valign="top">

### Backend
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express)
![Firebase](https://img.shields.io/badge/Firebase-13.6.1-FFCA28?logo=firebase)

- **Node.js 18+** - Runtime JavaScript
- **Express 5.2.1** - Web framework
- **Firebase Admin 13.6.1** - Database SDK
- **JWT 9.0.3** - Authentification tokens
- **Joi 18.0.2** - Validation de données
- **Bcrypt 6.0.0** - Password hashing
- **Helmet 8.1.0** - Security headers
- **CORS 2.8.6** - Cross-origin
- **Winston 3.19.0** - Logging structuré

</td>
</tr>
</table>

### Database
- **Firebase Firestore** - NoSQL database serverless
- **7 Collections** (valentine, messages, coupons, planning, quiz_questions, quiz_answers, playlist)
- **Real-time updates** (optionnel)
- **Auto-scaling** (Google Cloud)

---

## 📁 Structure du Projet

```
Princess Project/
│
├── 📄 README.md                    # Ce fichier
├── 📄 README_DEPLOY.md             # Guide de déploiement complet
├── 📄 BACKEND.md                   # Documentation backend (400+ lignes)
├── 📄 FRONTEND.md                  # Documentation frontend (400+ lignes)
├── 📄 PROJECT.md                   # Vue d'ensemble full-stack (800+ lignes)
│
├── 🖥️ backend/
│   ├── src/
│   │   ├── index.js                # Point d'entrée serveur (Express)
│   │   ├── config/
│   │   │   ├── firebase.js         # Firebase Admin SDK init
│   │   │   └── swagger.js          # OpenAPI 3.0 config
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification (authenticateToken)
│   │   │   ├── validate.js         # Joi schemas + validation
│   │   │   └── errorHandler.js     # Centralized error handling
│   │   ├── routes/
│   │   │   ├── index.js            # Main router (8 modules)
│   │   │   ├── auth.js             # Auth routes (3)
│   │   │   ├── valentine.js        # Valentine routes (5)
│   │   │   ├── messages.js         # Messages routes (5)
│   │   │   ├── coupons.js          # Coupons routes (7)
│   │   │   ├── planning.js         # Planning routes (5)
│   │   │   ├── quiz.js             # Quiz routes (9)
│   │   │   └── playlist.js         # Playlist routes (7)
│   │   └── utils/
│   │       ├── logger.js           # Winston logger config
│   │       └── tokenBlacklist.js   # JWT blacklist (logout)
│   ├── seed-coupons.js             # Seed 6 coupons
│   ├── seed-messages.js            # Seed 7 messages
│   ├── seed-planning.js            # Seed 5 events
│   ├── seed-quiz.js                # Seed 8 questions
│   ├── seed-playlist.js            # Seed 7 songs
│   ├── test-api.js                 # API tests complets
│   ├── package.json                # Backend dependencies
│   ├── .env.example                # Template variables d'env
│   └── princess-project-xxx.json   # Firebase service account (gitignored)
│
└── 🌐 frontend/
    ├── public/
    │   └── favicon_assets/         # PWA icons (192x192, 512x512)
    ├── src/
    │   ├── main.jsx                # Entry point (React.createRoot)
    │   ├── App.jsx                 # Router + ProtectedRoute
    │   ├── App.css                 # Global styles
    │   ├── index.css               # Tailwind imports
    │   ├── components/
    │   │   ├── FloatingHearts.jsx      # Animated hearts (all pages)
    │   │   ├── InstallPrompt.jsx       # PWA install prompt
    │   │   ├── MusicPlayer.jsx         # Global music player (UI)
    │   │   ├── PageTransition.jsx      # Framer Motion transitions
    │   │   ├── RelationshipCounter.jsx # Time together counter
    │   │   └── ScrollToTop.jsx         # Auto-scroll on route change
    │   ├── pages/
    │   │   ├── Login.jsx               # Authentication page
    │   │   ├── Home.jsx                # Landing page (10 buttons)
    │   │   ├── Valentine-request.jsx   # St-Valentin request
    │   │   ├── Valentine-success.jsx   # Success + confetti
    │   │   ├── DateIdeas.jsx           # Event planning + ideas
    │   │   ├── OpenWhen.jsx            # Open When messages
    │   │   ├── OurStory.jsx            # Relationship timeline
    │   │   ├── Reasons.jsx             # 100 reasons list
    │   │   ├── Coupons.jsx             # Gift coupons (3D flip)
    │   │   ├── Wheel.jsx               # Decision wheel
    │   │   ├── Quiz.jsx                # Couple quiz
    │   │   ├── ScratchGame.jsx         # Scratch card (canvas)
    │   │   └── Playlist.jsx            # Music playlist + Spotify
    │   └── Utils/
    │       └── api.js                  # API client (authenticatedFetch)
    ├── index.html                  # HTML template
    ├── vite.config.js              # Vite + PWA config
    ├── tailwind.config.js          # Tailwind theme
    ├── eslint.config.js            # ESLint rules
    ├── package.json                # Frontend dependencies
    └── .env.example                # Template variables d'env
```

**Métriques** :
- 📊 **~9,500 lignes de code** (backend: 5,000 | frontend: 4,500)
- 📄 **48 fichiers source** (25 JS backend + 23 JSX/CSS frontend)
- 🗄️ **7 collections** Firestore (33 items seedés)
- 🛣️ **42 routes API** (8 modules)
- 📄 **13 pages** React
- 🧩 **6 composants** réutilisables

---

## 🚀 Installation

### Prérequis

```bash
node --version  # v18.0.0 ou supérieur
npm --version   # v8.0.0 ou supérieur
```

- **Git** installé
- Compte **Firebase** avec projet créé
- Service Account Firebase téléchargé

### Quick Start (5 minutes)

#### 1️⃣ Cloner le Repository

```bash
git clone https://github.com/yourusername/princess-project.git
cd "Princess Project"
```

#### 2️⃣ Setup Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le template .env
cp .env.example .env

# Éditer .env avec vos vraies valeurs
# - APP_PASSWORD: Votre mot de passe de login
# - JWT_SECRET: 32+ caractères aléatoires
# - FIREBASE_PROJECT_ID: De votre Firebase JSON
# - FIREBASE_CLIENT_EMAIL: De votre Firebase JSON
# - FIREBASE_PRIVATE_KEY: De votre Firebase JSON (avec \n)

# Placer votre Firebase service account JSON dans backend/
# Fichier: princess-project-xxx-firebase-adminsdk-xxx.json

# Tester la connexion
npm run dev
# ✅ Devrait afficher: "Serveur démarré sur port 2106"
```

#### 3️⃣ Seeder la Database

```bash
# Dans backend/, exécuter les seed scripts
node seed-coupons.js    # 6 coupons
node seed-messages.js   # 7 messages
node seed-planning.js   # 5 événements
node seed-quiz.js       # 8 questions
node seed-playlist.js   # 7 chansons

# ✅ Total: 33 items créés dans Firestore
```

#### 4️⃣ Setup Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install

# Copier le template .env
cp .env.example .env

# Éditer .env
# VITE_API_URL=http://localhost:2106

# Lancer le dev server
npm run dev
# ✅ Devrait ouvrir: http://localhost:1308
```

#### 5️⃣ Tester l'Application

Ouvrir **deux terminaux** :

**Terminal 1 (Backend)** :
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend)** :
```bash
cd frontend
npm run dev
```

Naviguer vers **http://localhost:1308** et profiter ! 💖

---

## 🌐 API Backend

### Vue d'Ensemble

Le backend expose **42 endpoints RESTful** organisés en **8 modules** :

| Module | Routes | Description |
|--------|--------|-------------|
| **Health** | 1 | Status serveur |
| **Auth** | 3 | Login, verify, logout |
| **Valentine** | 5 | Demandes St-Valentin (CRUD) |
| **Messages** | 5 | Open When messages (CRUD) |
| **Coupons** | 7 | Bons cadeaux (CRUD + redeem/reset) |
| **Planning** | 5 | Événements (CRUD avec filtres) |
| **Quiz** | 9 | Questions + réponses + stats |
| **Playlist** | 7 | Chansons (CRUD + favorite/play) |

### Documentation Interactive

- **Swagger UI** : [http://localhost:2106/api-docs](http://localhost:2106/api-docs)
- **Documentation complète** : Voir [BACKEND.md](BACKEND.md)

### Exemple d'Utilisation

```javascript
// Login
const response = await fetch('http://localhost:2106/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'your_password' })
});
const { token } = await response.json();

// GET Coupons (protégé)
const coupons = await fetch('http://localhost:2106/api/coupons', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🚀 Déploiement

### Production Stack

- **Frontend** : Vercel (CDN global, auto-deploy)
- **Backend** : Render (Node.js 18+, auto-scaling)
- **Database** : Firebase Firestore (serverless, Google Cloud)

### Guide Complet

👉 **Voir [README_DEPLOY.md](README_DEPLOY.md)** pour le guide de déploiement étape par étape complet (1000+ lignes) :

- ✅ Configuration Firebase (avec screenshots textuels)
- ✅ Déploiement backend sur Render (7 étapes)
- ✅ Déploiement frontend sur Vercel (9 étapes)
- ✅ Variables d'environnement complètes
- ✅ Seeding de la database
- ✅ Tests & vérification
- ✅ Troubleshooting complet

### Déploiement Rapide

```bash
# 1. Push sur GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Vercel (Frontend)
# - Import repository
# - Root directory: frontend
# - Environment variable: VITE_API_URL=https://your-backend.onrender.com

# 3. Render (Backend)
# - Import repository
# - Root directory: backend
# - Add all environment variables (voir README_DEPLOY.md)

# 4. Vérifier
curl https://your-backend.onrender.com/api/health
```

---

## 📚 Documentation

Ce projet contient une documentation exhaustive pour tous les aspects :

| Fichier | Lignes | Contenu |
|---------|--------|---------|
| **[README.md](README.md)** | ~400 | Ce fichier - Vue d'ensemble générale |
| **[README_DEPLOY.md](README_DEPLOY.md)** | 1000+ | Guide de déploiement complet (Render + Vercel) |
| **[BACKEND.md](BACKEND.md)** | 400+ | Documentation backend complète |
| **[FRONTEND.md](FRONTEND.md)** | 400+ | Documentation frontend complète |
| **[PROJECT.md](PROJECT.md)** | 800+ | Vue d'ensemble full-stack architecture |

### Quoi Lire ?

- **🆕 Nouveau sur le projet** ? → Lire ce README.md
- **🖥️ Développer le backend** ? → Lire [BACKEND.md](BACKEND.md)
- **🌐 Développer le frontend** ? → Lire [FRONTEND.md](FRONTEND.md)
- **🚀 Déployer en production** ? → Lire [README_DEPLOY.md](README_DEPLOY.md)
- **🏗️ Comprendre l'architecture** ? → Lire [PROJECT.md](PROJECT.md)
- **🤖 IA qui analyse le projet** ? → Lire [PROJECT.md](PROJECT.md) en premier

---

## 🧪 Tests

### Backend Tests Automatisés

```bash
cd backend
npm run test:api

# Résultat attendu : ✅ 66/66 tests passed
```

### Tests Manuels (Swagger)

1. Lancer backend : `npm run dev`
2. Ouvrir : [http://localhost:2106/api-docs](http://localhost:2106/api-docs)
3. Tester n'importe quelle route avec "Try it out"

### Frontend Tests

```bash
cd frontend
npm run dev

# Vérifier manuellement :
# ✅ Login fonctionne
# ✅ Navigation fluide
# ✅ Animations présentes
# ✅ Data chargée depuis API
# ✅ Pas d'erreurs console
```

---

## 🛠️ Scripts Disponibles

### Backend

```bash
npm run dev      # Lancer serveur dev (nodemon auto-reload)
npm start        # Lancer serveur production
npm run test:api # Lancer tests automatisés (66 tests)
npm run lint     # Vérifier code style (ESLint)
```

### Frontend

```bash
npm run dev      # Lancer dev server (HMR, port 1308)
npm run build    # Build pour production (dist/)
npm run preview  # Preview du build production
npm run lint     # Vérifier code style (ESLint)
```

---

## 🎨 Design System

### Palette de Couleurs

```css
--primary: #ff69b4;      /* HotPink - Couleur principale */
--secondary: #fce7f3;    /* Pink-100 - Backgrounds */
--accent: #ec4899;       /* Pink-500 - Accents */
--text-dark: #1f2937;    /* Gray-800 - Texte principal */
--text-light: #6b7280;   /* Gray-500 - Texte secondaire */
```

### Typography

- **Headings** : `Playfair Display` (serif, elegant)
- **Body** : `Inter` / System sans-serif

### Animations

- **Spring Physics** : `{ stiffness: 260, damping: 20 }`
- **Duration** : 0.3s–0.6s
- **Easing** : `ease-out` / `spring`

---

## 🔐 Sécurité

### Implémenté

- ✅ **JWT Authentication** (7 jours expiration)
- ✅ **Token Blacklist** (logout révoque token)
- ✅ **Bcrypt Password Hashing** (10 rounds)
- ✅ **Helmet Security Headers** (XSS, clickjacking, etc.)
- ✅ **CORS Configured** (whitelist origins)
- ✅ **Rate Limiting** (100 req/15min par IP)
- ✅ **Input Validation** (Joi schemas stricts)
- ✅ **Firebase Rules** (deny all public access)
- ✅ **Environment Variables** (.env jamais commit)
- ✅ **HTTPS** (production)

### Best Practices

- Tous les secrets dans `.env` (gitignored)
- Firebase Private Key jamais exposée
- JWT_SECRET 32+ caractères aléatoires
- CORS origins explicitement listées
- Validation côté serveur pour toutes les entrées
- Logs structurés (Winston) sans données sensibles

---

## 🐛 Troubleshooting

### Backend ne démarre pas

```bash
# Vérifier Node.js version
node --version  # Doit être >= 18

# Vérifier .env existe et contient toutes les variables
cat backend/.env

# Vérifier Firebase service account JSON existe
ls backend/princess-project-*.json

# Tester connexion Firebase
cd backend
node -e "import { getDb } from './src/config/firebase.js'; console.log('Firebase OK:', !!getDb());"
```

### Frontend ne peut pas appeler API

```bash
# Vérifier VITE_API_URL dans .env
cat frontend/.env

# Vérifier CORS backend (FRONTEND_URL)
cat backend/.env | grep FRONTEND_URL

# Vérifier backend running
curl http://localhost:2106/api/health
```

### Token expiré / Invalid

```javascript
// Console navigateur
localStorage.removeItem('princess_token');
window.location.reload();
```

**Plus de troubleshooting** : Voir [README_DEPLOY.md](README_DEPLOY.md) section Troubleshooting

---

## 📊 Statistiques du Projet

```
📝 Lignes de code total:    ~9,500 lignes
   ├─ Backend:               5,000 lignes
   └─ Frontend:              4,500 lignes

📄 Fichiers source:          48 fichiers
   ├─ Backend JS:            25 fichiers
   └─ Frontend JSX/CSS:      23 fichiers

🗄️ Database:
   ├─ Collections:           7 collections
   ├─ Seed scripts:          5 scripts
   └─ Items seedés:          33 items

🛣️ API Routes:               42 endpoints (8 modules)
📄 Pages React:              13 pages
🧩 Composants React:         6 composants
📚 Documentation:            ~2,600 lignes (4 fichiers MD)
```

---

## 🤝 Contributing

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'feat: Add amazing feature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Conventions

- **Commits** : Format [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` Nouvelle fonctionnalité
  - `fix:` Correction de bug
  - `docs:` Documentation
  - `style:` Formatage
  - `refactor:` Refactoring
  - `test:` Tests
  - `chore:` Maintenance

---

## 📜 License

ISC License - Voir [LICENSE](LICENSE) pour plus de détails.

---

## 💖 Remerciements

- **Inspiration** : L'amour pour ma Princess 👑
- **Stack** : React, Node.js, Firebase, Tailwind CSS, Framer Motion
- **Communauté** : Tous les développeurs open-source

---

## 🎯 Roadmap Future

### Version 3.0 (Future)

- [ ] 📸 **Upload de Photos** (Firebase Storage + galerie)
- [ ] 🔔 **Notifications Push** (PWA notifications)
- [ ] 🌙 **Dark Mode** (toggle light/dark)
- [ ] 📊 **Dashboard Stats** (graphiques avec Chart.js)
- [ ] 🌐 **i18n** (support multi-langues)
- [ ] 📱 **App Mobile Native** (React Native)
- [ ] 🎮 **Plus de Jeux** (memory game, tic-tac-toe)
- [ ] 💬 **Chat en Temps Réel** (Socket.io)
- [ ] 🎥 **Appels Vidéo** (WebRTC)
- [ ] 🤖 **AI Features** (chatbot amoureux ?)

---

<div align="center">

**Fait avec 💖 pour ma Princess**

![Heart](https://img.shields.io/badge/Made%20with-Love-ff69b4?style=for-the-badge&logo=heart)

*"She said YES!" 🎉*

</div>

---

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/Ilan9903/princess-project/issues)
- **Documentation** : Voir les fichiers .md dans le repository
- **Email** : i.arfipro@outlook.fr

---

**Version** : 2.0.0  
**Dernière mise à jour** : 15 Avril 2026  
**Auteur** : The Prince 👨‍💻
