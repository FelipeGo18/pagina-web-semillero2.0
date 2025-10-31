import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { progressService } from '../services/progressApi'
import './ProgressPage.css'

export default function ProgressPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [allProgress, setAllProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalInProgress: 0,
    totalTimeSpent: 0
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }

    const loadProgress = async () => {
      try {
        setLoading(true)
        const progressData = await progressService.getMyProgress()
        
        if (progressData.progress && Array.isArray(progressData.progress)) {
          setAllProgress(progressData.progress)
          
          // Calcular estadísticas
          const completed = progressData.progress.filter(p => p.isCompleted).length
          const inProgress = progressData.progress.filter(p => !p.isCompleted && p.completedClasses?.length > 0).length
          const timeSpent = progressData.progress.reduce((acc, p) => acc + (p.totalTimeSpent || 0), 0)
          
          setStats({
            totalCompleted: completed,
            totalInProgress: inProgress,
            totalTimeSpent: timeSpent
          })
        }
      } catch (err) {
        console.error('Error al cargar progreso:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [isAuthenticated, navigate])

  if (loading) {
    return (
      <div className="progress-page">
        <div className="progress-loading">
          <div className="spinner"></div>
          <p>Cargando tu progreso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="progress-page">
      <div className="progress-container">
        <div className="progress-header">
          <h1>Mi Progreso</h1>
          <p>Aquí puedes ver todo tu avance en las prácticas</p>
        </div>

        {/* Estadísticas generales */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.totalCompleted}</div>
            <div className="stat-label">Completadas</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{stats.totalInProgress}</div>
            <div className="stat-label">En Progreso</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{Math.round(stats.totalTimeSpent / 60)}</div>
            <div className="stat-label">Minutos totales</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{allProgress.length}</div>
            <div className="stat-label">Total iniciadas</div>
          </div>
        </div>

        {/* Lista de progreso */}
        <div className="progress-list">
          <h2>Tus Prácticas</h2>
          
          {allProgress.length === 0 ? (
            <div className="no-progress">
              <div className="no-progress-icon">📚</div>
              <h3>Aún no has iniciado ninguna práctica</h3>
              <p>Explora nuestras prácticas y comienza a aprender</p>
              <button 
                className="btn-explore"
                onClick={() => navigate('/')}
              >
                Explorar Prácticas
              </button>
            </div>
          ) : (
            <div className="progress-cards">
              {allProgress.map((progress) => (
                <div 
                  key={progress._id} 
                  className={`progress-card ${progress.isCompleted ? 'completed' : ''}`}
                  onClick={() => navigate(`/practice/${progress.contentId}`)}
                >
                  <div className="progress-card-header">
                    <h3>
                      {progress.contentType === 'practice' ? '🔧' : '📖'} 
                      {' '}Práctica #{progress.contentId}
                    </h3>
                    {progress.isCompleted && (
                      <span className="badge-completed">✅ Completada</span>
                    )}
                  </div>
                  
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-bar-fill"
                        style={{ width: `${progress.overallProgress || 0}%` }}
                      ></div>
                    </div>
                    <span className="progress-percentage">
                      {Math.round(progress.overallProgress || 0)}%
                    </span>
                  </div>
                  
                  <div className="progress-details">
                    <div className="progress-detail">
                      <span className="detail-icon">📝</span>
                      <span>{progress.completedClasses?.length || 0} clases completadas</span>
                    </div>
                    <div className="progress-detail">
                      <span className="detail-icon">💪</span>
                      <span>{progress.completedExercises?.length || 0} ejercicios</span>
                    </div>
                    {progress.totalTimeSpent > 0 && (
                      <div className="progress-detail">
                        <span className="detail-icon">⏱️</span>
                        <span>{Math.round(progress.totalTimeSpent / 60)} min</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="progress-date">
                    Última actualización: {new Date(progress.updatedAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
