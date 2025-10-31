import api from './authApi';

export const progressService = {
  // Obtener todo mi progreso
  async getMyProgress() {
    const response = await api.get('/progress');
    return response.data;
  },

  // Obtener progreso en un contenido específico
  async getProgress(contentType, contentId) {
    const response = await api.get(`/progress/${contentType}/${contentId}`);
    return response.data;
  },

  // Marcar clase como completada
  async markClassCompleted(contentType, contentId, classData) {
    const response = await api.post(
      `/progress/${contentType}/${contentId}/class`,
      classData
    );
    return response.data;
  },

  // Marcar ejercicio como completado
  async markExerciseCompleted(contentType, contentId, exerciseData) {
    const response = await api.post(
      `/progress/${contentType}/${contentId}/exercise`,
      exerciseData
    );
    return response.data;
  },

  // Actualizar progreso general
  async updateProgress(contentType, contentId, progressData) {
    const response = await api.put(
      `/progress/${contentType}/${contentId}`,
      progressData
    );
    return response.data;
  },

  // Resetear progreso
  async resetProgress(contentType, contentId) {
    const response = await api.delete(`/progress/${contentType}/${contentId}`);
    return response.data;
  }
};
