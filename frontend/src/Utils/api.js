const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2106';

// Vérifier si authentifié (appelle le backend pour vérifier le cookie)
export const isAuthenticated = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      credentials: 'include', // Envoie les cookies HttpOnly
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Login avec mot de passe
export const login = async (password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      credentials: 'include', // Permet de recevoir les cookies HttpOnly
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (data.success) {
      // Le token est maintenant stocké dans un cookie HttpOnly automatiquement
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Erreur de connexion' };
    }
  } catch (error) {
    console.error('Erreur login:', error);
    return { success: false, error: 'Erreur de connexion au serveur' };
  }
};

// Vérifier la validité du token
export const verifyToken = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      credentials: 'include', // Envoie les cookies HttpOnly
    });

    return response.ok;
  } catch (error) {
    console.error('Erreur vérification token:', error);
    return false;
  }
};

// Logout
export const logout = async () => {
  try {
    // Appeler l'endpoint logout du backend pour blacklister le token et supprimer le cookie
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Envoie les cookies HttpOnly
    });
  } catch (error) {
    console.error('Erreur lors du logout:', error);
  }
};

// Fetch avec authentification
export const authenticatedFetch = async (url, options = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include', // Envoie automatiquement les cookies HttpOnly
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401 || response.status === 403) {
    window.location.href = '/';
    throw new Error('Session expirée');
  }

  return response;
};