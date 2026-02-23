import 'dotenv/config';
import axios from 'axios';

const BASE_URL = 'http://localhost:2106/api';
let authToken = '';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Statistiques globales
const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(route, method, details = '') {
  stats.total++;
  stats.passed++;
  log(`✅ ${method.toUpperCase().padEnd(7)} ${route} ${details}`, 'green');
}

function logError(route, method, error) {
  stats.total++;
  stats.failed++;
  log(`❌ ${method.toUpperCase().padEnd(7)} ${route}`, 'red');
  log(`   Erreur: ${error.message}`, 'red');
  if (error.response?.data) {
    log(`   Réponse: ${JSON.stringify(error.response.data)}`, 'yellow');
  }
}

function logWarning(message) {
  stats.warnings++;
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(`  ${title}`, 'blue');
  log(`${'='.repeat(60)}`, 'blue');
}

// Fonction de validation
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion échouée: ${message}`);
  }
}

function assertExists(value, fieldName) {
  assert(value !== undefined && value !== null, `${fieldName} doit exister`);
}

function assertType(value, type, fieldName) {
  assert(typeof value === type, `${fieldName} doit être de type ${type}, reçu ${typeof value}`);
}

function assertArrayLength(array, min, fieldName) {
  assert(Array.isArray(array), `${fieldName} doit être un tableau`);
  assert(array.length >= min, `${fieldName} doit contenir au moins ${min} éléments`);
}

// IDs temporaires pour les tests
const testIds = {
  message: null,
  planning: null,
  coupon: null,
  question: null,
  song: null,
  moment: null
};

// =============================================================================
// TESTS AUTH
// =============================================================================
async function testAuth() {
  logSection('🔐 AUTHENTIFICATION');
  
  try {
    // Test 1: Login avec bon mot de passe
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      password: process.env.APP_PASSWORD
    });
    
    assertExists(loginRes.data.token, 'token');
    assertExists(loginRes.data.success, 'success');
    assertType(loginRes.data.token, 'string', 'token');
    assert(loginRes.data.success === true, 'success doit être true');
    
    authToken = loginRes.data.token; // ✅ Token stocké
    logSuccess('/auth/login', 'POST', `(token reçu: ${authToken.substring(0, 20)}...)`);
    
    // Test 2: Login avec mauvais mot de passe
    try {
      await axios.post(`${BASE_URL}/auth/login`, { password: 'wrong' });
      logWarning('Login devrait échouer avec mauvais mot de passe');
    } catch (err) {
      assert(err.response?.status === 401, 'Status devrait être 401');
      logSuccess('/auth/login (bad password)', 'POST', '(401 comme attendu)');
    }
    
    // ✅ DÉFINIR LES HEADERS APRÈS AVOIR OBTENU LE TOKEN
    const headers = { Authorization: `Bearer ${authToken}` };
    
    // Test 3: Verify token valide
    const verifyRes = await axios.get(`${BASE_URL}/auth/verify`, { headers });
    assertExists(verifyRes.data.success, 'success');
    assert(verifyRes.data.success === true, 'Token devrait être valide');
    logSuccess('/auth/verify', 'GET', '(token valide)');
    
    // Test 4: Verify sans token
    try {
      await axios.get(`${BASE_URL}/auth/verify`);
      logWarning('Verify devrait échouer sans token');
    } catch (err) {
      assert(err.response?.status === 401, 'Status devrait être 401');
      logSuccess('/auth/verify (no token)', 'GET', '(401 comme attendu)');
    }
    
    // Test 5: Logout
    const logoutRes = await axios.post(`${BASE_URL}/auth/logout`, {}, { headers });
    assertExists(logoutRes.data.success, 'success');
    assert(logoutRes.data.success === true, 'Logout devrait réussir');
    logSuccess('/auth/logout', 'POST', '(déconnexion réussie)');
    
    // Test 6: Verify après logout (devrait échouer)
    try {
      await axios.get(`${BASE_URL}/auth/verify`, { headers });
      logWarning('Verify devrait échouer après logout');
    } catch (err) {
      assert(err.response?.status === 401, 'Status devrait être 401 après logout');
      logSuccess('/auth/verify (after logout)', 'GET', '(401 comme attendu)');
    }
    
    // Test 7: Re-login pour obtenir un nouveau token
    const reLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
      password: process.env.APP_PASSWORD
    });
    assertExists(reLoginRes.data.token, 'nouveau token');
    authToken = reLoginRes.data.token; // Mettre à jour le token pour les tests suivants
    logSuccess('/auth/login (re-login)', 'POST', `(nouveau token: ${authToken.substring(0, 20)}...)`);
    
  } catch (error) {
    logError('/auth/*', 'ALL', error);
    process.exit(1);
  }
}

// =============================================================================
// TESTS MESSAGES
// =============================================================================
async function testMessages() {
  logSection('💌 MESSAGES');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  try {
    // Test 1: Créer un message
    const createRes = await axios.post(`${BASE_URL}/messages`, {
      title: 'Test Message',
      content: 'Ceci est un test',
      isSecret: false
    }, { headers });
    
    assertExists(createRes.data.id, 'id');
    assertExists(createRes.data.success, 'success');
    assert(createRes.data.success === true, 'success doit être true');
    assert(createRes.status === 201, 'Status doit être 201');
    
    testIds.message = createRes.data.id;
    logSuccess('/messages', 'POST', `(ID: ${testIds.message})`);
    
    // Test 2: Créer un message secret
    const secretRes = await axios.post(`${BASE_URL}/messages`, {
      title: 'Secret Message',
      content: 'Message secret',
      isSecret: true,
      unlockDate: '2026-12-31'
    }, { headers });
    
    assertExists(secretRes.data.id, 'id pour message secret');
    const secretId = secretRes.data.id;
    logSuccess('/messages (secret)', 'POST', `(ID: ${secretId})`);
    
    // Test 2b: Créer un message secret verrouillé (date future)
    const lockedRes = await axios.post(`${BASE_URL}/messages`, {
      title: 'Locked Secret',
      content: 'Verrouillé',
      isSecret: true,
      unlockDate: '2027-12-31' // Date future
    }, { headers });
    
    assertExists(lockedRes.data.id, 'id pour message verrouillé');
    const lockedId = lockedRes.data.id;
    logSuccess('/messages (locked secret)', 'POST', `(ID: ${lockedId})`);
    
    // Test 3: Créer sans titre (devrait échouer)
    try {
      await axios.post(`${BASE_URL}/messages`, {
        content: 'Sans titre'
      }, { headers });
      logWarning('Création sans titre devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400');
      logSuccess('/messages (no title)', 'POST', '(400 comme attendu)');
    }
    
    // Test 4: Liste des messages
    const listRes = await axios.get(`${BASE_URL}/messages`, { headers });
    assertArrayLength(listRes.data, 3, 'messages'); // Les 3 messages (1 normal + 2 secrets)
    
    const firstMessage = listRes.data.find(m => m.id === testIds.message);
    assertExists(firstMessage, 'message créé dans la liste');
    assertExists(firstMessage.title, 'title');
    assertExists(firstMessage.content, 'content');
    assertExists(firstMessage.createdAt, 'createdAt');
    assert(firstMessage.title === 'Test Message', 'Titre doit correspondre');
    
    // Vérifier que les messages verrouillés apparaissent mais SANS contenu
    const lockedInList = listRes.data.find(m => m.id === lockedId);
    assertExists(lockedInList, 'Message verrouillé doit être dans la liste');
    assertExists(lockedInList.title, 'Titre doit être visible');
    assert(lockedInList.isLocked === true, 'isLocked doit être true');
    assert(lockedInList.content === undefined, 'Contenu ne doit PAS être exposé pour message verrouillé');
    
    logSuccess('/messages', 'GET', `(${listRes.data.length} messages, verrouillés sans contenu)`);
    
    // Test 5: Récupérer par ID
    const getRes = await axios.get(`${BASE_URL}/messages/${testIds.message}`, { headers });
    assertExists(getRes.data.id, 'id');
    assert(getRes.data.id === testIds.message, 'ID doit correspondre');
    assert(getRes.data.title === 'Test Message', 'Titre doit correspondre');
    assert(getRes.data.content === 'Ceci est un test', 'Contenu doit correspondre');
    
    logSuccess('/messages/:id', 'GET', `(trouvé)`);
    
    // Test 6: Récupérer ID inexistant
    try {
      await axios.get(`${BASE_URL}/messages/inexistant123`, { headers });
      logWarning('GET avec ID inexistant devrait échouer');
    } catch (err) {
      assert(err.response?.status === 404, 'Status devrait être 404');
      logSuccess('/messages/:id (not found)', 'GET', '(404 comme attendu)');
    }
    
    // Test 7: Modifier le message
    const updateRes = await axios.put(`${BASE_URL}/messages/${testIds.message}`, {
      title: 'Test Message Updated',
      content: 'Contenu modifié',
      isSecret: false
    }, { headers });
    
    assertExists(updateRes.data.success, 'success');
    assert(updateRes.data.success === true, 'Modification doit réussir');
    
    logSuccess('/messages/:id', 'PUT', '(modifié)');
    
    // Test 8: Vérifier la modification
    const verifyRes = await axios.get(`${BASE_URL}/messages/${testIds.message}`, { headers });
    assert(verifyRes.data.title === 'Test Message Updated', 'Titre doit être mis à jour');
    assert(verifyRes.data.content === 'Contenu modifié', 'Contenu doit être mis à jour');
    
    logInfo('Vérification: modification bien appliquée');
    
    // Test 9: Supprimer le message
    const deleteRes = await axios.delete(`${BASE_URL}/messages/${testIds.message}`, { headers });
    assertExists(deleteRes.data.success, 'success');
    assert(deleteRes.data.success === true, 'Suppression doit réussir');
    
    logSuccess('/messages/:id', 'DELETE', '(supprimé)');
    
    // Test 10: Vérifier la suppression
    try {
      await axios.get(`${BASE_URL}/messages/${testIds.message}`, { headers });
      logWarning('Message devrait être supprimé');
    } catch (err) {
      assert(err.response?.status === 404, 'Message supprimé doit retourner 404');
      logInfo('Vérification: message bien supprimé');
    }
    
    // Nettoyer les messages secrets
    await axios.delete(`${BASE_URL}/messages/${secretId}`, { headers });
    await axios.delete(`${BASE_URL}/messages/${lockedId}`, { headers });
    
  } catch (error) {
    logError('/messages/*', 'ALL', error);
  }
}

// =============================================================================
// TESTS PLANNING
// =============================================================================
async function testPlanning() {
  logSection('📅 PLANNING');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  try {
    // Test 1: Créer un événement
    const createRes = await axios.post(`${BASE_URL}/planning`, {
      title: 'Test Event',
      description: 'Description test',
      date: '2026-12-31',
      time: '20:00',
      location: 'Test Location',
      type: 'date',
      status: 'planned'
    }, { headers });
    
    assertExists(createRes.data.id, 'id');
    assert(createRes.status === 201, 'Status doit être 201');
    testIds.planning = createRes.data.id;
    logSuccess('/planning', 'POST', `(ID: ${testIds.planning})`);
    
    // Test 2: Créer sans date (devrait échouer)
    try {
      await axios.post(`${BASE_URL}/planning`, {
        title: 'Sans date'
      }, { headers });
      logWarning('Création sans date devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400');
      logSuccess('/planning (no date)', 'POST', '(400 comme attendu)');
    }
    
    // Test 3: Liste
    const listRes = await axios.get(`${BASE_URL}/planning`, { headers });
    assertArrayLength(listRes.data, 1, 'events');
    
    const event = listRes.data[0];
    assertExists(event.title, 'title');
    assertExists(event.date, 'date');
    assertExists(event.status, 'status');
    
    logSuccess('/planning', 'GET', `(${listRes.data.length} événements)`);
    
    // Test 4: Filtres status et type
    const filteredRes = await axios.get(`${BASE_URL}/planning?status=planned&type=date`, { headers });
    assert(filteredRes.data.length >= 1, 'Filtre doit retourner au moins 1 événement');
    assert(filteredRes.data.every(e => e.status === 'planned'), 'Tous doivent être "planned"');
    assert(filteredRes.data.every(e => e.type === 'date'), 'Tous doivent être de type "date"');
    
    logSuccess('/planning?filters', 'GET', `(${filteredRes.data.length} filtrés)`);
    
    // Test 4b: Filtre upcoming
    const upcomingRes = await axios.get(`${BASE_URL}/planning?upcoming=true`, { headers });
    assert(Array.isArray(upcomingRes.data), 'Doit retourner un tableau');
    // Vérifier que toutes les dates sont futures
    const now = new Date();
    upcomingRes.data.forEach(event => {
      const eventDate = new Date(event.date);
      assert(eventDate >= now || event.date === '2026-12-31', 'Événements à venir doivent être dans le futur');
    });
    logSuccess('/planning?upcoming=true', 'GET', `(${upcomingRes.data.length} à venir)`);
    
    // Test 5: Get by ID
    const getRes = await axios.get(`${BASE_URL}/planning/${testIds.planning}`, { headers });
    assert(getRes.data.title === 'Test Event', 'Titre doit correspondre');
    
    logSuccess('/planning/:id', 'GET');
    
    // Test 6: Modifier
    const updateRes = await axios.put(`${BASE_URL}/planning/${testIds.planning}`, {
      title: 'Test Event Updated',
      date: '2026-12-31',
      status: 'confirmed'
    }, { headers });
    
    assert(updateRes.data.success === true, 'Modification doit réussir');
    logSuccess('/planning/:id', 'PUT');
    
    // Test 7: Vérifier modification
    const verifyRes = await axios.get(`${BASE_URL}/planning/${testIds.planning}`, { headers });
    assert(verifyRes.data.title === 'Test Event Updated', 'Titre doit être modifié');
    assert(verifyRes.data.status === 'confirmed', 'Status doit être modifié');
    logInfo('Vérification: modification appliquée');
    
    // Test 8: Supprimer
    await axios.delete(`${BASE_URL}/planning/${testIds.planning}`, { headers });
    logSuccess('/planning/:id', 'DELETE');
    
  } catch (error) {
    logError('/planning/*', 'ALL', error);
  }
}

// =============================================================================
// TESTS COUPONS
// =============================================================================
async function testCoupons() {
  logSection('🎟️ COUPONS');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  try {
    // Test 1: Créer un coupon
    const createRes = await axios.post(`${BASE_URL}/coupons`, {
      title: 'Test Coupon',
      description: 'Description test',
      type: 'massage',
      expiryDate: '2026-12-31'
    }, { headers });
    
    assertExists(createRes.data.id, 'id');
    testIds.coupon = createRes.data.id;
    logSuccess('/coupons', 'POST', `(ID: ${testIds.coupon})`);
    
    // Test 1b: Créer un coupon expiré
    const expiredRes = await axios.post(`${BASE_URL}/coupons`, {
      title: 'Expired Coupon',
      description: 'Déjà expiré',
      type: 'massage',
      expiryDate: '2024-01-01' // Date passée
    }, { headers });
    
    assertExists(expiredRes.data.id, 'id pour coupon expiré');
    const expiredId = expiredRes.data.id;
    logSuccess('/coupons (expired)', 'POST', `(ID: ${expiredId})`);
    
    // Test 2: Liste
    const listRes = await axios.get(`${BASE_URL}/coupons`, { headers });
    assertArrayLength(listRes.data, 2, 'coupons');
    
    const coupon = listRes.data.find(c => c.id === testIds.coupon);
    assertExists(coupon.status, 'status');
    assert(coupon.status === 'available', 'Status initial doit être "available"');
    
    logSuccess('/coupons', 'GET', `(${listRes.data.length} coupons)`);
    
    // Test 2b: Essayer d'utiliser le coupon expiré (devrait échouer)
    try {
      await axios.patch(`${BASE_URL}/coupons/${expiredId}/redeem`, {}, { headers });
      logWarning('Utiliser un coupon expiré devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400 pour coupon expiré');
      logSuccess('/coupons/:id/redeem (expired)', 'PATCH', '(400 comme attendu)');  
    }
    
    // Test 3: Filtres
    const filteredRes = await axios.get(`${BASE_URL}/coupons?status=available&type=massage`, { headers });
    assert(filteredRes.data.length >= 1, 'Filtre doit retourner au moins 1 coupon');
    logSuccess('/coupons?filters', 'GET', `(${filteredRes.data.length} filtrés)`);
    
    // Test 4: Get by ID
    const getRes = await axios.get(`${BASE_URL}/coupons/${testIds.coupon}`, { headers });
    assert(getRes.data.title === 'Test Coupon', 'Titre doit correspondre');
    logSuccess('/coupons/:id', 'GET');
    
    // Test 5: Modifier
    await axios.put(`${BASE_URL}/coupons/${testIds.coupon}`, {
      title: 'Test Coupon Updated',
      type: 'massage'
    }, { headers });
    logSuccess('/coupons/:id', 'PUT');
    
    // Test 6: Utiliser le coupon
    const redeemRes = await axios.patch(`${BASE_URL}/coupons/${testIds.coupon}/redeem`, {}, { headers });
    assert(redeemRes.data.success === true, 'Redemption doit réussir');
    logSuccess('/coupons/:id/redeem', 'PATCH', '(utilisé)');
    
    // Test 7: Vérifier qu'il est utilisé
    const checkRes = await axios.get(`${BASE_URL}/coupons/${testIds.coupon}`, { headers });
    assert(checkRes.data.status === 'redeemed', 'Status doit être "redeemed"');
    assertExists(checkRes.data.redeemedAt, 'redeemedAt');
    logInfo('Vérification: coupon bien marqué comme utilisé');
    
    // Test 8: Essayer de réutiliser (devrait échouer)
    try {
      await axios.patch(`${BASE_URL}/coupons/${testIds.coupon}/redeem`, {}, { headers });
      logWarning('Réutiliser un coupon devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400');
      logSuccess('/coupons/:id/redeem (already used)', 'PATCH', '(400 comme attendu)');
    }
    
    // Test 9: Réinitialiser
    const resetRes = await axios.patch(`${BASE_URL}/coupons/${testIds.coupon}/reset`, {}, { headers });
    assert(resetRes.data.success === true, 'Reset doit réussir');
    logSuccess('/coupons/:id/reset', 'PATCH', '(réinitialisé)');
    
    // Test 10: Vérifier qu'il est à nouveau disponible
    const verifyRes = await axios.get(`${BASE_URL}/coupons/${testIds.coupon}`, { headers });
    assert(verifyRes.data.status === 'available', 'Status doit être "available"');
    logInfo('Vérification: coupon réinitialisé');
    
    // Test 11: Supprimer
    await axios.delete(`${BASE_URL}/coupons/${testIds.coupon}`, { headers });
    logSuccess('/coupons/:id', 'DELETE');
    
    // Nettoyer le coupon expiré
    await axios.delete(`${BASE_URL}/coupons/${expiredId}`, { headers });
    
  } catch (error) {
    logError('/coupons/*', 'ALL', error);
  }
}

// =============================================================================
// TESTS QUIZ
// =============================================================================
async function testQuiz() {
  logSection('🎮 QUIZ');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  try {
    // Test 1: Créer une question
    const createRes = await axios.post(`${BASE_URL}/quiz/questions`, {
      question: 'Test Question?',
      options: ['Option 1', 'Option 2', 'Option 3'],
      correctAnswer: 'Option 1',
      category: 'fun',
      difficulty: 'easy'
    }, { headers });
    
    assertExists(createRes.data.id, 'id');
    testIds.question = createRes.data.id;
    logSuccess('/quiz/questions', 'POST', `(ID: ${testIds.question})`);
    
    // Test 2: Créer sans options (devrait échouer)
    try {
      await axios.post(`${BASE_URL}/quiz/questions`, {
        question: 'Sans options?',
        correctAnswer: 'Oui'
      }, { headers });
      logWarning('Création sans options devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400');
      logSuccess('/quiz/questions (no options)', 'POST', '(400 comme attendu)');
    }
    
    // Test 3: Liste (sans réponses correctes)
    const listRes = await axios.get(`${BASE_URL}/quiz/questions`, { headers });
    assertArrayLength(listRes.data, 1, 'questions');
    
    const question = listRes.data[0];
    assertExists(question.question, 'question');
    assertExists(question.options, 'options');
    assert(question.correctAnswer === undefined, 'correctAnswer ne doit PAS être exposée');
    
    logSuccess('/quiz/questions', 'GET', `(${listRes.data.length} questions, sans réponses)`);
    
    // Test 4: Filtres
    const filteredRes = await axios.get(`${BASE_URL}/quiz/questions?category=fun&difficulty=easy`, { headers });
    assert(filteredRes.data.length >= 1, 'Filtre doit retourner au moins 1 question');
    logSuccess('/quiz/questions?filters', 'GET', `(${filteredRes.data.length} filtrées)`);
    
    // Test 5: Random
    const randomRes = await axios.get(`${BASE_URL}/quiz/questions/random?count=5`, { headers });
    assert(Array.isArray(randomRes.data), 'Doit retourner un tableau');
    assert(randomRes.data.length <= 5, 'Ne doit pas dépasser la limite');
    logSuccess('/quiz/questions/random', 'GET', `(${randomRes.data.length} aléatoires)`);
    
    // Test 5b: Random avec count > disponible (cas limite)
    const randomMaxRes = await axios.get(`${BASE_URL}/quiz/questions/random?count=999`, { headers });
    assert(Array.isArray(randomMaxRes.data), 'Doit retourner un tableau même avec count élevé');
    assert(randomMaxRes.data.length <= 10, 'Ne doit pas dépasser le nombre de questions disponibles');
    logSuccess('/quiz/questions/random?count=999', 'GET', `(${randomMaxRes.data.length} retournées, pas de crash)`);
    
    // Test 6: Get by ID (avec réponse correcte)
    const getRes = await axios.get(`${BASE_URL}/quiz/questions/${testIds.question}`, { headers });
    assertExists(getRes.data.correctAnswer, 'correctAnswer');
    assert(getRes.data.correctAnswer === 'Option 1', 'Réponse correcte doit être exposée');
    logSuccess('/quiz/questions/:id', 'GET', '(avec réponse)');
    
    // Test 7: Soumettre une bonne réponse
    const answerRes = await axios.post(`${BASE_URL}/quiz/answers`, {
      questionId: testIds.question,
      selectedAnswer: 'Option 1'
    }, { headers });
    
    assertExists(answerRes.data.isCorrect, 'isCorrect');
    assert(answerRes.data.isCorrect === true, 'Réponse doit être correcte');
    logSuccess('/quiz/answers', 'POST', '(bonne réponse)');
    
    // Test 8: Soumettre une mauvaise réponse
    const wrongAnswerRes = await axios.post(`${BASE_URL}/quiz/answers`, {
      questionId: testIds.question,
      selectedAnswer: 'Option 2'
    }, { headers });
    
    assert(wrongAnswerRes.data.isCorrect === false, 'Réponse doit être incorrecte');
    assertExists(wrongAnswerRes.data.correctAnswer, 'correctAnswer');
    logSuccess('/quiz/answers (wrong)', 'POST', '(mauvaise réponse)');
    
    // Test 9: Statistiques
    const statsRes = await axios.get(`${BASE_URL}/quiz/statistics`, { headers });
    assertExists(statsRes.data.totalAnswers, 'totalAnswers');
    assertExists(statsRes.data.correctAnswers, 'correctAnswers');
    assertExists(statsRes.data.accuracy, 'accuracy');
    assert(statsRes.data.totalAnswers === 2, 'Doit avoir 2 réponses');
    assert(statsRes.data.correctAnswers === 1, 'Doit avoir 1 bonne réponse');
    assert(statsRes.data.accuracy === 50, 'Précision doit être 50%');
    logSuccess('/quiz/statistics', 'GET', `(${statsRes.data.totalAnswers} réponses, ${statsRes.data.accuracy}%)`);
    
    // Test 10: Historique
    const historyRes = await axios.get(`${BASE_URL}/quiz/history?limit=10`, { headers });
    assertArrayLength(historyRes.data, 2, 'history');
    assert(historyRes.data[0].answeredAt > historyRes.data[1].answeredAt, 'Doit être trié par date décroissante');
    logSuccess('/quiz/history', 'GET', `(${historyRes.data.length} réponses)`);
    
    // Test 11: Modifier
    await axios.put(`${BASE_URL}/quiz/questions/${testIds.question}`, {
      question: 'Test Question Updated?',
      options: ['Option A', 'Option B'],
      correctAnswer: 'Option A',
      category: 'fun',
      difficulty: 'medium'
    }, { headers });
    logSuccess('/quiz/questions/:id', 'PUT');
    
    // Test 12: Supprimer
    await axios.delete(`${BASE_URL}/quiz/questions/${testIds.question}`, { headers });
    logSuccess('/quiz/questions/:id', 'DELETE');
    
  } catch (error) {
    logError('/quiz/*', 'ALL', error);
  }
}

// =============================================================================
// TESTS PLAYLIST
// =============================================================================
async function testPlaylist() {
  logSection('🎵 PLAYLIST');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  try {
    // Test 1: Créer une chanson
    const createRes = await axios.post(`${BASE_URL}/playlist`, {
      title: 'Test Song',
      artist: 'Test Artist',
      album: 'Test Album',
      platform: 'spotify',
      url: 'https://spotify.com/test',
      addedBy: 'me',
      reason: 'Test'
    }, { headers });
    
    assertExists(createRes.data.id, 'id');
    testIds.song = createRes.data.id;
    logSuccess('/playlist', 'POST', `(ID: ${testIds.song})`);
    
    // Test 2: Créer sans artiste (devrait échouer)
    try {
      await axios.post(`${BASE_URL}/playlist`, {
        title: 'Sans artiste'
      }, { headers });
      logWarning('Création sans artiste devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400');
      logSuccess('/playlist (no artist)', 'POST', '(400 comme attendu)');
    }
    
    // Test 3: Liste
    const listRes = await axios.get(`${BASE_URL}/playlist`, { headers });
    assertArrayLength(listRes.data, 1, 'songs');
    
    const song = listRes.data[0];
    assertExists(song.playCount, 'playCount');
    assert(song.playCount === 0, 'playCount initial doit être 0');
    
    logSuccess('/playlist', 'GET', `(${listRes.data.length} chansons)`);
    
    // Test 4: Filtres platform et sortBy
    const filteredRes = await axios.get(`${BASE_URL}/playlist?platform=spotify&sortBy=recent`, { headers });
    assert(filteredRes.data.length >= 1, 'Filtre doit retourner au moins 1 chanson');
    logSuccess('/playlist?filters', 'GET', `(${filteredRes.data.length} filtrées)`);
    
    // Test 4b: Marquer comme favori puis filtrer favorites
    await axios.patch(`${BASE_URL}/playlist/${testIds.song}/favorite`, {}, { headers });
    const favoritesRes = await axios.get(`${BASE_URL}/playlist?favorites=true`, { headers });
    assert(favoritesRes.data.length >= 1, 'Filtre favorites doit retourner au moins 1 chanson');
    assert(favoritesRes.data.every(s => s.isFavorite === true), 'Toutes doivent être favorites');
    logSuccess('/playlist?favorites=true', 'GET', `(${favoritesRes.data.length} favorites)`);
    
    // Retirer des favoris pour la suite des tests
    await axios.patch(`${BASE_URL}/playlist/${testIds.song}/favorite`, {}, { headers });
    
    // Test 5: Get by ID
    const getRes = await axios.get(`${BASE_URL}/playlist/${testIds.song}`, { headers });
    assert(getRes.data.title === 'Test Song', 'Titre doit correspondre');
    logSuccess('/playlist/:id', 'GET');
    
    // Test 6: Modifier
    await axios.put(`${BASE_URL}/playlist/${testIds.song}`, {
      title: 'Test Song Updated',
      artist: 'Test Artist Updated'
    }, { headers });
    logSuccess('/playlist/:id', 'PUT');
    
    // Test 7: Toggle favorite
    const favRes = await axios.patch(`${BASE_URL}/playlist/${testIds.song}/favorite`, {}, { headers });
    assert(favRes.data.isFavorite === true, 'Doit être marqué comme favori');
    logSuccess('/playlist/:id/favorite', 'PATCH', '(ajouté aux favoris)');
    
    // Test 8: Vérifier favorite
    const checkFavRes = await axios.get(`${BASE_URL}/playlist/${testIds.song}`, { headers });
    assert(checkFavRes.data.isFavorite === true, 'isFavorite doit être true');
    logInfo('Vérification: marqué comme favori');
    
    // Test 9: Toggle favorite à nouveau
    const unfavRes = await axios.patch(`${BASE_URL}/playlist/${testIds.song}/favorite`, {}, { headers });
    assert(unfavRes.data.isFavorite === false, 'Ne doit plus être favori');
    logSuccess('/playlist/:id/favorite (toggle)', 'PATCH', '(retiré des favoris)');
    
    // Test 10: Incrémenter play count
    await axios.patch(`${BASE_URL}/playlist/${testIds.song}/play`, {}, { headers });
    logSuccess('/playlist/:id/play', 'PATCH', '(+1 lecture)');
    
    // Test 11: Vérifier play count
    const checkPlayRes = await axios.get(`${BASE_URL}/playlist/${testIds.song}`, { headers });
    assert(checkPlayRes.data.playCount === 1, 'playCount doit être 1');
    assertExists(checkPlayRes.data.lastPlayedAt, 'lastPlayedAt');
    logInfo('Vérification: playCount incrémenté');
    
    // Test 12: Supprimer
    await axios.delete(`${BASE_URL}/playlist/${testIds.song}`, { headers });
    logSuccess('/playlist/:id', 'DELETE');
    
  } catch (error) {
    logError('/playlist/*', 'ALL', error);
  }
}

// =============================================================================
// TESTS HEALTH
// =============================================================================
async function testHealth() {
  logSection('🏥 HEALTH CHECK');
  
  try {
    // Test 1: Health check endpoint
    const healthRes = await axios.get(`${BASE_URL}/health`);
    
    assertExists(healthRes.data.status, 'status');
    assert(healthRes.data.status === 'ok', 'Status doit être "ok"');
    assertExists(healthRes.data.timestamp, 'timestamp');
    assert(healthRes.status === 200, 'Status HTTP doit être 200');
    
    logSuccess('/health', 'GET', '(serveur opérationnel)');
    
  } catch (error) {
    logError('/health', 'GET', error);
  }
}

// =============================================================================
// TESTS VALENTINE
// =============================================================================
async function testValentine() {
  logSection('💖 VALENTINE');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  try {
    // Test 1: Créer un moment
    const createRes = await axios.post(`${BASE_URL}/valentine`, {
      title: 'Test Moment',
      description: 'Description test',
      date: '2026-02-14',
      imageUrl: 'https://example.com/image.jpg'
    }, { headers });
    
    assertExists(createRes.data.id, 'id');
    testIds.moment = createRes.data.id;
    logSuccess('/valentine', 'POST', `(ID: ${testIds.moment})`);
    
    // Test 2: Créer sans description (devrait échouer)
    try {
      await axios.post(`${BASE_URL}/valentine`, {
        title: 'Sans description',
        date: '2026-02-14'
      }, { headers });
      logWarning('Création sans description devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400');
      logSuccess('/valentine (no description)', 'POST', '(400 comme attendu)');
    }
    
    // Test 3: Liste
    const listRes = await axios.get(`${BASE_URL}/valentine`, { headers });
    assertArrayLength(listRes.data, 1, 'moments');
    
    const moment = listRes.data[0];
    assertExists(moment.title, 'title');
    assertExists(moment.description, 'description');
    assertExists(moment.date, 'date');
    
    logSuccess('/valentine', 'GET', `(${listRes.data.length} moments)`);
    
    // Test 4: Get by ID
    const getRes = await axios.get(`${BASE_URL}/valentine/${testIds.moment}`, { headers });
    assert(getRes.data.title === 'Test Moment', 'Titre doit correspondre');
    logSuccess('/valentine/:id', 'GET');
    
    // Test 5: Modifier
    await axios.put(`${BASE_URL}/valentine/${testIds.moment}`, {
      title: 'Test Moment Updated',
      description: 'Description updated',
      date: '2026-02-14'
    }, { headers });
    logSuccess('/valentine/:id', 'PUT');
    
    // Test 6: Vérifier modification
    const verifyRes = await axios.get(`${BASE_URL}/valentine/${testIds.moment}`, { headers });
    assert(verifyRes.data.title === 'Test Moment Updated', 'Titre doit être modifié');
    logInfo('Vérification: modification appliquée');
    
    // Test 7: Supprimer
    await axios.delete(`${BASE_URL}/valentine/${testIds.moment}`, { headers });
    logSuccess('/valentine/:id', 'DELETE');
    
  } catch (error) {
    logError('/valentine/*', 'ALL', error);
  }
}

// =============================================================================
// EXÉCUTION DES TESTS
// =============================================================================
async function runAllTests() {
  log('\n🚀 DÉBUT DES TESTS COMPLETS - TOUTES LES ROUTES', 'magenta');
  log(`📡 Base URL: ${BASE_URL}`, 'yellow');
  log(`🔑 Password: ${process.env.APP_PASSWORD}`, 'yellow');
  log(`⏱️  Démarrage: ${new Date().toLocaleString('fr-FR')}`, 'cyan');
  
  const startTime = Date.now();
  
  try {
    await testAuth();
    await testMessages();
    await testPlanning();
    await testCoupons();
    await testQuiz();
    await testPlaylist();
    await testValentine();
    await testHealth();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    logSection('✨ RÉSULTAT FINAL');
    log(`\n📊 STATISTIQUES`, 'cyan');
    log(`   Total de tests: ${stats.total}`, 'cyan');
    log(`   ✅ Réussis: ${stats.passed}`, 'green');
    log(`   ❌ Échoués: ${stats.failed}`, stats.failed > 0 ? 'red' : 'cyan');
    log(`   ⚠️  Warnings: ${stats.warnings}`, stats.warnings > 0 ? 'yellow' : 'cyan');
    log(`   ⏱️  Durée: ${duration}s`, 'cyan');
    
    const successRate = ((stats.passed / stats.total) * 100).toFixed(1);
    log(`\n🎯 Taux de réussite: ${successRate}%`, successRate == 100 ? 'green' : 'yellow');
    
    if (stats.failed === 0 && stats.warnings === 0) {
      log('\n🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS !', 'green');
      log('✨ Votre API fonctionne parfaitement !', 'green');
    } else if (stats.failed === 0) {
      log('\n✅ Tous les tests sont passés', 'green');
      log(`⚠️  Mais ${stats.warnings} warning(s) détecté(s)`, 'yellow');
    } else {
      log(`\n⚠️  ${stats.failed} test(s) ont échoué`, 'red');
      log('Vérifiez les erreurs ci-dessus', 'yellow');
    }
    
    process.exit(stats.failed > 0 ? 1 : 0);
    
  } catch (error) {
    log('\n❌ ERREUR CRITIQUE', 'red');
    log(error.message, 'red');
    if (error.stack) {
      log(error.stack, 'red');
    }
    process.exit(1);
  }
}

// Lancer les tests
runAllTests();