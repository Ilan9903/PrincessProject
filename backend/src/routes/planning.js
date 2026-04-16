import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate, planningSchema } from '../middleware/validate.js';
import { getDb } from '../config/firebase.js';
import admin from '../config/firebase.js';
import logger from '../utils/logger.js';
import { paginate } from '../utils/paginate.js';

const router = express.Router();

/**
 * @swagger
 * /planning:
 *   post:
 *     summary: Créer un nouvel événement
 *     tags: [Planning]
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
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Dîner romantique"
 *               description:
 *                 type: string
 *                 example: "Un dîner aux chandelles"
 *               date:
 *                 type: string
 *                 example: "2026-03-15"
 *               time:
 *                 type: string
 *                 example: "19:30"
 *               location:
 *                 type: string
 *                 example: "Restaurant Le Romantique"
 *               type:
 *                 type: string
 *                 enum: [date, activity, reminder, special, other]
 *                 default: other
 *               status:
 *                 type: string
 *                 enum: [planned, confirmed, completed, cancelled]
 *                 default: planned
 *     responses:
 *       201:
 *         description: Événement créé avec succès
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
 *                 message:
 *                   type: string
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', authenticateToken, validate(planningSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { title, description, date, time, location, type, status } = req.body;
    
    const eventData = {
      title,
      description: description || '',
      date,
      time: time || '',
      location: location || '',
      type: type || 'other',
      status: status || 'planned',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('planning').add(eventData);

    logger.info('Événement créé', { 
      id: docRef.id,
      title,
      date,
      type,
      ip: req.ip 
    });

    res.status(201).json({ 
      success: true,
      id: docRef.id,
      message: 'Événement créé avec succès'
    });
  } catch (error) {
    logger.error('Erreur création événement', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /planning:
 *   get:
 *     summary: Récupérer tous les événements
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planned, confirmed, completed, cancelled]
 *         description: Filtrer par statut
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [date, activity, reminder, special, other]
 *         description: Filtrer par type
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: boolean
 *         description: Afficher uniquement les événements à venir
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
 *         description: Liste paginée des événements
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
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       date:
 *                         type: string
 *                       time:
 *                         type: string
 *                       location:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [date, activity, reminder, special, other]
 *                       status:
 *                         type: string
 *                         enum: [planned, confirmed, completed, cancelled]
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
    const { status, type, upcoming } = req.query;
    
    let query = db.collection('planning').orderBy('date', 'asc');
    
    if (status) query = query.where('status', '==', status);
    if (type) query = query.where('type', '==', type);
    
    const snapshot = await query.get();
    
    const events = [];
    const now = new Date().toISOString().split('T')[0];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // upcoming reste filtré en JS (comparaison de date string)
      if (upcoming === 'true' && data.date < now) return;
      
      events.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate().toISOString()
      });
    });

    const result = paginate(events, req.query);

    logger.info('Événements récupérés', { 
      count: result.pagination.total,
      page: result.pagination.page,
      filters: { status, type, upcoming },
      ip: req.ip 
    });

    res.json(result);
  } catch (error) {
    logger.error('Erreur récupération événements', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /planning/{id}:
 *   get:
 *     summary: Récupérer un événement par ID
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Événement trouvé
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
 *                 time:
 *                   type: string
 *                 location:
 *                   type: string
 *                 type:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Événement non trouvé
 *       401:
 *         description: Non authentifié
 */
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection('planning').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Événement non trouvé' 
      });
    }

    const data = doc.data();

    logger.info('Événement récupéré', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      id: doc.id, 
      ...data,
      createdAt: data.createdAt?.toDate().toISOString()
    });
  } catch (error) {
    logger.error('Erreur récupération événement', { 
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
 * /planning/{id}:
 *   put:
 *     summary: Modifier un événement
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement
 *         example: "abc123xyz"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Dîner modifié"
 *               description:
 *                 type: string
 *                 example: "Description modifiée"
 *               date:
 *                 type: string
 *                 example: "2026-03-20"
 *               time:
 *                 type: string
 *                 example: "20:00"
 *               location:
 *                 type: string
 *                 example: "Nouveau lieu"
 *               type:
 *                 type: string
 *                 enum: [date, activity, reminder, special, other]
 *               status:
 *                 type: string
 *                 enum: [planned, confirmed, completed, cancelled]
 *     responses:
 *       200:
 *         description: Événement modifié
 *       404:
 *         description: Événement non trouvé
 *       401:
 *         description: Non authentifié
 */
router.put('/:id', authenticateToken, validate(planningSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { title, description, date, time, location, type, status } = req.body;
    
    const docRef = db.collection('planning').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Événement non trouvé' 
      });
    }
    
    const updateData = {
      title,
      date,
      status: status || 'planned',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (description !== undefined) updateData.description = description;
    if (time !== undefined) updateData.time = time;
    if (location !== undefined) updateData.location = location;
    if (type !== undefined) updateData.type = type;
    
    await docRef.update(updateData);

    logger.info('Événement modifié', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Événement modifié avec succès'
    });
  } catch (error) {
    logger.error('Erreur modification événement', { 
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
 * /planning/{id}:
 *   delete:
 *     summary: Supprimer un événement
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement à supprimer
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Événement supprimé avec succès
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
 *                   example: "Événement supprimé avec succès"
 *       404:
 *         description: Événement non trouvé
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const docRef = db.collection('planning').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Événement non trouvé' 
      });
    }

    await docRef.delete();

    logger.info('Événement supprimé', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Événement supprimé avec succès'
    });
  } catch (error) {
    logger.error('Erreur suppression événement', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      ip: req.ip 
    });
    next(error);
  }
});

export default router;