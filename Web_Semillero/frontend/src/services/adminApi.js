import api from './authApi';

export const adminService = {
  // Estadísticas
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Usuarios
  async getUsers(params = {}) {
    const { page = 1, limit = 20, search = '', role = '' } = params;
    const response = await api.get('/admin/users', {
      params: { page, limit, search, role }
    });
    return response.data;
  },

  async getUser(userId) {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  async updateUser(userId, userData) {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Progreso
  async getAllProgress(params = {}) {
    const { page = 1, limit = 20 } = params;
    const response = await api.get('/admin/progress', {
      params: { page, limit }
    });
    return response.data;
  }
};
