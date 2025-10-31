import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authApi'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, isAuthenticated, updateUserProfile } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatar: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    } else if (user) {
      setProfileData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        bio: user.profile?.bio || '',
        avatar: user.profile?.avatar || ''
      })
    }
  }, [isAuthenticated, user, navigate])

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const result = await updateUserProfile(profileData)
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Perfil actualizado correctamente' })
        setEditing(false)
      } else {
        setMessage({ type: 'error', text: result.error })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    // Validaciones
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres' })
      setLoading(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
      setLoading(false)
      return
    }

    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword)
      setMessage({ type: 'success', text: '✅ Contraseña cambiada correctamente' })
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setChangingPassword(false)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Error al cambiar la contraseña' 
      })
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setEditing(false)
    setProfileData({
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      bio: user.profile?.bio || '',
      avatar: user.profile?.avatar || ''
    })
    setMessage({ type: '', text: '' })
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.profile?.avatar ? (
              <img src={user.profile.avatar} alt={user.username} />
            ) : (
              <div className="avatar-placeholder">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1>{profileData.firstName || profileData.lastName 
              ? `${profileData.firstName} ${profileData.lastName}`.trim() 
              : user.username}
            </h1>
            <p className="profile-email">{user.email}</p>
            <span className={`profile-role ${user.role}`}>{user.role}</span>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-sections">
          {/* Sección de Información Personal */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Información Personal</h2>
              {!editing && (
                <button 
                  className="btn-edit"
                  onClick={() => setEditing(true)}
                >
                  ✏️ Editar
                </button>
              )}
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    disabled={!editing}
                  />
                </div>

                <div className="form-field">
                  <label>Apellido</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Biografía</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  disabled={!editing}
                  rows="4"
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>

              <div className="form-field">
                <label>Avatar URL</label>
                <input
                  type="url"
                  name="avatar"
                  value={profileData.avatar}
                  onChange={handleProfileChange}
                  disabled={!editing}
                  placeholder="https://ejemplo.com/avatar.jpg"
                />
              </div>

              {editing && (
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-save"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Sección de Cambiar Contraseña */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Seguridad</h2>
              {!changingPassword && (
                <button 
                  className="btn-edit"
                  onClick={() => setChangingPassword(true)}
                >
                  🔒 Cambiar Contraseña
                </button>
              )}
            </div>

            {changingPassword ? (
              <form onSubmit={handleChangePassword}>
                <div className="form-field">
                  <label>Contraseña Actual</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label>Nueva Contraseña</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => {
                      setChangingPassword(false)
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      })
                      setMessage({ type: '', text: '' })
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-save"
                    disabled={loading}
                  >
                    {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="security-info">
                Tu contraseña está protegida y encriptada. Cámbiala regularmente para mantener tu cuenta segura.
              </p>
            )}
          </div>

          {/* Información de la Cuenta */}
          <div className="profile-section">
            <h2>Información de la Cuenta</h2>
            <div className="account-info">
              <div className="info-row">
                <span className="info-label">Usuario:</span>
                <span className="info-value">{user.username}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Rol:</span>
                <span className="info-value">{user.role}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Miembro desde:</span>
                <span className="info-value">
                  {new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {user.lastLogin && (
                <div className="info-row">
                  <span className="info-label">Último acceso:</span>
                  <span className="info-value">
                    {new Date(user.lastLogin).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
