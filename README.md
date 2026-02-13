# 💝 Princess Project

> A romantic Valentine's Day web application built with love for Babawa

## 📖 Description

Princess Project is a charming full-stack web application designed to create a special Valentine's Day experience. The app features multiple interactive pages including a Valentine's request, date ideas, and "Open When" letters, all wrapped in a beautiful and playful interface.

## ✨ Features

- 🌹 **Valentine Request**: An interactive Valentine's Day proposal with a playful "Yes/No" interface
- 🎉 **Success Celebration**: Confetti animation and celebration page
- 💡 **Date Ideas**: Creative date suggestions for special moments
- 💌 **Open When Letters**: Thoughtful messages for different occasions
- 🎨 **Beautiful UI**: Modern design with Tailwind CSS and smooth animations
- 📱 **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library
- **Vite 7.3.1** - Lightning-fast build tool
- **React Router DOM 7.13.0** - Client-side routing
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Axios 1.13.5** - HTTP client

### Backend
- **Node.js** with **Express 5.2.1** - Web server framework
- **Firebase Admin 13.6.1** - Backend services and Firestore database

## 📁 Project Structure

```
PrincessProject/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── pages/     # Route components
│   │   ├── App.jsx    # Main app component
│   │   └── main.jsx   # Application entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/           # Express backend server
│   ├── index.js       # Server entry point
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

- `/` - Home page
- `/valentine` - Valentine's request page
- `/date-ideas` - Date ideas page
- `/open-when` - Open when letters page

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

### Backend (Express)
- Server runs on port **2106** (or `process.env.PORT`)
- CORS enabled for cross-origin requests
- Firebase Firestore for data persistence

## 📦 Dependencies

### Frontend Dependencies
- `react`, `react-dom` - Core React libraries
- `react-router-dom` - Routing
- `@tailwindcss/vite` - Tailwind CSS integration
- `axios` - HTTP requests
- `react-confetti` - Confetti animations

### Backend Dependencies
- `express` - Web framework
- `firebase-admin` - Firebase backend services
- `cors` - CORS middleware
- `dotenv` - Environment variables

## 💖 Special Thanks

Made with love for **Babawa** 💝

## 📄 License

ISC

---

*"She said YES!" 🎉*
