# 🚀 Configuration Render - Variables d'Environnement

## ⚠️ CRITICAL : Variables Obligatoires

Sur le dashboard Render (Environment Variables), configure **EXACTEMENT** ces variables :

### 1. NODE_ENV
```
NODE_ENV=production
```
**⚠️ CRITIQUE** : Sans cette variable, les cookies ne seront pas `secure` et `sameSite: 'none'`, ce qui bloquera l'authentification cross-domain avec Vercel.

### 2. FRONTEND_URL
```
FRONTEND_URL=https://princess-project-chi.vercel.app
```
Pour autoriser le CORS depuis Vercel.

### 3. APP_PASSWORD
```
APP_PASSWORD=2106
```
Mot de passe pour se connecter.

### 4. JWT_SECRET
```
JWT_SECRET=votre_secret_jwt_32_caracteres_minimum
```
Secret pour signer les tokens JWT.

### 5. FIREBASE_PROJECT_ID
```
FIREBASE_PROJECT_ID=princess-project-210622
```

### 6. FIREBASE_CLIENT_EMAIL
```
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@princess-project-210622.iam.gserviceaccount.com
```

### 7. FIREBASE_PRIVATE_KEY
```
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nVOTRE_CLE_ICI\n-----END PRIVATE KEY-----
```
⚠️ Copier depuis le fichier JSON Firebase (avec les `\n`).

---

## 🔍 Vérification

Après configuration :
1. Redémarrer le service Render
2. Vérifier les logs : `🍪 Cookie configuré: { secure: true, sameSite: 'none' }`
3. Tester login depuis https://princess-project-chi.vercel.app

---

## 🐛 Débogage

Si erreur 401 sur /api/auth/verify :
- Ouvrir DevTools → Application → Cookies
- Vérifier que `princess_token` est présent avec flag `HttpOnly`
- Vérifier que `Secure` et `SameSite=None` sont activés
- Vérifier les logs Render pour voir "Cookies reçus: ['princess_token']"
