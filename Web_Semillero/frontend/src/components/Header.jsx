import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import logoUrl from '../assets/logo2.png'
import LoginModal from './LoginModal'

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

function ProfileMenu() {
  const items = [
    'Mis cursos',
    'Perfil',
    'Mis compras',
    'Configuración',
    'Actualizaciones',
    'Logros',
    'Centro de Ayuda',
    'Cerrar sesión',
  ]
  return (
    <div className="menu-list">
      {items.map((it) => (
        <button key={it} className="menu-item" type="button">{it}</button>
      ))}
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
  const [open, setOpen] = useState(null) // 'lang' | 'bell' | 'assistant' | 'profile' | null

  const closeAll = () => setOpen(null)
  const toggle = (key) => setOpen((cur) => (cur === key ? null : key))

  return (
    <header className="header">
  <Logo size={48} />
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
        <Icon title="Perfil" ariaExpanded={open==='profile'} ariaControls="profile-menu" onClick={() => setOpen('login')}>
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
