const mongoose = require('mongoose');

/**
 * Esquema para Prácticas
 */
const PracticeSchema = new mongoose.Schema({
  // ID de la práctica (1, 2, 3, etc.)
  practiceId: {
    type: Number,
    required: true
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
    required: false,
    default: ''
  },
  
  iconSvg: {
    type: String,
    required: false
  },
  
  // Tipo de práctica: determina el formato del contenido
  type: {
    type: String,
    enum: ['linux-terminal', 'teorica', 'quiz', 'practica-guiada'],
    default: 'linux-terminal'
  },
  
  // Nivel de dificultad
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
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
      duration: String,
      sections: [{
        title: String,
        content: String
      }],
      exercises: [mongoose.Schema.Types.Mixed] // Para mantener compatibilidad con ejercicios
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
    