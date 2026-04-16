import Joi from 'joi';
import logger from '../utils/logger.js';

// ============================================
// SCHEMAS DE VALIDATION CENTRALISÉS
// ============================================

// 🌹 Valentine
export const valentineSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Le titre est requis',
    'string.max': 'Le titre ne peut pas dépasser 100 caractères',
    'any.required': 'Le titre est requis'
  }),
  description: Joi.string().min(1).max(500).required().messages({
    'string.empty': 'La description ne peut pas être vide',
    'string.max': 'La description ne peut pas dépasser 500 caractères',
    'any.required': 'La description est requise'
  }),
  date: Joi.string().isoDate().required().messages({
    'string.empty': 'La date est requise',
    'string.isoDate': 'Format de date invalide (YYYY-MM-DD)',
    'any.required': 'La date est requise'
  }),
  imageUrl: Joi.string().uri().allow('').optional()
});

// 💌 Messages
export const messageSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Le titre est requis',
    'string.max': 'Le titre ne peut pas dépasser 100 caractères',
    'any.required': 'Le titre est requis'
  }),
  content: Joi.string().min(1).max(2000).required().messages({
    'string.empty': 'Le contenu est requis',
    'string.max': 'Le contenu ne peut pas dépasser 2000 caractères',
    'any.required': 'Le contenu est requis'
  }),
  isSecret: Joi.boolean().default(false),
  unlockDate: Joi.string().isoDate().optional().allow(null, '')
});

// 🎫 Coupons
export const couponSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Le titre est requis',
    'string.max': 'Le titre ne peut pas dépasser 100 caractères',
    'any.required': 'Le titre est requis'
  }),
  description: Joi.string().max(500).allow('').optional(),
  type: Joi.string().valid('massage', 'restaurant', 'cinema', 'experience', 'other').default('experience'),
  expirationDate: Joi.string().isoDate().optional().allow(null, '')
});

// 📅 Planning
export const planningSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Le titre est requis',
    'string.max': 'Le titre ne peut pas dépasser 100 caractères',
    'any.required': 'Le titre est requis'
  }),
  description: Joi.string().max(500).allow('').optional(),
  date: Joi.string().isoDate().required().messages({
    'string.empty': 'La date est requise',
    'string.isoDate': 'Format de date invalide (YYYY-MM-DD)',
    'any.required': 'La date est requise'
  }),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).allow('').optional().messages({
    'string.pattern.base': 'Format de temps invalide (HH:MM requis)'
  }),
  location: Joi.string().max(200).allow('').optional(),
  type: Joi.string().valid('date', 'activity', 'reminder', 'special', 'other').default('other'),
  status: Joi.string().valid('planned', 'confirmed', 'completed', 'cancelled').default('planned')
});

// 🎮 Quiz - Question
export const quizSchema = Joi.object({
  question: Joi.string().min(5).max(300).required().messages({
    'string.empty': 'La question est requise',
    'string.min': 'La question doit faire au moins 5 caractères',
    'string.max': 'La question ne peut pas dépasser 300 caractères',
    'any.required': 'La question est requise'
  }),
  options: Joi.array().items(Joi.string().max(100)).min(2).max(6).required().messages({
    'array.min': 'Au moins 2 options sont requises',
    'array.max': 'Maximum 6 options',
    'any.required': 'Les options sont requises'
  }),
  correctAnswer: Joi.string().required().messages({
    'string.empty': 'La réponse correcte est requise',
    'any.required': 'La réponse correcte est requise'
  }),
  category: Joi.string().valid('favorites', 'memories', 'fun', 'romantic', 'other').default('fun'),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium')
});

// 🎮 Quiz - Réponse
export const answerSchema = Joi.object({
  questionId: Joi.string().required().messages({
    'string.empty': 'L\'ID de la question est requis',
    'any.required': 'L\'ID de la question est requis'
  }),
  selectedAnswer: Joi.string().required().messages({
    'string.empty': 'La réponse sélectionnée est requise',
    'any.required': 'La réponse sélectionnée est requise'
  })
});

// 🎵 Playlist
export const playlistSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Le titre est requis',
    'string.max': 'Le titre ne peut pas dépasser 100 caractères',
    'any.required': 'Le titre est requis'
  }),
  artist: Joi.string().max(100).required().messages({
    'string.empty': 'L\'artiste est requis',
    'string.max': 'L\'artiste ne peut pas dépasser 100 caractères',
    'any.required': 'L\'artiste est requis'
  }),
  album: Joi.string().max(100).allow('').optional(),
  platform: Joi.string().valid('spotify', 'youtube', 'apple_music', 'other').default('spotify'),
  url: Joi.string().uri().allow('').optional(),
  addedBy: Joi.string().valid('me', 'princess', 'both').default('me'),
  reason: Joi.string().max(500).allow('').optional()
});

// ============================================
// MIDDLEWARE DE VALIDATION
// ============================================

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validation échouée', { 
        ip: req.ip, 
        path: req.path, 
        errors 
      });

      return res.status(400).json({ 
        error: 'Validation échouée', 
        details: errors 
      });
    }

    req.body = value;
    next();
  };
};