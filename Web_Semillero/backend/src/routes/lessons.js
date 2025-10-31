const express = require('express');
const router = express.Router();
const Module = require('../models/Module');

/**
 * GET /api/lessons/modules
 * Obtiene la lista de todos los módulos disponibles
 */
router.get('/modules', async (req, res) => {
  try {
    // Obtener todos los módulos (solo campos básicos)
    const modules = await Module.find({}, 'moduleId name title description')
      .sort({ moduleId: 1 })
      .lean();
    
    res.json({
      success: true,
      count: modules.length,
      modules: modules.map(module => ({
        id: module.moduleId,
        name: module.name,
        title: module.title,
        description: module.description,
        url: `/api/lessons/modules/${module.moduleId}`
      }))
    });
  } catch (error) {
    console.error('Error al leer módulos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la lista de módulos'
    });
  }
});

/**
 * GET /api/lessons/modules/:moduleId
 * Obtiene un módulo completo con todas sus clases
 */
router.get('/modules/:moduleId', async (req, res) => {
  try {
    const { moduleId } = req.params;
    
    // Buscar módulo por moduleId
    const module = await Module.findOne({ moduleId: parseInt(moduleId) }).lean();
    
    if (!module) {
      return res.status(404).json({
        success: false,
        error: `Módulo ${moduleId} no encontrado`
      });
    }
    
    // Convertir el Map de classes a un objeto compatible con el frontend
    const moduleData = {
      id: module.moduleId,
      name: module.name,
      title: module.title,
      description: module.description,
      classes: {}
    };
    
    // Convertir Map a objeto plano
    if (module.classes) {
      for (const [key, value] of Object.entries(module.classes)) {
        moduleData.classes[key] = value;
      }
    }
    
    res.json({
      success: true,
      module: moduleData
    });
  } catch (error) {
    console.error('Error al leer módulo:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el módulo'
    });
  }
});

/**
 * GET /api/lessons/modules/:moduleId/classes/:classId
 * Obtiene una clase específica de un módulo
 */
router.get('/modules/:moduleId/classes/:classId', async (req, res) => {
  try {
    const { moduleId, classId } = req.params;
    
    // Buscar módulo
    const module = await Module.findOne({ moduleId: parseInt(moduleId) }).lean();
    
    if (!module) {
      return res.status(404).json({
        success: false,
        error: `Módulo ${moduleId} no encontrado`
      });
    }
    
    // Buscar la clase específica en el Map
    const lesson = module.classes ? module.classes[classId] : null;
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: `Clase ${classId} no encontrada en el módulo ${moduleId}`
      });
    }
    
    res.json({
      success: true,
      lesson
    });
  } catch (error) {
    console.error('Error al leer clase:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la clase'
    });
  }
});

/**
 * GET /api/lessons/modules/:moduleId/info
 * Obtiene solo la información del módulo sin las clases
 */
router.get('/modules/:moduleId/info', async (req, res) => {
  try {
    const { moduleId } = req.params;
    
    // Buscar módulo solo con info básica
    const module = await Module.findOne(
      { moduleId: parseInt(moduleId) },
      'moduleId name title description'
    ).lean();
    
    if (!module) {
      return res.status(404).json({
        success: false,
        error: `Módulo ${moduleId} no encontrado`
      });
    }
    
    // Contar clases (necesitamos el documento completo para esto)
    const fullModule = await Module.findOne({ moduleId: parseInt(moduleId) }).lean();
    const classCount = fullModule.classes ? Object.keys(fullModule.classes).length : 0;
    
    res.json({
      success: true,
      module: {
        id: module.moduleId,
        name: module.name,
        title: module.title,
        description: module.description,
        classCount
      }
    });
  } catch (error) {
    console.error('Error al leer info del módulo:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener información del módulo'
    });
  }
});

/**
 * GET /api/lessons/search
 * Busca módulos por texto
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro de búsqueda "q" es requerido'
      });
    }
    
    // Búsqueda con text index
    const modules = await Module.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .lean();
    
    res.json({
      success: true,
      count: modules.length,
      query: q,
      results: modules.map(module => ({
        id: module.moduleId,
        name: module.name,
        title: module.title,
        description: module.description,
        url: `/api/lessons/modules/${module.moduleId}`
      }))
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      success: false,
      error: 'Error al realizar la búsqueda'
    });
  }
});

module.exports = router;
