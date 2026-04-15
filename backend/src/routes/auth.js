import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import logger from '../utils/logger.js';
import { tokenBlacklist } from '../utils/tokenBlacklist.js';
import { getDb } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper : options de cookie
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    path: '/'
  };
};

// Helper : générer un JWT avec les infos utilisateur
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un nouveau compte
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - displayName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               displayName:
 *                 type: string
 *               pin:
 *                 type: string
 *                 description: Code PIN à 4 chiffres (optionnel, pour connexion rapide)
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *       400:
 *         description: Données invalides ou email déjà utilisé
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, displayName, pin } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'Email, mot de passe et pseudo sont requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit faire au moins 6 caractères' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    if (pin && (!/^\d{4}$/.test(pin))) {
      return res.status(400).json({ error: 'Le PIN doit être composé de 4 chiffres' });
    }

    const db = getDb();

    // Vérifier si l'email existe déjà
    const existingUser = await db.collection('users')
      .where('email', '==', email.toLowerCase())
      .get();
    
    if (!existingUser.empty) {
      return res.status(400).json({ error: 'Un compte avec cet email existe déjà' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Hasher le PIN si fourni
    const hashedPin = pin ? await bcrypt.hash(pin, 12) : null;

    const userData = {
      email: email.toLowerCase(),
      password: hashedPassword,
      pin: hashedPin,
      displayName,
      role: 'princess', // Par défaut, les nouveaux comptes sont "princess"
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    const docRef = await db.collection('users').add(userData);

    logger.info('Nouveau compte créé', { userId: docRef.id, email: email.toLowerCase() });

    // Auto-login après inscription
    const token = generateToken({ id: docRef.id, ...userData });
    res.cookie('princess_token', token, getCookieOptions());

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès ! Bienvenue 💖',
      user: {
        id: docRef.id,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role
      }
    });
  } catch (error) {
    logger.error('Erreur inscription', { error: error.message, ip: req.ip });
    next(error);
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter avec email/mot de passe ou PIN
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               pin:
 *                 type: string
 *                 description: Code PIN à 4 chiffres (alternative au mot de passe)
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, pin } = req.body;
    const db = getDb();

    // --- Mode PIN (connexion rapide) ---
    if (pin && !email) {
      if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({ error: 'Le PIN doit être composé de 4 chiffres' });
      }

      // Chercher tous les utilisateurs avec un PIN défini
      const usersSnapshot = await db.collection('users').get();
      let matchedUser = null;

      for (const doc of usersSnapshot.docs) {
        const userData = doc.data();
        if (userData.pin && await bcrypt.compare(pin, userData.pin)) {
          matchedUser = { id: doc.id, ...userData };
          break;
        }
      }

      if (!matchedUser) {
        logger.warn('Tentative de connexion PIN échouée', { ip: req.ip });
        return res.status(401).json({ error: 'Code PIN incorrect' });
      }

      // Mettre à jour lastLogin
      await db.collection('users').doc(matchedUser.id).update({
        lastLogin: new Date().toISOString()
      });

      const token = generateToken(matchedUser);
      res.cookie('princess_token', token, getCookieOptions());

      logger.info('Connexion PIN réussie', { userId: matchedUser.id, ip: req.ip });

      return res.json({
        success: true,
        message: 'Connexion réussie ! Bienvenue 💖',
        user: {
          id: matchedUser.id,
          email: matchedUser.email,
          displayName: matchedUser.displayName,
          role: matchedUser.role
        }
      });
    }

    // --- Mode Email + Mot de passe ---
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe sont requis' });
    }

    const usersSnapshot = await db.collection('users')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      logger.warn('Tentative de connexion email inconnu', { email: email.toLowerCase(), ip: req.ip });
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      logger.warn('Tentative de connexion mot de passe incorrect', { email: email.toLowerCase(), ip: req.ip });
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Mettre à jour lastLogin
    await db.collection('users').doc(userDoc.id).update({
      lastLogin: new Date().toISOString()
    });

    const token = generateToken({ id: userDoc.id, ...userData });
    res.cookie('princess_token', token, getCookieOptions());

    logger.info('Connexion email réussie', { userId: userDoc.id, ip: req.ip });

    res.json({
      success: true,
      message: 'Connexion réussie ! Bienvenue 💖',
      user: {
        id: userDoc.id,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role
      }
    });
  } catch (error) {
    logger.error('Erreur connexion', { error: error.message, ip: req.ip });
    next(error);
  }
});

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Vérifier la validité du token et récupérer les infos utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valide
 *       401:
 *         description: Token manquant, invalide ou révoqué
 */
router.get('/verify', async (req, res, next) => {
  try {
    const token = req.cookies.princess_token;

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    // Vérifier blacklist Firestore
    const isBlacklisted = await tokenBlacklist.has(token);
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token révoqué, veuillez vous reconnecter' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token invalide ou expiré' });
      }

      res.json({
        success: true,
        message: 'Token valide',
        expiresIn: decoded.exp - Math.floor(Date.now() / 1000),
        user: {
          userId: decoded.userId,
          email: decoded.email,
          displayName: decoded.displayName,
          role: decoded.role
        }
      });
    });
  } catch (error) {
    logger.error('Erreur vérification token', { error: error.message, ip: req.ip });
    next(error);
  }
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Non authentifié
 */
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const userDoc = await db.collection('users').doc(req.user.userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const userData = userDoc.data();

    res.json({
      id: userDoc.id,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      createdAt: userData.createdAt,
      lastLogin: userData.lastLogin
    });
  } catch (error) {
    logger.error('Erreur récupération profil', { error: error.message, ip: req.ip });
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
 *       401:
 *         description: Token manquant
 */
router.post('/logout', async (req, res, next) => {
  try {
    const token = req.cookies.princess_token;

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    // Décoder pour récupérer la date d'expiration
    try {
      const decoded = jwt.decode(token);
      const expiresAt = decoded?.exp 
        ? new Date(decoded.exp * 1000).toISOString() 
        : undefined;
      await tokenBlacklist.add(token, expiresAt);
    } catch {
      await tokenBlacklist.add(token);
    }

    logger.info('Déconnexion réussie', { ip: req.ip });

    res.clearCookie('princess_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    });

    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    logger.error('Erreur déconnexion', { error: error.message, ip: req.ip });
    next(error);
  }
});

export default router;