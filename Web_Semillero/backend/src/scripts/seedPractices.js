/**
 * Script para migrar prácticas desde JSON a MongoDB
 */
require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const connectDB = require('../config/database');
const Practice = require('../models/Practice');

async function seedPractices() {
  try {
    console.log('🚀 Iniciando migración de prácticas...');
    
    // Conectar a la base de datos
    await connectDB();
    
    // Leer archivo JSON
    const practicePath = path.join(__dirname, '../../data/practices.json');
    const practiceData = await fs.readFile(practicePath, 'utf-8');
    const practicesJson = JSON.parse(practiceData);
    
    // Limpiar colección existente (opcional)
    console.log('🧹 Limpiando prácticas existentes...');
    await Practice.deleteMany({});
    
    // Transformar y guardar cada práctica
    const savedPractices = [];
    
    for (const practice of practicesJson) {
      const practiceDoc = {
        practiceId: practice.id,
        title: practice.title,
        description: practice.description,
        icon: practice.icon,
        color: practice.color,
        fullDescription: practice.fullDescription,
        objectives: practice.objectives || [],
        topics: practice.topics || [],
        requirements: practice.requirements || [],
        duration: practice.duration,
        modules: practice.modules || []
      };
      
      const saved = await Practice.create(practiceDoc);
      savedPractices.push(saved);
      
      console.log(`✅ Práctica migrada: ${saved.title} (ID: ${saved.practiceId})`);
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`   - Total de prácticas migradas: ${savedPractices.length}`);
    
    // Cerrar conexión
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al migrar prácticas:', error);
    process.exit(1);
  }
}

// Ejecutar si se corre directamente
if (require.main === module) {
  seedPractices();
}

module.exports = seedPractices;
