import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import FloatingHearts from '../components/FloatingHearts';
import ThemeToggle from '../components/ThemeToggle';
import { resetPassword } from '../Utils/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const userId = searchParams.get('id');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Lien invalide (pas de token ou userId)
  if (!token || !userId) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 dark:border-gray-700 p-8 max-w-md w-full text-center transition-colors">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Lien invalide</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Ce lien de réinitialisation est invalide ou incomplet.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block px-6 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(token, userId, newPassword);

    if (result.success) {
      setSuccess(true);
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
              {success ? '✅' : '🔐'}
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 font-['Playfair_Display']">
              {success ? 'Mot de passe modifié !' : 'Nouveau mot de passe'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              {success
                ? 'Tu peux maintenant te reconnecter 💖'
                : 'Choisis un nouveau mot de passe sécurisé'}
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Link
                to="/login"
                className="inline-block mt-2 px-8 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Se connecter 🔓
              </Link>
            </motion.div>
          ) : (
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

              {/* Nouveau mot de passe */}
              <div className="relative">
                <label htmlFor="new-password" className="sr-only">Nouveau mot de passe</label>
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  className="w-full px-4 py-3 pr-12 bg-pink-50 dark:bg-gray-700 border-2 border-pink-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder:text-pink-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Confirmation */}
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirmer le mot de passe</label>
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer le mot de passe"
                  className="w-full px-4 py-3 bg-pink-50 dark:bg-gray-700 border-2 border-pink-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder:text-pink-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>

              {/* Indicateur de force */}
              {newPassword && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        newPassword.length >= 10 ? 'w-full bg-green-500' :
                        newPassword.length >= 8 ? 'w-2/3 bg-yellow-500' :
                        newPassword.length >= 6 ? 'w-1/3 bg-orange-500' :
                        'w-1/6 bg-red-500'
                      }`}
                    />
                  </div>
                  <span className={`${
                    newPassword.length >= 10 ? 'text-green-500' :
                    newPassword.length >= 8 ? 'text-yellow-500' :
                    'text-orange-500'
                  }`}>
                    {newPassword.length >= 10 ? 'Fort' : newPassword.length >= 8 ? 'Moyen' : 'Faible'}
                  </span>
                </div>
              )}

              {/* Correspondance */}
              {confirmPassword && (
                <p className={`text-xs ${newPassword === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                  {newPassword === confirmPassword ? '✓ Les mots de passe correspondent' : '✗ Les mots de passe ne correspondent pas'}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
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
                    Réinitialisation...
                  </>
                ) : (
                  'Réinitialiser le mot de passe 🔐'
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

export default ResetPassword;
