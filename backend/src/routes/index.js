import express from 'express';

// Importation des routes
import authRoutes from './auth.js';
import valentineRoutes from './valentine.js';
import messagesRoutes from './messages.js';
import planningRoutes from './planning.js';
import couponsRoutes from './coupons.js';
import quizRoutes from './quiz.js';
import playlistRoutes from './playlist.js';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Vérifier l'état du serveur
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Serveur opérationnel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-02-23T12:00:00.000Z"
 *                 uptime:
 *                   type: number
 *                   description: Temps d'activité en secondes
 *                   example: 3600
 *                 modules:
 *                   type: object
 *                   properties:
 *                     auth:
 *                       type: boolean
 *                       example: true
 *                     valentine:
 *                       type: boolean
 *                       example: true
 *                     messages:
 *                       type: boolean
 *                       example: true
 *                     planning:
 *                       type: boolean
 *                       example: true
 *                     coupons:
 *                       type: boolean
 *                       example: true
 *                     quiz:
 *                       type: boolean
 *                       example: true
 *                     playlist:
 *                       type: boolean
 *                       example: true
 */
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    modules: {
      auth: true,
      valentine: true,
      messages: true,
      planning: true,
      coupons: true,
      quiz: true,
      playlist: true
    }
  });
});

// Routes principales
router.use('/auth', authRoutes);
router.use('/valentine', valentineRoutes);
router.use('/messages', messagesRoutes);
router.use('/planning', planningRoutes);
router.use('/coupons', couponsRoutes);
router.use('/quiz', quizRoutes);
router.use('/playlist', playlistRoutes);

export default router;