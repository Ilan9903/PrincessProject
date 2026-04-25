import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHearts from '../components/FloatingHearts';
import ThemeToggle from '../components/ThemeToggle';
import { login, register } from '../Utils/api';

const Login = ({ onLogin }) => {
  const [searchParams] = useSearchParams();

  // Vue principale : connexion ou inscription
  const [authView, setAuthView] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');

  // Mode de connexion : 'credentials' ou 'pin'
  const [mode, setMode] = useState('credentials');
  
  // State pour le mode email/password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // State inscription
  const [displayName, setDisplayName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerPin, setRegisterPin] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State pour le mode PIN
  const [pin, setPin] = useState('');
  
  // State commun
  const [error, setError] = useState('');
  const [shakeError, setShakeError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const triggerError = (message) => {
    setError(message);
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError('');

    const result = await login({ email, password });
    setIsLoading(false);

    if (result.success) {
      if (onLogin) onLogin(result.user);
      navigate('/');
    } else {
      triggerError(result.error || 'Identifiants incorrects');
      setPassword('');
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) return;

    setIsLoading(true);
    setError('');

    const result = await login({ pin });
    setIsLoading(false);

    if (result.success) {
      if (onLogin) onLogin(result.user);
      navigate('/');
    } else {
      triggerError(result.error || 'Code PIN incorrect');
      setPin('');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!displayName || !registerEmail || !registerPassword) {
      triggerError('Pseudo, email et mot de passe sont requis');
      return;
    }

    if (registerPassword.length < 6) {
      triggerError('Le mot de passe doit faire au moins 6 caractères');
      return;
    }

    if (registerPassword !== confirmPassword) {
      triggerError('Les mots de passe ne correspondent pas');
      return;
    }

    if (registerPin && !/^\d{4}$/.test(registerPin)) {
      triggerError('Le PIN doit contenir exactement 4 chiffres');
      return;
    }

    setIsLoading(true);
    const result = await register({
      displayName,
      email: registerEmail,
      password: registerPassword,
      pin: registerPin || undefined,
    });
    setIsLoading(false);

    if (result.success) {
      if (onLogin) onLogin(result.user);
      navigate('/');
      return;
    }

    triggerError(result.error || 'Erreur d\'inscription');
  };

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPin(value);
    }
  };

  const getCursorPosition = () => {
    switch (pin.length) {
      case 0: return '0px';   
      case 1: return '20px';  
      case 2: return '40px';  
      case 3: return '60px';  
      default: return '0px';
    }
  };

  return (
    <div className="fixed inset-0 z-100 bg-pink-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 font-['Playfair_Display'] overflow-hidden transition-colors duration-300">
      <FloatingHearts />
      <ThemeToggle />
      <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-[2px]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-sm bg-white/80 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white dark:border-gray-700 flex flex-col items-center text-center transition-colors duration-300"
      >
        <div className="text-4xl mb-4">👑</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Espace Privé</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 italic transition-colors">Accès réservé</p>

        <div className="flex w-full mb-4 bg-pink-50 dark:bg-gray-700 rounded-xl p-1">
          <button
            type="button"
            onClick={() => {
              setAuthView('login');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              authView === 'login'
                ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-pink-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthView('register');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              authView === 'register'
                ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-pink-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            S'inscrire
          </button>
        </div>

        {/* Onglets de mode connexion */}
        {authView === 'login' && (
        <div className="flex w-full mb-6 bg-pink-50 dark:bg-gray-700 rounded-xl p-1">
          <button 
            type="button"
            onClick={() => { setMode('credentials'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              mode === 'credentials' 
                ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-pink-400 shadow-sm' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            📧 Email
          </button>
          <button 
            type="button"
            onClick={() => { setMode('pin'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              mode === 'pin' 
                ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-pink-400 shadow-sm' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            🔢 PIN
          </button>
        </div>
        )}

        {/* Message d'erreur */}
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 dark:text-red-400 text-sm mb-4 font-medium"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {authView === 'register' ? (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRegisterSubmit}
              className="w-full flex flex-col gap-4"
            >
              <label htmlFor="register-display-name" className="sr-only">Pseudo</label>
              <input
                id="register-display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Pseudo"
                className="w-full px-4 py-3 bg-pink-50 dark:bg-gray-700 border-2 border-pink-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder:text-pink-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all"
                autoFocus
                autoComplete="nickname"
                disabled={isLoading}
              />

              <label htmlFor="register-email" className="sr-only">Adresse email</label>
              <input
                id="register-email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 bg-pink-50 dark:bg-gray-700 border-2 border-pink-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder:text-pink-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all"
                autoComplete="email"
                disabled={isLoading}
              />

              <div className="relative">
                <label htmlFor="register-password" className="sr-only">Mot de passe</label>
                <input
                  id="register-password"
                  type={showRegisterPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Mot de passe (min 6)"
                  className="w-full px-4 py-3 pr-12 bg-pink-50 dark:bg-gray-700 border-2 border-pink-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder:text-pink-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  aria-label={showRegisterPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  {showRegisterPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <div className="relative">
                <label htmlFor="register-confirm-password" className="sr-only">Confirmer le mot de passe</label>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer le mot de passe"
                  className="w-full px-4 py-3 pr-12 bg-pink-50 dark:bg-gray-700 border-2 border-pink-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder:text-pink-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Masquer la confirmation' : 'Afficher la confirmation'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <label htmlFor="register-pin" className="sr-only">PIN optionnel (4 chiffres)</label>
              <input
                id="register-pin"
                type="text"
                inputMode="numeric"
                maxLength="4"
                value={registerPin}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,4}$/.test(value)) {
                    setRegisterPin(value);
                  }
                }}
                placeholder="PIN optionnel (4 chiffres)"
                className="w-full px-4 py-3 bg-pink-50 dark:bg-gray-700 border-2 border-pink-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder:text-pink-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading || !displayName || !registerEmail || !registerPassword || !confirmPassword}
                className="w-full py-4 bg-linear-to-r from-pink-400 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <span>✨</span>
                  </>
                )}
              </button>
            </motion.form>
          ) : mode === 'credentials' ? (
            /* ── Formulaire Email / Mot de passe ── */
            <motion.form 
              key="credentials"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleCredentialsSubmit} 
              className="w-full flex flex-col gap-4"
            >
              <motion.div
                animate={shakeError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <label htmlFor="login-email" className="sr-only">Adresse email</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-pink-50 dark:bg-gray-700 border-2 border-pink-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder:text-pink-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all"
                  autoFocus
                  autoComplete="email"
                  disabled={isLoading}
                />
              </motion.div>

              <div className="relative">
                <label htmlFor="login-password" className="sr-only">Mot de passe</label>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full px-4 py-3 pr-12 bg-pink-50 dark:bg-gray-700 border-2 border-pink-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder:text-pink-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all"
                  autoComplete="current-password"
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

              <button 
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full py-4 bg-linear-to-r from-pink-400 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <span>🔓</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <a href="/forgot-password" className="text-pink-500 dark:text-pink-400 text-sm hover:underline">
                  Mot de passe oublié ? 🔑
                </a>
              </div>
            </motion.form>
          ) : (
            /* ── Formulaire PIN ── */
            <motion.form 
              key="pin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handlePinSubmit} 
              className="w-full flex flex-col gap-6"
            >
              <motion.div 
                animate={shakeError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative w-full flex justify-center"
              >
                <label htmlFor="login-pin" className="sr-only">Code PIN à 4 chiffres</label>
                <input
                  id="login-pin"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="4"
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="Code PIN" 
                  className="w-full text-center text-3xl tracking-[1em] font-bold py-4 bg-pink-50 dark:bg-gray-700 border-2 border-pink-200 dark:border-gray-600 rounded-xl text-pink-600 dark:text-pink-400 placeholder:text-pink-300 dark:placeholder:text-gray-500 placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/30 transition-all shadow-inner caret-transparent relative z-0"
                  autoFocus
                  disabled={isLoading}
                />

                {/* BARRE CLIGNOTANTE PERSONNALISÉE */}
                {pin.length < 4 && !isLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <motion.div 
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="h-8 w-0.5 bg-pink-600 rounded-full"
                      style={{ 
                        x: getCursorPosition(),
                      }} 
                    />
                  </div>
                )}
              </motion.div>

              <button 
                type="submit"
                disabled={isLoading || pin.length !== 4}
                className="w-full py-4 bg-linear-to-r from-pink-400 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Vérification...</span>
                  </>
                ) : (
                  <>
                    <span>Entrer</span>
                    <span>🔓</span>
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 transition-colors">
          {authView === 'register'
            ? 'Ton compte sera connecté automatiquement après inscription 💖'
            : mode === 'pin'
              ? 'Indice : La date de notre rencontre...'
              : 'Connecte-toi avec ton compte 💖'}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;