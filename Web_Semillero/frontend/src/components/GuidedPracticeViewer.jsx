import { useState } from 'react'
import './GuidedPracticeViewer.css'

export default function GuidedPracticeViewer({ steps = [], onComplete, isCompleted }) {
  const [completedSteps, setCompletedSteps] = useState([])
  const [expandedStep, setExpandedStep] = useState(0)

  if (!steps || steps.length === 0) {
    return (
      <div className="guided-practice-viewer">
        <div className="no-steps">
          <p>No hay pasos disponibles para esta práctica guiada.</p>
        </div>
      </div>
    )
  }

  const toggleStep = (index) => {
    setExpandedStep(expandedStep === index ? -1 : index)
  }

  const markStepCompleted = (index) => {
    if (!completedSteps.includes(index)) {
      const newCompleted = [...completedSteps, index]
      setCompletedSteps(newCompleted)
      
      // Si completa todos los pasos, marcar la clase como completada
      if (newCompleted.length === steps.length && !isCompleted) {
        onComplete()
      }
      
      // Expandir el siguiente paso automáticamente
      if (index < steps.length - 1) {
        setExpandedStep(index + 1)
      }
    }
  }

  const unmarkStepCompleted = (index) => {
    setCompletedSteps(completedSteps.filter(i => i !== index))
  }

  const progressPercentage = (completedSteps.length / steps.length) * 100

  return (
    <div className="guided-practice-viewer">
      {/* Header con progreso */}
      <div className="practice-header">
        <div className="practice-info">
          <h2>🎯 Práctica Guiada</h2>
          <p>Sigue estos pasos en orden para completar la práctica</p>
        </div>
        <div className="practice-progress">
          <div className="progress-stats">
            <span className="progress-text">
              {completedSteps.length} de {steps.length} pasos completados
            </span>
            <span className="progress-percent">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lista de pasos */}
      <div className="steps-list">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index)
          const isExpanded = expandedStep === index
          const isLocked = index > 0 && !completedSteps.includes(index - 1)
          
          return (
            <div 
              key={index} 
              className={`step-card ${isCompleted ? 'completed' : ''} ${isExpanded ? 'expanded' : ''} ${isLocked ? 'locked' : ''}`}
            >
              {/* Header del paso */}
              <div 
                className="step-header" 
                onClick={() => !isLocked && toggleStep(index)}
              >
                <div className="step-number-section">
                  <div className={`step-number ${isCompleted ? 'completed' : ''}`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  {isLocked && <span className="lock-icon">🔒</span>}
                </div>
                
                <div className="step-title-section">
                  <h3 className="step-title">{step.title}</h3>
                  {isCompleted && <span className="completed-badge">Completado</span>}
                </div>
                
                <button className="expand-btn" disabled={isLocked}>
                  {isExpanded ? '▼' : '▶'}
                </button>
              </div>

              {/* Contenido del paso (expandible) */}
              {isExpanded && !isLocked && (
                <div className="step-content">
                  <div className="step-description">
                    <h4>📋 Descripción</h4>
                    {(step.description || step.instruction || '').split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>

                  {step.code && (
                    <div className="step-code">
                      <h4>💻 Código / Ejemplo</h4>
                      <pre><code>{step.code}</code></pre>
                      <button 
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(step.code)
                          alert('¡Código copiado al portapapeles!')
                        }}
                      >
                        📋 Copiar código
                      </button>
                    </div>
                  )}

                  {step.notes && (
                    <div className="step-notes">
                      <h4>💡 Notas adicionales</h4>
                      {step.notes.split('\n').map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}

                  {/* Botón para marcar como completado */}
                  <div className="step-actions">
                    {!isCompleted ? (
                      <button 
                        className="complete-step-btn"
                        onClick={() => markStepCompleted(index)}
                      >
                        ✓ Marcar paso como completado
                      </button>
                    ) : (
                      <button 
                        className="undo-step-btn"
                        onClick={() => unmarkStepCompleted(index)}
                      >
                        ↺ Desmarcar paso
                      </button>
                    )}
                  </div>
                </div>
              )}

              {isLocked && (
                <div className="step-locked-message">
                  <p>🔒 Completa el paso anterior para desbloquear este</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer con resumen */}
      {completedSteps.length === steps.length && (
        <div className="practice-completion">
          <div className="completion-card">
            <div className="completion-icon">🎉</div>
            <h3>¡Práctica Completada!</h3>
            <p>Has completado todos los pasos de esta práctica guiada.</p>
            {isCompleted && (
              <div className="completion-badge">
                <span>✅ Clase marcada como completada</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resumen lateral de progreso */}
      <div className="practice-summary">
        <h4>Resumen de Progreso</h4>
        <div className="summary-items">
          <div className="summary-item">
            <span className="summary-label">Total de pasos:</span>
            <span className="summary-value">{steps.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Completados:</span>
            <span className="summary-value completed">{completedSteps.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Restantes:</span>
            <span className="summary-value">{steps.length - completedSteps.length}</span>
          </div>
        </div>
        
        <div className="quick-nav">
          <h5>Navegación rápida:</h5>
          <div className="quick-nav-buttons">
            {steps.map((step, idx) => (
              <button
                key={idx}
                className={`quick-nav-btn ${completedSteps.includes(idx) ? 'completed' : ''} ${expandedStep === idx ? 'active' : ''}`}
                onClick={() => toggleStep(idx)}
                title={step.title}
                disabled={idx > 0 && !completedSteps.includes(idx - 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
