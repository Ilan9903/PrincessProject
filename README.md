# 💝 Princess Project

> A romantic Valentine's Day web application built with love for Babawa

## 📖 Description

Princess Project is a charming full-stack web application designed to create a special Valentine's Day experience. The app features multiple interactive pages including a Valentine's request, random date idea generator, "Open When" letters, relationship counter, and much more - all wrapped in a beautiful and playful interface with custom animations.

## ✨ Features

### 🌹 Core Features
- **Valentine Request**: An interactive Valentine's Day proposal with a playful "Yes/No" interface where the "No" button runs away
- **Success Celebration**: Full-screen confetti animation and celebration page when she says yes
- **Floating Hearts**: Animated background hearts that float across all pages
- **Relationship Counter**: Real-time counter showing time together in multiple formats (seconds, minutes, hours, days, weeks, months, years, and heartbeats!)

### 🎲 Interactive Pages
- **Date Ideas Generator**: Random date idea picker with 40+ curated suggestions across categories:
  - ❤️ Romantic (massages, candlelit dinners, sunset watching)
  - 🛋️ Chill & Cocooning (Netflix nights, pillow forts, reading together)
  - 🍔 Foodie Adventures (homemade pizza, food roulette, chocolate fondue)
  - 🎲 Fun & Activities (board games, karaoke, escape rooms, video games)
  - 🌍 Adventures & Outings (road trips, cinema, museums, nature walks)
  - 👑 Special Princess (joker cards, special surprises)
  
- **Open When Letters**: 6 personalized letters for different moods:
  - When you're sad 😢
  - When you miss me 🥺
  - When you're angry at me 😡
  - When you need to laugh 😂
  - When you doubt us 💭
  - When you need motivation 💪

### 🚧 Coming Soon (WIP)
- **Our Story**: Photo gallery of relationship memories
- **100 Reasons Why**: Daily dose of love and appreciation
- **Gift Coupons**: Redeemable tickets for special treats
- **The Evening Wheel**: Decision wheel for indecisive evenings
- **Planning**: Shared calendar
- **To-Do List**: Couple's task manager

### 🎨 Design Features
- **Beautiful UI**: Modern gradient design with Tailwind CSS
- **Custom Animations**: 
  - Smooth fade-in effects
  - Floating hearts background
  - Pulse animations
  - Page transitions
  - Hover effects with smooth transforms
- **Custom Typography**: Playfair Display font for elegant headings
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Protected Access**: Login system with password protection

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library
- **Vite 7.3.1** - Lightning-fast build tool
- **React Router DOM 7.13.0** - Client-side routing with page transitions
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Axios 1.13.5** - HTTP client for API calls
- **React Confetti 6.4.0** - Celebration animations
- **Custom CSS Animations** - Floating hearts, smooth fades, pulse effects

### Backend
- **Node.js** with **Express 5.2.1** - Web server framework
- **Firebase Admin 13.6.1** - Backend services and Firestore database
- **CORS 2.8.6** - Cross-origin resource sharing
- **Nodemon 3.1.11** - Auto-restart during development

## 📁 Project Structure

```
PrincessProject/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── pages/     # Route components
│   │   │   ├── Home.jsx
│   │   │   ├── Valentine-request.jsx
│   │   │   ├── Valentine-success.jsx
│   │   │   ├── DateIdeas.jsx
│   │   │   └── OpenWhen.jsx
│   │   ├── components/
│   │   │   ├── FloatingHearts.jsx
│   │   │   ├── RelationshipCounter.jsx
│   │   │   └── PageTransition.jsx
│   │   ├── assets/    # Images and media
│   │   ├── App.jsx    # Main app component with routing
│   │   ├── main.jsx   # Application entry point
│   │   └── index.css  # Global styles & animations
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/           # Express backend server
│   ├── index.js       # Server entry point with API routes
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ilan9903/PrincessProject.git
   cd PrincessProject
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```
   
   - Add your Firebase Admin SDK credentials file to the `backend` directory
   - Update the service account import in `index.js` if needed

3. **Set up the Frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:2106`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:1308`

3. **Open your browser**
   Navigate to `http://localhost:1308`

## 📡 API Endpoints

### `GET /`
Health check endpoint
- Returns: Server status message

### `POST /api/valentine-response`
Records the Valentine's Day response to Firestore

**Request Body:**
```json
{
  "answer": "OUI",
  "timestamp": "2026-02-14T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Réponse enregistrée pour l'éternité (jusqu'à l'année prochaine)"
}
```

## 🎯 Available Routes

- `/` - Home page with navigation menu
- `/valentine` - Valentine's request page
- `/success` - Success celebration page (confetti!)
- `/date-ideas` - Random date idea generator
- `/open-when` - Open when letters page
- `/our-story` - Photo gallery (WIP)
- `/reasons` - 100 reasons why (WIP)
- `/coupons` - Gift coupons (WIP)
- `/wheel` - The evening wheel (WIP)

## 🧑‍💻 Development

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend Scripts
```bash
npm run dev      # Start development server with nodemon
```

## 🔧 Configuration

### Frontend (Vite)
- Development server runs on port **1308**
- Configured with React and Tailwind CSS plugins
- Custom font: Playfair Display from Google Fonts
- Custom animations defined in index.css

### Backend (Express)
- Server runs on port **2106** (or `process.env.PORT`)
- CORS enabled for cross-origin requests
- Firebase Firestore for data persistence
- Stores Valentine responses in `valentine-responses` collection

## 🎨 Custom Animations

The project includes several custom CSS animations:
- **float**: Hearts floating upward with rotation
- **fade-in-up**: Smooth entrance animation
- **smooth-fade-in**: Gentle fade with scale and blur
- **pulse-slow**: Subtle pulsing effect

## 📦 Dependencies

### Frontend Dependencies
- `react`, `react-dom` - Core React libraries
- `react-router-dom` - Client-side routing
- `@tailwindcss/vite` - Tailwind CSS integration
- `axios` - HTTP requests to backend API
- `react-confetti` - Celebration confetti animations

### Backend Dependencies
- `express` - Web server framework
- `firebase-admin` - Firebase backend services
- `cors` - Cross-origin resource sharing middleware
- `dotenv` - Environment variable management
- `nodemon` - Development auto-reload

## 🎭 Key Features Explained

### Relationship Counter
Displays the time you've been together in rotating formats:
- Real-time updates every second
- Cycles through 8 different time formats every 6 seconds
- Includes heartbeat calculation (75 bpm average)
- Smooth transitions with custom animations

### Date Ideas Generator
- 40+ handcrafted date suggestions
- Roulette animation effect (25 shuffles)
- Color-coded categories
- Prevents double-clicking during animation
- Randomized selection algorithm

### Valentine Request
- "No" button that runs away when hovered
- "Yes" button grows larger with each "No" attempt
- Collision detection to avoid overlap
- Records response to Firebase
- Redirects to celebration page on "Yes"

## 💖 Special Thanks

Made with love for **Babawa** 💝

Developed with ❤️ by ton chéri

## 📄 License

ISC

---

*"She said YES!" 🎉*