# 💖 Princess Project - Guide de Déploiement Complet

> **Guide complet pour déployer l'application Princess Project**  
> **Backend** : Render | **Frontend** : Vercel | **Database** : Firebase Firestore  
> **Date** : 23 Février 2026

---

## 📑 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Configuration Firebase](#configuration-firebase)
4. [Déploiement Backend (Render)](#déploiement-backend-render)
5. [Déploiement Frontend (Vercel)](#déploiement-frontend-vercel)
6. [Configuration Locale](#configuration-locale)
7. [Seeder la Base de Données](#seeder-la-base-de-données)
8. [Tests & Vérification](#tests--vérification)
9. [Variables d'Environnement](#variables-denvironnement)
10. [Troubleshooting](#troubleshooting)
11. [URLs & Accès](#urls--accès)

---

## 🎯 Vue d'Ensemble

### Architecture de Déploiement

```
┌─────────────────────────────────────────────────┐
│              PRODUCTION STACK                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  👥 Users                                       │
│    ↓                                            │
│  🌐 Frontend (Vercel)                          │
│    - React 19.2.0 + Vite 7.3.1                  │
│    - CDN Global                                 │
│    - Auto HTTPS                                 │
│    - URL: princess-project.vercel.app           │
│    ↓                                            │
│  🔌 Backend API (Render)                       │
│    - Node.js 18+ + Express 5.2.1                │
│    - 42 Routes RESTful                          │
│    - JWT Authentication                         │
│    - URL: princess-api.onrender.com             │
│    ↓                                            │
│  🗄️ Database (Firebase Firestore)              │
│    - 7 Collections NoSQL                        │
│    - Real-time capable                          │
│    - Google Cloud Infrastructure                │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Technologies Clés

| Couche | Technologie | Version |
|--------|-------------|---------|
| **Frontend** | React | 19.2.0 |
| | Vite | 7.3.1 |
| | Tailwind CSS | 4.1.18 |
| | Framer Motion | 12.34.0 |
| **Backend** | Node.js | 18+ |
| | Express | 5.2.1 |
| | Firebase Admin | 13.6.1 |
| | JWT | 9.0.3 |
| **Database** | Firestore | Latest |
| **Hosting** | Vercel | - |
| | Render | - |

---

## 📋 Prérequis

### Comptes Nécessaires

- ✅ **GitHub** : Compte avec repository du projet
- ✅ **Vercel** : [vercel.com](https://vercel.com) (gratuit)
- ✅ **Render** : [render.com](https://render.com) (gratuit)
- ✅ **Firebase** : [console.firebase.google.com](https://console.firebase.google.com) (gratuit)

### Outils Locaux

```bash
# Vérifier installations
node --version    # v18.0.0 ou supérieur
npm --version     # v8.0.0 ou supérieur
git --version     # n'importe quelle version récente
```

### Structure du Projet

```
Princess Project/
├── backend/
│   ├── src/
│   │   ├── index.js                    # Entry point
│   │   ├── config/
│   │   │   ├── firebase.js
│   │   │   └── swagger.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validate.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── auth.js
│   │   │   ├── valentine.js
│   │   │   ├── messages.js
│   │   │   ├── coupons.js
│   │   │   ├── planning.js
│   │   │   ├── quiz.js
│   │   │   └── playlist.js
│   │   └── utils/
│   │       ├── logger.js
│   │       └── tokenBlacklist.js
│   ├── seed-coupons.js
│   ├── seed-messages.js
│   ├── seed-planning.js
│   ├── seed-quiz.js
│   ├── seed-playlist.js
│   ├── package.json
│   ├── .env.example
│   └── princess-project-xxx.json      # Firebase service account
│
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
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
    │   └── Utils/
    │       └── api.js
    ├── public/
    │   └── favicon_assets/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

---

## 🔥 Configuration Firebase

### Étape 1 : Créer le Projet Firebase

1. **Aller sur** : [console.firebase.google.com](https://console.firebase.google.com)
2. **Cliquer** : "Ajouter un projet"
3. **Nom du projet** : `princess-project` (ou votre choix)
4. **Analytics** : Activer (optionnel)
5. **Créer le projet** : Attendre ~30 secondes

### Étape 2 : Activer Firestore

1. Dans le menu gauche : **"Firestore Database"**
2. **Cliquer** : "Créer une base de données"
3. **Mode** : Sélectionner "Production"
4. **Région** : Choisir proche de vous (ex: `europe-west1`)
5. **Règles de sécurité** : Accepter les règles par défaut

### Étape 3 : Créer un Service Account

1. **Menu gauche** : ⚙️ Paramètres > "Paramètres du projet"
2. **Onglet** : "Comptes de service"
3. **Cliquer** : "Générer une nouvelle clé privée"
4. **Télécharger** : Fichier JSON (ex: `princess-project-210622-firebase-adminsdk-xxx.json`)
5. **⚠️ IMPORTANT** : Ne JAMAIS commit ce fichier sur Git !

### Étape 4 : Extraire les Variables

Ouvrir le fichier JSON téléchargé, vous aurez besoin de :

```json
{
  "type": "service_account",
  "project_id": "princess-project-210622",           // ← FIREBASE_PROJECT_ID
  "private_key": "-----BEGIN PRIVATE KEY-----\n...", // ← FIREBASE_PRIVATE_KEY
  "client_email": "firebase-adminsdk-xxx@..."        // ← FIREBASE_CLIENT_EMAIL
}
```

### Étape 5 : Configurer les Règles Firestore

1. **Firestore Database** > **Règles**
2. **Remplacer** par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tout accès refusé par défaut (l'app utilise Firebase Admin SDK)
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Publier** les règles

> ℹ️ **Pourquoi ces règles strictes ?** L'application utilise le **backend comme proxy** avec Firebase Admin SDK, qui a tous les droits. Les utilisateurs ne communiquent jamais directement avec Firestore.

---

## 🖥️ Déploiement Backend (Render)

### Étape 1 : Préparer le Repository

1. **Vérifier que le code est poussé sur GitHub** :

```bash
cd "Princess Project"
git add .
git commit -m "feat: Ready for deployment"
git push origin main
```

### Étape 2 : Créer le Service Render

1. **Aller sur** : [dashboard.render.com](https://dashboard.render.com)
2. **Se connecter** avec GitHub
3. **Cliquer** : "New +" → "Web Service"
4. **Sélectionner** votre repository : `Princess Project`

### Étape 3 : Configuration du Service

**Settings à remplir** :

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `princess-backend` (ou votre choix) |
| **Region** | Choisir proche de vous |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### Étape 4 : Variables d'Environnement Render

Dans **"Environment"** > **"Environment Variables"**, ajouter :

#### Variables Obligatoires

| Clé | Valeur | Description |
|-----|--------|-------------|
| `NODE_ENV` | `production` | Mode production |
| `PORT` | `2106` | Port du serveur |
| `APP_PASSWORD` | `VotreMotDePasseSecure123!` | Password de login |
| `JWT_SECRET` | `[Générer 32+ caractères aléatoires]` | Secret pour JWT |
| `FRONTEND_URL` | `https://princess-project.vercel.app` | URL Vercel (après déploiement) |
| `FIREBASE_PROJECT_ID` | `princess-project-210622` | De Firebase JSON |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-xxx@...` | De Firebase JSON |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` | De Firebase JSON (avec \n) |

#### 🔐 Générer JWT_SECRET Fort

```bash
# Option 1 : Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2 : PowerShell
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Option 3 : Site web
# https://randomkeygen.com/ → "Fort Fort Fort"
```

#### ⚠️ IMPORTANT pour FIREBASE_PRIVATE_KEY

Le `FIREBASE_PRIVATE_KEY` doit inclure les `\n` (newlines) :

```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhki...\n-----END PRIVATE KEY-----\n
```

**Ne pas** remplacer `\n` par de vrais retours à la ligne dans Render !

### Étape 5 : Déployer

1. **Cliquer** : "Create Web Service"
2. **Attendre** : 3-5 minutes (premier déploiement)
3. **Vérifier logs** : Doit voir "✅ Serveur démarré sur port 2106"

### Étape 6 : Récupérer l'URL Backend

Render assigne une URL comme :

```
https://princess-backend.onrender.com
```

**Copier cette URL** → Vous en aurez besoin pour le frontend !

### Étape 7 : Tester le Backend

```bash
# Test health check
curl https://princess-backend.onrender.com/api/health

# Réponse attendue :
# {"status":"healthy","timestamp":"2026-02-23T..."}
```

### ⚠️ Note sur Render Free Tier

Le plan gratuit Render **"dort" après 15 minutes d'inactivité**. Le premier accès après sommeil prend ~30 secondes (cold start). Pour éviter ça, upgrade vers un plan payant ou utilise un service de ping externe.

---

## 🌐 Déploiement Frontend (Vercel)

### Étape 1 : Créer Fichier .env.production

Dans `frontend/.env.production` :

```bash
VITE_API_URL=https://princess-backend.onrender.com
```

**Remplacer** par votre vraie URL Render !

### Étape 2 : Créer Fichier vercel.json

Dans `frontend/vercel.json` :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Étape 3 : Push sur GitHub

```bash
cd "Princess Project"
git add .
git commit -m "feat: Configure production deployment"
git push origin main
```

### Étape 4 : Créer Projet Vercel

1. **Aller sur** : [vercel.com/new](https://vercel.com/new)
2. **Se connecter** avec GitHub
3. **Import Git Repository** : Sélectionner `Princess Project`
4. **Cliquer** : "Import"

### Étape 5 : Configuration Vercel

**Settings** :

| Paramètre | Valeur |
|-----------|--------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Étape 6 : Environment Variables Vercel

Dans **"Environment Variables"**, ajouter :

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://princess-backend.onrender.com` |

**Appliquer à** : Production, Preview, Development

### Étape 7 : Déployer

1. **Cliquer** : "Deploy"
2. **Attendre** : 1-2 minutes
3. **Success !** → Vercel donne l'URL

Vercel assigne une URL comme :

```
https://princess-project.vercel.app
```

### Étape 8 : ⚠️ Mettre à Jour FRONTEND_URL Backend

**Retourner sur Render** :

1. Dashboard > `princess-backend` > Environment
2. **Modifier** `FRONTEND_URL` → `https://princess-project.vercel.app`
3. **Save Changes** (Render redémarre automatiquement)

### Étape 9 : Domaine Personnalisé (Optionnel)

1. **Vercel** : Settings > Domains
2. **Ajouter** : `mon-projet.com`
3. **Configurer DNS** : Suivre instructions Vercel
4. **Attendre** : Propagation DNS (5-30 min)

---

## 💻 Configuration Locale

### Backend Local

```bash
# 1. Naviguer vers backend
cd backend

# 2. Copier .env.example
cp .env.example .env

# 3. Éditer .env (utiliser éditeur de votre choix)
notepad .env
# Ou : code .env

# 4. Remplir .env avec vraies valeurs
NODE_ENV=development
PORT=2106
APP_PASSWORD=VotreMotDePasseLocal
JWT_SECRET=votre_jwt_secret_32_chars
FRONTEND_URL=http://localhost:1308
FIREBASE_PROJECT_ID=princess-project-210622
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# 5. Installer dépendances
npm install

# 6. Lancer serveur dev (auto-reload)
npm run dev

# Serveur disponible : http://localhost:2106
# Swagger docs : http://localhost:2106/api-docs
```

### Frontend Local

```bash
# 1. Naviguer vers frontend
cd frontend

# 2. Copier .env.example
cp .env.example .env

# 3. Éditer .env
notepad .env
# Ou : code .env

# 4. Remplir .env
VITE_API_URL=http://localhost:2106

# 5. Installer dépendances
npm install

# 6. Lancer dev server (HMR)
npm run dev

# App disponible : http://localhost:1308
```

### Lancer les Deux en Parallèle

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

Puis ouvrir : [http://localhost:1308](http://localhost:1308)

---

## 🌱 Seeder la Base de Données

### Prérequis

- ✅ Backend configuré avec Firebase
- ✅ Variables d'environnement définies
- ✅ Firestore Database créée

### Lancer les Seeds

```bash
cd backend

# Seed TOUS les scripts (recommandé)
node seed-coupons.js
node seed-messages.js
node seed-planning.js
node seed-quiz.js
node seed-playlist.js
```

### Résultat Attendu

| Script | Collection | Items Créés | Description |
|--------|------------|-------------|-------------|
| `seed-coupons.js` | `coupons` | 6 | Bons cadeaux (Massage, Resto, etc.) |
| `seed-messages.js` | `messages` | 7 | Messages "Open When" |
| `seed-planning.js` | `planning` | 5 | Événements planifiés |
| `seed-quiz.js` | `quiz_questions` | 8 | Questions du quiz couple |
| `seed-playlist.js` | `playlist` | 7 | Chansons romantiques |

**Total** : **33 items** créés

### Vérifier dans Firebase Console

1. **Aller sur** : [console.firebase.google.com](https://console.firebase.google.com)
2. **Projet** : `princess-project`
3. **Firestore Database** : Voir 5 collections avec données

### Re-seed (Supprimer et Recréer)

```bash
# Supprimer une collection
node -e "import { getDb } from './src/config/firebase.js'; const db = getDb(); db.collection('coupons').get().then(snap => { const batch = db.batch(); snap.forEach(doc => batch.delete(doc.ref)); return batch.commit(); }).then(() => console.log('Supprimé'));"

# Puis re-seed
node seed-coupons.js
```

---

## ✅ Tests & Vérification

### 1. Tester Backend API

#### Test Manual (curl)

```bash
# Health check
curl https://princess-backend.onrender.com/api/health

# Login
curl -X POST https://princess-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"VotreMotDePasse"}'

# Response attendue :
# {"success":true,"token":"eyJhbGciOiJIUzI1NiIs..."}

# GET Coupons (avec token)
curl https://princess-backend.onrender.com/api/coupons \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Test avec Swagger UI

1. **Ouvrir** : [https://princess-backend.onrender.com/api-docs](https://princess-backend.onrender.com/api-docs)
2. **Cliquer** : `/api/auth/login` → "Try it out"
3. **Body** :
   ```json
   {
     "password": "VotreMotDePasse"
   }
   ```
4. **Execute** → Copier le `token` de la réponse
5. **Cliquer** : 🔓 "Authorize" en haut
6. **Entrer** : `Bearer YOUR_TOKEN_HERE`
7. **Tester** n'importe quelle route protégée !

### 2. Tester Frontend

1. **Ouvrir** : [https://princess-project.vercel.app](https://princess-project.vercel.app)
2. **Login** : Entrer le password
3. **Naviguer** : Tester chaque page
4. **Vérifier** :
   - ✅ FloatingHearts s'affichent
   - ✅ Animations fluides
   - ✅ Data chargée (coupons, messages, etc.)
   - ✅ Pas d'erreurs console

### 3. Tests Automatisés (Local)

```bash
cd backend
npm run test:api

# Résultat attendu : ✅ 66/66 tests passed
```

### 4. Checklist Déploiement

#### Backend (Render)
- [ ] Service créé et déployé
- [ ] Variables d'env configurées (8 variables)
- [ ] `npm start` démarre sans erreur
- [ ] Logs montrent "Serveur démarré"
- [ ] Health check répond 200
- [ ] Swagger UI accessible

#### Frontend (Vercel)
- [ ] Projet créé et déployé
- [ ] `VITE_API_URL` configurée
- [ ] Build réussit
- [ ] Site accessible
- [ ] Login fonctionne
- [ ] API calls réussissent

#### Database (Firebase)
- [ ] Firestore activé
- [ ] Service Account créé
- [ ] 5 collections seedées (33 items total)
- [ ] Règles de sécurité définies

#### CORS & Integration
- [ ] `FRONTEND_URL` backend = URL Vercel
- [ ] `VITE_API_URL` frontend = URL Render
- [ ] Login depuis frontend → Backend
- [ ] Fetch data → Firestore

---

## 📝 Variables d'Environnement

### Backend (.env)

```bash
# ──────────────────────────────────────────────────
# BACKEND ENVIRONMENT VARIABLES
# ──────────────────────────────────────────────────

# Node Environment
NODE_ENV=production                # production | development

# Server
PORT=2106                          # Port serveur (2106 pour Princess)

# Authentication
APP_PASSWORD=VotreMotDePasseSecure123!   # Password login unique
JWT_SECRET=votre_jwt_secret_aleatoire_32_chars_minimum   # Secret pour signer JWT

# CORS
FRONTEND_URL=https://princess-project.vercel.app   # URL frontend (sans trailing /)

# Firebase Credentials
FIREBASE_PROJECT_ID=princess-project-210622
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@princess-project-210622.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"
# ⚠️ Garder les \n dans la clé !
```

### Frontend (.env.production)

```bash
# ──────────────────────────────────────────────────
# FRONTEND ENVIRONMENT VARIABLES (PRODUCTION)
# ──────────────────────────────────────────────────

# API Backend URL
VITE_API_URL=https://princess-backend.onrender.com
# ⚠️ Sans trailing slash !
```

### Frontend (.env)

```bash
# ──────────────────────────────────────────────────
# FRONTEND ENVIRONMENT VARIABLES (DEVELOPMENT)
# ──────────────────────────────────────────────────

# API Backend URL (local)
VITE_API_URL=http://localhost:2106
```

### Sécurité Variables

#### ⚠️ NE JAMAIS COMMIT

Ajouter à `.gitignore` :

```
.env
.env.local
.env.production
.env.development
*.json
```

#### ✅ Fichiers Safe à Commit

- `.env.example` (template sans vraies valeurs)

### Exemple .env.example

**backend/.env.example** :

```bash
NODE_ENV=development
PORT=2106
APP_PASSWORD=your_password_here
JWT_SECRET=your_jwt_secret_32_chars
FRONTEND_URL=http://localhost:1308
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key_with_newlines"
```

**frontend/.env.example** :

```bash
VITE_API_URL=http://localhost:2106
```

---

## 🔧 Troubleshooting

### Backend Issues

#### ❌ Erreur: "Firebase not initialized"

**Symptôme** : Logs montrent erreur Firebase

**Solutions** :
1. Vérifier `FIREBASE_PROJECT_ID` correct
2. Vérifier `FIREBASE_PRIVATE_KEY` inclut `\n`
3. Vérifier `FIREBASE_CLIENT_EMAIL` correct
4. Tester connexion locale d'abord

**Test** :
```bash
node -e "import { getDb } from './src/config/firebase.js'; console.log('Firebase OK:', !!getDb());"
```

#### ❌ Erreur: "CORS policy blocked"

**Symptôme** : Frontend ne peut pas appeler API

**Solutions** :
1. Vérifier `FRONTEND_URL` sur Render = URL Vercel exacte
2. Pas de trailing slash dans `FRONTEND_URL`
3. Redémarrer service Render après changement

**Vérifier CORS** :
```bash
curl -I https://princess-backend.onrender.com/api/health \
  -H "Origin: https://princess-project.vercel.app"

# Doit voir : Access-Control-Allow-Origin: https://princess-project.vercel.app
```

#### ❌ Erreur: "Rate limit exceeded"

**Symptôme** : API retourne 429 Too Many Requests

**Cause** : Plus de 100 requêtes en 15 minutes depuis même IP

**Solution** : Attendre 15 minutes OU augmenter limite dans `backend/src/index.js` :

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200  // ← Augmenter
});
```

#### ❌ Render Service "Sleep"

**Symptôme** : Premier accès après inactivité prend 30+ secondes

**Cause** : Plan gratuit Render dort après 15 min

**Solutions** :
1. **Accepter** : Cold start normal sur free tier
2. **Upgrade** : Plan payant Render (~$7/mois)
3. **Ping externe** : Service qui ping ton API toutes les 10 min (ex: UptimeRobot)

### Frontend Issues

#### ❌ Erreur: "API URL undefined"

**Symptôme** : Console montre `undefined/api/...`

**Solutions** :
1. Vérifier fichier `.env.production` existe
2. Variable nommée `VITE_API_URL` (pas `API_URL`)
3. Re-build : `npm run build`
4. Sur Vercel : Vérifier Environment Variables

**Test local** :
```javascript
console.log(import.meta.env.VITE_API_URL);
// Doit afficher : http://localhost:2106
```

#### ❌ Erreur: "Token expired"

**Symptôme** : Redirect forcé vers `/login`

**Cause** : JWT expiré (après 7 jours)

**Solution** : Re-login (normal)

**Forcer logout** :
```javascript
// Console DevTools
localStorage.removeItem('princess_token');
window.location.reload();
```

#### ❌ Build Fails sur Vercel

**Symptôme** : Deployment failed

**Solutions** :
1. Vérifier `package.json` complet
2. Tester build local : `npm run build`
3. Vérifier logs Vercel pour erreur exacte
4. Vérifier `vercel.json` configuration

### Database Issues

#### ❌ Collections Vides

**Symptôme** : API retourne `[]`

**Cause** : Seeds pas exécutés

**Solution** :
```bash
cd backend
node seed-coupons.js
node seed-messages.js
node seed-planning.js
node seed-quiz.js
node seed-playlist.js
```

#### ❌ Firebase Permission Denied

**Symptôme** : Erreur "Insufficient permissions"

**Cause** : Règles Firestore trop strictes ou Service Account invalide

**Solutions** :
1. Vérifier règles Firestore (voir section Firebase)
2. Re-télécharger Service Account JSON
3. Vérifier variables d'env Firebase correctes

### Network Debugging

#### Utiliser Chrome DevTools

1. **Ouvrir** : F12 → Network tab
2. **Filter** : Fetch/XHR
3. **Login** puis naviguer
4. **Vérifier** chaque requête :
   - Status Code (200, 201, etc.)
   - Headers (Authorization: Bearer...)
   - Response body

#### Utiliser Postman

1. **Import** : Collection depuis Swagger JSON
2. **Setup** : Environment variables
3. **Test** : Chaque endpoint manuellement

---

## 🔗 URLs & Accès

### Production

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | https://princess-project.vercel.app | Application web |
| **Backend API** | https://princess-backend.onrender.com/api | REST API |
| **Swagger Docs** | https://princess-backend.onrender.com/api-docs | Documentation interactive |
| **Health Check** | https://princess-backend.onrender.com/api/health | Status serveur |
| **Firebase Console** | https://console.firebase.google.com/project/princess-project-210622 | Base de données |

### Développement Local

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:1308 | Dev server (Vite) |
| **Backend API** | http://localhost:2106/api | API locale |
| **Swagger Docs** | http://localhost:2106/api-docs | Docs locale |

### Dashboards

| Platform | URL | Accès |
|----------|-----|-------|
| **Vercel** | https://vercel.com/dashboard | Logs, deployments, analytics |
| **Render** | https://dashboard.render.com | Logs, metrics, restarts |
| **Firebase** | https://console.firebase.google.com | Database, règles, usage |

---

## 📊 Routes API (42 Endpoints)

### Authentication (3 routes)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/login` | Login avec password |
| `GET` | `/api/auth/verify` | Vérifier token JWT |
| `POST` | `/api/auth/logout` | Logout (blacklist token) |

### Valentine (5 routes)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/valentine` | Créer demande St-Valentin |
| `GET` | `/api/valentine` | Lister demandes |
| `GET` | `/api/valentine/:id` | Détail demande |
| `PUT` | `/api/valentine/:id` | Modifier demande |
| `DELETE` | `/api/valentine/:id` | Supprimer demande |

### Messages (5 routes)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/messages` | Créer message "Open When" |
| `GET` | `/api/messages` | Lister messages |
| `GET` | `/api/messages/:id` | Détail message |
| `PUT` | `/api/messages/:id` | Modifier message |
| `DELETE` | `/api/messages/:id` | Supprimer message |

### Coupons (7 routes)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/coupons` | Créer coupon |
| `GET` | `/api/coupons` | Lister coupons |
| `GET` | `/api/coupons/:id` | Détail coupon |
| `PUT` | `/api/coupons/:id` | Modifier coupon |
| `PATCH` | `/api/coupons/:id/redeem` | Utiliser coupon |
| `PATCH` | `/api/coupons/:id/reset` | Réinitialiser coupon |
| `DELETE` | `/api/coupons/:id` | Supprimer coupon |

### Planning (5 routes)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/planning` | Créer événement |
| `GET` | `/api/planning` | Lister événements |
| `GET` | `/api/planning/:id` | Détail événement |
| `PUT` | `/api/planning/:id` | Modifier événement |
| `DELETE` | `/api/planning/:id` | Supprimer événement |

### Quiz (9 routes)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/quiz/questions` | Créer question |
| `GET` | `/api/quiz/questions` | Lister questions |
| `GET` | `/api/quiz/questions/random` | Question aléatoire |
| `GET` | `/api/quiz/questions/:id` | Détail question |
| `PUT` | `/api/quiz/questions/:id` | Modifier question |
| `DELETE` | `/api/quiz/questions/:id` | Supprimer question |
| `POST` | `/api/quiz/answers` | Soumettre réponse |
| `GET` | `/api/quiz/statistics` | Stats globales |
| `GET` | `/api/quiz/history` | Historique réponses |

### Playlist (7 routes)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/playlist` | Ajouter chanson |
| `GET` | `/api/playlist` | Lister chansons |
| `GET` | `/api/playlist/:id` | Détail chanson |
| `PUT` | `/api/playlist/:id` | Modifier chanson |
| `PATCH` | `/api/playlist/:id/favorite` | Toggle favorite |
| `PATCH` | `/api/playlist/:id/play` | Incrémenter playCount |
| `DELETE` | `/api/playlist/:id` | Supprimer chanson |

### Health (1 route)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/health` | Status serveur |

**Total** : **42 routes**

---

## 🎯 Next Steps

### Après Déploiement Réussi

1. **✅ Tester toutes les fonctionnalités**
2. **✅ Seed la database**
3. **✅ Partager l'URL avec Princess** 💖
4. **✅ Configurer un domaine personnalisé** (optionnel)
5. **✅ Setup monitoring** (Vercel Analytics, Render metrics)
6. **✅ Configurer backups Firebase** (optionnel)

### Améliorations Futures

- 🚀 **PWA complète** : Notifications push
- 📊 **Analytics** : Google Analytics, Vercel Analytics
- 🔔 **Notifications** : Nouveaux messages, événements
- 💾 **Backups automatiques** : Firebase → Cloud Storage
- 🌍 **i18n** : Support multi-langues
- 🎨 **Themes** : Dark mode, custom themes
- 📱 **App mobile** : React Native version

---

## 📚 Documentation Complète

Pour plus de détails techniques :

- **[BACKEND.md](BACKEND.md)** : Documentation backend complète (400+ lignes)
- **[FRONTEND.md](FRONTEND.md)** : Documentation frontend complète (400+ lignes)
- **[PROJECT.md](PROJECT.md)** : Vue d'ensemble full-stack (800+ lignes)
- **[CORRECTIONS.md](CORRECTIONS.md)** : Historique des corrections

---

## 💖 Félicitations !

Votre **Princess Project** est maintenant déployé en production ! 🎉

---

**Date de dernière mise à jour** : 23 Février 2026  
**Version** : 2.0.0  
**Auteur** : The Prince  
**Pour** : Ma Princess 💖
