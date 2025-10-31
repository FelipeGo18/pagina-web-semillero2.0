const mongoose = require('mongoose');

/**
 * Configuración de conexión a MongoDB Atlas
 */
const connectDB = async () => {
  try {
    // Opciones de conexión
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout después de 5s
      socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
    };

    // Conectar a MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    console.log(`📦 Base de datos: ${conn.connection.name}`);

    // Eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });

    // Manejo de cierre graceful
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB desconectado por cierre de aplicación');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    console.error('💡 Verifica tu MONGODB_URI en el archivo .env');
    process.exit(1);
  }
};

module.exports = connectDB;
