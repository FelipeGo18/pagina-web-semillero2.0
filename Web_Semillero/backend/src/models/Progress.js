const mongoose = require('mongoose');

/**
 * Esquema para seguimiento del progreso del usuario
 */
const ProgressSchema = new mongoose.Schema({
  // Usuario
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Tipo de contenido (module o practice)
  contentType: {
    type: String,
    enum: ['module', 'practice'],
    required: true
  },
  
  // ID del contenido
  contentId: {
    type: Number,
    required: true
  },
  
  // Progreso de clases completadas
  completedClasses: [{
    classId: String,
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: Number,
    timeSpent: Number // en minutos
  }],
  
  // Progreso de ejercicios
  completedExercises: [{
    exerciseId: Number,
    classId: String,
    completedAt: {
      type: Date,
      default: Date.now
    },
    attempts: Number,
    hintsUsed: Number
  }],
  
  // Estadísticas generales
  totalTimeSpent: {
    type: Number,
    default: 0
  },
  
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  isCompleted: {
    type: Boolean,
    default: false
  },
  
  completedAt: Date,
  
  // Metadata
  startedAt: {
    type: Date,
    default: Date.now
  },
  
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
});

// Índices compuestos para consultas rápidas
ProgressSchema.index({ userId: 1, contentType: 1, contentId: 1 }, { unique: true });
ProgressSchema.index({ userId: 1, isCompleted: 1 });

module.exports = mongoose.model('Progress', ProgressSchema);
