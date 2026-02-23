const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2106';

// Récupérer le token stocké
const getToken = () => {
  return localStorage.getItem('princess_token');
};

// Stocker le token
const setToken = (token) => {
  localStorage.setItem('princess_token', token);
  localStorage.setItem('princess_access', 'true'); // Pour compatibilité
};

// Supprimer le token
const removeToken = () => {
  localStorage.removeItem('princess_token');
  localStorage.removeItem('princess_access');
};

// Vérifier si authentifié
const isAuthenticated = () => {
  return !!getToken();
};

// Login avec mot de passe
export const login = async (password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (data.success && data.token) {
      setToken(data.token);
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
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Erreur vérification token:', error);
    return false;
  }
};

// Logout
export const logout = () => {
  removeToken();
};

// Fetch avec authentification
export const authenticatedFetch = async (url, options = {}) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Non authentifié');
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401 || response.status === 403) {
    removeToken();
    window.location.href = '/';
    throw new Error('Session expirée');
  }

  return response;
};

export { isAuthenticated, getToken };