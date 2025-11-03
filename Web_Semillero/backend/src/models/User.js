const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Esquema para Usuarios
 */
const UserSchema = new mongoose.Schema({
  // Información básica
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Perfil
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String
  },
  
  // Rol del usuario
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  lastLogin: Date,
  
  isActive: {
    type: Boolean,
    default: true
  }
});

// Índices
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

// Middleware pre-save para hashear la contraseña
UserSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña fue modificada (o es nueva)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generar salt y hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', UserSchema);
