const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2106';

/**
 * Vérifier si authentifié et récupérer les infos utilisateur
 * @returns {Promise<{authenticated: boolean, user: object|null}>}
 */
export const isAuthenticated = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      credentials: 'include',
    });
    
    if (!response.ok) return { authenticated: false, user: null };
    
    const data = await response.json();
    return { 
      authenticated: true, 
      user: data.user || null 
    };
  } catch {
    return { authenticated: false, user: null };
  }
};

/**
 * Login avec email/password ou PIN
 * @param {object} credentials - { email, password } ou { pin }
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.success) {
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error || 'Erreur de connexion' };
    }
  } catch {
    return { success: false, error: 'Erreur de connexion au serveur' };
  }
};

/**
 * Inscription
 * @param {object} userData - { email, password, displayName, pin? }
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.success) {
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error || 'Erreur d\'inscription' };
    }
  } catch {
    return { success: false, error: 'Erreur de connexion au serveur' };
  }
};

// Logout
export const logout = async () => {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Silencieux - l'erreur logout n'empêche pas la navigation
  }
};

/**
 * Demander un email de réinitialisation de mot de passe
 * @param {string} email
 */
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch {
    return { success: false, error: 'Erreur de connexion au serveur' };
  }
};

/**
 * Réinitialiser le mot de passe avec le token
 * @param {string} token
 * @param {string} userId
 * @param {string} newPassword
 */
export const resetPassword = async (token, userId, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, userId, newPassword }),
    });
    return await response.json();
  } catch {
    return { success: false, error: 'Erreur de connexion au serveur' };
  }
};

// Fetch avec authentification
export const authenticatedFetch = async (url, options = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401 || response.status === 403) {
    window.location.href = '/login';
    throw new Error('Session expirée');
  }

  return response;
};