const mongoose = require('mongoose');

/**
 * Esquema para Módulos de Lecciones
 * Estructura flexible para almacenar módulos educativos
 */
const ModuleSchema = new mongoose.Schema({
  // ID del módulo (1, 2, 3, etc.)
  moduleId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  
  // Información básica
  name: {
    type: String,
    required: true
  },
  
  title: {
    type: String,
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  // Clases dentro del módulo
  classes: {
    type: Map,
    of: {
      id: String,
      title: String,
      description: String,
      sections: [{
        title: String,
        content: String
      }],
      exercises: [{
        id: Number,
        title: String,
        instruction: String,
        expectedCommand: String,
        explanation: String,
        successMessage: String,
        hints: [String]
      }],
      additionalContent: [mongoose.Schema.Types.Mixed]
    }
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para búsquedas rápidas
ModuleSchema.index({ moduleId: 1 });
ModuleSchema.index({ name: 'text', title: 'text', description: 'text' });

module.exports = mongoose.model('Module', ModuleSchema);
