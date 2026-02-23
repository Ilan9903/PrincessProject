import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import Joi from 'joi';
import { getDb } from '../config/firebase.js';
import admin from '../config/firebase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Schéma de validation pour créer/modifier un coupon
const couponSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Le titre est requis',
    'any.required': 'Le titre est requis'
  }),
  description: Joi.string().allow('').optional(),
  type: Joi.string().valid('massage', 'restaurant', 'cinema', 'experience', 'other').default('experience'),
  expiryDate: Joi.string().isoDate().optional().allow(null, '')
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       required:
 *         - title
 *         - type
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *           enum: [massage, restaurant, cinema, experience, other]
 *         status:
 *           type: string
 *           enum: [available, redeemed, expired]
 *         expiryDate:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         redeemedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Créer un nouveau coupon
 *     tags: [Coupons]
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Massage relaxant"
 *               description:
 *                 type: string
 *                 example: "1h de massage aux huiles essentielles"
 *               type:
 *                 type: string
 *                 enum: [massage, restaurant, cinema, experience, other]
 *                 default: experience
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *     responses:
 *       201:
 *         description: Coupon créé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', authenticateToken, validate(couponSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { title, description, type, expiryDate } = req.body;
    
    const couponData = {
      title,
      description: description || '',
      type: type || 'experience',
      status: 'available',
      expiryDate: expiryDate || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      redeemedAt: null
    };
    
    const docRef = await db.collection('coupons').add(couponData);

    logger.info('Coupon créé', { 
      id: docRef.id,
      title,
      type,
      ip: req.ip 
    });

    res.status(201).json({ 
      success: true,
      id: docRef.id,
      message: 'Coupon créé avec succès'
    });
  } catch (error) {
    logger.error('Erreur création coupon', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Récupérer tous les coupons
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, redeemed, expired]
 *         description: Filtrer par statut
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [massage, restaurant, cinema, experience, other]
 *         description: Filtrer par type
 *     responses:
 *       200:
 *         description: Liste des coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Non authentifié
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const { status, type } = req.query;
    
    const snapshot = await db.collection('coupons').orderBy('createdAt', 'desc').get();

    const coupons = [];
    const now = new Date();

    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Vérifier si le coupon est expiré
      const isExpired = data.expirationDate && new Date(data.expirationDate) < now;
      
      // Filtrer sur isRedeemed si demandé via status
      if (status === 'redeemed' && !data.isRedeemed) return;
      if (status === 'available' && (data.isRedeemed || isExpired)) return;
      if (status === 'expired' && !isExpired) return;
      
      // Filtrer par type si demandé
      if (type && data.type !== type) return;
      
      coupons.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        redeemedAt: data.redeemedAt?.toDate().toISOString()
      });
    });

    logger.info('Coupons récupérés', { 
      count: coupons.length,
      filters: { status, type },
      ip: req.ip 
    });

    res.json({ coupons });
  } catch (error) {
    logger.error('Erreur récupération coupons', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /coupons/{id}:
 *   get:
 *     summary: Récupérer un coupon par ID
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du coupon
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Détails du coupon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       404:
 *         description: Coupon non trouvé
 *       401:
 *         description: Non authentifié
 */
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection('coupons').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Coupon non trouvé' 
      });
    }

    const data = doc.data();
    
    // Vérifier si expiré
    let currentStatus = data.status;
    if (data.expiryDate && new Date(data.expiryDate) < new Date() && data.status === 'available') {
      currentStatus = 'expired';
    }

    logger.info('Coupon récupéré', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      id: doc.id, 
      ...data,
      status: currentStatus,
      createdAt: data.createdAt?.toDate().toISOString(),
      redeemedAt: data.redeemedAt?.toDate().toISOString()
    });
  } catch (error) {
    logger.error('Erreur récupération coupon', { 
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
 * /coupons/{id}:
 *   put:
 *     summary: Modifier un coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du coupon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [massage, restaurant, cinema, experience, other]
 *               expiryDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Coupon modifié
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Coupon non trouvé
 *       401:
 *         description: Non authentifié
 */
router.put('/:id', authenticateToken, validate(couponSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { title, description, type, expiryDate } = req.body;
    
    // Vérifier que le coupon existe
    const docRef = db.collection('coupons').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Coupon non trouvé' 
      });
    }
    
    // Créer l'objet de mise à jour
    const updateData = {
      title,
      type: type || 'experience',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Ajouter les champs optionnels
    if (description !== undefined) updateData.description = description;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate;
    
    await docRef.update(updateData);

    logger.info('Coupon modifié', { 
      id: req.params.id,
      title,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Coupon modifié avec succès'
    });
  } catch (error) {
    logger.error('Erreur modification coupon', { 
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
 * /coupons/{id}/redeem:
 *   patch:
 *     summary: Utiliser un coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du coupon
 *     responses:
 *       200:
 *         description: Coupon utilisé
 *       400:
 *         description: Coupon déjà utilisé ou expiré
 *       404:
 *         description: Coupon non trouvé
 *       401:
 *         description: Non authentifié
 */
router.patch('/:id/redeem', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const docRef = db.collection('coupons').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Coupon non trouvé' 
      });
    }

    const couponData = doc.data();

    // Vérifier si déjà utilisé
    if (couponData.isRedeemed) {
      return res.status(400).json({ 
        error: 'Ce coupon a déjà été utilisé',
        redeemedAt: couponData.redeemedAt?.toDate().toISOString()
      });
    }

    // Vérifier si expiré
    if (couponData.expirationDate && new Date(couponData.expirationDate) < new Date()) {
      return res.status(400).json({ 
        error: 'Ce coupon est expiré',
        expirationDate: couponData.expirationDate
      });
    }

    // Marquer comme utilisé
    await docRef.update({
      isRedeemed: true,
      redeemedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    logger.info('Coupon utilisé', { 
      id: req.params.id,
      title: couponData.title,
      ip: req.ip 
    });

    // Récupérer le coupon mis à jour
    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();

    res.json({ 
      success: true,
      message: 'Coupon utilisé avec succès ! Profitez-en bien 💖',
      coupon: {
        id: updatedDoc.id,
        ...updatedData,
        createdAt: updatedData.createdAt?.toDate().toISOString(),
        redeemedAt: updatedData.redeemedAt?.toDate().toISOString()
      }
    });
  } catch (error) {
    logger.error('Erreur utilisation coupon', { 
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
 * /coupons/{id}/reset:
 *   patch:
 *     summary: Réinitialiser un coupon (le rendre disponible à nouveau)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du coupon
 *     responses:
 *       200:
 *         description: Coupon réinitialisé
 *       404:
 *         description: Coupon non trouvé
 *       401:
 *         description: Non authentifié
 */
router.patch('/:id/reset', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const docRef = db.collection('coupons').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Coupon non trouvé' 
      });
    }

    // Réinitialiser le coupon
    await docRef.update({
      status: 'available',
      redeemedAt: null
    });

    logger.info('Coupon réinitialisé', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Coupon réinitialisé avec succès'
    });
  } catch (error) {
    logger.error('Erreur réinitialisation coupon', { 
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
 * /coupons/{id}:
 *   delete:
 *     summary: Supprimer un coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du coupon
 *     responses:
 *       200:
 *         description: Coupon supprimé
 *       404:
 *         description: Coupon non trouvé
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const docRef = db.collection('coupons').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Coupon non trouvé' 
      });
    }

    await docRef.delete();

    logger.info('Coupon supprimé', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Coupon supprimé avec succès'
    });
  } catch (error) {
    logger.error('Erreur suppression coupon', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      ip: req.ip 
    });
    next(error);
  }
});

export default router;