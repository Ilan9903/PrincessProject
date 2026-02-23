import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import { tokenBlacklist } from '../utils/tokenBlacklist.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Tentative d\'accès sans token', { ip: req.ip, path: req.path });
    return res.status(401).json({ error: 'Token d\'authentification manquant' });
  }

  // Vérifier si le token est dans la blacklist
  if (tokenBlacklist.has(token)) {
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