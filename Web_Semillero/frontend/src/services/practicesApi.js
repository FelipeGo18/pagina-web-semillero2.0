/**
 * API Service para Prácticas
 * Maneja todas las peticiones relacionadas con las prácticas del semillero
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Cache simple en memoria
const cache = {
  practices: null,
  lastFetch: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene todas las prácticas
 * @returns {Promise<Array>} Array de prácticas
 */
export async function getAllPractices() {
  try {
    const response = await fetch(`${API_BASE_URL}/practices`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.practices || [];
  } catch (error) {
    console.error('Error fetching practices:', error);
    throw new Error('No se pudieron cargar las prácticas. Verifica tu conexión.');
  }
}

/**
 * Obtiene una práctica específica por ID
 * @param {number} practiceId - ID de la práctica
 * @returns {Promise<Object>} Datos de la práctica
 */
export async function getPractice(practiceId) {
  try {
    const response = await fetch(`${API_BASE_URL}/practices/${practiceId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Práctica ${practiceId} no encontrada`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.practice;
  } catch (error) {
    console.error('Error fetching practice:', error);
    throw error;
  }
}

/**
 * Obtiene todas las prácticas con cache
 * @returns {Promise<Array>} Array de prácticas
 */
export async function getPracticesWithCache() {
  const now = Date.now();
  
  // Si hay datos en cache y no han expirado, retornarlos
  if (cache.practices && cache.lastFetch && (now - cache.lastFetch) < CACHE_DURATION) {
    console.log('📦 Usando prácticas desde cache');
    return cache.practices;
  }
  
  // Si no hay cache o expiró, hacer fetch
  console.log('🌐 Obteniendo prácticas desde API');
  const practices = await getAllPractices();
  
  // Guardar en cache
  cache.practices = practices;
  cache.lastFetch = now;
  
  return practices;
}

/**
 * Limpia el cache de prácticas
 */
export function clearPracticesCache() {
  cache.practices = null;
  cache.lastFetch = null;
  console.log('🗑️ Cache de prácticas limpiado');
}

export default {
  getAllPractices,
  getPractice,
  getPracticesWithCache,
  clearPracticesCache
};
