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
          <span 
            className="practice-icon" 
            dangerouslySetInnerHTML={{ __html: practice.icon }}
          />
        </div>
        
        <div className="practice-card-content">
          <h3 className="practice-card-title">{practice.title}</h3>
          <p className="practice-card-description">{practice.description}</p>
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
