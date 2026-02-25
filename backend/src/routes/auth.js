import express from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import { tokenBlacklist } from '../utils/tokenBlacklist.js';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter avec le mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "2106"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Mot de passe incorrect
 */
router.post('/login', async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ 
        error: 'Le mot de passe est requis' 
      });
    }

    if (password !== process.env.APP_PASSWORD) {
      logger.warn('Tentative de connexion échouée', { 
        ip: req.ip 
      });
      return res.status(401).json({ 
        error: 'Mot de passe incorrect' 
      });
    }

    const token = jwt.sign(
      { 
        timestamp: Date.now(),
        ip: req.ip 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info('Connexion réussie', { 
      ip: req.ip 
    });

    // Envoyer le token dans un cookie HttpOnly
    const isProduction = process.env.NODE_ENV === 'production';
    
    const cookieOptions = {
      httpOnly: true, // Inaccessible depuis JavaScript
      secure: isProduction, // HTTPS obligatoire en production
      sameSite: isProduction ? 'none' : 'lax', // 'none' requis pour cross-domain
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      path: '/'
    };
    
    res.cookie('princess_token', token, cookieOptions);

    // Logs détaillés pour debug production
    console.log('🍪 LOGIN - Configuration:', {
      NODE_ENV: process.env.NODE_ENV,
      isProduction,
      cookieOptions,
      tokenLength: token.length,
      origin: req.headers.origin || 'no-origin',
      host: req.headers.host
    });

    res.json({
      success: true,
      message: 'Connexion réussie ! Bienvenue 💖'
    });
  } catch (error) {
    logger.error('Erreur lors de la connexion', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Vérifier la validité du token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valide
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
 *                   example: "Token valide"
 *                 expiresIn:
 *                   type: number
 *                   description: Temps restant avant expiration (en secondes)
 *                   example: 604800
 *       401:
 *         description: Token manquant, invalide ou révoqué
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token invalide ou expiré"
 */
router.get('/verify', async (req, res, next) => {
  try {
    const token = req.cookies.princess_token;

    // Logs détaillés pour debug production
    console.log('🔍 VERIFY - Debug:', {
      NODE_ENV: process.env.NODE_ENV,
      hasCookies: Object.keys(req.cookies).length > 0,
      cookieNames: Object.keys(req.cookies),
      hasToken: !!token,
      origin: req.headers.origin || 'no-origin',
      host: req.headers.host,
      userAgent: req.headers['user-agent']?.substring(0, 50) || 'unknown'
    });

    if (!token) {
      console.log('❌ VERIFY - Token manquant');
      return res.status(401).json({ 
        error: 'Token manquant',
        debug: {
          NODE_ENV: process.env.NODE_ENV,
          hasCookies: Object.keys(req.cookies).length > 0,
          cookieNames: Object.keys(req.cookies)
        }
      });
    }

    // Vérifier si le token est dans la blacklist
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ 
        error: 'Token révoqué, veuillez vous reconnecter' 
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ 
          error: 'Token invalide ou expiré' 
        });
      }

      res.json({
        success: true,
        message: 'Token valide',
        expiresIn: decoded.exp - Math.floor(Date.now() / 1000)
      });
    });
  } catch (error) {
    logger.error('Erreur vérification token', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Se déconnecter et invalider le token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
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
 *                   example: "Déconnexion réussie"
 *       401:
 *         description: Token manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token manquant"
 */
router.post('/logout', async (req, res, next) => {
  try {
    const token = req.cookies.princess_token;

    if (!token) {
      return res.status(401).json({ 
        error: 'Token manquant' 
      });
    }

    tokenBlacklist.add(token);

    logger.info('Déconnexion réussie', { 
      ip: req.ip 
    });

    // Supprimer le cookie avec les MÊMES options que lors de la création
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('princess_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/'
    });

    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    logger.error('Erreur lors de la déconnexion', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

export default router;