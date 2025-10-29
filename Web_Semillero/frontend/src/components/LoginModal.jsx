import logoUrl from '../assets/LogoLab.jpg'
import './LoginModal.css'

export default function LoginModal({ onClose }) {
  const onSubmit = (e) => {
    e.preventDefault()
    // TODO: integrar con backend más adelante
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
        <label className="field">
          <span>Correo electrónico <b>*</b></span>
          <input type="email" required placeholder="nombre@correoelectronico.com" />
        </label>
        <label className="field">
          <span>Contraseña <b>*</b></span>
          <input type="password" required placeholder="Introduce tu contraseña" />
          <div className="hint"><button type="button" className="link">¿Olvidaste la contraseña?</button></div>
        </label>
        <button type="submit" className="primary full">Iniciar sesión</button>
      </form>
      <div className="modal-footer">
        <span>¿Es la primera vez que entras al laboratorio virtual? </span>
        <button type="button" className="link">Regístrate</button>
      </div>
    </div>
  )
}
