import { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSearch } from '../context/SearchContext'
import './Header.css'
import logoUrl from '../assets/logo8.png'
import LoginModal from './LoginModal'

import { practicesData } from '../data/practicesData'

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const AdminPanelIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch()
  const navigate = useNavigate()
  const location = useLocation()
  const [showDropdown, setShowDropdown] = useState(false)
  const [filtered, setFiltered] = useState([])
  const inputRef = useRef(null)

  // Filtrar prácticas al escribir
  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (value.trim().length > 0) {
      const results = practicesData.filter(p =>
        p.title.toLowerCase().includes(value.toLowerCase())
      )
      setFiltered(results)
      setShowDropdown(results.length > 0)
    } else {
      setFiltered([])
      setShowDropdown(false)
    }
    // No navegar automáticamente
  }

  // Navegar solo al seleccionar una sugerencia
  const handleSuggestionClick = (practice) => {
    setShowDropdown(false)
    // Establecer el título exacto de la práctica para filtrar solo esa
    setSearchTerm(practice.title)
    // Navega a la home si no está ahí
    if (location.pathname !== '/') {
      navigate('/')
    }
    setTimeout(() => {
      const el = document.getElementById(`practice-${practice.id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  // Cerrar dropdown al perder foco
  const handleBlur = (e) => {
    setTimeout(() => setShowDropdown(false), 120)
  }

  const handleFocus = () => {
    if (filtered.length > 0) setShowDropdown(true)
  }

  return (
    <div className="search" tabIndex={-1}>
      <input
        type="search"
        placeholder="Buscar cursos, prácticas, proyectos..."
        aria-label="Buscar"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={inputRef}
        autoComplete="off"
      />
      <button type="button" className="search-btn" aria-label="Buscar" tabIndex={-1}>
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      </button>
      {showDropdown && (
        <ul className="search-dropdown">
          {filtered.map(practice => (
            <li
              key={practice.id}
              className="search-suggestion"
              onMouseDown={() => handleSuggestionClick(practice)}
            >
              {practice.title}
            </li>
          ))}
        </ul>
      )}
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
            <span className="menu-icon">
              <AdminPanelIcon />
            </span>
            <span>Panel Admin</span>
          </button>
        )}
        
        <button 
          className="profile-menu-item" 
          type="button"
          onClick={() => handleNavigation('/')}
        >
          <span className="menu-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"/>
            </svg>
          </span>
          <span>Mis cursos</span>
        </button>
        
        <button 
          className="profile-menu-item" 
          type="button"
          onClick={() => handleNavigation('/perfil')}
        >
          <span className="menu-icon">
            <UserIcon />
          </span>
          <span>Perfil</span>
        </button>
        
        <button 
          className="profile-menu-item" 
          type="button"
          onClick={() => handleNavigation('/progreso')}
        >
          <span className="menu-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3V21H21M7 16L12 11L16 15L21 10"/>
            </svg>
          </span>
          <span>Mi progreso</span>
        </button>
        
        <button 
          className="profile-menu-item" 
          type="button"
          onClick={() => handleNavigation('/perfil')}
        >
          <span className="menu-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24M19 12a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </span>
          <span>Configuración</span>
        </button>
        
        <button 
          className="profile-menu-item" 
          type="button"
          onClick={() => handleNavigation('/')}
        >
          <span className="menu-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9M12 15V19M8 19H16"/>
            </svg>
          </span>
          <span>Logros</span>
        </button>
      </div>

      {/* Botón de cerrar sesión */}
      <div className="profile-menu-footer">
        <button 
          className="profile-menu-logout" 
          type="button" 
          onClick={onLogout}
        >
          <span className="menu-icon">
            <LogoutIcon />
          </span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLogout = async () => {
    await logout()
    setProfileOpen(false)
    navigate('/')
  }

  const handleProfileClick = (e) => {
    if (e) e.preventDefault();
    if (isAuthenticated) {
      setProfileOpen((open) => !open);
      return false;
    } else {
      setShowLoginModal(true);
      return false;
    }
  }

  const scrollToSection = (sectionId) => {
    setProfileOpen(false)
    navigate('/')
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* TOP BAR - Logo, Search, Actions */}
        <div className="header-top">
          <Link to="/" className="logo">
            <img src={logoUrl} alt="Universidad Piloto de Colombia - IEEE Student Branch" />
           
          </Link>

          <SearchBar />

          {/* NAVIGATION - Botones al lado de búsqueda */}
          <nav className="header-nav-inline">
            <button 
              className="nav-link-inline"
              onClick={() => scrollToSection('practices')}
            >
              Prácticas
            </button>
            <button 
              className="nav-link-inline"
              onClick={() => scrollToSection('about')}
            >
              Sobre Nosotros
            </button>
          </nav>

          <div className="header-actions">
            <button 
              type="button"
              className={`profile-btn${profileOpen ? ' active' : ''}`}
              onClick={handleProfileClick}
              aria-label="Perfil"
              title={isAuthenticated ? "Mi Perfil" : "Iniciar sesión"}
            >
              <UserIcon />
            </button>

            {profileOpen && isAuthenticated && (
              <>
                <div className="profile-overlay" onClick={() => setProfileOpen(false)} />
                <ProfileMenu user={user} onLogout={handleLogout} onClose={() => setProfileOpen(false)} />
              </>
            )}

            {showLoginModal && (
              <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
            )}
          </div>
        </div>
      </div>

      {/* Modal de Login */}
      
    </header>
  )
}
