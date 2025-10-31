const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/progress
 * Obtiene todo el progreso del usuario autenticado
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const progressRecords = await Progress.find({ userId: req.user._id })
      .sort({ lastAccessedAt: -1 })
      .lean();
    
    res.json({
      success: true,
      count: progressRecords.length,
      progress: progressRecords
    });
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el progreso del usuario'
    });
  }
});

/**
 * GET /api/progress/:contentType/:contentId
 * Obtiene el progreso del usuario autenticado en un contenido específico
 */
router.get('/:contentType/:contentId', authenticate, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    
    console.log('📊 GET Progress Request:', {
      userId: req.user._id,
      username: req.user.username,
      contentType,
      contentId: parseInt(contentId)
    });
    
    const progress = await Progress.findOne({
      userId: req.user._id,
      contentType,
      contentId: parseInt(contentId)
    }).lean();
    
    console.log('📦 Progress found:', progress ? 'YES' : 'NO', progress);
    
    if (!progress) {
      return res.json({
        success: true,
        progress: null,
        message: 'No hay progreso registrado para este contenido'
      });
    }
    
    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('❌ Error al obtener progreso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el progreso'
    });
  }
});

/**
 * POST /api/progress/:contentType/:contentId/class
 * Marca una clase como completada para el usuario autenticado
 */
router.post('/:contentType/:contentId/class', authenticate, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const { classId, score, timeSpent } = req.body;
    
    console.log('💾 POST Class Completion Request:', {
      userId: req.user._id,
      username: req.user.username,
      contentType,
      contentId: parseInt(contentId),
      classId,
      score,
      timeSpent
    });
    
    if (!classId) {
      return res.status(400).json({
        success: false,
        error: 'classId es requerido'
      });
    }
    
    // Buscar o crear registro de progreso
    let progress = await Progress.findOne({
      userId: req.user._id,
      contentType,
      contentId: parseInt(contentId)
    });
    
    console.log('🔍 Existing progress:', progress ? 'FOUND' : 'NOT FOUND');
    
    if (!progress) {
      console.log('🆕 Creating new progress record...');
      progress = new Progress({
        userId: req.user._id,
        contentType,
        contentId: parseInt(contentId),
        completedClasses: [],
        completedExercises: []
      });
    }
    
    // Verificar si la clase ya está completada
    const classIndex = progress.completedClasses.findIndex(
      c => c.classId === classId
    );
    
    console.log('📝 Class already completed?', classIndex !== -1);
    
    if (classIndex === -1) {
      // Agregar nueva clase completada
      progress.completedClasses.push({
        classId,
        completedAt: new Date(),
        score: score || null,
        timeSpent: timeSpent || null
      });
      console.log('➕ Added new completed class');
    } else {
      // Actualizar clase existente
      progress.completedClasses[classIndex].completedAt = new Date();
      if (score !== undefined) progress.completedClasses[classIndex].score = score;
      if (timeSpent !== undefined) progress.completedClasses[classIndex].timeSpent = timeSpent;
      console.log('🔄 Updated existing class');
    }
    
    // Actualizar última acceso
    progress.lastAccessedAt = new Date();
    
    await progress.save();
    console.log('✅ Progress saved successfully:', {
      progressId: progress._id,
      completedClassesCount: progress.completedClasses.length
    });
    
    res.json({
      success: true,
      message: 'Clase marcada como completada',
      progress
    });
  } catch (error) {
    console.error('❌ Error al actualizar progreso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el progreso'
    });
  }
});

/**
 * POST /api/progress/:contentType/:contentId/exercise
 * Marca un ejercicio como completado para el usuario autenticado
 */
router.post('/:contentType/:contentId/exercise', authenticate, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const { exerciseId, classId, attempts, hintsUsed } = req.body;
    
    if (!exerciseId || !classId) {
      return res.status(400).json({
        success: false,
        error: 'exerciseId y classId son requeridos'
      });
    }
    
    // Buscar o crear registro de progreso
    let progress = await Progress.findOne({
      userId: req.user._id,
      contentType,
      contentId: parseInt(contentId)
    });
    
    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        contentType,
        contentId: parseInt(contentId),
        completedClasses: [],
        completedExercises: []
      });
    }
    
    // Agregar ejercicio completado
    progress.completedExercises.push({
      exerciseId: parseInt(exerciseId),
      classId,
      completedAt: new Date(),
      attempts: attempts || 1,
      hintsUsed: hintsUsed || 0
    });
    
    // Actualizar última acceso
    progress.lastAccessedAt = new Date();
    
    await progress.save();
    
    res.json({
      success: true,
      message: 'Ejercicio marcado como completado',
      progress
    });
  } catch (error) {
    console.error('Error al actualizar progreso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el progreso'
    });
  }
});

/**
 * PUT /api/progress/:contentType/:contentId
 * Actualiza el progreso general (porcentaje, tiempo, etc.) del usuario autenticado
 */
router.put('/:contentType/:contentId', authenticate, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const { overallProgress, totalTimeSpent, isCompleted } = req.body;
    
    let progress = await Progress.findOne({
      userId: req.user._id,
      contentType,
      contentId: parseInt(contentId)
    });
    
    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        contentType,
        contentId: parseInt(contentId),
        completedClasses: [],
        completedExercises: []
      });
    }
    
    // Actualizar campos
    if (overallProgress !== undefined) progress.overallProgress = overallProgress;
    if (totalTimeSpent !== undefined) progress.totalTimeSpent = totalTimeSpent;
    if (isCompleted !== undefined) {
      progress.isCompleted = isCompleted;
      if (isCompleted) progress.completedAt = new Date();
    }
    
    progress.lastAccessedAt = new Date();
    
    await progress.save();
    
    res.json({
      success: true,
      message: 'Progreso actualizado',
      progress
    });
  } catch (error) {
    console.error('Error al actualizar progreso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el progreso'
    });
  }
});

/**
 * DELETE /api/progress/:contentType/:contentId
 * Elimina el progreso de un contenido específico (reset) para el usuario autenticado
 */
router.delete('/:contentType/:contentId', authenticate, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    
    const result = await Progress.deleteOne({
      userId: req.user._id,
      contentType,
      contentId: parseInt(contentId)
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Progreso no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Progreso eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar progreso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el progreso'
    });
  }
});

module.exports = router;
