import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios con configuración
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // IMPORTANTE: Para enviar/recibir cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token en cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Registro
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data.user;
  },

  // Actualizar perfil
  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    const response = await api.put('/auth/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtener usuario guardado
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default api;
