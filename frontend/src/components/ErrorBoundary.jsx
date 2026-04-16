import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Silencieux en production — l'UI de fallback gère l'affichage
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
          <div className="text-center max-w-md">
            <p className="text-6xl mb-4">💔</p>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Oups, quelque chose s'est cassé…
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Pas de panique, ça arrive même aux meilleures princesses !
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-5 py-2.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
              >
                Réessayer ✨
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false })}
                className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Accueil 🏠
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
