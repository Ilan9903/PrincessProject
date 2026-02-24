import 'dotenv/config';
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const BASE_URL = 'http://localhost:2106/api';

// Configuration axios pour les cookies HttpOnly (nécessaire en Node.js)
const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

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
    // Test 1: Login avec bon mot de passe (le token est maintenant dans un cookie HttpOnly)
    const loginRes = await client.post(`${BASE_URL}/auth/login`, {
      password: process.env.APP_PASSWORD
    });
    
    assertExists(loginRes.data.success, 'success');
    assert(loginRes.data.success === true, 'success doit être true');
    // Le token n'est PLUS dans le response body, il est dans un cookie HttpOnly
    assert(loginRes.data.token === undefined, 'token ne doit plus être exposé (HttpOnly cookie)');
    
    logSuccess('/auth/login', 'POST', '(cookie HttpOnly défini)');
    
    // Test 2: Login avec mauvais mot de passe
    try {
      await client.post(`${BASE_URL}/auth/login`, { password: 'wrong' });
      logWarning('Login devrait échouer avec mauvais mot de passe');
    } catch (err) {
      assert(err.response?.status === 401, 'Status devrait être 401');
      logSuccess('/auth/login (bad password)', 'POST', '(401 comme attendu)');
    }
    
    // Test 3: Verify token valide (le cookie est envoyé automatiquement)
    const verifyRes = await client.get(`${BASE_URL}/auth/verify`);
    assertExists(verifyRes.data.success, 'success');
    assert(verifyRes.data.success === true, 'Token devrait être valide');
    logSuccess('/auth/verify', 'GET', '(token valide via cookie)');
    
    // Test 4: Logout
    const logoutRes = await client.post(`${BASE_URL}/auth/logout`);
    assertExists(logoutRes.data.success, 'success');
    assert(logoutRes.data.success === true, 'Logout devrait réussir');
    logSuccess('/auth/logout', 'POST', '(déconnexion réussie, cookie supprimé)');
    
    // Test 5: Verify après logout (devrait échouer)
    try {
      await client.get(`${BASE_URL}/auth/verify`);
      logWarning('Verify devrait échouer après logout');
    } catch (err) {
      assert(err.response?.status === 401, 'Status devrait être 401 après logout');
      logSuccess('/auth/verify (after logout)', 'GET', '(401 comme attendu)');
    }
    
    // Test 6: Re-login pour obtenir un nouveau cookie
    const reLoginRes = await client.post(`${BASE_URL}/auth/login`, {
      password: process.env.APP_PASSWORD
    });
    assertExists(reLoginRes.data.success, 'success');
    assert(reLoginRes.data.success === true, 're-login doit réussir');
    logSuccess('/auth/login (re-login)', 'POST', '(nouveau cookie HttpOnly défini)');
    
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
  
  try {
    // Test 1: Créer un message
    const createRes = await client.post(`${BASE_URL}/messages`, {
      title: 'Test Message',
      content: 'Ceci est un test',
      isSecret: false
    });
    
    assertExists(createRes.data.id, 'id');
    assertExists(createRes.data.success, 'success');
    assert(createRes.data.success === true, 'success doit être true');
    assert(createRes.status === 201, 'Status doit être 201');
    
    testIds.message = createRes.data.id;
    logSuccess('/messages', 'POST', `(ID: ${testIds.message})`);
    
    // Test 2: Créer un message secret
    const secretRes = await client.post(`${BASE_URL}/messages`, {
      title: 'Secret Message',
      content: 'Message secret',
      isSecret: true,
      unlockDate: '2026-12-31'
    });
    
    assertExists(secretRes.data.id, 'id pour message secret');
    const secretId = secretRes.data.id;
    logSuccess('/messages (secret)', 'POST', `(ID: ${secretId})`);
    
    // Test 2b: Créer un message secret verrouillé (date future)
    const lockedRes = await client.post(`${BASE_URL}/messages`, {
      title: 'Locked Secret',
      content: 'Verrouillé',
      isSecret: true,
      unlockDate: '2027-12-31' // Date future
    });
    
    assertExists(lockedRes.data.id, 'id pour message verrouillé');
    const lockedId = lockedRes.data.id;
    logSuccess('/messages (locked secret)', 'POST', `(ID: ${lockedId})`);
    
    // Test 3: Créer sans titre (devrait échouer)
    try {
      await client.post(`${BASE_URL}/messages`, {
        content: 'Sans titre'
      });
      logWarning('Création sans titre devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400');
      logSuccess('/messages (no title)', 'POST', '(400 comme attendu)');
    }
    
    // Test 4: Liste des messages
    const listRes = await client.get(`${BASE_URL}/messages`);
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
    const getRes = await client.get(`${BASE_URL}/messages/${testIds.message}`);
    assertExists(getRes.data.id, 'id');
    assert(getRes.data.id === testIds.message, 'ID doit correspondre');
    assert(getRes.data.title === 'Test Message', 'Titre doit correspondre');
    assert(getRes.data.content === 'Ceci est un test', 'Contenu doit correspondre');
    
    logSuccess('/messages/:id', 'GET', `(trouvé)`);
    
    // Test 6: Récupérer ID inexistant
    try {
      await client.get(`${BASE_URL}/messages/inexistant123`);
      logWarning('GET avec ID inexistant devrait échouer');
    } catch (err) {
      assert(err.response?.status === 404, 'Status devrait être 404');
      logSuccess('/messages/:id (not found)', 'GET', '(404 comme attendu)');
    }
    
    // Test 7: Modifier le message
    const updateRes = await client.put(`${BASE_URL}/messages/${testIds.message}`, {
      title: 'Test Message Updated',
      content: 'Contenu modifié',
      isSecret: false
    });
    
    assertExists(updateRes.data.success, 'success');
    assert(updateRes.data.success === true, 'Modification doit réussir');
    
    logSuccess('/messages/:id', 'PUT', '(modifié)');
    
    // Test 8: Vérifier la modification
    const verifyRes = await client.get(`${BASE_URL}/messages/${testIds.message}`);
    assert(verifyRes.data.title === 'Test Message Updated', 'Titre doit être mis à jour');
    assert(verifyRes.data.content === 'Contenu modifié', 'Contenu doit être mis à jour');
    
    logInfo('Vérification: modification bien appliquée');
    
    // Test 9: Supprimer le message
    const deleteRes = await client.delete(`${BASE_URL}/messages/${testIds.message}`);
    assertExists(deleteRes.data.success, 'success');
    assert(deleteRes.data.success === true, 'Suppression doit réussir');
    
    logSuccess('/messages/:id', 'DELETE', '(supprimé)');
    
    // Test 10: Vérifier la suppression
    try {
      await client.get(`${BASE_URL}/messages/${testIds.message}`);
      logWarning('Message devrait être supprimé');
    } catch (err) {
      assert(err.response?.status === 404, 'Message supprimé doit retourner 404');
      logInfo('Vérification: message bien supprimé');
    }
    
    // Nettoyer les messages secrets
    await client.delete(`${BASE_URL}/messages/${secretId}`);
    await client.delete(`${BASE_URL}/messages/${lockedId}`);
    
  } catch (error) {
    logError('/messages/*', 'ALL', error);
  }
}

