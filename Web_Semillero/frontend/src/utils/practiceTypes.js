/**
 * Utilidades para tipos de prácticas
 */

export const PRACTICE_TYPES = {
  'linux-terminal': {
    label: '🖥️ Terminal Linux',
    description: 'Ejercicios interactivos con comandos',
    itemName: 'ejercicio',
    itemNamePlural: 'ejercicios',
    color: '#2ecc71'
  },
  'teorica': {
    label: '📚 Teórica',
    description: 'Contenido de lectura y conceptos',
    itemName: 'contenido',
    itemNamePlural: 'contenidos',
    color: '#3498db'
  },
  'quiz': {
    label: '❓ Quiz',
    description: 'Preguntas y respuestas',
    itemName: 'pregunta',
    itemNamePlural: 'preguntas',
    color: '#e74c3c'
  },
  'practica-guiada': {
    label: '🎯 Práctica guiada',
    description: 'Pasos secuenciales a seguir',
    itemName: 'paso',
    itemNamePlural: 'pasos',
    color: '#f39c12'
  }
};

/**
 * Obtiene la información de un tipo de práctica
 * @param {string} type - Tipo de práctica
 * @returns {object} - Información del tipo
 */
export const getPracticeTypeInfo = (type) => {
  return PRACTICE_TYPES[type] || PRACTICE_TYPES['linux-terminal'];
};

/**
 * Obtiene el nombre del item según el tipo (singular o plural)
 * @param {string} type - Tipo de práctica
 * @param {boolean} plural - Si es plural
 * @returns {string} - Nombre del item
 */
export const getItemName = (type, plural = false) => {
  const info = getPracticeTypeInfo(type);
  return plural ? info.itemNamePlural : info.itemName;
};

/**
 * Crea un nuevo item vacío según el tipo de práctica
 * @param {string} type - Tipo de práctica
 * @returns {object} - Nuevo item vacío
 */
export const createEmptyItem = (type) => {
  const baseItem = { id: Date.now() + Math.random() };
  
  switch (type) {
    case 'linux-terminal':
      return {
        ...baseItem,
        title: '',
        instruction: '',
        expectedCommand: '',
        explanation: ''
      };
    
    case 'teorica':
      return {
        ...baseItem,
        title: '',
        content: '',
        resources: ''
      };
    
    case 'quiz':
      return {
        ...baseItem,
        question: '',
        title: '',
        options: '',
        correctAnswer: '',
        explanation: ''
      };
    
    case 'practica-guiada':
      return {
        ...baseItem,
        title: '',
        description: '',
        code: '',
        notes: ''
      };
    
    default:
      return baseItem;
  }
};

/**
 * Valida que un item tenga los campos requeridos según su tipo
 * @param {object} item - Item a validar
 * @param {string} type - Tipo de práctica
 * @returns {boolean} - true si es válido
 */
export const validateItem = (item, type) => {
  if (!item) return false;
  
  switch (type) {
    case 'linux-terminal':
      return !!(item.title && item.instruction && item.expectedCommand);
    
    case 'teorica':
      return !!(item.title && item.content);
    
    case 'quiz':
      return !!(item.question && item.options && item.correctAnswer);
    
    case 'practica-guiada':
      return !!(item.title && item.description);
    
    default:
      return true;
  }
};
