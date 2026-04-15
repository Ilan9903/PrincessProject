// Token blacklist persistante via Firestore
// Résiste aux redémarrages serveur (important sur Render free tier)
import { getDb } from '../config/firebase.js';

const COLLECTION = 'token_blacklist';

export const tokenBlacklist = {
  /**
   * Ajouter un token à la blacklist avec TTL
   */
  async add(token, expiresAt) {
    try {
      const db = getDb();
      await db.collection(COLLECTION).doc(token).set({
        blacklistedAt: new Date().toISOString(),
        expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      console.error('Erreur ajout blacklist:', error.message);
    }
  },

  /**
   * Vérifier si un token est blacklisté
   */
  async has(token) {
    try {
      const db = getDb();
      const doc = await db.collection(COLLECTION).doc(token).get();
      if (!doc.exists) return false;
      
      // Vérifier si le token blacklisté a expiré (nettoyage automatique)
      const data = doc.data();
      if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
        await db.collection(COLLECTION).doc(token).delete();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erreur vérification blacklist:', error.message);
      return false;
    }
  }
};
