import admin from './src/config/firebase.js';
import { getDb } from './src/config/firebase.js';

const seedQuiz = async () => {
  try {
    const db = getDb();
    console.log('✅ Connecté avec succès');
    
    // 🗑️ Supprimer toutes les anciennes questions
    console.log('🗑️ Suppression des anciennes questions...');
    const existingQuestions = await db.collection('quiz').get();
    const deletePromises = existingQuestions.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`✅ ${existingQuestions.size} ancienne(s) question(s) supprimée(s)`);
    
    const questions = [
      {
        question: "Où nous sommes-nous embrassés pour la première fois ?",
        options: [
          "Dans ta voiture",
          "Au cinéma",
          "Sur un banc au parc",
          "On s'est embrassé ?!"
        ],
        correctAnswer: "Sur un banc au parc",
        category: "memories",
        difficulty: "easy",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        question: "Quel est mon plat préféré que tu cuisines ?",
        options: [
          "Les pâtes carbo",
          "La quiche lorraine",
          "Les sushis maison",
          "Rien, je commande UberEats"
        ],
        correctAnswer: "Les pâtes carbo",
        category: "favorites",
        difficulty: "easy",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        question: "Quelle est la date exacte de notre rencontre ?",
        options: [
          "14 Février",
          "12 Octobre",
          "13 Octobre",
          "Je demande à mon avocat"
        ],
        correctAnswer: "12 Octobre",
        category: "memories",
        difficulty: "hard",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        question: "Si on gagnait au loto, on partirait où ?",
        options: [
          "Aux Maldives",
          "Au Japon",
          "Dans la Creuse",
          "À New York"
        ],
        correctAnswer: "Au Japon",
        category: "romantic",
        difficulty: "medium",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        question: "Qui a dit 'Je t'aime' en premier ?",
        options: [
          "C'est toi !",
          "C'est moi (évidemment)",
          "En même temps",
          "Le chien"
        ],
        correctAnswer: "C'est toi !",
        category: "memories",
        difficulty: "medium",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        question: "Quel est mon film préféré qu'on a regardé ensemble ?",
        options: [
          "Titanic",
          "The Notebook",
          "Your Name",
          "Fast & Furious"
        ],
        correctAnswer: "Your Name",
        category: "favorites",
        difficulty: "easy",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        question: "Qu'est-ce que je déteste le plus ?",
        options: [
          "Les araignées",
          "Quand tu ronfl es",
          "Les épinards",
          "Le froid"
        ],
        correctAnswer: "Les araignées",
        category: "fun",
        difficulty: "easy",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        question: "Quel est mon surnom préféré que tu me donnes ?",
        options: [
          "Mon cœur",
          "Ma princesse",
          "Bébé",
          "Chef"
        ],
        correctAnswer: "Ma princesse",
        category: "romantic",
        difficulty: "medium",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];
    
    console.log('❓ Création des questions...');
    
    for (const question of questions) {
      await db.collection('quiz_questions').add(question);
      console.log(`✅ 💭 ${question.question}`);
    }
    
    console.log('🎉 Toutes les questions ont été créées avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

seedQuiz();
