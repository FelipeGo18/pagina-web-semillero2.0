import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { progressService } from '../services/progressApi'
import InteractiveTerminal from './InteractiveTerminal'
import QuizViewer from './QuizViewer'
import GuidedPracticeViewer from './GuidedPracticeViewer'
import { getModuleWithCache, convertModuleToFrontendFormat } from '../services/lessonsApi'
import { CheckIcon, BookIcon } from './Icons'
import './LessonViewer.css'

export default function LessonViewer({ moduleId = 1, practiceId = null, practiceType = 'linux-terminal', practiceData = null }) {
  const { isAuthenticated, user } = useAuth()
  const [currentClassIndex, setCurrentClassIndex] = useState(1)
  const [completedClasses, setCompletedClasses] = useState([])
  const [moduleLessons, setModuleLessons] = useState({})
  const [moduleInfo, setModuleInfo] = useState(null) // Información del módulo (título, descripción)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar módulo desde la API
  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Si practiceData viene directamente (desde PracticeDetailPage), usarlo
        if (practiceData && practiceData.modules) {
          // moduleId ahora es el índice (1, 2, 3...), obtener el módulo por índice
          const moduleData = practiceData.modules[moduleId - 1]; // Array empieza en 0
          if (!moduleData || !moduleData.classes || moduleData.classes.length === 0) {
            setError('Este módulo aún no tiene contenido. Agrega clases desde el panel de administración.');
            setLoading(false);
            return;
          }
          
          // Guardar información del módulo
          setModuleInfo({
            title: moduleData.title || `Módulo ${moduleId}`,
            description: moduleData.description || ''
          });
          
          // Convertir al formato esperado por el componente
          const converted = {};
          moduleData.classes.forEach((cls, idx) => {
            converted[idx + 1] = {
              id: cls.id || `${moduleId}.${idx + 1}`,
              title: cls.title || `Clase ${idx + 1}`,
              description: cls.description || '',
              duration: cls.duration || '',
              sections: cls.sections || [],
              exercises: cls.exercises || []
            };
          });
          
          setModuleLessons(converted);
          setLoading(false);
          return;
        }
        
        // Fallback: cargar desde la API (para prácticas antiguas/legacy)
        const moduleData = await getModuleWithCache(moduleId)
        const converted = convertModuleToFrontendFormat(moduleData)
        
        setModuleLessons(converted)
      } catch (err) {
        console.error('Error loading module:', err)
        setError(err.message || 'Error al cargar el módulo')
      } finally {
        setLoading(false)
      }
    }

    loadModule()
  }, [moduleId, practiceId, practiceData])

  // Cargar progreso del usuario
  useEffect(() => {
    const loadProgress = async () => {
      if (!isAuthenticated || !practiceId || !user) {
        console.log('⚠️ LessonViewer: No se puede cargar progreso - falta autenticación');
        return;
      }

      try {
        console.log('🔄 LessonViewer: Cargando progreso para práctica:', practiceId, 'módulo:', moduleId);
        const progressData = await progressService.getProgress('practice', practiceId);
        
        if (progressData.progress && progressData.progress.completedClasses) {
          // Filtrar solo las clases de este módulo (ej: "1.1", "1.2" para módulo 1)
          const thisModuleClasses = progressData.progress.completedClasses
            .filter(c => c.classId.startsWith(`${moduleId}.`))
            .map(c => parseInt(c.classId.split('.')[1])); // Convertir "1.1" a 1, "1.2" a 2
          
          console.log('✅ LessonViewer: Clases completadas del módulo', moduleId, ':', thisModuleClasses);
          setCompletedClasses(thisModuleClasses);
        }
      } catch (err) {
        console.error('❌ LessonViewer: Error al cargar progreso:', err);
      }
    };

    loadProgress();
  }, [isAuthenticated, practiceId, moduleId, user]);

  const currentLesson = moduleLessons[currentClassIndex]
  const totalClasses = Object.keys(moduleLessons).length

  const handleComplete = async () => {
    if (completedClasses.includes(currentClassIndex)) {
      console.log('ℹ️ LessonViewer: Clase ya completada');
      return;
    }

    // Actualizar UI inmediatamente
    setCompletedClasses(prev => [...prev, currentClassIndex])

    // Guardar en backend si está autenticado
    if (isAuthenticated && practiceId) {
      try {
        const classId = `${moduleId}.${currentClassIndex}`; // Ej: "1.1", "1.2"
        console.log('💾 LessonViewer: Guardando progreso de clase:', classId);
        
        await progressService.markClassCompleted('practice', practiceId, {
          classId,
          score: 100,
          timeSpent: 0
        });
        
        console.log('✅ LessonViewer: Clase guardada exitosamente');
      } catch (err) {
        console.error('❌ LessonViewer: Error al guardar progreso:', err);
        // Revertir si falla
        setCompletedClasses(prev => prev.filter(c => c !== currentClassIndex));
        alert('Error al guardar el progreso. Por favor, intenta de nuevo.');
      }
    } else {
      console.warn('⚠️ LessonViewer: No autenticado - progreso no guardado');
    }
  }

  const handleNext = () => {
    if (currentClassIndex < totalClasses) {
      setCurrentClassIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentClassIndex > 1) {
      setCurrentClassIndex(prev => prev - 1)
    }
  }

  const goToClass = (classIndex) => {
    const isCurrentCompleted = completedClasses.includes(currentClassIndex)
    
    if (classIndex <= currentClassIndex || isCurrentCompleted || classIndex === currentClassIndex + 1) {
      setCurrentClassIndex(classIndex)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="lesson-viewer">
        <div className="loading-state">
          <div className="spinner"></div>
          <h2>Cargando módulo...</h2>
          <p>Preparando las lecciones para ti</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="lesson-viewer">
        <div className="error-state">
          <div className="error-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#e53935' }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
          </div>
          <h2>Error al cargar</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!currentLesson) {
    return (
      <div className="lesson-viewer">
        <div className="no-lesson">
          <h2>Lección no encontrada</h2>
          <p>Este módulo aún no tiene lecciones disponibles.</p>
        </div>
      </div>
    )
  }

  const isCompleted = completedClasses.includes(currentClassIndex)
  const progressPercentage = (completedClasses.length / totalClasses) * 100

  return (
    <div className="lesson-viewer">


      {/* Barra de progreso superior */}
      <div className="lesson-progress-bar">
        <div className="progress-info">
          <h3>Tu Progreso</h3>
          <span className="progress-text">
            {completedClasses.length} de {totalClasses} lecciones completadas
          </span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill-animated" 
            style={{ width: `${progressPercentage}%` }}
          >
            <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
      </div>

      {/* Navegación de clases mejorada */}
      <div className="class-navigation">
        <h3>Lecciones del Módulo</h3>
        <div className="class-grid">
          {Object.keys(moduleLessons).map((classIndex) => {
            const index = parseInt(classIndex)
            const lesson = moduleLessons[index]
            const completed = completedClasses.includes(index)
            const current = currentClassIndex === index
            
            // Lógica de bloqueo: Solo la primera clase está desbloqueada al inicio
            // Las demás se desbloquean solo cuando la anterior esté completada
            const isLocked = index > 1 && !completedClasses.includes(index - 1)
            
            return (
              <button
                key={index}
                className={`class-card ${completed ? 'completed' : ''} ${current ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
                onClick={() => {
                  goToClass(index);
                  setTimeout(() => {
                    const el = document.getElementById('lesson-content-main');
                    if (el) {
                      const yOffset = -140; // Ajusta este valor según el alto de tu header/borde
                      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }, 100);
                }}
                disabled={isLocked}
                title={isLocked ? 'Completa las lecciones anteriores' : ''}
              >
                <div className="class-card-header">
                  <span className="class-number">Clase {moduleId}.{index}</span>
                  {completed && (
                    <span className="check-icon">
                      <CheckIcon size={16} />
                    </span>
                  )}
                  {isLocked && <span className="lock-icon">🔒</span>}
                  {current && <span className="current-badge">Actual</span>}
                </div>
                <h4 className="class-title">{lesson.title}</h4>
                <div className="class-description" dangerouslySetInnerHTML={{ __html: lesson.description }} />
                {lesson.exercises && (
                  <div className="class-meta">
                    <span>📝 {lesson.exercises.length} ejercicios</span>
                    {lesson.sections && (
                      <span>
                        <BookIcon size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        {lesson.sections.length} secciones
                      </span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="navigation-buttons">
          <button 
            className="nav-btn prev-btn"
            onClick={handlePrevious}
            disabled={currentClassIndex === 1}
          >
            ← Lección Anterior
          </button>
          <div className="current-class-badge">
            <span className="badge-label">Lección Actual</span>
            <span className="badge-value">{moduleId}.{currentClassIndex}</span>
          </div>
          <button 
            className="nav-btn next-btn"
            onClick={handleNext}
            disabled={currentClassIndex === totalClasses || !isCompleted}
            title={!isCompleted ? 'Completa todos los ejercicios' : ''}
          >
            Siguiente Lección →
          </button>
        </div>
      </div>

      {/* Información de la lección actual y header de módulo limpio */}
      <div className="current-lesson-info">
        <div className="lesson-title-section">
          {/* Mostrar solo el título del módulo, sin duplicar 'Módulo 1:' */}
          {moduleInfo && (
            <h1 style={{ fontWeight: 'bold', fontSize: '2rem', marginBottom: 0 }}>{moduleInfo.title}</h1>
          )}
          {/* Título de la lección */}
          <h2 style={{ marginTop: 0 }}>{currentLesson.title}</h2>
          <div className="lesson-description" dangerouslySetInnerHTML={{ __html: currentLesson.description }} />
        </div>
        {isCompleted && (
          <div className="completed-badge">
            <span className="badge-icon">
              <CheckIcon size={16} />
            </span>
            <span>¡Completada!</span>
          </div>
        )}
      </div>


      {/* Terminal Interactiva o Contenido según tipo */}
      <div id="lesson-content-main">
        {practiceType === 'linux-terminal' && (
          <InteractiveTerminal
            lesson={currentLesson}
            onComplete={handleComplete}
            onNext={currentClassIndex < totalClasses ? handleNext : null}
            isCompleted={isCompleted}
          />
        )}

        {practiceType === 'teorica' && (
          <div className="theoretical-content">
            {currentLesson.exercises && currentLesson.exercises.map((item, idx) => (
              <div key={idx} className="theory-block">
                <h3 className="theory-title">{item.title}</h3>
                <div className="theory-content">
                  {item.content && item.content.split('\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
                {item.resources && (
                  <div className="theory-resources">
                    <h4>📚 Recursos adicionales:</h4>
                    <ul>
                      {item.resources.split(',').map((url, rIdx) => (
                        <li key={rIdx}>
                          <a href={url.trim()} target="_blank" rel="noopener noreferrer">
                            {url.trim()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <div className="lesson-actions">
              <button 
                className={`complete-btn ${isCompleted ? 'completed' : ''}`}
                onClick={handleComplete}
                disabled={isCompleted}
              >
                {isCompleted ? '✅ Completada' : '✓ Marcar como completada'}
              </button>
            </div>
          </div>
        )}
      </div>

      {practiceType === 'quiz' && (
        <QuizViewer
          questions={currentLesson.exercises || []}
          onComplete={handleComplete}
          isCompleted={isCompleted}
        />
      )}

      {practiceType === 'practica-guiada' && (
        <GuidedPracticeViewer
          steps={currentLesson.exercises || []}
          onComplete={handleComplete}
          isCompleted={isCompleted}
        />
      )}

      {/* Footer con estadísticas */}
      {completedClasses.length > 0 && (
        <div className="lesson-stats">
          <div className="stat-card">
            <div className="stat-value">{completedClasses.length}</div>
            <div className="stat-label">Lecciones Completadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalClasses - completedClasses.length}</div>
            <div className="stat-label">Lecciones Restantes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Math.round(progressPercentage)}%</div>
            <div className="stat-label">Progreso del Módulo</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helpers para información del módulo
function getModuleName(moduleId) {
  const names = {
    1: 'Introducción y Primeros Pasos',
    2: 'Manipulación de Archivos y Directorios',
    3: 'Visualización de Contenido',
    4: 'Edición de Texto',
    5: 'Permisos y Usuarios'
  }
  return names[moduleId] || 'Módulo Desconocido'
}

function getModuleDescription(moduleId) {
  const descriptions = {
    1: 'Aprende los fundamentos de Linux y la línea de comandos. Descubre cómo navegar por el sistema y ejecutar tus primeros comandos.',
    2: 'Domina la creación, copia, movimiento y eliminación de archivos y directorios. Aprende a organizar tu sistema de archivos.',
    3: 'Aprende a visualizar y buscar contenido en archivos. Domina herramientas como cat, less, grep y más.',
    4: 'Edita archivos de texto desde la terminal. Aprende nano, vim y técnicas de edición avanzadas.',
    5: 'Entiende el sistema de permisos de Linux. Aprende a gestionar usuarios, grupos y accesos.'
  }
  return descriptions[moduleId] || 'Contenido del módulo'
}
