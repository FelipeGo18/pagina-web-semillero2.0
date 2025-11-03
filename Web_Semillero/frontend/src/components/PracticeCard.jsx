import { useState } from 'react'
import './PracticeCard.css'
import PracticeModal from './PracticeModal'

export default function PracticeCard({ practice }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div 
        className="practice-card"
        onClick={() => setShowModal(true)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setShowModal(true)
          }
        }}
      >
        <div className="practice-card-icon">
          {practice.iconSvg ? (
            practice.iconSvg.startsWith('data:image') ? (
              <img src={practice.iconSvg} alt={practice.title} className="practice-icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span className="practice-icon" dangerouslySetInnerHTML={{ __html: practice.iconSvg }} />
            )
          ) : (
            <span className="practice-icon" dangerouslySetInnerHTML={{ __html: practice.icon }} />
          )}
        </div>
        
        <div className="practice-card-content">
          <h3 className="practice-card-title">{practice.title}</h3>
          <div className="practice-card-description" dangerouslySetInnerHTML={{ __html: practice.description }} />
        </div>

        <div className="practice-card-footer">
          <span className="practice-card-hint">Haz clic para ver más →</span>
        </div>
      </div>

      {showModal && (
        <PracticeModal 
          practice={practice} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  )
}
