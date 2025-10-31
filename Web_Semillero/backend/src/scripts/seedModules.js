/**
 * Script para migrar módulos desde JSON a MongoDB
 */
require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const connectDB = require('../config/database');
const Module = require('../models/Module');

async function seedModules() {
  try {
    console.log('🚀 Iniciando migración de módulos...');
    
    // Conectar a la base de datos
    await connectDB();
    
    // Leer archivo JSON
    const modulePath = path.join(__dirname, '../../data/modulo1.json');
    const moduleData = await fs.readFile(modulePath, 'utf-8');
    const moduleJson = JSON.parse(moduleData);
    
    // Limpiar colección existente (opcional)
    console.log('🧹 Limpiando módulos existentes...');
    await Module.deleteMany({});
    
    // Transformar estructura para MongoDB
    const classesMap = new Map();
    
    // Convertir el objeto de clases en un Map
    if (moduleJson.classes) {
      // Si es un objeto (como en el JSON actual)
      for (const [key, classItem] of Object.entries(moduleJson.classes)) {
        classesMap.set(key, {
          id: classItem.id,
          title: classItem.title,
          description: classItem.description,
          sections: classItem.sections || [],
          exercises: classItem.exercises || [],
          additionalContent: classItem.additionalContent || []
        });
      }
    }
    
    // Crear documento de módulo
    const moduleDoc = {
      moduleId: moduleJson.id,
      name: moduleJson.name,
      title: moduleJson.title,
      description: moduleJson.description,
      classes: classesMap
    };
    
    // Guardar en MongoDB
    const savedModule = await Module.create(moduleDoc);
    
    console.log('✅ Módulo migrado exitosamente:');
    console.log(`   - ID: ${savedModule.moduleId}`);
    console.log(`   - Nombre: ${savedModule.name}`);
    console.log(`   - Clases: ${savedModule.classes.size}`);
    
    // Cerrar conexión
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al migrar módulos:', error);
    process.exit(1);
  }
}

// Ejecutar si se corre directamente
if (require.main === module) {
  seedModules();
}

module.exports = seedModules;
