# 🚀 Guide de déploiement Backend - Railway

## Prérequis
- Compte GitHub avec ce repo
- Compte Firebase (déjà configuré)
- Variables d'environnement prêtes

## 📝 Étapes de déploiement

### 1. Créer un compte Railway
1. Aller sur [railway.app](https://railway.app)
2. S'inscrire avec GitHub
3. Autoriser l'accès au repo

### 2. Créer un nouveau projet
1. Cliquer sur "New Project"
2. Sélectionner "Deploy from GitHub repo"
3. Choisir ce repository
4. Sélectionner la branche `main`
5. Railway détecte automatiquement Node.js

### 3. Configurer le Root Directory
1. Dans les Settings du service
2. Trouver "Root Directory"
3. Mettre : `backend`
4. Sauvegarder

### 4. Ajouter les variables d'environnement
Dans l'onglet "Variables", ajouter :

```bash
NODE_ENV=production
PORT=2106
APP_PASSWORD=<votre_mot_de_passe>
JWT_SECRET=<votre_jwt_secret_production>
FRONTEND_URL=<votre_url_vercel>

# Firebase Admin SDK
FIREBASE_PROJECT_ID=<votre_project_id>
FIREBASE_PRIVATE_KEY=<votre_private_key_avec_\n>
FIREBASE_CLIENT_EMAIL=<votre_client_email>
```

**Important** : Pour `FIREBASE_PRIVATE_KEY`, copier tout le contenu du fichier JSON Firebase, y compris les `\n`

### 5. Déployer
1. Railway déploie automatiquement
2. Attendre que le statut devienne "Active" (2-3 minutes)
3. Noter l'URL générée (format : `https://xxx.up.railway.app`)

### 6. Tester le déploiement
Ouvrir dans le navigateur :
```
https://votre-app.up.railway.app/api/health
```

Devrait retourner :
```json
{"status":"ok","timestamp":"2026-02-23T..."}
```

### 7. Tester Swagger UI
```
https://votre-app.up.railway.app/api-docs
```

### 8. Mettre à jour le Frontend
Dans `frontend/src/Utils/api.js`, remplacer :
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://votre-app.up.railway.app/api'
  : 'http://localhost:2106/api';
```

### 9. Redéployer le Frontend sur Vercel
```bash
git add .
git commit -m "Update API URL for production"
git push
```

Vercel détecte automatiquement et redéploie.

## ⚙️ Configuration Railway avancée

### Variables d'environnement depuis un fichier
Railway supporte `.env` mais il n'est PAS dans le repo (gitignored).
Utiliser l'interface web pour les ajouter.

### Logs en temps réel
```bash
railway logs
```
Ou dans l'interface web : onglet "Deployments" > "View Logs"

### Domaine personnalisé (optionnel)
1. Onglet "Settings"
2. Section "Domains"
3. Ajouter votre domaine
4. Configurer le DNS (CNAME)

### Redémarrage manuel
```bash
railway restart
```

## 🔧 Maintenance

### Vérifier les logs
- Interface Railway : Onglet "Deployments"
- Chercher les erreurs (`[ERROR]`)

### Mettre à jour les variables
- Interface Railway : Onglet "Variables"
- Modifier > Auto-redéploie

### Rollback en cas de problème
- Interface Railway : Onglet "Deployments"
- Cliquer sur un déploiement précédent
- "Rollback to this deployment"

## 💰 Coûts
- **Plan Hobby** : 5$ de crédit gratuit/mois
- Largement suffisant pour ce projet
- Surveillance : tableau de bord Railway

## 🆘 Résolution de problèmes

### Erreur "Module not found"
→ Vérifier que `Root Directory = backend`

### Erreur Firebase
→ Vérifier `FIREBASE_PRIVATE_KEY` avec `\n` échappés

### CORS errors
→ Ajouter l'URL Vercel dans `FRONTEND_URL`

### Port déjà utilisé
→ Railway utilise la variable `PORT` automatiquement (pas besoin de changer)

## 📞 Support
- [Documentation Railway](https://docs.railway.app)
- [Discord Railway](https://discord.gg/railway)
