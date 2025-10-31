const mongoose = require('mongoose');

/**
 * Esquema para Prácticas
 */
const PracticeSchema = new mongoose.Schema({
  // ID de la práctica (1, 2, 3, etc.)
  practiceId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  
  // Información básica
  title: {
    type: String,
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  icon: {
    type: String,
    required: true
  },
  
  color: String,
  
  fullDescription: String,
  
  // Objetivos y contenido
  objectives: [String],
  topics: [String],
  requirements: [String],
  
  duration: String,
  
  // Módulos de la práctica
  modules: [{
    id: Number,
    title: String,
    description: String,
    duration: String,
    difficulty: String,
    classes: [{
      id: String,
      title: String,
      duration: String
    }]
  }],
  
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
PracticeSchema.index({ practiceId: 1 });
PracticeSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Practice', PracticeSchema);
    