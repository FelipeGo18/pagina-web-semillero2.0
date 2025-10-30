import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './PracticeDetailPage.css'

// Importar los datos de las prácticas
import { practicesData } from '../data/practicesData'

export default function PracticeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [completedModules, setCompletedModules] = useState([])
  
  const practice = practicesData.find(p => p.id === parseInt(id))

  if (!practice) {
    return (
      <div className="practice-not-found">
        <h2>Práctica no encontrada</h2>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    )
  }

  const toggleModuleCompletion = (moduleId) => {
    setCompletedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  return (
    <div className="practice-detail-page">
      <div className="practice-detail-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <div className="practice-detail-title-section">
          <div className="practice-detail-icon">
            <span dangerouslySetInnerHTML={{ __html: practice.icon }} />
          </div>
          <div>
            <h1>{practice.title}</h1>
            <p className="practice-detail-subtitle">{practice.description}</p>
          </div>
        </div>
        <div className="practice-progress">
          <span>Progreso: {completedModules.length}/{practice.modules?.length || 0} módulos</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${practice.modules ? (completedModules.length / practice.modules.length) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="practice-detail-content">
        <div className="modules-section">
          <h2>Módulos de Aprendizaje</h2>
          
          {practice.modules && practice.modules.length > 0 ? (
            <div className="modules-grid">
              {practice.modules.map((module, index) => (
                <div 
                  key={module.id} 
                  className={`module-card ${completedModules.includes(module.id) ? 'completed' : ''}`}
                >
                  <div className="module-header">
                    <div className="module-number">Módulo {index + 1}</div>
                    <button 
                      className="module-check"
                      onClick={() => toggleModuleCompletion(module.id)}
                      title={completedModules.includes(module.id) ? 'Marcar como incompleto' : 'Marcar como completado'}
                    >
                      {completedModules.includes(module.id) ? '✓' : '○'}
                    </button>
                  </div>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <div className="module-info">
                    <span className="module-duration">⏱️ {module.duration}</span>
                    {module.difficulty && (
                      <span className={`module-difficulty ${module.difficulty.toLowerCase()}`}>
                        {module.difficulty}
                      </span>
                    )}
                  </div>
                  <button className="btn-start-module">
                    Comenzar Módulo →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-modules">
              <p>Los módulos para esta práctica estarán disponibles próximamente.</p>
            </div>
          )}
        </div>

        <div className="practice-sidebar">
          <div className="sidebar-card">
            <h3>📋 Información General</h3>
            <div className="info-item">
              <strong>Duración total:</strong>
              <span>{practice.duration}</span>
            </div>
            {practice.objectives && (
              <div className="info-item">
                <strong>Objetivos:</strong>
                <ul>
                  {practice.objectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {practice.requirements && (
            <div className="sidebar-card">
              <h3>✅ Requisitos</h3>
              <ul>
                {practice.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