// =============================================================================
// TESTS PLANNING
// =============================================================================
async function testPlanning() {
  logSection('📅 PLANNING');
  
  try {
    // Test 1: Créer un événement
    const createRes = await client.post(`${BASE_URL}/planning`, {
      title: 'Test Event',
      description: 'Description test',
      date: '2026-12-31',
      time: '20:00',
      location: 'Test Location',
      type: 'date',
      status: 'planned'
    });
    
    assertExists(createRes.data.id, 'id');
    assert(createRes.status === 201, 'Status doit être 201');
    testIds.planning = createRes.data.id;
    logSuccess('/planning', 'POST', `(ID: ${testIds.planning})`);
    
    // Test 2: Créer sans date (devrait échouer)
    try {
      await client.post(`${BASE_URL}/planning`, {
        title: 'Sans date'
      });
      logWarning('Création sans date devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400');
      logSuccess('/planning (no date)', 'POST', '(400 comme attendu)');
    }
    
    // Test 3: Liste
    const listRes = await client.get(`${BASE_URL}/planning`);
    assertArrayLength(listRes.data, 1, 'events');
    
    const event = listRes.data[0];
    assertExists(event.title, 'title');
    assertExists(event.date, 'date');
    assertExists(event.status, 'status');
    
    logSuccess('/planning', 'GET', `(${listRes.data.length} événements)`);
    
    // Test 4: Filtres status et type
    const filteredRes = await client.get(`${BASE_URL}/planning?status=planned&type=date`);
    assert(filteredRes.data.length >= 1, 'Filtre doit retourner au moins 1 événement');
    assert(filteredRes.data.every(e => e.status === 'planned'), 'Tous doivent être "planned"');
    assert(filteredRes.data.every(e => e.type === 'date'), 'Tous doivent être de type "date"');
    
    logSuccess('/planning?filters', 'GET', `(${filteredRes.data.length} filtrés)`);
    
    // Test 4b: Filtre upcoming
    const upcomingRes = await client.get(`${BASE_URL}/planning?upcoming=true`);
    assert(Array.isArray(upcomingRes.data), 'Doit retourner un tableau');
    // Vérifier que toutes les dates sont futures ou aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Mettre à minuit pour comparer seulement les dates
    upcomingRes.data.forEach(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      assert(eventDate >= today, `Événement ${event.title} (${event.date}) doit être aujourd'hui ou dans le futur`);
    });
    logSuccess('/planning?upcoming=true', 'GET', `(${upcomingRes.data.length} à venir)`);
    
    // Test 5: Get by ID
    const getRes = await client.get(`${BASE_URL}/planning/${testIds.planning}`);
    assert(getRes.data.title === 'Test Event', 'Titre doit correspondre');
    
    logSuccess('/planning/:id', 'GET');
    
    // Test 6: Modifier
    const updateRes = await client.put(`${BASE_URL}/planning/${testIds.planning}`, {
      title: 'Test Event Updated',
      date: '2026-12-31',
      status: 'confirmed'
    });
    
    assert(updateRes.data.success === true, 'Modification doit réussir');
    logSuccess('/planning/:id', 'PUT');
    
    // Test 7: Vérifier modification
    const verifyRes = await client.get(`${BASE_URL}/planning/${testIds.planning}`);
    assert(verifyRes.data.title === 'Test Event Updated', 'Titre doit être modifié');
    assert(verifyRes.data.status === 'confirmed', 'Status doit être modifié');
    logInfo('Vérification: modification appliquée');
    
    // Test 8: Supprimer
    await client.delete(`${BASE_URL}/planning/${testIds.planning}`);
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
  
  try {
    // Test 1: Créer un coupon
    const createRes = await client.post(`${BASE_URL}/coupons`, {
      title: 'Test Coupon',
      description: 'Description test',
      type: 'massage',
      expirationDate: '2026-12-31'
    });
    
    assertExists(createRes.data.id, 'id');
    testIds.coupon = createRes.data.id;
    logSuccess('/coupons', 'POST', `(ID: ${testIds.coupon})`);
    
    // Test 1b: Créer un coupon expiré
    const expiredRes = await client.post(`${BASE_URL}/coupons`, {
      title: 'Expired Coupon',
      description: 'Déjà expiré',
      type: 'massage',
      expirationDate: '2024-01-01' // Date passée
    });
    
    assertExists(expiredRes.data.id, 'id pour coupon expiré');
    const expiredId = expiredRes.data.id;
    logSuccess('/coupons (expired)', 'POST', `(ID: ${expiredId})`);
    
    // Test 2: Liste
    const listRes = await client.get(`${BASE_URL}/coupons`);
    assertArrayLength(listRes.data, 2, 'coupons');
    
    const coupon = listRes.data.find(c => c.id === testIds.coupon);
    assertExists(coupon.status, 'status');
    assert(coupon.status === 'available', 'Status initial doit être "available"');
    
    logSuccess('/coupons', 'GET', `(${listRes.data.length} coupons)`);
    
    // Test 2b: Essayer d'utiliser le coupon expiré (devrait échouer)
    try {
      await client.patch(`${BASE_URL}/coupons/${expiredId}/redeem`, {});
      logWarning('Utiliser un coupon expiré devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400 pour coupon expiré');
      logSuccess('/coupons/:id/redeem (expired)', 'PATCH', '(400 comme attendu)');  
    }
    
    // Test 3: Filtres
    const filteredRes = await client.get(`${BASE_URL}/coupons?status=available&type=massage`);
    assert(filteredRes.data.length >= 1, 'Filtre doit retourner au moins 1 coupon');
    logSuccess('/coupons?filters', 'GET', `(${filteredRes.data.length} filtrés)`);
    
    // Test 4: Get by ID
    const getRes = await client.get(`${BASE_URL}/coupons/${testIds.coupon}`);
    assert(getRes.data.title === 'Test Coupon', 'Titre doit correspondre');
    logSuccess('/coupons/:id', 'GET');
    
    // Test 5: Modifier
    await client.put(`${BASE_URL}/coupons/${testIds.coupon}`, {
      title: 'Test Coupon Updated',
      type: 'massage'
    });
    logSuccess('/coupons/:id', 'PUT');
    
    // Test 6: Utiliser le coupon
    const redeemRes = await client.patch(`${BASE_URL}/coupons/${testIds.coupon}/redeem`, {});
    assert(redeemRes.data.success === true, 'Redemption doit réussir');
    logSuccess('/coupons/:id/redeem', 'PATCH', '(utilisé)');
    
    // Test 7: Vérifier qu'il est utilisé
    const checkRes = await client.get(`${BASE_URL}/coupons/${testIds.coupon}`);
    assert(checkRes.data.status === 'redeemed', 'Status doit être "redeemed"');
    assertExists(checkRes.data.redeemedAt, 'redeemedAt');
    logInfo('Vérification: coupon bien marqué comme utilisé');
    
    // Test 8: Essayer de réutiliser (devrait échouer)
    try {
      await client.patch(`${BASE_URL}/coupons/${testIds.coupon}/redeem`, {});
      logWarning('Réutiliser un coupon devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400');
      logSuccess('/coupons/:id/redeem (already used)', 'PATCH', '(400 comme attendu)');
    }
    
    // Test 9: Réinitialiser
    const resetRes = await client.patch(`${BASE_URL}/coupons/${testIds.coupon}/reset`, {});
    assert(resetRes.data.success === true, 'Reset doit réussir');
    logSuccess('/coupons/:id/reset', 'PATCH', '(réinitialisé)');
    
    // Test 10: Vérifier qu'il est à nouveau disponible
    const verifyRes = await client.get(`${BASE_URL}/coupons/${testIds.coupon}`);
    assert(verifyRes.data.status === 'available', 'Status doit être "available"');
    logInfo('Vérification: coupon réinitialisé');
    
    // Test 11: Supprimer
    await client.delete(`${BASE_URL}/coupons/${testIds.coupon}`);
    logSuccess('/coupons/:id', 'DELETE');
    
    // Nettoyer le coupon expiré
    await client.delete(`${BASE_URL}/coupons/${expiredId}`);
    
  } catch (error) {
    logError('/coupons/*', 'ALL', error);
  }
}

