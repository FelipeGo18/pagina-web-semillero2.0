const express = require('express');
const router = express.Router();
const Practice = require('../models/Practice');
const Module = require('../models/Module');
const Counter = require('../models/Counter');

// --- Helper Function (para no repetir código) ---
const formatPracticeResponse = (practice) => {
  if (!practice) return null;
  return {
    id: practice.practiceId,
    title: practice.title,
    description: practice.description,
    icon: practice.icon,
    iconSvg: practice.iconSvg,
    level: practice.level,
    type: practice.type,
    color: practice.color,
    fullDescription: practice.fullDescription,
    objectives: practice.objectives,
    topics: practice.topics,
    requirements: practice.requirements,
    duration: practice.duration,
    modules: practice.modules
  };
};

// --- Helper Function (para el contador atómico) ---
async function getNextSequenceValue(sequenceName) {
  const counter = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

/**
 * POST /api/practices
 * Crea una nueva práctica
 */
router.post('/', async (req, res) => {
  try {
    const nextId = await getNextSequenceValue('practiceId');
    
    const newPractice = new Practice({
      practiceId: nextId,
      ...req.body // Usamos el spread operator para simplicidad
    });

    await newPractice.save();

    res.status(201).json({
      success: true,
      message: 'Práctica creada correctamente',
      practice: formatPracticeResponse(newPractice)
    });
  } catch (error) {
    console.error('Error al crear práctica:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear la práctica'
    });
  }
});

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
      practices: practices.map(formatPracticeResponse)
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
 * GET /api/practices/search
 * Busca prácticas por texto (DEBE ir antes de /:id)
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
      results: practices.map(p => ({
        id: p.practiceId,
        title: p.title,
        description: p.description,
        icon: p.icon,
        color: p.color
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

/**
 * GET /api/practices/:id
 * Obtiene una práctica específica por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const practiceId = parseInt(id);

    if (isNaN(practiceId)) {
      return res.status(400).json({
        success: false, error: 'El ID de la práctica debe ser un número'
      });
    }

    const practice = await Practice.findOne({ practiceId }).lean();

    if (!practice) {
      return res.status(404).json({
        success: false, error: `Práctica ${id} no encontrada`
      });
    }

    // Log temporal para debug
    console.log('🔍 GET - Práctica desde DB:', {
      title: practice.title,
      modulesCount: practice.modules?.length,
      firstModuleClasses: practice.modules?.[0]?.classes?.length,
      firstClassSections: practice.modules?.[0]?.classes?.[0]?.sections
    });

    // Enriquecer módulos y clases con ejercicios completos desde Module, pero sin perder otros campos (como sections)
    const enrichedModules = await Promise.all((practice.modules || []).map(async (mod) => {
      const moduleDoc = await Module.findOne({
        $or: [
          { moduleId: mod.id },
          { title: mod.title }
        ]
      }).lean();

      console.log('🔍 Módulo encontrado en DB:', {
        modTitle: mod.title,
        moduleDocFound: !!moduleDoc,
        moduleDocTitle: moduleDoc?.title,
        classesInModule: moduleDoc?.classes ? Object.keys(moduleDoc.classes).length : 0
      });

      if (!mod.classes || mod.classes.length === 0) {
        return mod;
      }

      const enrichedClasses = mod.classes.map(cls => {
        // Buscar la clase correspondiente en Module
        let exercisesFromModule = null;
        let sectionsFromModule = null;
        
        if (moduleDoc && moduleDoc.classes) {
          const classEntry = Object.values(moduleDoc.classes).find(c =>
            (c.id && c.id === cls.id) || (c.title && c.title === cls.title)
          );
          
          if (classEntry) {
            console.log('📚 Clase encontrada en Module:', {
              clsTitle: cls.title,
              hasSections: !!classEntry.sections,
              sectionsCount: classEntry.sections?.length,
              hasExercises: !!classEntry.exercises,
              exercisesCount: classEntry.exercises?.length
            });
            
            // Obtener ejercicios si existen
            if (Array.isArray(classEntry.exercises)) {
              exercisesFromModule = classEntry.exercises;
            }
            // Obtener sections si existen
            if (Array.isArray(classEntry.sections)) {
              sectionsFromModule = classEntry.sections;
            }
          } else {
            console.log('⚠️ Clase NO encontrada en Module:', cls.title);
          }
        }
        
        // Construir el objeto de la clase enriquecida
        const enrichedClass = { ...cls };
        
        // Agregar exercises desde Module (o desde Practice si no hay en Module)
        if (exercisesFromModule) {
          enrichedClass.exercises = exercisesFromModule;
        }
        
        // Agregar sections desde Module (o desde Practice si no hay en Module)
        if (sectionsFromModule) {
          enrichedClass.sections = sectionsFromModule;
        }
        
        console.log('✅ Clase enriquecida:', {
          title: enrichedClass.title,
          sectionsCount: enrichedClass.sections?.length,
          exercisesCount: enrichedClass.exercises?.length
        });
        
        return enrichedClass;
      });

      return { ...mod, classes: enrichedClasses };
    }));

    const enrichedPractice = { ...practice, modules: enrichedModules };

    // Log temporal para debug
    console.log('✅ GET - Práctica enriquecida:', {
      title: enrichedPractice.title,
      modulesCount: enrichedPractice.modules?.length,
      firstModuleClasses: enrichedPractice.modules?.[0]?.classes?.length,
      firstClassSections: enrichedPractice.modules?.[0]?.classes?.[0]?.sections
    });

    res.json({
      success: true,
      practice: formatPracticeResponse(enrichedPractice)
    });
  } catch (error) {
    console.error('Error al leer práctica:', error);
    res.status(500).json({
      success: false, error: 'Error al obtener la práctica'
    });
  }
});

/**
 * PUT /api/practices/:id
 * Edita una práctica existente
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const practiceId = parseInt(id);

    if (isNaN(practiceId)) {
      return res.status(400).json({
        success: false, error: 'El ID de la práctica debe ser un número'
      });
    }

    // El cuerpo de la petición (req.body) ya contiene los campos a actualizar.
    // MongoDB ignorará los campos que no estén en el Schema.
    const updateData = req.body;

    const updatedPractice = await Practice.findOneAndUpdate(
      { practiceId: practiceId },
      { $set: updateData }, // Usamos el cuerpo de la petición directamente
      { new: true, runValidators: true } // 'new: true' devuelve el doc actualizado
    );

    if (!updatedPractice) {
      return res.status(404).json({
        success: false, error: `Práctica ${id} no encontrada`
      });
    }

    res.json({
      success: true,
      message: 'Práctica actualizada correctamente',
      practice: formatPracticeResponse(updatedPractice)
    });
  } catch (error) {
    console.error('Error al actualizar práctica:', error);
    res.status(500).json({
      success: false, error: 'Error al actualizar la práctica'
    });
  }
});

/**
 * DELETE /api/practices/:id
 * Elimina una práctica existente
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const practiceId = parseInt(id);

    if (isNaN(practiceId)) {
      return res.status(400).json({
        success: false, error: 'El ID de la práctica debe ser un número'
      });
    }

    const deletedPractice = await Practice.findOneAndDelete({ practiceId: practiceId });

    if (!deletedPractice) {
      return res.status(404).json({
        success: false, error: `Práctica ${id} no encontrada`
      });
    }

    res.json({
      success: true,
      message: 'Práctica eliminada correctamente',
      practice: formatPracticeResponse(deletedPractice) // Devuelve el objeto eliminado
    });
  } catch (error) {
    console.error('Error al eliminar práctica:', error);
    res.status(500).json({
      success: false, error: 'Error al eliminar la práctica'
    });
  }
});

module.exports = router;