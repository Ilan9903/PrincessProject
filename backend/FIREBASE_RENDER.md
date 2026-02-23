# 🔐 Guide : Extraire les credentials Firebase pour Render

## Pourquoi ?
Le fichier `serviceAccountKey.json` contient vos credentials Firebase et **ne doit JAMAIS** être committé sur Git. Pour Render, on utilise des **variables d'environnement** à la place.

## Comment extraire les credentials ?

### Étape 1️⃣ : Ouvrir votre fichier serviceAccountKey.json

Le fichier ressemble à ça :
```json
{
  "type": "service_account",
  "project_id": "princess-project-210622",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@princess-project-210622.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

### Étape 2️⃣ : Extraire les 3 valeurs importantes

Vous avez besoin de **3 champs uniquement** :

1. **`project_id`** → Variable `FIREBASE_PROJECT_ID`
2. **`client_email`** → Variable `FIREBASE_CLIENT_EMAIL`
3. **`private_key`** → Variable `FIREBASE_PRIVATE_KEY`

### Étape 3️⃣ : Copier dans Render

#### Option A : Via l'interface web (recommandé)

1. Aller sur Render → Votre Web Service → Onglet **"Environment"**
2. Cliquer **"Add Environment Variable"**
3. Ajouter une par une :

**Variable 1 :**
```
Name: FIREBASE_PROJECT_ID
Value: princess-project-210622
```

**Variable 2 :**
```
Name: FIREBASE_CLIENT_EMAIL
Value: firebase-adminsdk-fbsvc@princess-project-210622.iam.gserviceaccount.com
```

**Variable 3 (ATTENTION aux guillemets) :**
```
Name: FIREBASE_PRIVATE_KEY
Value: -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
```

⚠️ **IMPORTANT pour `FIREBASE_PRIVATE_KEY`** :
- Copier la valeur COMPLÈTE entre guillemets
- Les `\n` doivent être CONSERVÉS (ce sont des caractères littéraux)
- NE PAS ajouter de guillemets supplémentaires dans Render

#### Option B : Via script PowerShell (automatique)

Créez un fichier `extract-firebase-env.ps1` :

```powershell
# Lire le fichier JSON
$json = Get-Content -Path "serviceAccountKey.json" -Raw | ConvertFrom-Json

# Afficher les variables d'environnement
Write-Host "`n🔑 Variables d'environnement Firebase pour Render :" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

Write-Host "`nFIREBASE_PROJECT_ID=" -NoNewline -ForegroundColor Yellow
Write-Host $json.project_id -ForegroundColor Green

Write-Host "`nFIREBASE_CLIENT_EMAIL=" -NoNewline -ForegroundColor Yellow
Write-Host $json.client_email -ForegroundColor Green

Write-Host "`nFIREBASE_PRIVATE_KEY=" -NoNewline -ForegroundColor Yellow
Write-Host $json.private_key -ForegroundColor Green

Write-Host "`n" + "=" * 60 -ForegroundColor Gray
Write-Host "✅ Copiez ces valeurs dans Render > Environment" -ForegroundColor Cyan
```

Puis exécuter :
```powershell
cd backend
powershell -ExecutionPolicy Bypass -File extract-firebase-env.ps1
```

### Étape 4️⃣ : Vérifier la configuration

Une fois les 3 variables ajoutées dans Render :

1. Render redéploie automatiquement
2. Vérifier les logs : vous devriez voir `🔧 Mode PRODUCTION : Utilisation des variables d'environnement Firebase`
3. Puis `✅ Firebase initialisé avec succès`

Si vous voyez `❌ ERREUR Firebase`, vérifier :
- Les 3 variables sont bien définies
- `FIREBASE_PRIVATE_KEY` contient bien les `\n` (échappés)
- Pas d'espaces ou de guillemets en trop

## 🧪 Test en local

Pour tester que le mode variables d'env fonctionne localement :

**Backend `.env` :**
```bash
NODE_ENV=production
PORT=2106
APP_PASSWORD=2106
JWT_SECRET=test_secret
FRONTEND_URL=http://localhost:1308

# Firebase via variables (extraites du JSON)
FIREBASE_PROJECT_ID=princess-project-210622
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@princess-project-210622.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

Lancer :
```bash
npm start
```

Vous devriez voir `🔧 Mode PRODUCTION : Utilisation des variables d'environnement Firebase`

Si vous voyez `🔧 Mode DEVELOPMENT : Utilisation du fichier serviceAccountKey.json`, c'est qu'une des 3 variables manque.

## 🔒 Sécurité

✅ **À faire :**
- Garder `serviceAccountKey.json` dans `.gitignore`
- Utiliser les variables d'environnement en production
- Ne jamais commit les credentials

❌ **À NE PAS faire :**
- Commit `serviceAccountKey.json`
- Partager le fichier JSON publiquement
- Mettre les credentials en clair dans le code

## 🆘 Dépannage

### Erreur : "Cannot read properties of undefined"
→ Une variable Firebase manque, vérifier les 3 sont définies

### Erreur : "Invalid service account"
→ `FIREBASE_PRIVATE_KEY` mal formatée, vérifier les `\n`

### Serveur crash au démarrage
→ Vérifier les logs Render, chercher "Firebase" ou "ERREUR"

### "serviceAccountKey.json introuvable" en production
→ Normal ! En production Render utilise les variables d'env

---

✅ Une fois configuré, Render peut accéder à Firebase sans avoir besoin du fichier JSON !
