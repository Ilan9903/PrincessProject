import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Princess Project API',
      version: '2.0.0',
      description: `
        API complète pour le Princess Project 💖
        
        ## Fonctionnalités
        - 🔐 Authentification JWT sécurisée
        - 💕 Gestion des moments Valentine
        - 💌 Messages secrets avec déverrouillage
        - 📅 Planning de rendez-vous
        - 🎫 Coupons d'amour échangeables
        - 🎮 Quiz interactif sur le couple
        - 🎵 Playlist musicale collaborative
        
        ## Sécurité
        - Rate limiting : 100 requêtes / 15 minutes
        - CORS configuré
        - Headers sécurisés (Helmet)
        - Validation des données (Joi)
        
        ## Authentification
        Toutes les routes (sauf /health et /auth/login) nécessitent un token JWT.
        
        **Pour obtenir un token :**
        1. POST /api/auth/login avec le mot de passe
        2. Copier le token reçu
        3. Utiliser "Authorize" en haut à droite
        4. Entrer : Bearer VOTRE_TOKEN
      `,
      contact: {
        name: 'Support API',
        email: 'support@princess-project.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:2106/api',
        description: 'Serveur de développement'
      },
      {
        url: 'https://api.princess-project.com/api',
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT (sans "Bearer")'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Message d\'erreur'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            id: {
              type: 'string',
              description: 'ID de la ressource créée'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'État du serveur'
      },
      {
        name: 'Auth',
        description: 'Authentification et gestion des sessions'
      },
      {
        name: 'Valentine',
        description: 'Moments Valentine spéciaux'
      },
      {
        name: 'Messages',
        description: 'Messages secrets avec déverrouillage'
      },
      {
        name: 'Planning',
        description: 'Gestion des rendez-vous et événements'
      },
      {
        name: 'Coupons',
        description: 'Coupons d\'amour échangeables'
      },
      {
        name: 'Quiz',
        description: 'Quiz interactif sur le couple'
      },
      {
        name: 'Playlist',
        description: 'Playlist musicale collaborative'
      }
    ]
  },
  apis: ['./src/routes/*.js'] // Chemins vers les fichiers contenant les annotations
};

export default swaggerJsdoc(options);