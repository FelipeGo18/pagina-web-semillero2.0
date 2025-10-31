const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Progress = require('../models/Progress');
const { authenticate, authorize } = require('../middleware/auth');

// Middleware: todas las rutas requieren autenticación y rol admin
router.use(authenticate);
router.use(authorize('admin'));

/**
 * GET /api/admin/stats
 * Obtiene estadísticas generales del sistema
 */
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({ isActive: true });
    
    const totalProgress = await Progress.countDocuments();
    const completedPractices = await Progress.countDocuments({ 
      'completedClasses.0': { $exists: true } 
    });
    
    // Usuarios recientes (últimos 7 días)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });
    
    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          students: totalStudents,
          instructors: totalInstructors,
          admins: totalAdmins,
          active: activeUsers,
          recent: recentUsers
        },
        progress: {
          total: totalProgress,
          completed: completedPractices
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas'
    });
  }
});

/**
 * GET /api/admin/users
 * Obtiene lista de todos los usuarios con paginación
 */
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';
    
    // Filtros
    const filter = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      filter.role = role;
    }
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await User.countDocuments(filter);
    
    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios'
    });
  }
});

/**
 * GET /api/admin/users/:id
 * Obtiene detalles de un usuario específico
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    // Obtener progreso del usuario
    const progress = await Progress.find({ userId: req.params.id }).lean();
    
    res.json({
      success: true,
      user: {
        ...user,
        progressCount: progress.length,
        progress
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuario'
    });
  }
});

/**
 * PUT /api/admin/users/:id
 * Actualiza información de un usuario
 */
router.put('/users/:id', async (req, res) => {
  try {
    const { role, isActive, profile } = req.body;
    
    const updateData = {};
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (profile) updateData.profile = { ...profile };
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario actualizado',
      user
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar usuario'
    });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Elimina un usuario (soft delete - marca como inactivo)
 */
router.delete('/users/:id', async (req, res) => {
  try {
    // No permitir que un admin se elimine a sí mismo
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'No puedes eliminarte a ti mismo'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario desactivado',
      user
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar usuario'
    });
  }
});

/**
 * GET /api/admin/progress
 * Obtiene todo el progreso de todos los usuarios
 */
router.get('/progress', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const progress = await Progress.find()
      .populate('userId', 'username email profile.firstName profile.lastName')
      .sort({ lastAccessedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Progress.countDocuments();
    
    res.json({
      success: true,
      progress,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener progreso'
    });
  }
});

module.exports = router;
