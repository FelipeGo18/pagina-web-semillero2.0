import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './PracticeModal.css'

export default function PracticeModal({ practice, onClose }) {
  const navigate = useNavigate()

  useEffect(() => {
    // Bloquear scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden'
    
    // Restaurar scroll cuando el modal se cierra
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleStartPractice = () => {
    navigate(`/practice/${practice.id}`)
  }

  return (
    <div className="practice-modal-overlay">
      <div className="practice-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="practice-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="practice-modal-header">
          <div 
            className="practice-modal-icon"
          >
            {practice.iconSvg ? (
              practice.iconSvg.startsWith('data:image') ? (
                <img src={practice.iconSvg} alt={practice.title} className="practice-icon-large" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span className="practice-icon-large" dangerouslySetInnerHTML={{ __html: practice.iconSvg }} />
              )
            ) : (
              <span className="practice-icon-large" dangerouslySetInnerHTML={{ __html: practice.icon }} />
            )}
          </div>
          <h2 className="practice-modal-title">{practice.title}</h2>
        </div>

        <div className="practice-modal-body">
          <div className="practice-section">
            <h3>Descripción</h3>
            <div dangerouslySetInnerHTML={{ __html: practice.fullDescription || practice.description }} />
          </div>

          {practice.objectives && (
            <div className="practice-section">
              <h3>Objetivos</h3>
              <ul>
                {practice.objectives.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {practice.topics && (
            <div className="practice-section">
              <h3>Temas a desarrollar</h3>
              <ul>
                {practice.topics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
          )}

          {practice.requirements && (
            <div className="practice-section">
              <h3>Requisitos</h3>
              <ul>
                {practice.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {practice.duration && (
            <div className="practice-section">
              <h3>Duración estimada</h3>
              <p>{practice.duration}</p>
            </div>
          )}
        </div>

        <div className="practice-modal-footer">
          <button className="btn-start-practice" onClick={handleStartPractice}>
            Iniciar Práctica →
          </button>
        </div>
      </div>
    </div>
  )
}
