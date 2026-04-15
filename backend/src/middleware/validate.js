import Joi from 'joi';
import logger from '../utils/logger.js';

// ============================================
// SCHEMAS EXISTANTS
// ============================================

export const valentineSchema = Joi.object({
  date: Joi.date().iso().required().messages({
    'date.base': 'La date doit être valide',
    'date.format': 'Format de date invalide (ISO 8601 requis)',
    'any.required': 'La date est requise'
  }),
  description: Joi.string().min(1).max(500).required().messages({
    'string.empty': 'La description ne peut pas être vide',
    'string.max': 'La description ne peut pas dépasser 500 caractères',
    'any.required': 'La description est requise'
  })
});

export const loginSchema = Joi.object({
  password: Joi.string().required().messages({
    'string.empty': 'Le mot de passe est requis',
    'any.required': 'Le mot de passe est requis'
  })
});

// ============================================
// NOUVEAUX SCHEMAS
// ============================================

// 💌 Messages
export const messageSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Le titre est requis',
    'string.max': 'Le titre ne peut pas dépasser 100 caractères'
  }),
  content: Joi.string().min(1).max(2000).required().messages({
    'string.empty': 'Le contenu est requis',
    'string.max': 'Le contenu ne peut pas dépasser 2000 caractères'
  }),
  unlockDate: Joi.date().iso().optional().messages({
    'date.format': 'Format de date invalide'
  }),
  isSecret: Joi.boolean().default(false)
});

// 📅 Planning
export const planningSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional().allow(''),
  date: Joi.date().iso().required(),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().messages({
    'string.pattern.base': 'Format de temps invalide (HH:MM requis)'
  }),
  location: Joi.string().max(200).optional().allow(''),
  type: Joi.string().valid('date', 'anniversary', 'surprise', 'other').default('date'),
  reminder: Joi.boolean().default(false)
});

// 🎫 Coupons
export const couponSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional().allow(''),
  type: Joi.string().valid('massage', 'dinner', 'movie', 'surprise', 'custom').required(),
  expiryDate: Joi.date().iso().optional(),
  conditions: Joi.string().max(300).optional().allow('')
});

// 🎮 Quiz
export const quizQuestionSchema = Joi.object({
  question: Joi.string().min(5).max(300).required(),
  options: Joi.array().items(Joi.string().max(100)).min(2).max(6).required(),
  correctAnswer: Joi.number().integer().min(0).required(),
  category: Joi.string().valid('memories', 'favorites', 'personality', 'future', 'fun').default('fun'),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium')
});

export const quizAnswerSchema = Joi.object({
  questionId: Joi.string().required(),
  selectedAnswer: Joi.number().integer().min(0).required()
});

// 🎵 Playlist
export const playlistSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  artist: Joi.string().max(100).optional().allow(''),
  url: Joi.string().uri().optional().allow(''),
  platform: Joi.string().valid('spotify', 'youtube', 'apple_music', 'other').default('other'),
  reason: Joi.string().max(500).optional().allow(''),
  dateAdded: Joi.date().iso().optional()
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