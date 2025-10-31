/**
 * Script para ejecutar todas las migraciones
 */
require('dotenv').config();
const seedModules = require('./seedModules');
const seedPractices = require('./seedPractices');

async function seedAll() {
  try {
    console.log('🎯 Iniciando migración completa de datos...\n');
    
    // Migrar módulos
    await seedModules();
    
    // Esperar un poco antes de la siguiente migración
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Migrar prácticas
    await seedPractices();
    
    console.log('\n🎉 ¡Migración completa exitosa!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  }
}

seedAll();
