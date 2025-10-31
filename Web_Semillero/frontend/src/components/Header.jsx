import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'
import logoUrl from '../assets/logo8.png'
import LoginModal from './LoginModal'

// SVG Icons para el menú de perfil
const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 19H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 9H6C5.20435 9 4.44129 8.68393 3.87868 8.12132C3.31607 7.55871 3 6.79565 3 6V5C3 4.73478 3.10536 4.48043 3.29289 4.29289C3.48043 4.10536 3.73478 4 4 4H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 9H18C18.7956 9 19.5587 8.68393 20.1213 8.12132C20.6839 7.55871 21 6.79565 21 6V5C21 4.73478 20.8946 4.48043 20.7071 4.29289C20.5196 4.10536 20.2652 4 20 4H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 4V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 4V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const AdminPanelIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function Icon({ title, children, onClick, ariaExpanded, ariaControls }) {
  return (
    <button
      className="icon-btn"
      aria-label={title}
      title={title}
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      {children}
    </button>
  )
}

function Logo({ size = 48 }) {
  return (
    <Link to="/" className="logo" style={{ height: size }} aria-label="Ir al inicio">
      <img
        src={logoUrl}
        alt="Universidad Piloto de Colombia - IEEE Student Branch"
        style={{ height: '100%', width: 'auto', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 0 0.5px rgba(0,0,0,0.5))' }}
        loading="eager"
        decoding="async"
      />
    </Link>
  )
}

function SearchBar() {
  return (
    <form className="search" role="search" onSubmit={(e)=>e.preventDefault()}>
      <input type="search" placeholder="Buscar cursos, colecciones..." aria-label="Buscar" />
      <button type="submit" className="search-btn" aria-label="Buscar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M11 4a7 7 0 105.293 12.293l3.707 3.707 1.414-1.414-3.707-3.707A7 7 0 0011 4zm0 2a5 5 0 110 10 5 5 0 010-10z" fill="#111"/>
        </svg>
      </button>
    </form>
  )
}

function Overlay({ onClick }) {
  return <div className="overlay" onClick={onClick} />
}

function Dropdown({ id, children, style }) {
  return (
    <div id={id} className="dropdown" style={style} role="dialog" aria-modal="true">
      {children}
    </div>
  )
}

function ProfileMenu({ user, onLogout, onClose }) {
  const navigate = useNavigate()
  const displayName = user?.profile?.firstName 
    ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim()
    : user?.username || 'Usuario'

  const handleNavigation = (path) => {
    navigate(path)
    if (onClose) onClose()
  }

  return (
    <div className="profile-menu">
      {/* Header del menú con avatar */}
      <div className="profile-menu-header">
        <div className="profile-menu-avatar">
          {user?.profile?.avatar ? (
            <img src={user.profile.avatar} alt={displayName} />
          ) : (
            <div className="avatar-initial">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-menu-info">
          <div className="profile-menu-name">{displayName}</div>
          {user?.email && (
            <div className="profile-menu-email">{user.email}</div>
          )}
          <span className={`profile-menu-badge ${user?.role}`}>
            {user?.role === 'student' ? 'Estudiante' : 
             user?.role === 'instructor' ? 'Instructor' : 
             user?.role === 'admin' ? 'Admin' : user?.role}
          </span>
        </div>
      </div>

      {/* Opciones del menú */}
      <div className="profile-menu-options">
        {/* Panel Admin - Solo para administradores */}
        {user?.role === 'admin' && (
          <button 
            className="profile-menu-item admin-item" 
            type="button"
            onClick={() => handleNavigation('/admin/dashboard')}
          >
            <span className="menu-icon"><AdminPanelIcon /></span>
            <span>Panel Admin</span>
          </button>
        )}
        
        <button 
          className="profile-menu-item" 
          type="button"
          onClick={() => handleNavigation('/')}
        >
          <span className="menu-icon"><BookIcon /></span>
          <span>Mis cursos</span>
        </button>
        
        <button 
          className="profile-menu-item" 
          type="button"
          onClick={() => handleNavigation('/perfil')}
        >
          <span className="menu-icon"><UserIcon /></span>
          <span>Perfil</span>
        </button>
        
        <button 
          className="profile-menu-item" 
          type="button"
          onClick={() => handleNavigation('/progreso')}
        >
          <span className="menu-icon"><ChartIcon /></span>
          <span>Mi progreso</span>
        </button>
        
        <button 
          className="profile-menu-item" 
          type="button"
          onClick={() => handleNavigation('/perfil')}
        >
          <span className="menu-icon"><SettingsIcon /></span>
          <span>Configuración</span>
        </button>
        
        <button 
          className="profile-menu-item" 
          type="button"
          onClick={() => handleNavigation('/')}
        >
          <span className="menu-icon"><TrophyIcon /></span>
          <span>Logros</span>
        </button>
        
        <button 
          className="profile-menu-item" 
          type="button"
          onClick={() => handleNavigation('/')}
        >
          <span className="menu-icon"><HelpIcon /></span>
          <span>Centro de Ayuda</span>
        </button>
      </div>

      {/* Botón de cerrar sesión */}
      <div className="profile-menu-footer">
        <button 
          className="profile-menu-logout" 
          type="button" 
          onClick={onLogout}
        >
          <span className="menu-icon"><LogoutIcon /></span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}

function NotificationsPanel() {
  return (
    <div className="panel">
      <h3>Notificaciones</h3>
      <div className="empty">Sin notificaciones</div>
    </div>
  )
}

function AssistantPanel({ onClose }) {
  return (
    <div className="assistant" role="dialog" aria-modal="true">
      <div className="assistant-header">
        <strong>Asistente</strong>
        <button className="icon-btn" aria-label="Cerrar" onClick={onClose}>✕</button>
      </div>
      <div className="assistant-body">
        <h4>¡Hola! ¿Cómo puedo ayudarte?</h4>
        <p>Puedes preguntarme lo que quieras.</p>
        <button className="primary">Conversemos</button>
      </div>
    </div>
  )
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(null) // 'lang' | 'bell' | 'assistant' | 'profile' | 'login' | null

  const closeAll = () => setOpen(null)
  const toggle = (key) => setOpen((cur) => (cur === key ? null : key))

  const handleLogout = async () => {
    await logout()
    closeAll()
    navigate('/') // Redirigir al inicio después de cerrar sesión
  }

  const handleProfileClick = () => {
    if (isAuthenticated) {
      toggle('profile')
    } else {
      setOpen('login')
    }
  }

  return (
    <header className="header">
  <Logo size={63} />
      <SearchBar />
      <nav className="actions" aria-label="Acciones">
        <Icon title="Idioma" ariaExpanded={open==='lang'} ariaControls="lang-menu" onClick={() => toggle('lang')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2c1.657 0 3.156.672 4.243 1.757L13 9h3a8 8 0 11-6.928 3.99L10 10H7l4.243-4.243C11.328 4.672 12 4 12 4z" fill="#111"/>
          </svg>
        </Icon>
        <Icon title="Notificaciones" ariaExpanded={open==='bell'} ariaControls="notif-panel" onClick={() => toggle('bell')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5l-2 2v1h16v-1l-2-2z" fill="#111"/>
          </svg>
        </Icon>
        <Icon title="Asistente" ariaExpanded={open==='assistant'} ariaControls="assistant-panel" onClick={() => toggle('assistant')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 2a7 7 0 00-7 7v3a5 5 0 004 4.9V20h6v-3.1a5 5 0 004-4.9V9a7 7 0 00-7-7z" fill="#111"/>
          </svg>
        </Icon>
        <Icon 
          title={isAuthenticated ? 'Perfil' : 'Iniciar sesión'} 
          ariaExpanded={open==='profile' || open==='login'} 
          ariaControls={isAuthenticated ? 'profile-menu' : 'login-modal'} 
          onClick={handleProfileClick}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 5v3h18v-3c0-2.5-4-5-9-5z" fill="#111"/>
          </svg>
        </Icon>
      </nav>

      {/* Overlays + Panels */}
      {open && <Overlay onClick={closeAll} />}

      {open === 'lang' && (
        <Dropdown id="lang-menu" style={{ right: 196 }}>
          <div className="menu-list">
            <button className="menu-item" type="button">Español</button>
            <button className="menu-item" type="button" disabled>English (pronto)</button>
          </div>
        </Dropdown>
      )}

      {open === 'bell' && (
        <Dropdown id="notif-panel" style={{ right: 144 }}>
          <NotificationsPanel />
        </Dropdown>
      )}

      {open === 'profile' && isAuthenticated && (
        <Dropdown id="profile-menu" style={{ right: 16 }}>
          <ProfileMenu user={user} onLogout={handleLogout} onClose={closeAll} />
        </Dropdown>
      )}

      {open === 'login' && (
        <>
          <div className="overlay blur" onClick={closeAll} />
          <LoginModal onClose={closeAll} />
        </>
      )}

      {open === 'assistant' && (
        <AssistantPanel onClose={closeAll} />
      )}
    </header>
  )
}
