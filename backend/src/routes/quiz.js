import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import Joi from 'joi';
import { getDb } from '../config/firebase.js';
import admin from '../config/firebase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Schéma de validation pour créer/modifier une question
const quizSchema = Joi.object({
  question: Joi.string().required().messages({
    'string.empty': 'La question est requise',
    'any.required': 'La question est requise'
  }),
  options: Joi.array().items(Joi.string()).min(2).max(6).required().messages({
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

// Schéma pour répondre à une question
const answerSchema = Joi.object({
  questionId: Joi.string().required().messages({
    'string.empty': 'L\'ID de la question est requis',
    'any.required': 'L\'ID de la question est requis'
  }),
  selectedAnswer: Joi.string().required().messages({
    'string.empty': 'La réponse sélectionnée est requise',
    'any.required': 'La réponse sélectionnée est requise'
  })
});

/**
 * @swagger
 * /quiz/questions:
 *   post:
 *     summary: Créer une nouvelle question
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - options
 *               - correctAnswer
 *             properties:
 *               question:
 *                 type: string
 *                 example: "Quelle est notre chanson préférée ?"
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Chanson A", "Chanson B", "Chanson C", "Chanson D"]
 *               correctAnswer:
 *                 type: string
 *                 example: "Chanson B"
 *               category:
 *                 type: string
 *                 enum: [fun, serious, memories, favorites, other]
 *                 default: fun
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 default: medium
 *     responses:
 *       201:
 *         description: Question créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/questions', authenticateToken, validate(quizSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { question, options, correctAnswer, category, difficulty } = req.body;
    
    const questionData = {
      question,
      options,
      correctAnswer,
      category: category || 'fun',
      difficulty: difficulty || 'medium',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('quiz_questions').add(questionData);

    logger.info('Question créée', { 
      id: docRef.id,
      category,
      difficulty,
      ip: req.ip 
    });

    res.status(201).json({ 
      success: true,
      id: docRef.id,
      message: 'Question créée avec succès'
    });
  } catch (error) {
    logger.error('Erreur création question', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /quiz/questions:
 *   get:
 *     summary: Récupérer toutes les questions (sans les réponses correctes)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [fun, serious, memories, favorites, other]
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Filtrer par difficulté
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre maximum de questions
 *     responses:
 *       200:
 *         description: Liste des questions (sans réponses correctes)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   question:
 *                     type: string
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 *                   category:
 *                     type: string
 *                   difficulty:
 *                     type: string
 *       401:
 *         description: Non authentifié
 */
router.get('/questions', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const { category, difficulty, limit } = req.query;
    
    let snapshot;
    if (limit) {
      snapshot = await db.collection('quiz_questions')
        .orderBy('createdAt', 'desc')
        .limit(parseInt(limit))
        .get();
    } else {
      snapshot = await db.collection('quiz_questions')
        .orderBy('createdAt', 'desc')
        .get();
    }

    const questions = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Filtrer côté serveur
      if (category && data.category !== category) return;
      if (difficulty && data.difficulty !== difficulty) return;
      
      questions.push({ 
        id: doc.id, 
        question: data.question,
        options: data.options,
        category: data.category,
        difficulty: data.difficulty,
        createdAt: data.createdAt?.toDate().toISOString()
      });
    });

    logger.info('Questions récupérées', { 
      count: questions.length,
      filters: { category, difficulty, limit },
      ip: req.ip 
    });

    res.json(questions);
  } catch (error) {
    logger.error('Erreur récupération questions', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /quiz/questions/random:
 *   get:
 *     summary: Récupérer des questions aléatoires
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de questions à retourner
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [fun, serious, memories, favorites, other]
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Filtrer par difficulté
 *     responses:
 *       200:
 *         description: Questions aléatoires (sans réponses correctes)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Non authentifié
 */
router.get('/questions/random', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const { count = 10, category, difficulty } = req.query;
    
    const snapshot = await db.collection('quiz_questions').get();
    
    const allQuestions = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Filtrer côté serveur
      if (category && data.category !== category) return;
      if (difficulty && data.difficulty !== difficulty) return;
      
      allQuestions.push({ 
        id: doc.id, 
        question: data.question,
        options: data.options,
        category: data.category,
        difficulty: data.difficulty,
        createdAt: data.createdAt?.toDate().toISOString()
      });
    });
    
    // Mélanger aléatoirement (Fisher-Yates)
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }
    const selected = allQuestions.slice(0, parseInt(count));

    logger.info('Questions aléatoires générées', { 
      count: selected.length,
      filters: { category, difficulty },
      ip: req.ip 
    });

    res.json(selected);
  } catch (error) {
    logger.error('Erreur génération questions aléatoires', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /quiz/questions/{id}:
 *   get:
 *     summary: Récupérer une question par ID (avec la réponse correcte)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la question
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Détails complets de la question (avec réponse)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 question:
 *                   type: string
 *                 options:
 *                   type: array
 *                   items:
 *                     type: string
 *                 correctAnswer:
 *                   type: string
 *                 category:
 *                   type: string
 *                 difficulty:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Question non trouvée
 *       401:
 *         description: Non authentifié
 */
router.get('/questions/:id', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const doc = await db.collection('quiz_questions').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Question non trouvée' 
      });
    }

    const data = doc.data();

    logger.info('Question récupérée', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      id: doc.id, 
      ...data,
      createdAt: data.createdAt?.toDate().toISOString()
    });
  } catch (error) {
    logger.error('Erreur récupération question', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /quiz/questions/{id}:
 *   put:
 *     summary: Modifier une question
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la question
 *         example: "abc123xyz"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - options
 *               - correctAnswer
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctAnswer:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [fun, serious, memories, favorites, other]
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *     responses:
 *       200:
 *         description: Question modifiée
 *       404:
 *         description: Question non trouvée
 *       401:
 *         description: Non authentifié
 */
router.put('/questions/:id', authenticateToken, validate(quizSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { question, options, correctAnswer, category, difficulty } = req.body;
    
    const docRef = db.collection('quiz_questions').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Question non trouvée' 
      });
    }
    
    const updateData = {
      question,
      options,
      correctAnswer,
      category: category || 'fun',
      difficulty: difficulty || 'medium',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await docRef.update(updateData);

    logger.info('Question modifiée', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Question modifiée avec succès'
    });
  } catch (error) {
    logger.error('Erreur modification question', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /quiz/questions/{id}:
 *   delete:
 *     summary: Supprimer une question
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la question à supprimer
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Question supprimée avec succès
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
 *       404:
 *         description: Question non trouvée
 *       401:
 *         description: Non authentifié
 */
router.delete('/questions/:id', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const docRef = db.collection('quiz_questions').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Question non trouvée' 
      });
    }

    await docRef.delete();

    logger.info('Question supprimée', { 
      id: req.params.id,
      ip: req.ip 
    });

    res.json({ 
      success: true,
      message: 'Question supprimée avec succès'
    });
  } catch (error) {
    logger.error('Erreur suppression question', { 
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /quiz/answers:
 *   post:
 *     summary: Soumettre une réponse
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - selectedAnswer
 *             properties:
 *               questionId:
 *                 type: string
 *                 description: ID de la question
 *                 example: "abc123xyz"
 *               selectedAnswer:
 *                 type: string
 *                 description: Réponse choisie
 *                 example: "Chanson B"
 *     responses:
 *       200:
 *         description: Réponse enregistrée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isCorrect:
 *                   type: boolean
 *                 correctAnswer:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Question non trouvée
 *       401:
 *         description: Non authentifié
 */
router.post('/answers', authenticateToken, validate(answerSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const { questionId, selectedAnswer } = req.body;
    
    // Récupérer la question
    const questionDoc = await db.collection('quiz_questions').doc(questionId).get();
    
    if (!questionDoc.exists) {
      return res.status(404).json({ 
        error: 'Question non trouvée' 
      });
    }
    
    const questionData = questionDoc.data();
    const isCorrect = selectedAnswer === questionData.correctAnswer;
    
    // Enregistrer la réponse
    const answerData = {
      questionId,
      selectedAnswer,
      correctAnswer: questionData.correctAnswer,
      isCorrect,
      answeredBy: req.user.userId,
      answeredAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('quiz_answers').add(answerData);

    logger.info('Réponse enregistrée', { 
      id: docRef.id,
      questionId,
      isCorrect,
      ip: req.ip 
    });

    res.status(201).json({ 
      success: true,
      id: docRef.id,
      isCorrect,
      correctAnswer: questionData.correctAnswer,
      message: isCorrect ? 'Bonne réponse ! 🎉' : 'Mauvaise réponse 😢'
    });
  } catch (error) {
    logger.error('Erreur enregistrement réponse', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /quiz/statistics:
 *   get:
 *     summary: Récupérer les statistiques du quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques globales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalQuestions:
 *                   type: integer
 *                   description: Nombre total de questions disponibles
 *                 totalAnswers:
 *                   type: integer
 *                   description: Nombre de réponses données par l'utilisateur
 *                 correctAnswers:
 *                   type: integer
 *                   description: Nombre de bonnes réponses
 *                 wrongAnswers:
 *                   type: integer
 *                   description: Nombre de mauvaises réponses
 *                 accuracy:
 *                   type: number
 *                   description: Taux de réussite en pourcentage
 *                   example: 85.5
 *                 categoriesAvailable:
 *                   type: object
 *                   description: Nombre de questions par catégorie
 *       401:
 *         description: Non authentifié
 */
router.get('/statistics', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    
    const answersSnapshot = await db.collection('quiz_answers').get();
    
    let totalAnswers = 0;
    let correctAnswers = 0;
    
    answersSnapshot.forEach(doc => {
      const data = doc.data();
      
      if (data.answeredBy === req.user.userId) {
        totalAnswers++;
        if (data.isCorrect) {
          correctAnswers++;
        }
      }
    });
    
    const accuracy = totalAnswers > 0 ? ((correctAnswers / totalAnswers) * 100).toFixed(2) : 0;
    
    const categoriesSnapshot = await db.collection('quiz_questions').get();
    const categoriesCount = {};
    
    categoriesSnapshot.forEach(doc => {
      const category = doc.data().category;
      categoriesCount[category] = (categoriesCount[category] || 0) + 1;
    });

    logger.info('Statistiques quiz récupérées', { 
      totalAnswers,
      correctAnswers,
      ip: req.ip 
    });

    res.json({
      totalQuestions: categoriesSnapshot.size,
      totalAnswers,
      correctAnswers,
      wrongAnswers: totalAnswers - correctAnswers,
      accuracy: parseFloat(accuracy),
      categoriesAvailable: categoriesCount
    });
  } catch (error) {
    logger.error('Erreur récupération statistiques', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

/**
 * @swagger
 * /quiz/history:
 *   get:
 *     summary: Historique des réponses
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre maximum de réponses à retourner
 *     responses:
 *       200:
 *         description: Historique des réponses de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   question:
 *                     type: string
 *                   selectedAnswer:
 *                     type: string
 *                   correctAnswer:
 *                     type: string
 *                   isCorrect:
 *                     type: boolean
 *                   category:
 *                     type: string
 *                   answeredAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Non authentifié
 */
router.get('/history', authenticateToken, async (req, res, next) => {
  try {
    const db = getDb();
    const { limit = 20 } = req.query;
    
    const snapshot = await db.collection('quiz_answers')
      .where('answeredBy', '==', req.user.userId)
      .orderBy('answeredAt', 'desc')
      .limit(parseInt(limit))
      .get();
    
    if (snapshot.empty) {
      return res.json([]);
    }

    const answers = [];
    const questionIds = new Set();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      answers.push({ id: doc.id, ...data });
      questionIds.add(data.questionId);
    });

    // Batch read : une seule requête pour toutes les questions
    const questionRefs = [...questionIds].map(id => db.collection('quiz_questions').doc(id));
    const questionDocs = await db.getAll(...questionRefs);
    
    const questionsMap = {};
    questionDocs.forEach(doc => {
      if (doc.exists) {
        questionsMap[doc.id] = doc.data();
      }
    });

    const history = answers
      .filter(answer => questionsMap[answer.questionId])
      .map(answer => {
        const q = questionsMap[answer.questionId];
        return {
          id: answer.id,
          question: q.question,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect: answer.isCorrect,
          category: q.category,
          answeredAt: answer.answeredAt?.toDate().toISOString()
        };
      });

    logger.info('Historique quiz récupéré', { 
      count: history.length,
      limit,
      ip: req.ip 
    });

    res.json(history);
  } catch (error) {
    logger.error('Erreur récupération historique', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip 
    });
    next(error);
  }
});

export default router;