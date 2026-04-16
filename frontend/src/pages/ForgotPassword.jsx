import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import FloatingHearts from '../components/FloatingHearts';
import ThemeToggle from '../components/ThemeToggle';
import { forgotPassword } from '../Utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await forgotPassword(email);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error || 'Une erreur est survenue');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden transition-colors">
      <FloatingHearts />
      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 dark:border-gray-700 p-8 transition-colors">
          
          {/* Icône */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-5xl mb-3"
            >
              {sent ? '📧' : '🔑'}
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 font-['Playfair_Display']">
              {sent ? 'Email envoyé !' : 'Mot de passe oublié'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              {sent
                ? 'Vérifie ta boîte mail (et les spams) 💌'
                : 'Entre ton email pour recevoir un lien de réinitialisation'}
            </p>
          </div>

          {sent ? (
            /* Message de confirmation */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Si un compte existe avec <strong>{email}</strong>, tu recevras un email avec un lien pour réinitialiser ton mot de passe.
                </p>
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-xs">
                Le lien expire dans 1 heure.
              </p>
              <Link
                to="/login"
                className="inline-block mt-4 px-6 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Retour à la connexion
              </Link>
            </motion.div>
          ) : (
            /* Formulaire */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label htmlFor="forgot-email" className="sr-only">Adresse email</label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ton adresse email"
                  className="w-full px-4 py-3 bg-pink-50 dark:bg-gray-700 border-2 border-pink-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder:text-pink-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all"
                  autoFocus
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || !email}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200/50 dark:shadow-pink-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer le lien 📧'
                )}
              </motion.button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-pink-500 dark:text-pink-400 text-sm hover:underline"
                >
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
