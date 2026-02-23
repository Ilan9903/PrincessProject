import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 2106;

// ⚙️ Configuration pour les proxies (Railway, Heroku, etc.)
app.set('trust proxy', 1);

// 🔍 DEBUG : Vérifier les variables d'environnement au démarrage
console.log('✅ .env chargé');
console.log('🔐 APP_PASSWORD:', process.env.APP_PASSWORD ? '✓ Défini' : '✗ Manquant');
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? '✓ Défini' : '✗ Manquant');
console.log('🔥 FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✓ Défini' : '✗ Manquant');
console.log('🌐 FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:1308');

// Middlewares de sécurité
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:1308',
  credentials: true
};
app.use(cors(corsOptions));
console.log('✅ CORS configuré pour:', corsOptions.origin);

// Rate limiting : 100 requêtes par 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes par IP
  message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  trustProxy: true, // Important pour Railway/Heroku
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging des requêtes (seulement en développement)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`, {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip
      });
    });
    next();
  });
}

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Princess Project API',
  customfavIcon: '/favicon.ico'
}));

// Endpoint pour le JSON OpenAPI
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Route de base (redirection vers la doc)
app.get('/', (req, res) => {
  res.json({
    message: 'Princess Project API 💖',
    version: '2.0.0',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      valentine: '/api/valentine',
      messages: '/api/messages',
      planning: '/api/planning',
      coupons: '/api/coupons',
      quiz: '/api/quiz',
      playlist: '/api/playlist'
    }
  });
});

// Routes principales
app.use('/api', routes);

// Middleware 404 - Route non trouvée
app.use((req, res) => {
  logger.warn('Route non trouvée', { 
    url: req.originalUrl,
    method: req.method,
    ip: req.ip 
  });
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.originalUrl,
    availableEndpoints: [
      '/api/health',
      '/api/auth/login',
      '/api/valentine',
      '/api/messages',
      '/api/planning',
      '/api/coupons',
      '/api/quiz',
      '/api/playlist'
    ]
  });
});

// Middleware de gestion des erreurs (doit être en dernier)
app.use(errorHandler);

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { 
    reason: reason,
    promise: promise 
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { 
    error: error.message,
    stack: error.stack 
  });
  process.exit(1);
});

// Démarrage du serveur
const server = app.listen(PORT, () => {
  logger.info('🚀 Serveur démarré', {
    port: PORT,
    env: process.env.NODE_ENV || 'development',
    documentation: `http://localhost:${PORT}/api-docs`
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 PRINCESS PROJECT API - SERVEUR DÉMARRÉ 💖');
  console.log('='.repeat(60));
  console.log(`✅ Serveur actif       : http://localhost:${PORT}`);
  console.log(`📚 Documentation       : http://localhost:${PORT}/api-docs`);
  console.log(`📊 Health Check        : http://localhost:${PORT}/api/health`);
  console.log(`🔐 Environnement       : ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Démarré à           : ${new Date().toLocaleString('fr-FR')}`);
  console.log('='.repeat(60) + '\n');
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu, arrêt du serveur');
  server.close(() => {
    logger.info('Serveur arrêté');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT reçu (Ctrl+C), arrêt du serveur');
  server.close(() => {
    logger.info('Serveur arrêté');
    process.exit(0);
  });
});

export default app;