// Servicio para consumir la API de lecciones
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Obtiene todos los módulos disponibles
 */
export async function getAllModules() {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons/modules`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener módulos');
    }
    
    return data.modules;
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }
}

/**
 * Obtiene un módulo completo con todas sus clases
 * @param {number} moduleId - ID del módulo
 */
export async function getModule(moduleId) {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons/modules/${moduleId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener módulo');
    }
    
    return data.module;
  } catch (error) {
    console.error(`Error fetching module ${moduleId}:`, error);
    throw error;
  }
}

/**
 * Obtiene una clase específica de un módulo
 * @param {number} moduleId - ID del módulo
 * @param {number} classId - ID de la clase
 */
export async function getLesson(moduleId, classId) {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons/modules/${moduleId}/classes/${classId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener lección');
    }
    
    return data.lesson;
  } catch (error) {
    console.error(`Error fetching lesson ${moduleId}.${classId}:`, error);
    throw error;
  }
}

/**
 * Obtiene solo la información básica de un módulo (sin las clases)
 * @param {number} moduleId - ID del módulo
 */
export async function getModuleInfo(moduleId) {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons/modules/${moduleId}/info`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener info del módulo');
    }
    
    return data.module;
  } catch (error) {
    console.error(`Error fetching module info ${moduleId}:`, error);
    throw error;
  }
}

/**
 * Convierte el módulo del API al formato usado por el frontend
 * @param {Object} moduleData - Datos del módulo desde el API
 */
export function convertModuleToFrontendFormat(moduleData) {
  const converted = {};
  
  // Convertir el objeto classes de string keys a number keys
  Object.entries(moduleData.classes).forEach(([key, value]) => {
    converted[parseInt(key)] = value;
  });
  
  return converted;
}

/**
 * Cache simple para evitar llamadas repetidas
 */
const cache = {
  modules: null,
  lessons: {}
};

/**
 * Obtiene un módulo con cache
 */
export async function getModuleWithCache(moduleId) {
  const cacheKey = `module_${moduleId}`;
  
  if (cache.lessons[cacheKey]) {
    return cache.lessons[cacheKey];
  }
  
  const module = await getModule(moduleId);
  cache.lessons[cacheKey] = module;
  
  return module;
}

/**
 * Limpia el cache
 */
export function clearCache() {
  cache.modules = null;
  cache.lessons = {};
}
