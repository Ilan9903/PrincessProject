import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import Joi from 'joi';
import { getDb } from '../config/firebase.js';
import admin from '../config/firebase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Schéma de validation
const playlistSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Le titre est requis',
    'any.required': 'Le titre est requis'
  }),
  artist: Joi.string().required().messages({
    'string.empty': 'L\'artiste est requis',
    'any.required': 'L\'artiste est requis'
  }),
  album: Joi.string().allow('').optional(),
  platform: Joi.string().valid('spotify', 'youtube', 'apple_music', 'other').default('spotify'),
  url: Joi.string().uri().allow('').optional(),
  addedBy: Joi.string().valid('me', 'princess', 'both').default('me'),
  reason: Joi.string().allow('').optional()
});

/**
 * @swagger
 * /playlist:
 *   post:
 *     summary: Ajouter une chanson à la playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artist
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Perfect"
 *               artist:
 *                 type: string
 *                 example: "Ed Sheeran"
 *               album:
 *                 type: string
 *                 example: "Divide"
 *               platform:
 *                 type: string
 *                 enum: [spotify, youtube, apple_music, other]
 *                 default: spotify
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: "https://open.spotify.com/track/..."
 *               addedBy:
 *                 type: string
 *                 enum: [me, you, both]
 *                 default: me
 *               reason:
 *                 type: string
 *                 example: "Notre chanson"
 *     responses:
 *       201:
 *         description: Chanson ajoutée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', authenticateToken, validate(playlistSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { title, artist, album, platform, url, addedBy, reason } = req.body;
    
    const songData = {
      title,
      artist,
      album: album || '',
      platform: platform || 'spotify',
      url: url || '',
      addedBy: addedBy || 'me',
      reason: reason || '',
      isFavorite: false,
      playCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastPlayedAt: null
    };
    
    const docRef = await db.collection('playlist').add(songData);

    logger.info('Chanson ajoutée', { 
      id: docRef.id,
      title,
      artist,
      platform,
      ip: req.ip 
    });

    res.status(201).json({ 
      success: true,
      id: docRef.id,
      message: 'Chanson ajoutée avec succès'
    });
  } catch (error) {
    logger.error('Erreur ajout chanson', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /playlist:
 *   get:
 *     summary: Récupérer toutes les chansons
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           enum: [spotify, youtube, apple_music, other]
 *         description: Filtrer par plateforme
 *       - in: query
 *         name: addedBy
 *         schema:
 *           type: string
 *           enum: [me, you, both]
 *         description: Filtrer par ajouté par
 *       - in: query
 *         name: favorites
 *         schema:
 *           type: boolean
 *         description: Afficher uniquement les favoris
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [recent, popular, alphabetical]
 *           default: recent
 *         description: Ordre de tri
 *     responses:
 *       200:
 *         description: Liste des chansons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   artist:
 *                     type: string
 *                   album:
 *                     type: string
 *                   platform:
 *                     type: string
 *                   url:
 *                     type: string
 *                   addedBy:
 *                     type: string
 *                   reason:
 *                     type: string
 *                   isFavorite:
 *                     type: boolean
 *                   playCount:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                   lastPlayedAt:
 *                     type: string
 *       401:
 *         description: Non authentifié
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const { platform, addedBy, favorites, sortBy = 'recent' } = req.query;
    
    let snapshot;
    if (sortBy === 'recent') {
      snapshot = await db.collection('playlist').orderBy('createdAt', 'desc').get();
    } else if (sortBy === 'popular') {
      snapshot = await db.collection('playlist').orderBy('playCount', 'desc').get();
    } else {
      snapshot = await db.collection('playlist').orderBy('createdAt', 'desc').get();
    }

    let songs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Filtrer côté serveur
      if (platform && data.platform !== platform) return;
      if (addedBy && data.addedBy !== addedBy) return;
      if (favorites === 'true' && !data.isFavorite) return;
      
      songs.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        lastPlayedAt: data.lastPlayedAt?.toDate().toISOString()
      });
    });
    
    // Tri alphabétique côté serveur si demandé
    if (sortBy === 'alphabetical') {
      songs.sort((a, b) => a.title.localeCompare(b.title));
    }

    logger.info('Chansons récupérées', { 
      count: songs.length,
      filters: { platform, addedBy, favorites, sortBy },
      ip: req.ip 
    });

    res.json(songs);
  } catch (error) {
    logger.error('Erreur récupération playlist', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /playlist/{id}:
 *   get:
 *     summary: Récupérer une chanson par ID
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la chanson
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Détails de la chanson
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Chanson non trouvée
 *       401:
 *         description: Non authentifié
 */
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection('playlist').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Chanson non trouvée' 
      });
    }

    const data = doc.data();

    logger.info('Chanson récupérée', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      id: doc.id, 
      ...data,
      createdAt: data.createdAt?.toDate().toISOString(),
      lastPlayedAt: data.lastPlayedAt?.toDate().toISOString()
    });
  } catch (error) {
    logger.error('Erreur récupération chanson', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /playlist/{id}:
 *   put:
 *     summary: Modifier une chanson
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la chanson
 *         example: "abc123xyz"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artist
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               album:
 *                 type: string
 *               platform:
 *                 type: string
 *                 enum: [spotify, youtube, apple_music_music, other]
 *               url:
 *                 type: string
 *               addedBy:
 *                 type: string
 *                 enum: [me, you, both]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chanson modifiée
 *       404:
 *         description: Chanson non trouvée
 *       401:
 *         description: Non authentifié
 */
router.put('/:id', authenticateToken, validate(playlistSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { title, artist, album, platform, url, addedBy, reason } = req.body;
    
    const docRef = db.collection('playlist').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Chanson non trouvée' 
      });
    }
    
    const updateData = {
      title,
      artist,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (album !== undefined) updateData.album = album;
    if (platform !== undefined) updateData.platform = platform;
    if (url !== undefined) updateData.url = url;
    if (addedBy !== undefined) updateData.addedBy = addedBy;
    if (reason !== undefined) updateData.reason = reason;
    
    await docRef.update(updateData);

    logger.info('Chanson modifiée', { 
      id: req.params.id,
      title,
      artist,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Chanson modifiée avec succès'
    });
  } catch (error) {
    logger.error('Erreur modification chanson', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /playlist/{id}/favorite:
 *   patch:
 *     summary: Marquer/Démarquer une chanson comme favorite
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la chanson
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Statut favori modifié (toggle)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isFavorite:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Chanson non trouvée
 *       401:
 *         description: Non authentifié
 */
router.patch('/:id/favorite', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const docRef = db.collection('playlist').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Chanson non trouvée' 
      });
    }

    const currentData = doc.data();
    const newFavoriteStatus = !currentData.isFavorite;

    await docRef.update({
      isFavorite: newFavoriteStatus
    });

    logger.info('Statut favori modifié', { 
      id: req.params.id,
      isFavorite: newFavoriteStatus,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      isFavorite: newFavoriteStatus,
      message: newFavoriteStatus ? 'Ajouté aux favoris' : 'Retiré des favoris'
    });
  } catch (error) {
    logger.error('Erreur modification favori', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /playlist/{id}/play:
 *   patch:
 *     summary: Incrémenter le compteur de lecture
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la chanson
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Lecture enregistrée (playCount +1)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lecture enregistrée"
 *       404:
 *         description: Chanson non trouvée
 *       401:
 *         description: Non authentifié
 */
router.patch('/:id/play', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const docRef = db.collection('playlist').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Chanson non trouvée' 
      });
    }

    await docRef.update({
      playCount: admin.firestore.FieldValue.increment(1),
      lastPlayedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    logger.info('Chanson jouée', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Lecture enregistrée'
    });
  } catch (error) {
    logger.error('Erreur enregistrement lecture', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /playlist/{id}:
 *   delete:
 *     summary: Supprimer une chanson
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la chanson à supprimer
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Chanson supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Chanson supprimée avec succès"
 *       404:
 *         description: Chanson non trouvée
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const docRef = db.collection('playlist').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Chanson non trouvée' 
      });
    }

    await docRef.delete();

    logger.info('Chanson supprimée', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Chanson supprimée avec succès'
    });
  } catch (error) {
    logger.error('Erreur suppression chanson', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      ip: req.ip 
    });
    next(error);
  }
});

export default router;