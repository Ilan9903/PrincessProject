import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;

try {
  let credential;
  
  const serviceAccountPath = join(__dirname, '..', '..', 'serviceAccountKey.json');
  
  // DEVELOPMENT : Préférer le fichier serviceAccountKey.json s'il existe
  if (existsSync(serviceAccountPath)) {
    console.log('🔧 Mode DEVELOPMENT : Utilisation du fichier serviceAccountKey.json');
    
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    credential = admin.credential.cert(serviceAccount);
  }
  // PRODUCTION : Utiliser les variables d'environnement
  else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
    console.log('🔧 Mode PRODUCTION : Utilisation des variables d\'environnement Firebase');
    
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Remplacer les \\n par de vrais retours à la ligne
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    });
  } 
  else {
    throw new Error('serviceAccountKey.json introuvable et variables d\'environnement non définies.');
  }

  // Initialiser Firebase Admin
  admin.initializeApp({
    credential: credential,
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });

  // Initialiser Firestore
  db = admin.firestore();

  console.log('✅ Firebase initialisé avec succès');
  console.log('📊 Project ID:', process.env.FIREBASE_PROJECT_ID);
} catch (error) {
  console.error('❌ ERREUR : Impossible d\'initialiser Firebase');
  console.error('📄 Détails:', error.message);
  console.error('\n🔍 Solutions possibles :');
  console.error('   - En LOCAL : Vérifiez que serviceAccountKey.json existe à la racine du backend');
  console.error('   - En PRODUCTION : Définissez FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
  process.exit(1); // Arrêter le serveur si Firebase n'est pas initialisé
}

export const getDb = () => {
  if (!db) {
    throw new Error('❌ Firestore non initialisé. Vérifiez la configuration Firebase.');
  }
  return db;
};

export default admin;