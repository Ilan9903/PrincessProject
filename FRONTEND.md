# 🎨 FRONTEND - Princess Project - Documentation Complète

> **Version**: 0.0.0  
> **Framework**: React 19.2.0  
> **Build Tool**: Vite 7.3.1  
> **Port**: 1308

---

## 📋 Table des Matières

1. [Architecture Générale](#architecture-générale)
2. [Stack Technologique](#stack-technologique)
3. [Structure des Fichiers](#structure-des-fichiers)
4. [Configuration](#configuration)
5. [Routing & Navigation](#routing--navigation)
6. [Authentification Frontend](#authentification-frontend)
7. [API Client (Utils/api.js)](#api-client-utilsapijs)
8. [Toutes les Pages](#toutes-les-pages)
9. [Composants Réutilisables](#composants-réutilisables)
10. [Design System](#design-system)
11. [Animations (Framer Motion)](#animations-framer-motion)
12. [Responsive Design](#responsive-design)
13. [PWA (Progressive Web App)](#pwa-progressive-web-app)
14. [Scripts NPM](#scripts-npm)

---

## 🏗️ Architecture Générale

### Pattern Component-Based React
```
frontend/
├── public/                  # Assets statiques
│   ├── favicon_assets/      # Favicons
│   └── site.webmanifest     # PWA manifest
├── src/
│   ├── assets/              # Images, icons
│   ├── components/          # Composants réutilisables (6)
│   ├── pages/               # Pages de l'application (13)
│   ├── Utils/               # Utilitaires (api.js)
│   ├── App.jsx              # Routeur principal
│   ├── App.css              # Styles globaux
│   ├── main.jsx             # Point d'entrée React
│   └── index.css            # Tailwind base
├── index.html               # HTML de base
├── vite.config.js           # Config Vite
├── tailwind.config.js       # Config Tailwind
├── eslint.config.js         # Config ESLint
└── package.json             # Dépendances NPM
```

### Flux de Navigation
```
User ouvre app
    ↓
App.jsx (Router)
    ↓
ProtectedRoute (vérifie auth)
    ↓
Si non authentifié → /login
Si authentifié → Page demandée
    ↓
Page charge les données (authenticatedFetch)
    ↓
Backend API (/api/*)
    ↓
Affichage avec animations (Framer Motion)
    ↓
FloatingHearts + PageTransition
```

---

## 🛠️ Stack Technologique

### Dependencies Principales
```json
{
  "react": "^19.2.0",                   // Framework UI
  "react-dom": "^19.2.0",               // DOM rendering
  "react-router-dom": "^7.13.0",        // Routing
  "framer-motion": "^12.34.0",          // Animations
  "@tailwindcss/vite": "^4.1.18",       // Utility CSS
  "tailwindcss": "^4.1.18",             // CSS framework
  "axios": "^1.13.5",                   // HTTP client
  "canvas-confetti": "^1.9.4",          // Confettis
  "react-confetti": "^6.4.0"            // Plus de confettis
}
```

### DevDependencies
```json
{
  "vite": "^7.3.1",                     // Build tool
  "@vitejs/plugin-react": "^5.1.1",    // Plugin React
  "vite-plugin-pwa": "^1.2.0",         // PWA support
  "eslint": "^9.39.1"                  // Linting
}
```

---

## 📁 Structure des Fichiers (Détaillée)

```
frontend/
│
├── public/
│   ├── favicon_assets/
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   └── site.webmanifest
│   └── (autres assets)
│
├── src/
│   ├── assets/                       # Images, icons (vide actuellement)
│   │
│   ├── components/
│   │   ├── FloatingHearts.jsx        # Cœurs animés en fond
│   │   ├── InstallPrompt.jsx         # Prompt installation PWA
│   │   ├── MusicPlayer.jsx           # Lecteur audio (UI uniquement)
│   │   ├── PageTransition.jsx        # Wrapper transitions pages
│   │   ├── RelationshipCounter.jsx   # Compteur temps ensemble
│   │   └── ScrollToTop.jsx           # Scroll automatique haut page
│   │
│   ├── pages/
│   │   ├── Login.jsx                 # Page de connexion
│   │   ├── Home.jsx                  # Page d'accueil (menu principal)
│   │   ├── Valentine-request.jsx     # Demande St-Valentin
│   │   ├── Valentine-success.jsx     # Page succès St-Valentin
│   │   ├── DateIdeas.jsx             # Idées de dates + planning
│   │   ├── OpenWhen.jsx              # Messages "Ouvre quand..."
│   │   ├── OurStory.jsx              # Histoire du couple (timeline)
│   │   ├── Reasons.jsx               # 100 raisons de t'aimer
│   │   ├── Coupons.jsx               # Bons cadeaux (flip cards)
│   │   ├── Wheel.jsx                 # Roue des activités
│   │   ├── Quiz.jsx                  # Quiz sur le couple
│   │   ├── ScratchGame.jsx           # Jeu à gratter
│   │   └── Playlist.jsx              # Notre playlist musicale
│   │
│   ├── Utils/
│   │   └── api.js                    # Client API + auth helpers
│   │
│   ├── App.jsx                       # Routeur principal + ProtectedRoute
│   ├── App.css                       # Styles globaux + animations CSS
│   ├── main.jsx                      # Point d'entrée React (createRoot)
│   └── index.css                     # Import Tailwind + fonts
│
├── index.html                        # HTML de base
├── vite.config.js                    # Config Vite + PWA
├── tailwind.config.js                # Config Tailwind (theme)
├── eslint.config.js                  # Config ESLint React
├── package.json                      # Dépendances NPM
├── .env                              # Variables d'environnement (dev)
├── .env.production                   # Variables prod
└── .env.example                      # Template .env
```

---

## ⚙️ Configuration

### Variables d'Environnement (.env)
```bash
# URL de l'API Backend
VITE_API_URL=http://localhost:2106

# Note: En production (.env.production)
# VITE_API_URL=https://your-backend-url.com
```

### Vite Config (vite.config.js)
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Princess Project',
        short_name: 'Princess',
        description: 'Une app d\'amour pour ma princesse',
        theme_color: '#ff69b4',
        background_color: '#fce7f3',
        display: 'standalone',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 1308
  }
});
```

### Tailwind Config (tailwind.config.js)
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'princess-pink': '#ff69b4',
        'princess-rose': '#fce7f3'
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif']
      }
    }
  },
  plugins: []
}
```

---

## 🗺️ Routing & Navigation

### Routes Définies (App.jsx)
```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

<Routes location={location} key={location.pathname}>
  // Route publique
  <Route path="/login" element={<Login />} />
  
  // Routes protégées (nécessitent authentification)
  <Route path="/" element={<Home />} />
  <Route path="/valentine" element={<ValentineRequest />} />
  <Route path="/success" element={<ValentineSuccess />} />
  <Route path="/date-ideas" element={<DateIdeas />} />
  <Route path="/open-when" element={<OpenWhen />} />
  <Route path="/our-story" element={<OurStory />} />
  <Route path="/reasons" element={<Reasons />} />
  <Route path="/coupons" element={<Coupons />} />
  <Route path="/wheel" element={<Wheel />} />
  <Route path="/quiz" element={<Quiz />} />
  <Route path="/scratch" element={<ScratchGame />} />
  <Route path="/playlist" element={<Playlist />} />
  
  // Catch-all (404)
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### ProtectedRoute Component
```javascript
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      const valid = await verifyToken();
      setAuthenticated(valid);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="loading-screen">Vérification...</div>;
  }

  return authenticated ? children : <Navigate to="/login" replace />;
};
```

### Navigation depuis Home.jsx (Menu principal)
```javascript
// 10 boutons de navigation
<Link to="/valentine">💝 Notre St-Valentin</Link>
<Link to="/date-ideas">💡 Idées de Dates</Link>
<Link to="/open-when">✉️ Open When...</Link>
<Link to="/our-story">📖 Notre Histoire</Link>
<Link to="/reasons">💖 100 Raisons</Link>
<Link to="/coupons">🎟️ Tes Coupons</Link>
<Link to="/wheel">🎡 Roue Surprise</Link>
<Link to="/quiz">🎮 Quiz Couple</Link>
<Link to="/scratch">🎫 Jeu à Gratter</Link>
<Link to="/playlist">🎶 Notre Playlist</Link>
```

---

## 🔐 Authentification Frontend

### Flow d'Authentification
```
1. User arrive sur app
   ↓
2. App.jsx vérifie si token existe (localStorage)
   ↓
3. Si token existe → verifyToken() vers backend
   ↓
4. Backend valide JWT
   ↓
5. Si valide → Accès pages
   Si invalide → Redirect /login
   ↓
6. Login page → Submit password
   ↓
7. Backend retourne JWT
   ↓
8. Frontend stocke token → Redirect /
```

### Utils/api.js (Client d'authentification)
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2106';

// Token Management
const getToken = () => localStorage.getItem('princess_token');
const setToken = (token) => localStorage.setItem('princess_token', token);
const removeToken = () => localStorage.removeItem('princess_token');
const isAuthenticated = () => !!getToken();

// Login
export const login = async (password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  
  const data = await response.json();
  
  if (data.success && data.token) {
    setToken(data.token);
    return { success: true };
  }
  
  return { success: false, error: data.error };
};

// Verify Token
export const verifyToken = async () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return data.valid;
  } catch {
    return false;
  }
};

// Logout
export const logout = async () => {
  const token = getToken();
  if (token) {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
  removeToken();
};

// Authenticated Fetch (pour toutes les requêtes protégées)
export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Non authentifié');
  }
  
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
};
```

---

## 📄 Toutes les Pages (13 pages)

### 1. Login.jsx (Page de connexion)
**Route**: `/login`  
**Auth**: ❌ Non (publique)  
**Description**: Page de connexion avec mot de passe unique

**Fonctionnalités**:
- Input password avec validation
- Submit vers `/api/auth/login`
- Stockage token dans localStorage
- Redirect vers `/` après succès
- Animation d'entrée (Framer Motion)
- FloatingHearts en arrière-plan

**Code clé**:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await login(password);
  
  if (result.success) {
    navigate('/');
  } else {
    setError(result.error);
  }
};
```

---

### 2. Home.jsx (Menu principal)
**Route**: `/`  
**Auth**: ✅ Oui  
**Description**: Page d'accueil avec 10 boutons de navigation

**Fonctionnalités**:
- 10 boutons animés vers toutes les pages
- RelationshipCounter (temps ensemble)
- FloatingHearts
- Animations stagger (Framer Motion)
- Bouton logout en haut à droite

**Design**:
- Grid 2 colonnes responsive
- Couleurs dégradées par bouton
- Icônes emoji
- Hover effects avec scale

**Boutons navigations**:
1. 💝 Notre St-Valentin → `/valentine`
2. 💡 Idées de Dates → `/date-ideas`
3. ✉️ Open When... → `/open-when`
4. 📖 Notre Histoire → `/our-story`
5. 💖 100 Raisons → `/reasons`
6. 🎟️ Tes Coupons → `/coupons`
7. 🎡 Roue Surprise → `/wheel`
8. 🎮 Quiz Couple → `/quiz`
9. 🎫 Jeu à Gratter → `/scratch`
10. 🎶 Notre Playlist → `/playlist`

---

### 3. Valentine-request.jsx (Demande St-Valentin)
**Route**: `/valentine`  
**Auth**: ✅ Oui  
**Description**: Page pour faire une demande de St-Valentin

**Fonctionnalités**:
- Formulaire de demande (from, to, message)
- Submit vers `POST /api/valentine`
- Animation cœurs + confettis
- Redirect vers `/success` après soumission
- Affichage des demandes précédentes (historique)

**API Call**:
```javascript
const response = await authenticatedFetch('/api/valentine', {
  method: 'POST',
  body: JSON.stringify({ from, to, message, status: 'pending' })
});
```

---

### 4. Valentine-success.jsx (Succès St-Valentin)
**Route**: `/success`  
**Auth**: ✅ Oui  
**Description**: Page de confirmation après demande St-Valentin

**Fonctionnalités**:
- Animation confettis (canvas-confetti)
- Message de succès animé
- Bouton retour home
- FloatingHearts

---

### 5. DateIdeas.jsx (Idées de dates + Planning)
**Route**: `/date-ideas`  
**Auth**: ✅ Oui  
**Description**: Suggestions de dates + planification d'événements

**Fonctionnalités**:
- Liste d'idées de dates (prédéfinies)
- Affichage événements planifiés depuis `GET /api/planning?upcoming=true`
- Formulaire pour planifier une date
- Submit vers `POST /api/planning`
- Bouton "Fait ✓" → `PATCH /api/planning/:id` (status: done)
- Filtres par catégorie (cinema, restaurant, etc.)
- Calendrier des prochains événements

**État local**:
```javascript
const [ideas, setIdeas] = useState([]);
const [plannedEvents, setPlannedEvents] = useState([]);
const [showForm, setShowForm] = useState(false);
```

---

### 6. OpenWhen.jsx (Messages "Ouvre quand...")
**Route**: `/open-when`  
**Auth**: ✅ Oui  
**Description**: Collection de messages à ouvrir selon l'humeur

**Fonctionnalités**:
- Récupère messages depuis `GET /api/messages`
- Affichage cartes par catégorie (triste, manque, fâchée, rire, doute, motivation, special)
- Messages verrouillés (grayed out) si `lockedUntil > now`
- Clic sur carte ouvre modal avec contenu complet
- Couleurs de fond selon backgroundColor
- Animations entrée/sortie modal

**Catégories de messages**:
- 😢 Triste
- 💔 Tu me manques
- 😠 Fâchée
- 😂 Tu as besoin de rire
- 🤔 Tu as des doutes
- 💪 Motivation
- 🎁 Spécial (verrouillé jusqu'à date future)

**Code clé**:
```javascript
const messages = await authenticatedFetch('/api/messages');
const data = await response.json();

const isLocked = (msg) => {
  return msg.lockedUntil && new Date(msg.lockedUntil) > new Date();
};
```

---

### 7. OurStory.jsx (Histoire du couple)
**Route**: `/our-story`  
**Auth**: ✅ Oui  
**Description**: Timeline de l'histoire du couple

**Fonctionnalités**:
- Timeline verticale avec événements clés
- Photos/images pour chaque événement
- Dates importantes (première rencontre, premier baiser, etc.)
- Animations scroll (entrée progressive)
- Design "story book"

**Structure**:
```javascript
const milestones = [
  { date: "14 Février 2025", title: "Notre Rencontre", description: "..." },
  { date: "20 Mars 2025", title: "Premier Baiser", description: "..." },
  // ... autres événements
];
```

---

### 8. Reasons.jsx (100 raisons de t'aimer)
**Route**: `/reasons`  
**Auth**: ✅ Oui  
**Description**: Liste des 100 raisons pourquoi je t'aime

**Fonctionnalités**:
- Affichage scrollable de 100 raisons
- Animations reveal au scroll
- Numérotation
- Couleurs alternées
- FloatingHearts
- Design romantique

**Structure**:
```javascript
const reasons = [
  "Ton sourire illumine mes journées",
  "Ta façon de rire me fait fondre",
  "Ton intelligence et ta sagesse",
  // ... 97 autres raisons
];
```

---

### 9. Coupons.jsx (Bons cadeaux)
**Route**: `/coupons`  
**Auth**: ✅ Oui  
**Description**: Bons cadeaux à utiliser (cartes flip 3D)

**Fonctionnalités**:
- Récupère coupons depuis `GET /api/coupons`
- Affichage cartes flip 3D (recto/verso)
- Clic pour retourner carte
- Bouton "Utiliser" → `PATCH /api/coupons/:id/redeem`
- État isRedeemed (grayed out si utilisé)
- Animation flip CSS 3D
- Couleurs par icon

**Code clé**:
```javascript
const handleRedeem = async (couponId) => {
  const response = await authenticatedFetch(`/api/coupons/${couponId}/redeem`, {
    method: 'PATCH'
  });
  
  if (response.ok) {
    const data = await response.json();
    setCoupons(coupons.map(c => 
      c.id === couponId ? { ...c, isRedeemed: true } : c
    ));
  }
};
```

**Design 3D Flip**:
```css
.perspective-1000 { perspective: 1000px; }
.card-flip { transform-style: preserve-3d; transition: transform 0.6s; }
.flipped { transform: rotateY(180deg); }
.card-back { transform: rotateY(180deg); }
```

---

### 10. Wheel.jsx (Roue des activités)
**Route**: `/wheel`  
**Auth**: ✅ Oui  
**Description**: Roue de la fortune pour choisir une activité

**Fonctionnalités**:
- Roue tournante animée (CSS rotate)
- 8-12 segments avec activités
- Bouton "Faire tourner"
- Animation rotation + ralentissement
- Résultat avec confettis
- Historique des résultats

**Activités**:
- Ciné
- Restaurant
- Balade
- Jeux
- Cuisine
- Massage
- Netflix
- Sport
- etc.

---

### 11. Quiz.jsx (Quiz sur le couple)
**Route**: `/quiz`  
**Auth**: ✅ Oui  
**Description**: Quiz interactif avec questions sur le couple

**Fonctionnalités**:
- Récupère questions depuis `GET /api/quiz/questions`
- Affichage question + 4 options
- Soumission réponse → `POST /api/quiz/answers`
- Feedback immédiat (correct/incorrect)
- Score en temps réel
- Statistiques finales depuis `GET /api/quiz/statistics`
- Bouton "Question suivante"

**État local**:
```javascript
const [questions, setQuestions] = useState([]);
const [currentQuestion, setCurrentQuestion] = useState(0);
const [score, setScore] = useState(0);
const [showResult, setShowResult] = useState(false);
```

**API Call**:
```javascript
const submitAnswer = async (answer) => {
  const response = await authenticatedFetch('/api/quiz/answers', {
    method: 'POST',
    body: JSON.stringify({
      questionId: questions[currentQuestion].id,
      answer,
      isCorrect: answer === questions[currentQuestion].correctAnswer
    })
  });
};
```

---

### 12. ScratchGame.jsx (Jeu à gratter)
**Route**: `/scratch`  
**Auth**: ✅ Oui  
**Description**: Carte à gratter interactive (canvas)

**Fonctionnalités**:
- Canvas HTML5 pour grattage
- Détection mouse move / touch move
- Révélation progressive du message caché
- Confettis quand 80%+ gratté
- Reset pour rejouer
- Message surprise en dessous

**Implémentation**:
```javascript
const handleScratch = (e) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, 2 * Math.PI);
  ctx.fill();
};
```

---

### 13. Playlist.jsx (Notre playlist musicale)
**Route**: `/playlist`  
**Auth**: ✅ Oui  
**Description**: Playlist de chansons du couple avec intégration Spotify

**Fonctionnalités**:
- Récupère chansons depuis `GET /api/playlist?sortBy=playCount`
- Affichage liste avec titre, artiste, album
- Liens vers Spotify (spotifyUrl)
- Bouton favorite → `PATCH /api/playlist/:id/favorite`
- Compteur de lectures → `PATCH /api/playlist/:id/play`
- Tri par titre, artiste, playCount
- Filtrer favorites uniquement
- Raison d'ajout affichée

**Code clé**:
```javascript
const toggleFavorite = async (songId) => {
  await authenticatedFetch(`/api/playlist/${songId}/favorite`, {
    method: 'PATCH'
  });
  // Update local state
};

const incrementPlayCount = async (songId) => {
  await authenticatedFetch(`/api/playlist/${songId}/play`, {
    method: 'PATCH'
  });
  // Update local state
};
```

**Design**:
- Card layout avec cover image (si disponible)
- Bouton play (ouvre Spotify)
- Icône cœur pour favorite
- Badge playCount
- Reason en italique

---

## 🧩 Composants Réutilisables (6 composants)

### 1. FloatingHearts.jsx
**Description**: Cœurs animés flottants en arrière-plan

**Props**: Aucun  
**Utilisé dans**: TOUTES les pages

**Fonctionnalités**:
- Génère 10 cœurs aléatoires
- Animation float montante (CSS keyframes)
- Positions/tailles/vitesses aléatoires
- Z-index: -1 (derrière contenu)
- Couleurs pink/rose variées

**Implémentation**:
```javascript
const FloatingHearts = () => {
  const hearts = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${3 + Math.random() * 4}s`,
    animationDelay: `${Math.random() * 2}s`,
    fontSize: `${20 + Math.random() * 30}px`
  }));

  return (
    <div className="floating-hearts">
      {hearts.map(heart => (
        <span key={heart.id} className="heart" style={{...heart}}>
          💖
        </span>
      ))}
    </div>
  );
};
```

**CSS Keyframes** (App.css):
```css
@keyframes float {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
}

.heart {
  position: fixed;
  animation: float 5s linear infinite;
  z-index: -1;
}
```

---

### 2. PageTransition.jsx
**Description**: Wrapper pour transitions d'entrée/sortie de pages

**Props**: `{ children }`  
**Utilisé dans**: TOUTES les pages

**Fonctionnalités**:
- Framer Motion variants
- Animation d'entrée (fadeIn + slideUp)
- Animation de sortie (fadeOut)
- Durée: 0.3s
- Easing: easeInOut

**Implémentation**:
```javascript
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};
```

**Utilisation**:
```javascript
// Dans chaque page
return (
  <PageTransition>
    <div className="page-content">
      {/* Contenu de la page */}
    </div>
  </PageTransition>
);
```

---

### 3. ScrollToTop.jsx
**Description**: Scroll automatique en haut lors du changement de route

**Props**: Aucun  
**Utilisé dans**: App.jsx (une fois)

**Fonctionnalités**:
- useEffect sur location.pathname
- window.scrollTo(0, 0)
- Pas de rendu visuel

**Implémentation**:
```javascript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
```

---

### 4. RelationshipCounter.jsx
**Description**: Compteur du temps passé ensemble

**Props**: `{ startDate }`  
**Utilisé dans**: Home.jsx

**Fonctionnalités**:
- Calcul différence entre startDate et maintenant
- Affichage années, mois, jours, heures, minutes, secondes
- Mise à jour chaque seconde (setInterval)
- Animation numbers

**Implémentation**:
```javascript
const RelationshipCounter = ({ startDate }) => {
  const [timeElapsed, setTimeElapsed] = useState({});

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const start = new Date(startDate);
      const diff = now - start;

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
      // ... etc

      setTimeElapsed({ years, months, days, hours, minutes, seconds });
    };

    const interval = setInterval(calculateTime, 1000);
    calculateTime();

    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="relationship-counter">
      <p>{timeElapsed.years} ans {timeElapsed.months} mois {timeElapsed.days} jours</p>
      <p>{timeElapsed.hours}:{timeElapsed.minutes}:{timeElapsed.seconds}</p>
    </div>
  );
};
```

---

### 5. MusicPlayer.jsx
**Description**: Lecteur audio (UI uniquement, pas fonctionnel)

**Props**: Aucun  
**Utilisé dans**: App.jsx (global)

**Fonctionnalités**:
- UI bouton play/pause
- Barre de progression
- Volume control
- Nom de la chanson
- Design fixe en bas de page

**Note**: UI seulement, pas de lecture audio réelle actuellement

---

### 6. InstallPrompt.jsx
**Description**: Prompt pour installer l'app (PWA)

**Props**: Aucun  
**Utilisé dans**: App.jsx (global)

**Fonctionnalités**:
- Détecte si PWA installable (beforeinstallprompt)
- Affiche banner/modal "Installer l'app"
- Bouton "Installer" → prompt.prompt()
- Masque après installation
- localStorage pour ne pas re-afficher

**Implémentation**:
```javascript
const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="install-prompt">
      <p>Installer Princess Project ?</p>
      <button onClick={handleInstall}>Installer</button>
      <button onClick={() => setShowPrompt(false)}>Plus tard</button>
    </div>
  );
};
```

---

## 🎨 Design System

### Palette de Couleurs
```css
/* Principales */
--pink-50: #fdf2f8;
--pink-100: #fce7f3;
--pink-200: #fbcfe8;
--pink-300: #f9a8d4;
--pink-400: #f472b6;
--pink-500: #ec4899;  /* Princess pink */
--pink-600: #db2777;
--pink-700: #be185d;

--rose-50: #fff1f2;
--rose-100: #ffe4e6;
--rose-200: #fecdd3;
--rose-300: #fda4af;

--purple-100: #f3e8ff;
--purple-200: #e9d5ff;
--purple-300: #d8b4fe;

/* Backgrounds */
bg-pink-50: Fond principal pages
bg-rose-100: Cards, sections
bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300: Backgrounds boutons

/* Texts */
text-gray-800: Titres
text-gray-600: Sous-titres
text-gray-500: Texte secondaire
text-pink-600: Liens, accents
```

### Typographie
```css
/* Font principale */
font-family: 'Playfair Display', serif;

/* Tailles */
text-4xl: Titres principaux (36px)
text-3xl: Titres secondaires (30px)
text-2xl: Sous-titres (24px)
text-xl: Texte important (20px)
text-lg: Texte normal (18px)
text-base: Texte body (16px)

/* Weights */
font-bold: Titres (700)
font-semibold: Sous-titres (600)
font-normal: Body (400)
font-light: Descriptions (300)

/* Styles */
italic: Citations, raisons
```

### Espacements
```css
/* Padding */
p-2: 8px
p-4: 16px
p-6: 24px
p-8: 32px
p-12: 48px

/* Margin */
m-2 à m-12: Idem padding
mb-4: Margin bottom 16px
mt-8: Margin top 32px

/* Gap */
gap-4: 16px (grids)
gap-6: 24px
gap-8: 32px
```

### Borders & Shadows
```css
/* Borders */
border: 1px solid
border-2: 2px solid
rounded-lg: border-radius 8px
rounded-xl: border-radius 12px
rounded-full: border-radius 9999px

/* Shadows */
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
shadow: 0 1px 3px rgba(0,0,0,0.1)
shadow-md: 0 4px 6px rgba(0,0,0,0.1)
shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
shadow-xl: 0 20px 25px rgba(0,0,0,0.1)
shadow-2xl: 0 25px 50px rgba(0,0,0,0.25)
```

---

## 🎬 Animations (Framer Motion)

### Pattern Global
Toutes les animations utilisent Framer Motion avec des paramètres cohérents :

**Spring Physics**:
```javascript
const springConfig = {
  type: "spring",
  stiffness: 260,
  damping: 20
};
```

**Variants Communs**:
```javascript
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const slideIn = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 }
};

const scale = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 }
};
```

### Animations par Type

#### 1. Page Transitions (PageTransition.jsx)
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
```

#### 2. Stagger Children (Home.jsx)
```javascript
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {buttons.map(btn => (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
    >
      {btn}
    </motion.div>
  ))}
</motion.div>
```

#### 3. Hover Animations
```javascript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
```

#### 4. Layout Animations (Cards)
```javascript
<motion.div
  layout
  layoutId="card-1"
  transition={{ type: "spring", stiffness: 260, damping: 20 }}
>
```

#### 5. Scroll Animations (Reasons.jsx)
```javascript
<motion.div
  initial={{ opacity: 0, x: -50 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
```css
/* Mobile first approach */
sm: 640px   /* Tablets portrait */
md: 768px   /* Tablets landscape */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Patterns Responsives Utilisés

#### Grid Responsive (Home.jsx)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 col mobile, 2 cols tablet, 3 cols desktop */}
</div>
```

#### Text Responsive
```jsx
<h1 className="text-3xl sm:text-4xl lg:text-5xl">
  {/* 30px mobile, 36px tablet, 48px desktop */}
</h1>
```

#### Padding Responsive
```jsx
<div className="p-4 sm:p-6 lg:p-8">
  {/* 16px mobile, 24px tablet, 32px desktop */}
</div>
```

#### Display Responsive
```jsx
<div className="hidden sm:block">
  {/* Caché mobile, visible tablet+ */}
</div>

<div className="block sm:hidden">
  {/* Visible mobile, caché tablet+ */}
</div>
```

---

## 📲 PWA (Progressive Web App)

### Manifest (public/site.webmanifest)
```json
{
  "name": "Princess Project",
  "short_name": "Princess",
  "description": "Une app d'amour pour ma princesse 💖",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fce7f3",
  "theme_color": "#ff69b4",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Service Worker (via vite-plugin-pwa)
```javascript
// Généré automatiquement par Vite PWA
// Stratégie: Cache-first pour assets, Network-first pour API
registerSW({
  onNeedRefresh() {
    // Prompt user pour reload
  },
  onOfflineReady() {
    // App ready to work offline
  }
});
```

### Features PWA
- ✅ Installable (Add to Home Screen)
- ✅ Offline capable (Service Worker)
- ✅ App-like experience (standalone display)
- ✅ Icons pour iOS/Android
- ✅ Splash screen
- ✅ Theme color

---

## 🛠️ Scripts NPM

```json
{
  "scripts": {
    "dev": "vite",                    // Dev server (hot reload)
    "build": "vite build",            // Production build
    "preview": "vite preview",        // Preview production build
    "lint": "eslint ."                // Lint code
  }
}
```

### Commandes d'utilisation
```bash
# Développement
npm run dev
# → http://localhost:1308

# Build production
npm run build
# → Génère dist/

# Preview build
npm run preview

# Linting
npm run lint
```

---

## 🚀 Build & Déploiement

### Build Production
```bash
npm run build
```

**Output** (dist/):
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [autres assets hachés]
├── favicon_assets/
└── manifest.json
```

### Déploiement Recommandé
- **Vercel**: Excellent pour React + Vite
- **Netlify**: Alternative populaire
- **GitHub Pages**: Option gratuite
- **Cloudflare Pages**: CDN global

### Variables d'environnement Production
```bash
# .env.production
VITE_API_URL=https://your-backend-url.com
```

### Checklist Pré-déploiement
- [ ] VITE_API_URL pointant vers backend prod
- [ ] Assets optimisés (images compressées)
- [ ] PWA manifest configuré
- [ ] Icons générés (192x192, 512x512)
- [ ] ESLint sans erreurs
- [ ] Build réussi (`npm run build`)
- [ ] Preview testé (`npm run preview`)

---

## 🎯 Points Clés pour IA

1. **Architecture**: React 19 + Vite + Tailwind + Framer Motion
2. **Pages**: 13 pages (1 publique + 12 protégées)
3. **Composants**: 6 composants réutilisables
4. **Auth**: JWT stocké localStorage, vérification à chaque route
5. **API Client**: authenticatedFetch dans Utils/api.js
6. **Design**: Pink/Rose palette, Playfair Display font
7. **Animations**: Framer Motion avec spring physics (260/20)
8. **Responsive**: Mobile-first Tailwind
9. **PWA**: Installable, offline-capable
10. **Pattern uniforme**: Toutes les pages utilisent FloatingHearts + PageTransition

---

## 🔗 Routes & Endpoints Utilisés

| Page | Route Frontend | Backend Endpoint(s) | Méthode |
|------|----------------|---------------------|---------|
| Login | `/login` | `/api/auth/login` | POST |
| Home | `/` | - | - |
| Valentine | `/valentine` | `/api/valentine` | GET, POST |
| Success | `/success` | - | - |
| DateIdeas | `/date-ideas` | `/api/planning` | GET, POST, PATCH |
| OpenWhen | `/open-when` | `/api/messages` | GET |
| OurStory | `/our-story` | - | - |
| Reasons | `/reasons` | - | - |
| Coupons | `/coupons` | `/api/coupons`, `/api/coupons/:id/redeem` | GET, PATCH |
| Wheel | `/wheel` | - | - |
| Quiz | `/quiz` | `/api/quiz/questions`, `/api/quiz/answers`, `/api/quiz/statistics` | GET, POST |
| Scratch | `/scratch` | - | - |
| Playlist | `/playlist` | `/api/playlist`, `/api/playlist/:id/favorite`, `/api/playlist/:id/play` | GET, PATCH |

---

**Date de dernière mise à jour**: 23 février 2026  
**Auteur**: The Prince  
**Version**: 0.0.0