// =============================================================================
// TESTS QUIZ
// =============================================================================
async function testQuiz() {
  logSection('🎮 QUIZ');
  
  try {
    const createRes = await client.post(`${BASE_URL}/quiz/questions`, {
      question: 'Test Question?',
      options: ['Option 1', 'Option 2', 'Option 3'],
      correctAnswer: 'Option 1',
      category: 'fun',
      difficulty: 'easy'
    });
    
    assertExists(createRes.data.id, 'id');
    testIds.question = createRes.data.id;
    logSuccess('/quiz/questions', 'POST', `(ID: ${testIds.question})`);
    
    // Test 2: Créer sans options (devrait échouer)
    try {
      await client.post(`${BASE_URL}/quiz/questions`, {
        question: 'Sans options?',
        correctAnswer: 'Oui'
      });
      logWarning('Création sans options devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400');
      logSuccess('/quiz/questions (no options)', 'POST', '(400 comme attendu)');
    }
    
    // Test 3: Liste (sans réponses correctes)
    const listRes = await client.get(`${BASE_URL}/quiz/questions`);
    assertArrayLength(listRes.data, 1, 'questions');
    
    const question = listRes.data[0];
    assertExists(question.question, 'question');
    assertExists(question.options, 'options');
    assert(question.correctAnswer === undefined, 'correctAnswer ne doit PAS être exposée');
    
    logSuccess('/quiz/questions', 'GET', `(${listRes.data.length} questions, sans réponses)`);
    
    // Test 4: Filtres
    const filteredRes = await client.get(`${BASE_URL}/quiz/questions?category=fun&difficulty=easy`);
    assert(filteredRes.data.length >= 1, 'Filtre doit retourner au moins 1 question');
    logSuccess('/quiz/questions?filters', 'GET', `(${filteredRes.data.length} filtrées)`);
    
    // Test 5: Random
    const randomRes = await client.get(`${BASE_URL}/quiz/questions/random?count=5`);
    assert(Array.isArray(randomRes.data), 'Doit retourner un tableau');
    assert(randomRes.data.length <= 5, 'Ne doit pas dépasser la limite');
    logSuccess('/quiz/questions/random', 'GET', `(${randomRes.data.length} aléatoires)`);
    
    // Test 5b: Random avec count > disponible (cas limite)
    const randomMaxRes = await client.get(`${BASE_URL}/quiz/questions/random?count=999`);
    assert(Array.isArray(randomMaxRes.data), 'Doit retourner un tableau même avec count élevé');
    assert(randomMaxRes.data.length <= 20, 'Ne doit pas dépasser 20 questions (seeded database)');
    logSuccess('/quiz/questions/random?count=999', 'GET', `(${randomMaxRes.data.length} retournées, pas de crash)`);
    
    // Test 6: Get by ID (avec réponse correcte)
    const getRes = await client.get(`${BASE_URL}/quiz/questions/${testIds.question}`);
    assertExists(getRes.data.correctAnswer, 'correctAnswer');
    assert(getRes.data.correctAnswer === 'Option 1', 'Réponse correcte doit être exposée');
    logSuccess('/quiz/questions/:id', 'GET', '(avec réponse)');
    
    // Test 7: Soumettre une bonne réponse
    const answerRes = await client.post(`${BASE_URL}/quiz/answers`, {
      questionId: testIds.question,
      selectedAnswer: 'Option 1'
    });
    
    assertExists(answerRes.data.isCorrect, 'isCorrect');
    assert(answerRes.data.isCorrect === true, 'Réponse doit être correcte');
    logSuccess('/quiz/answers', 'POST', '(bonne réponse)');
    
    // Test 8: Soumettre une mauvaise réponse
    const wrongAnswerRes = await client.post(`${BASE_URL}/quiz/answers`, {
      questionId: testIds.question,
      selectedAnswer: 'Option 2'
    });
    
    assert(wrongAnswerRes.data.isCorrect === false, 'Réponse doit être incorrecte');
    assertExists(wrongAnswerRes.data.correctAnswer, 'correctAnswer');
    logSuccess('/quiz/answers (wrong)', 'POST', '(mauvaise réponse)');
    
    // Test 9: Statistiques
    const statsRes = await client.get(`${BASE_URL}/quiz/statistics`);
    assertExists(statsRes.data.totalAnswers, 'totalAnswers');
    assertExists(statsRes.data.correctAnswers, 'correctAnswers');
    assertExists(statsRes.data.accuracy, 'accuracy');
    assert(statsRes.data.totalAnswers === 2, 'Doit avoir 2 réponses');
    assert(statsRes.data.correctAnswers === 1, 'Doit avoir 1 bonne réponse');
    assert(statsRes.data.accuracy === 50, 'Précision doit être 50%');
    logSuccess('/quiz/statistics', 'GET', `(${statsRes.data.totalAnswers} réponses, ${statsRes.data.accuracy}%)`);
    
    // Test 10: Historique
    const historyRes = await client.get(`${BASE_URL}/quiz/history?limit=10`);
    assertArrayLength(historyRes.data, 2, 'history');
    assert(historyRes.data[0].answeredAt > historyRes.data[1].answeredAt, 'Doit être trié par date décroissante');
    logSuccess('/quiz/history', 'GET', `(${historyRes.data.length} réponses)`);
    
    // Test 11: Modifier
    await client.put(`${BASE_URL}/quiz/questions/${testIds.question}`, {
      question: 'Test Question Updated?',
      options: ['Option A', 'Option B'],
      correctAnswer: 'Option A',
      category: 'fun',
      difficulty: 'medium'
    });
    logSuccess('/quiz/questions/:id', 'PUT');
    
    // Test 12: Supprimer
    await client.delete(`${BASE_URL}/quiz/questions/${testIds.question}`);
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
  
  try {
    // Test 1: Créer une chanson
    const createRes = await client.post(`${BASE_URL}/playlist`, {
      title: 'Test Song',
      artist: 'Test Artist',
      album: 'Test Album',
      platform: 'spotify',
      url: 'https://spotify.com/test',
      addedBy: 'me',
      reason: 'Test'
    });
    
    assertExists(createRes.data.id, 'id');
    testIds.song = createRes.data.id;
    logSuccess('/playlist', 'POST', `(ID: ${testIds.song})`);
    
    // Test 2: Créer sans artiste (devrait échouer)
    try {
      await client.post(`${BASE_URL}/playlist`, {
        title: 'Sans artiste'
      });
      logWarning('Création sans artiste devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400');
      logSuccess('/playlist (no artist)', 'POST', '(400 comme attendu)');
    }
    
    // Test 3: Liste
    const listRes = await client.get(`${BASE_URL}/playlist`);
    assertArrayLength(listRes.data, 1, 'songs');
    
    const song = listRes.data[0];
    assertExists(song.playCount, 'playCount');
    assert(song.playCount === 0, 'playCount initial doit être 0');
    
    logSuccess('/playlist', 'GET', `(${listRes.data.length} chansons)`);
    
    // Test 4: Filtres platform et sortBy
    const filteredRes = await client.get(`${BASE_URL}/playlist?platform=spotify&sortBy=recent`);
    assert(filteredRes.data.length >= 1, 'Filtre doit retourner au moins 1 chanson');
    logSuccess('/playlist?filters', 'GET', `(${filteredRes.data.length} filtrées)`);
    
    // Test 4b: Marquer comme favori puis filtrer favorites
    await client.patch(`${BASE_URL}/playlist/${testIds.song}/favorite`, {});
    const favoritesRes = await client.get(`${BASE_URL}/playlist?favorites=true`);
    assert(favoritesRes.data.length >= 1, 'Filtre favorites doit retourner au moins 1 chanson');
    assert(favoritesRes.data.every(s => s.isFavorite === true), 'Toutes doivent être favorites');
    logSuccess('/playlist?favorites=true', 'GET', `(${favoritesRes.data.length} favorites)`);
    
    // Retirer des favoris pour la suite des tests
    await client.patch(`${BASE_URL}/playlist/${testIds.song}/favorite`, {});
    
    // Test 5: Get by ID
    const getRes = await client.get(`${BASE_URL}/playlist/${testIds.song}`);
    assert(getRes.data.title === 'Test Song', 'Titre doit correspondre');
    logSuccess('/playlist/:id', 'GET');
    
    // Test 6: Modifier
    await client.put(`${BASE_URL}/playlist/${testIds.song}`, {
      title: 'Test Song Updated',
      artist: 'Test Artist Updated'
    });
    logSuccess('/playlist/:id', 'PUT');
    
    // Test 7: Toggle favorite
    const favRes = await client.patch(`${BASE_URL}/playlist/${testIds.song}/favorite`, {});
    assert(favRes.data.isFavorite === true, 'Doit être marqué comme favori');
    logSuccess('/playlist/:id/favorite', 'PATCH', '(ajouté aux favoris)');
    
    // Test 8: Vérifier favorite
    const checkFavRes = await client.get(`${BASE_URL}/playlist/${testIds.song}`);
    assert(checkFavRes.data.isFavorite === true, 'isFavorite doit être true');
    logInfo('Vérification: marqué comme favori');
    
    // Test 9: Toggle favorite à nouveau
    const unfavRes = await client.patch(`${BASE_URL}/playlist/${testIds.song}/favorite`, {});
    assert(unfavRes.data.isFavorite === false, 'Ne doit plus être favori');
    logSuccess('/playlist/:id/favorite (toggle)', 'PATCH', '(retiré des favoris)');
    
    // Test 10: Incrémenter play count
    await client.patch(`${BASE_URL}/playlist/${testIds.song}/play`, {});
    logSuccess('/playlist/:id/play', 'PATCH', '(+1 lecture)');
    
    // Test 11: Vérifier play count
    const checkPlayRes = await client.get(`${BASE_URL}/playlist/${testIds.song}`);
    assert(checkPlayRes.data.playCount === 1, 'playCount doit être 1');
    assertExists(checkPlayRes.data.lastPlayedAt, 'lastPlayedAt');
    logInfo('Vérification: playCount incrémenté');
    
    // Test 12: Supprimer
    await client.delete(`${BASE_URL}/playlist/${testIds.song}`);
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
    const healthRes = await client.get(`${BASE_URL}/health`);
    
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
  
  try {
    // Test 1: Créer un moment
    const createRes = await client.post(`${BASE_URL}/valentine`, {
      title: 'Test Moment',
      description: 'Description test',
      date: '2026-02-14',
      imageUrl: 'https://example.com/image.jpg'
    });
    
    assertExists(createRes.data.id, 'id');
    testIds.moment = createRes.data.id;
    logSuccess('/valentine', 'POST', `(ID: ${testIds.moment})`);
    
    // Test 2: Créer sans description (devrait échouer)
    try {
      await client.post(`${BASE_URL}/valentine`, {
        title: 'Sans description',
        date: '2026-02-14'
      });
      logWarning('Création sans description devrait échouer');
    } catch (err) {
      assert(err.response?.status === 400, 'Status devrait être 400');
      logSuccess('/valentine (no description)', 'POST', '(400 comme attendu)');
    }
    
    // Test 3: Liste
    const listRes = await client.get(`${BASE_URL}/valentine`);
    assertArrayLength(listRes.data, 1, 'moments');
    
    const moment = listRes.data[0];
    assertExists(moment.title, 'title');
    assertExists(moment.description, 'description');
    assertExists(moment.date, 'date');
    
    logSuccess('/valentine', 'GET', `(${listRes.data.length} moments)`);
    
    // Test 4: Get by ID
    const getRes = await client.get(`${BASE_URL}/valentine/${testIds.moment}`);
    assert(getRes.data.title === 'Test Moment', 'Titre doit correspondre');
    logSuccess('/valentine/:id', 'GET');
    
    // Test 5: Modifier
    await client.put(`${BASE_URL}/valentine/${testIds.moment}`, {
      title: 'Test Moment Updated',
      description: 'Description updated',
      date: '2026-02-14'
    });
    logSuccess('/valentine/:id', 'PUT');
    
    // Test 6: Vérifier modification
    const verifyRes = await client.get(`${BASE_URL}/valentine/${testIds.moment}`);
    assert(verifyRes.data.title === 'Test Moment Updated', 'Titre doit être modifié');
    logInfo('Vérification: modification appliquée');
    
    // Test 7: Supprimer
    await client.delete(`${BASE_URL}/valentine/${testIds.moment}`);
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

