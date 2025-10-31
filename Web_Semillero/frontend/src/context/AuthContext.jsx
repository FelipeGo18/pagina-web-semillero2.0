import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar usuario al iniciar
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          // Verificar que el token siga siendo válido
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Token inválido o expirado
          console.error('Error al verificar usuario:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al registrar usuario';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar perfil';
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
