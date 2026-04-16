import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate, valentineSchema } from '../middleware/validate.js';
import { getDb } from '../config/firebase.js';
import admin from '../config/firebase.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @swagger
 * /valentine:
 *   post:
 *     summary: Créer un nouveau moment spécial
 *     tags: [Valentine]
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
 *               - description
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre du moment
 *                 example: "Notre première rencontre"
 *               description:
 *                 type: string
 *                 description: Description du moment
 *                 example: "Le jour où on s'est rencontrés 💖"
 *               date:
 *                 type: string
 *                 description: Date du moment
 *                 example: "2024-02-14"
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL de l'image (optionnel)
 *                 example: "https://example.com/photo.jpg"
 *     responses:
 *       201:
 *         description: Moment créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 id:
 *                   type: string
 *                   example: "abc123xyz"
 *                 message:
 *                   type: string
 *                   example: "Moment créé avec succès"
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', authenticateToken, validate(valentineSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { title, description, date, imageUrl } = req.body;
    
    const momentData = {
      title,
      description,
      date,
      imageUrl: imageUrl || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('valentine').add(momentData);

    logger.info('Moment créé', { 
      id: docRef.id,
      title,
      date,
      ip: req.ip 
    });

    res.status(201).json({ 
      success: true,
      id: docRef.id,
      message: 'Moment créé avec succès'
    });
  } catch (error) {
    logger.error('Erreur création moment', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /valentine:
 *   get:
 *     summary: Récupérer tous les moments spéciaux
 *     tags: [Valentine]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des moments
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
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Non authentifié
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    
    const snapshot = await db.collection('valentine')
      .orderBy('date', 'desc')
      .get();

    const moments = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      moments.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate().toISOString()
      });
    });

    logger.info('Moments récupérés', { 
      count: moments.length,
      ip: req.ip 
    });

    res.json(moments);
  } catch (error) {
    logger.error('Erreur récupération moments', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /valentine/{id}:
 *   get:
 *     summary: Récupérer un moment par ID
 *     tags: [Valentine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du moment
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Moment trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Moment non trouvé
 *       401:
 *         description: Non authentifié
 */
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection('valentine').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Moment non trouvé' 
      });
    }

    const data = doc.data();

    logger.info('Moment récupéré', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      id: doc.id, 
      ...data,
      createdAt: data.createdAt?.toDate().toISOString()
    });
  } catch (error) {
    logger.error('Erreur récupération moment', { 
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
 * /valentine/{id}:
 *   put:
 *     summary: Modifier un moment
 *     tags: [Valentine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du moment
 *         example: "abc123xyz"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Titre modifié"
 *               description:
 *                 type: string
 *                 example: "Description modifiée"
 *               date:
 *                 type: string
 *                 example: "2024-02-14"
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Moment modifié avec succès
 *       404:
 *         description: Moment non trouvé
 *       401:
 *         description: Non authentifié
 */
router.put('/:id', authenticateToken, validate(valentineSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { title, description, date, imageUrl } = req.body;
    
    const docRef = db.collection('valentine').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Moment non trouvé' 
      });
    }
    
    const updateData = {
      title,
      description,
      date,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    
    await docRef.update(updateData);

    logger.info('Moment modifié', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Moment modifié avec succès'
    });
  } catch (error) {
    logger.error('Erreur modification moment', { 
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
 * /valentine/{id}:
 *   delete:
 *     summary: Supprimer un moment
 *     tags: [Valentine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du moment à supprimer
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Moment supprimé avec succès
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
 *                   example: "Moment supprimé avec succès"
 *       404:
 *         description: Moment non trouvé
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const docRef = db.collection('valentine').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Moment non trouvé' 
      });
    }

    await docRef.delete();

    logger.info('Moment supprimé', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Moment supprimé avec succès'
    });
  } catch (error) {
    logger.error('Erreur suppression moment', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      ip: req.ip 
    });
    next(error);
  }
});

export default router;