import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import logoUrl from '../assets/LogoLab.jpg'
import './LoginModal.css'

export default function LoginModal({ onClose }) {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result
      if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        // Validación básica para registro
        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres')
          setLoading(false)
          return
        }
        if (!formData.username) {
          setError('El nombre de usuario es requerido')
          setLoading(false)
          return
        }
        result = await register(formData)
      }

      if (result.success) {
        onClose()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setShowPassword(false)
    setFormData({
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: ''
    })
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <div className="modal-header">
        <div className="modal-brand">
          <img src={logoUrl} alt="Logo" />
        </div>
        <button className="icon-btn" aria-label="Cerrar" onClick={onClose}>✕</button>
      </div>
      <form className="modal-body" onSubmit={onSubmit}>
        <h2 id="login-title" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>

        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c33',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {!isLogin && (
          <>
            <label className="field">
              <span>Nombre de usuario <b>*</b></span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="usuario123"
              />
            </label>
            <label className="field">
              <span>Nombre</span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Tu nombre"
              />
            </label>
            <label className="field">
              <span>Apellido</span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Tu apellido"
              />
            </label>
          </>
        )}

        <label className="field">
          <span>Correo electrónico <b>*</b></span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="nombre@correoelectronico.com"
          />
        </label>
        <label className="field">
          <span>Contraseña <b>*</b></span>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder={isLogin ? 'Introduce tu contraseña' : 'Mínimo 6 caracteres'}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                // Ojo cerrado
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                // Ojo abierto
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          {isLogin && (
            <div className="hint">
              <button type="button" className="link">¿Olvidaste la contraseña?</button>
            </div>
          )}
        </label>
        <button type="submit" className="primary full" disabled={loading}>
          {loading ? 'Procesando...' : (isLogin ? 'Iniciar sesión' : 'Registrarse')}
        </button>
      </form>
      <div className="modal-footer">
        <span>
          {isLogin 
            ? '¿Es la primera vez que entras al laboratorio virtual? ' 
            : '¿Ya tienes una cuenta? '
          }
        </span>
        <button type="button" className="link" onClick={toggleMode}>
          {isLogin ? 'Regístrate' : 'Inicia sesión'}
        </button>
      </div>
    </div>
  )
}

