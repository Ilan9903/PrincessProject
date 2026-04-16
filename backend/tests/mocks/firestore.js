/**
 * Mock Firestore en mémoire pour les tests
 * Simule les opérations CRUD de Firestore sans connexion réelle
 */

// Store en mémoire : { collectionName: { docId: data } }
const store = {};
let idCounter = 0;

const generateId = () => `mock_${++idCounter}`;

/**
 * Wrapper pour simuler un Firestore Timestamp
 * Supporte .toDate() comme les vrais timestamps Firestore
 */
class MockTimestamp {
  constructor(value) {
    this._date = value instanceof Date ? value : new Date(value);
  }
  toDate() {
    return this._date;
  }
  toISOString() {
    return this._date.toISOString();
  }
  toString() {
    return this._date.toISOString();
  }
}

// Convertit les champs de date en MockTimestamp pour simuler Firestore
const wrapTimestamps = (data) => {
  const timestampFields = ['createdAt', 'redeemedAt', 'updatedAt', 'answeredAt'];
  const wrapped = { ...data };
  for (const field of timestampFields) {
    if (wrapped[field] && !(wrapped[field] instanceof MockTimestamp)) {
      wrapped[field] = new MockTimestamp(wrapped[field]);
    }
  }
  return wrapped;
};

// Reset le store entre les tests
export const resetStore = () => {
  Object.keys(store).forEach(k => delete store[k]);
  idCounter = 0;
};

// Pré-remplir des données
export const seedCollection = (collectionName, docs) => {
  if (!store[collectionName]) store[collectionName] = {};
  docs.forEach(doc => {
    const id = doc.id || generateId();
    const { id: _id, ...data } = doc;
    store[collectionName][id] = data;
  });
};

// Créer un mock de QuerySnapshot
const createQuerySnapshot = (collectionName, filters = []) => {
  const collectionData = store[collectionName] || {};
  
  let entries = Object.entries(collectionData).map(([id, data]) => ({
    id,
    data: () => wrapTimestamps({ ...data }),
    exists: true
  }));

  // Appliquer les filtres where
  for (const { field, op, value } of filters) {
    entries = entries.filter(doc => {
      const docValue = doc.data()[field];
      switch (op) {
        case '==': return docValue === value;
        case '!=': return docValue !== value;
        case '>': return docValue > value;
        case '>=': return docValue >= value;
        case '<': return docValue < value;
        case '<=': return docValue <= value;
        default: return true;
      }
    });
  }

  return entries;
};

// Mock d'une query Firestore chainable
const createQuery = (collectionName, filters = [], limitCount = null, orderByField = null, orderDir = 'asc') => {
  const query = {
    where(field, op, value) {
      return createQuery(collectionName, [...filters, { field, op, value }], limitCount, orderByField, orderDir);
    },
    orderBy(field, dir = 'asc') {
      return createQuery(collectionName, filters, limitCount, field, dir);
    },
    limit(n) {
      return createQuery(collectionName, filters, n, orderByField, orderDir);
    },
    async get() {
      let docs = createQuerySnapshot(collectionName, filters);
      
      if (orderByField) {
        docs.sort((a, b) => {
          const aVal = a.data()[orderByField];
          const bVal = b.data()[orderByField];
          if (aVal < bVal) return orderDir === 'asc' ? -1 : 1;
          if (aVal > bVal) return orderDir === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      if (limitCount) {
        docs = docs.slice(0, limitCount);
      }
      
      return {
        docs,
        empty: docs.length === 0,
        size: docs.length,
        forEach: (fn) => docs.forEach(fn)
      };
    }
  };
  return query;
};

// Mock d'une référence de document
const createDocRef = (collectionName, docId) => ({
  id: docId,
  async get() {
    const data = store[collectionName]?.[docId];
    return {
      id: docId,
      exists: !!data,
      data: () => data ? wrapTimestamps({ ...data }) : undefined
    };
  },
  async set(data) {
    if (!store[collectionName]) store[collectionName] = {};
    store[collectionName][docId] = { ...data };
  },
  async update(data) {
    if (store[collectionName]?.[docId]) {
      store[collectionName][docId] = { ...store[collectionName][docId], ...data };
    }
  },
  async delete() {
    if (store[collectionName]) {
      delete store[collectionName][docId];
    }
  }
});

// Mock d'une collection Firestore
const createCollectionRef = (collectionName) => ({
  async add(data) {
    const id = generateId();
    if (!store[collectionName]) store[collectionName] = {};
    store[collectionName][id] = { ...data };
    return { id };
  },
  doc(docId) {
    return createDocRef(collectionName, docId);
  },
  where(field, op, value) {
    return createQuery(collectionName, [{ field, op, value }]);
  },
  orderBy(field, dir = 'asc') {
    return createQuery(collectionName, [], null, field, dir);
  },
  limit(n) {
    return createQuery(collectionName, [], n);
  },
  async get() {
    return createQuery(collectionName).get();
  }
});

// Le mock db
const mockDb = {
  collection(name) {
    return createCollectionRef(name);
  },
  async getAll(...docRefs) {
    const results = [];
    for (const ref of docRefs) {
      const doc = await ref.get();
      results.push(doc);
    }
    return results;
  }
};

// Mock de firebase-admin
const mockAdmin = {
  firestore: {
    FieldValue: {
      serverTimestamp: () => new Date().toISOString(),
      increment: (n) => n,
      arrayUnion: (...args) => args,
      arrayRemove: (...args) => args
    }
  }
};

export { mockDb, mockAdmin };
