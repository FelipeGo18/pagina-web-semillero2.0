const express = require('express');
const router = express.Router();
const Practice = require('../models/Practice');

/**
 * GET /api/practices
 * Obtiene todas las prácticas
 */
router.get('/', async (req, res) => {
  try {
    const practices = await Practice.find({})
      .sort({ practiceId: 1 })
      .lean();
    
    res.json({
      success: true,
      count: practices.length,
      practices: practices.map(practice => ({
        id: practice.practiceId,
        title: practice.title,
        description: practice.description,
        icon: practice.icon,
        color: practice.color,
        fullDescription: practice.fullDescription,
        objectives: practice.objectives,
        topics: practice.topics,
        requirements: practice.requirements,
        duration: practice.duration,
        modules: practice.modules
      }))
    });
  } catch (error) {
    console.error('Error al leer prácticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las prácticas'
    });
  }
});

/**
 * GET /api/practices/:id
 * Obtiene una práctica específica por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const practice = await Practice.findOne({ practiceId: parseInt(id) }).lean();
    
    if (!practice) {
      return res.status(404).json({
        success: false,
        error: `Práctica ${id} no encontrada`
      });
    }
    
    res.json({
      success: true,
      practice: {
        id: practice.practiceId,
        title: practice.title,
        description: practice.description,
        icon: practice.icon,
        color: practice.color,
        fullDescription: practice.fullDescription,
        objectives: practice.objectives,
        topics: practice.topics,
        requirements: practice.requirements,
        duration: practice.duration,
        modules: practice.modules
      }
    });
  } catch (error) {
    console.error('Error al leer práctica:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la práctica'
    });
  }
});

/**
 * GET /api/practices/search
 * Busca prácticas por texto
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
    const practices = await Practice.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .lean();
    
    res.json({
      success: true,
      count: practices.length,
      query: q,
      results: practices.map(practice => ({
        id: practice.practiceId,
        title: practice.title,
        description: practice.description,
        icon: practice.icon,
        color: practice.color
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
