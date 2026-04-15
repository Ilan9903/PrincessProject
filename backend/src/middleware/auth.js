import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import { tokenBlacklist } from '../utils/tokenBlacklist.js';

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.princess_token;

  if (!token) {
    logger.warn('Tentative d\'accès sans token', { ip: req.ip, path: req.path });
    return res.status(401).json({ error: 'Token d\'authentification manquant' });
  }

  // Vérifier si le token est dans la blacklist (maintenant async avec Firestore)
  const isBlacklisted = await tokenBlacklist.has(token);
  if (isBlacklisted) {
    logger.warn('Tentative d\'utilisation d\'un token révoqué', { ip: req.ip });
    return res.status(401).json({ error: 'Token révoqué, veuillez vous reconnecter' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Token invalide ou expiré', { ip: req.ip, error: err.message });
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
    
    req.user = user;
    next();
  });
};

/**
 * Middleware de vérification de rôle
 * @param  {...string} roles - Rôles autorisés ('prince', 'princess')
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Accès refusé : rôle manquant' });
    }
    
    if (!roles.includes(req.user.role)) {
      logger.warn('Accès refusé par rôle', { 
        userId: req.user.userId,
        role: req.user.role, 
        requiredRoles: roles,
        path: req.path 
      });
      return res.status(403).json({ error: 'Accès refusé : droits insuffisants' });
    }
    
    next();
  };
};