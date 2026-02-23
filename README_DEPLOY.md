# 🎀 Princess Project - Guide de déploiement complet

## 📁 Structure du projet
```
Princess Project/
├── backend/          # API Node.js + Express + Firebase
│   ├── src/         # Code source
│   ├── test-api.js  # Suite de tests complète
│   └── DEPLOIEMENT.md  # Guide Railway détaillé
└── frontend/        # React + Vite
    └── src/         # Application web
```

## 🚀 Déploiement Production

### Backend sur Railway
1. **Créer un compte** : [railway.app](https://railway.app)
2. **Nouveau projet** : "Deploy from GitHub repo"
3. **Configurer** : Root Directory = `backend`
4. **Variables d'env** : Voir `backend/DEPLOIEMENT.md`
5. **Déployer** : Automatique après push

**Résultat** : `https://your-app.up.railway.app`

### Frontend sur Vercel
1. **Créer fichier** : `frontend/.env.production`
   ```bash
   VITE_API_URL=https://your-railway-app.up.railway.app
   ```

2. **Push sur GitHub** :
   ```bash
   git add .
   git commit -m "feat: Complete Swagger docs + Railway deployment"
   git push
   ```

3. **Vercel redéploie automatiquement**

## 🔧 Configuration locale

### Backend
```bash
cd backend
cp .env.exemple .env
# Éditer .env avec vos credentials Firebase
npm install
npm run dev
```
API disponible : `http://localhost:2106`  
Swagger UI : `http://localhost:2106/api-docs`

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
App disponible : `http://localhost:1308`

## ✅ Tests

### Tests backend complets (66 tests)
```bash
cd backend
npm run test:api
```

**Couverture : 100%** de toutes les routes API

### Tester manuellement
1. Lancer le backend : `npm run dev` (port 2106)
2. Ouvrir Swagger : `http://localhost:2106/api-docs`
3. Cliquer "Try it out" sur n'importe quelle route
4. Voir les schémas de requête/réponse complets

## 📊 Fonctionnalités

### Routes API documentées (41 endpoints)
- **Auth** : Login, verify, logout
- **Messages** : CRUD + messages secrets avec date de déverrouillage
- **Planning** : Gestion d'événements avec filtres (status, type, upcoming)
- **Coupons** : CRUD + redeem/reset avec gestion d'expiration
- **Quiz** : Questions/réponses avec statistiques et historique
- **Playlist** : Chansons avec favoris, compteur de lectures
- **Valentine** : Moments spéciaux
- **Health** : Check serveur

### Sécurité
- JWT avec expiration 7 jours
- Token blacklist pour logout
- Rate limiting (100 req/15min)
- CORS configuré
- Helmet.js
- Validation Joi

### Documentation
- **OpenAPI 3.0** complet
- Swagger UI interactif
- Schémas de requête avec exemples
- Réponses détaillées (200, 201, 400, 401, 404)

## 📝 Variables d'environnement requises

### Backend (.env)
```bash
NODE_ENV=production
PORT=2106
APP_PASSWORD=<secret>
JWT_SECRET=<secret_jwt>
FRONTEND_URL=<url_vercel>
FIREBASE_PROJECT_ID=<firebase_id>
FIREBASE_PRIVATE_KEY=<firebase_key>
FIREBASE_CLIENT_EMAIL=<firebase_email>
```

### Frontend (.env.production)
```bash
VITE_API_URL=<url_railway>
```

## 🔗 URLs Production (après déploiement)

- **Frontend** : https://princess-project.vercel.app
- **Backend API** : https://princess-backend.up.railway.app/api
- **Swagger Docs** : https://princess-backend.up.railway.app/api-docs

## 🆘 Support

- **Backend** : Voir `backend/DEPLOIEMENT.md`
- **Railway** : [docs.railway.app](https://docs.railway.app)
- **Vercel** : [vercel.com/docs](https://vercel.com/docs)

## 📈 Monitoring

- **Railway** : Dashboard > Logs en temps réel
- **Vercel** : Analytics + Error tracking
- **Health check** : `GET /api/health`

Bon déploiement ! 🚀
