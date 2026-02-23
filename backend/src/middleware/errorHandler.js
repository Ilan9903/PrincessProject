import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  // Logger l'erreur
  logger.error('Erreur capturée', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Erreurs de validation Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation échouée',
      details: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // Erreurs Firebase
  if (err.code && typeof err.code === 'string' && err.code.startsWith('auth/')) {
    return res.status(401).json({
      error: 'Erreur d\'authentification Firebase',
      message: err.message
    });
  }

  // Erreur générique JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expiré'
    });
  }

  // Erreur MongoDB/Firestore
  if (err.code === 5 || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      error: 'Service indisponible',
      message: 'Impossible de se connecter à la base de données'
    });
  }

  // Erreur générique 500
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;