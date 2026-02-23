import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;

try {
  // Lire le fichier serviceAccountKey.json
  const serviceAccountPath = join(__dirname, '..', '..', 'serviceAccountKey.json');
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  // Initialiser Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });

  // Initialiser Firestore
  db = admin.firestore();

  console.log('✅ Firebase initialisé avec succès');
  console.log('📊 Project ID:', process.env.FIREBASE_PROJECT_ID);
} catch (error) {
  console.error('❌ ERREUR : Impossible d\'initialiser Firebase');
  console.error('📄 Détails:', error.message);
  console.error('🔍 Vérifiez que serviceAccountKey.json existe à la racine du backend');
  console.error('🔍 Vérifiez que FIREBASE_PROJECT_ID est défini dans .env');
  process.exit(1); // Arrêter le serveur si Firebase n'est pas initialisé
}

export const getDb = () => {
  if (!db) {
    throw new Error('❌ Firestore non initialisé. Vérifiez la configuration Firebase.');
  }
  return db;
};

export default admin;