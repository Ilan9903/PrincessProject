import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate, messageSchema } from '../middleware/validate.js';
import { getDb } from '../config/firebase.js';
import admin from '../config/firebase.js';
import logger from '../utils/logger.js';
import { paginate } from '../utils/paginate.js';

const router = express.Router();

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Créer un nouveau message
 *     tags: [Messages]
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
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre du message
 *                 example: "Mon message d'amour"
 *               content:
 *                 type: string
 *                 description: Contenu du message
 *                 example: "Je t'aime tellement 💖"
 *               isSecret:
 *                 type: boolean
 *                 description: Si true, message déverrouillable à une date
 *                 default: false
 *               unlockDate:
 *                 type: string
 *                 format: date
 *                 description: Date de déverrouillage (ISO format)
 *                 example: "2026-12-25"
 *     responses:
 *       201:
 *         description: Message créé avec succès
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
 *                   example: "Message créé avec succès"
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateToken, validate(messageSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { title, content, isSecret, unlockDate } = req.body;
    
    const messageData = {
      title,
      content,
      isSecret: isSecret || false,
      unlockDate: (isSecret && unlockDate) ? unlockDate : null,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('messages').add(messageData);

    logger.info('Message créé', { 
      id: docRef.id,
      title,
      isSecret,
      ip: req.ip 
    });

    res.status(201).json({ 
      success: true,
      id: docRef.id,
      message: 'Message créé avec succès'
    });
  } catch (error) {
    logger.error('Erreur création message', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Récupérer tous les messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre d'éléments par page (max 100)
 *     responses:
 *       200:
 *         description: Liste paginée des messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "abc123xyz"
 *                       title:
 *                         type: string
 *                         example: "Mon message"
 *                       content:
 *                         type: string
 *                         example: "Contenu du message"
 *                       isSecret:
 *                         type: boolean
 *                         example: false
 *                       isLocked:
 *                         type: boolean
 *                         description: Si true, le contenu est masqué
 *                         example: false
 *                       unlockDate:
 *                         type: string
 *                         example: "2026-12-25"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Non authentifié
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const now = new Date();
    
    const snapshot = await db.collection('messages')
      .orderBy('createdAt', 'desc')
      .get();

    const messages = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Filtrer les messages secrets non déverrouillés
      if (data.isSecret && data.unlockDate) {
        const unlockDate = new Date(data.unlockDate);
        if (unlockDate > now) {
          messages.push({
            id: doc.id,
            title: data.title,
            isSecret: true,
            isLocked: true,
            unlockDate: data.unlockDate,
            createdAt: data.createdAt?.toDate().toISOString()
          });
          return;
        }
      }
      
      messages.push({ 
        id: doc.id, 
        ...data,
        isLocked: false,
        createdAt: data.createdAt?.toDate().toISOString()
      });
    });

    const result = paginate(messages, req.query);

    logger.info('Messages récupérés', { 
      count: result.pagination.total,
      page: result.pagination.page,
      ip: req.ip 
    });

    res.json(result);
  } catch (error) {
    logger.error('Erreur récupération messages', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Récupérer un message par ID
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du message
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Message trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 isSecret:
 *                   type: boolean
 *                 unlockDate:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       403:
 *         description: Message verrouillé
 *       404:
 *         description: Message non trouvé
 *       401:
 *         description: Non authentifié
 */
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection('messages').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Message non trouvé' 
      });
    }

    const data = doc.data();
    const now = new Date();
    
    // Vérifier si le message est verrouillé
    if (data.isSecret && data.unlockDate) {
      const unlockDate = new Date(data.unlockDate);
      if (unlockDate > now) {
        return res.status(403).json({ 
          error: 'Ce message est encore verrouillé',
          unlockDate: data.unlockDate
        });
      }
    }

    logger.info('Message récupéré', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      id: doc.id, 
      ...data,
      createdAt: data.createdAt?.toDate().toISOString()
    });
  } catch (error) {
    logger.error('Erreur récupération message', { 
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
 * /messages/{id}:
 *   put:
 *     summary: Modifier un message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du message
 *         example: "abc123xyz"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nouveau titre
 *                 example: "Titre modifié"
 *               content:
 *                 type: string
 *                 description: Nouveau contenu
 *                 example: "Contenu modifié"
 *               isSecret:
 *                 type: boolean
 *                 default: false
 *               unlockDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-25"
 *     responses:
 *       200:
 *         description: Message modifié avec succès
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
 *                   example: "Message modifié avec succès"
 *       404:
 *         description: Message non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 */
router.put('/:id', authenticateToken, validate(messageSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { title, content, isSecret, unlockDate } = req.body;
    
    const docRef = db.collection('messages').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Message non trouvé' 
      });
    }
    
    const updateData = {
      title,
      content,
      isSecret: isSecret || false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (isSecret && unlockDate) {
      updateData.unlockDate = unlockDate;
    } else {
      updateData.unlockDate = null;
    }
    
    await docRef.update(updateData);

    logger.info('Message modifié', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Message modifié avec succès'
    });
  } catch (error) {
    logger.error('Erreur modification message', { 
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
 * /messages/{id}:
 *   delete:
 *     summary: Supprimer un message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du message à supprimer
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Message supprimé avec succès
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
 *                   example: "Message supprimé avec succès"
 *       404:
 *         description: Message non trouvé
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const docRef = db.collection('messages').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Message non trouvé' 
      });
    }

    await docRef.delete();

    logger.info('Message supprimé', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    logger.error('Erreur suppression message', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      ip: req.ip 
    });
    next(error);
  }
});

export default router;