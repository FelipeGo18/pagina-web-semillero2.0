const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

/**
 * POST /api/auth/register
 * Registro de nuevo usuario
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    // Validación básica
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email y password son requeridos'
      });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: existingUser.email === email.toLowerCase() 
          ? 'Email ya registrado' 
          : 'Username ya existe'
      });
    }
    
    // Crear usuario (la contraseña se hasheará automáticamente con el pre-save hook)
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: password, // El pre-save hook lo hasheará
      profile: {
        firstName: firstName || '',
        lastName: lastName || ''
      }
    });
    
    // Generar token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Configurar cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      sameSite: 'lax'
    });
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      },
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Datos de registro inválidos',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al registrar usuario'
    });
  }
});

/**
 * POST /api/auth/login
 * Inicio de sesión
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y password son requeridos'
      });
    }
    
    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }
    
    // Verificar si la cuenta está activa
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Cuenta desactivada. Contacta al administrador.'
      });
    }
    
    // Verificar password usando el método del modelo
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }
    
    // Actualizar último login (sin disparar el pre-save hook de password)
    await User.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );
    
    // Generar token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Configurar cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      sameSite: 'lax'
    });
    
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión'
    });
  }
});

/**
 * POST /api/auth/logout
 * Cerrar sesión
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

/**
 * GET /api/auth/me
 * Obtener información del usuario autenticado
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        profile: req.user.profile,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener información del usuario'
    });
  }
});

/**
 * PUT /api/auth/profile
 * Actualizar perfil del usuario
 */
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, avatar, bio } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (avatar !== undefined) user.profile.avatar = avatar;
    if (bio !== undefined) user.profile.bio = bio;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Perfil actualizado',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar perfil'
    });
  }
});

/**
 * PUT /api/auth/password
 * Cambiar contraseña
 */
router.put('/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Password actual y nuevo son requeridos'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'El nuevo password debe tener al menos 6 caracteres'
      });
    }
    
    const user = await User.findById(req.user._id);
    
    // Verificar password actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Password actual incorrecto'
      });
    }
    
    // Hash del nuevo password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      error: 'Error al cambiar contraseña'
    });
  }
});

module.exports = router;
