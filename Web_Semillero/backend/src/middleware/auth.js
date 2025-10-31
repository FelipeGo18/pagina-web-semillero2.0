const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de autenticación
 * Verifica el token JWT en las cookies o headers
 */
const authenticate = async (req, res, next) => {
  try {
    // Obtener token desde cookies o header Authorization
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization) {
      // Bearer token
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado. Token no proporcionado.'
      });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Cuenta desactivada'
      });
    }
    
    // Adjuntar usuario al request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado'
      });
    }
    
    console.error('Error en autenticación:', error);
    res.status(500).json({
      success: false,
      error: 'Error en la autenticación'
    });
  }
};

/**
 * Middleware para verificar roles
 * @param  {...string} roles - Roles permitidos
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Acceso denegado. Requiere rol: ${roles.join(' o ')}`
      });
    }
    
    next();
  };
};

/**
 * Middleware opcional de autenticación
 * Si hay token, adjunta el usuario, si no, continúa sin usuario
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Si hay error, simplemente continuar sin usuario
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};
