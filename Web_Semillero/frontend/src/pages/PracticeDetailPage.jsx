import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './PracticeDetailPage.css'
import LessonViewer from '../components/LessonViewer'
import { getPractice } from '../services/practicesApi'
import { progressService } from '../services/progressApi'
import LoginModal from '../components/LoginModal'
import { 
  ConstructionIcon, 
  LightbulbIcon, 
  CheckIcon, 
  CircleIcon, 
  ClockIcon, 
  ClipboardIcon, 
  CheckCircleIcon 
} from '../components/Icons'

export default function PracticeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [completedModules, setCompletedModules] = useState([])
  const [selectedModule, setSelectedModule] = useState(null)
  const [practice, setPractice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [progressLoading, setProgressLoading] = useState(false)
  
  // Cargar práctica desde la API
  useEffect(() => {
    const loadPractice = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPractice(parseInt(id));
        setPractice(data);
      } catch (err) {
        console.error('Error loading practice:', err);
        setError(err.message || 'Error al cargar la práctica');
      } finally {
        setLoading(false);
      }
    };

    loadPractice();
  }, [id]);

  // Cargar progreso del usuario si está autenticado
  useEffect(() => {
    const loadProgress = async () => {
      console.log('📊 Estado de autenticación:', {
        isAuthenticated,
        hasId: !!id,
        hasUser: !!user,
        userId: user?._id,
        token: !!localStorage.getItem('token')
      });

      if (!isAuthenticated || !id || !user) {
        console.log('⚠️ No se puede cargar progreso - falta autenticación o datos');
        return;
      }

      try {
        setProgressLoading(true);
        console.log('🔄 Cargando progreso para práctica ID:', id);
        const progressData = await progressService.getProgress('practice', id);
        console.log('📦 Datos de progreso recibidos:', progressData);
        
        if (progressData.progress && progressData.progress.completedClasses) {
          const completed = progressData.progress.completedClasses.map(c => c.classId);
          console.log('✅ Módulos completados cargados:', completed);
          setCompletedModules(completed);
        } else {
          console.log('ℹ️ No hay progreso previo registrado');
        }
      } catch (err) {
        console.error('❌ Error al cargar progreso:', err.response?.data || err.message);
      } finally {
        setProgressLoading(false);
      }
    };

    loadProgress();
  }, [isAuthenticated, id, user]);

  if (loading) {
    return (
      <div className="practice-loading">
        <div className="spinner"></div>
        <p>Cargando práctica...</p>
      </div>
    );
  }

  if (error || !practice) {
    return (
      <div className="practice-not-found">
        <h2>{error || 'Práctica no encontrada'}</h2>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    )
  }

  // Calcular el total de lecciones y lecciones completadas
  const totalLessons = practice.modules?.reduce((sum, module) => sum + (module.classes?.length || 0), 0) || 0;
  const completedLessons = completedModules.length;

  const toggleModuleCompletion = async (moduleId) => {
    const wasCompleted = completedModules.includes(moduleId);
    
    console.log('🔄 Toggle módulo:', {
      moduleId,
      wasCompleted,
      isAuthenticated,
      hasUser: !!user,
      userId: user?._id,
      practiceId: id,
      hasToken: !!localStorage.getItem('token')
    });
    
    // Actualizar UI inmediatamente
    setCompletedModules(prev => 
      wasCompleted 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );

    // Guardar en backend si está autenticado
    if (!isAuthenticated || !id) {
      console.warn('⚠️ No autenticado o sin ID - no se guardará el progreso');
      return;
    }

    try {
      if (!wasCompleted) {
        // Marcar como completado
        console.log('💾 Guardando progreso...', {
          contentType: 'practice',
          contentId: id,
          classId: moduleId.toString()
        });
        
        const result = await progressService.markClassCompleted('practice', id, {
          classId: moduleId.toString(),
          score: 100,
          timeSpent: 0
        });
        
        console.log('✅ Progreso guardado exitosamente:', result);
      } else {
        // Si se desmarca, podríamos resetear o actualizar
        console.log('ℹ️ Módulo desmarcado (considera implementar endpoint de desmarcar)');
      }
    } catch (err) {
      console.error('❌ Error al guardar progreso:', {
        error: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Revertir el cambio en la UI si falla
      setCompletedModules(prev => 
        wasCompleted 
          ? [...prev, moduleId]
          : prev.filter(id => id !== moduleId)
      );
      
      alert('Error al guardar el progreso. Por favor, intenta de nuevo.');
    }
  }

  const startModule = (moduleId) => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }
    setSelectedModule(moduleId)
  }

  const backToModules = () => {
    setSelectedModule(null)
  }

  // Si hay un módulo seleccionado, verificar si es Linux o no
  if (selectedModule !== null) {
    // Si NO es la práctica de Linux (id 1), mostrar mensaje
    if (parseInt(id) !== 1) {
      return (
        <div className="practice-detail-page">
          <div className="practice-detail-header">
            <button className="btn-back" onClick={backToModules}>
              ← Volver a Módulos
            </button>
            <div className="practice-detail-title-section">
              <h1>{practice.title}</h1>
              <p className="practice-detail-subtitle">Módulo {selectedModule}</p>
            </div>
          </div>
          <div className="practice-not-available">
            <div className="not-available-icon">
              <ConstructionIcon size={60} />
            </div>
            <h2>Contenido en Desarrollo</h2>
            <p>
              El contenido interactivo para esta práctica estará disponible próximamente. 
              Por ahora, puedes revisar los módulos y objetivos de aprendizaje.
            </p>
            <p className="available-practice">
              <LightbulbIcon size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              <strong>Práctica disponible:</strong> Aprende Linux tiene contenido completo con clases interactivas.
            </p>
            <button className="btn-back" onClick={backToModules}>
              ← Volver a Módulos
            </button>
          </div>
        </div>
      )
    }
    
    // Si es Linux (id 1), mostrar LessonViewer normalmente
    return (
      <div className="practice-detail-page">
        <div className="practice-detail-header">
          <button className="btn-back" onClick={backToModules}>
            ← Volver a Módulos
          </button>
          <div className="practice-detail-title-section">
            <h1>{practice.title}</h1>
            <p className="practice-detail-subtitle">Módulo {selectedModule}</p>
          </div>
        </div>
        {/* Solo cargar LessonViewer para Linux */}
        <LessonViewer 
          moduleId={selectedModule} 
          practiceId={parseInt(id)}
        />
      </div>
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
          <span>Progreso: {completedLessons} de {totalLessons} lecciones completadas</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` 
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
              {practice.modules.map((module, index) => {
                // Calcular cuántas lecciones de este módulo están completadas
                const moduleClassesIds = module.classes?.map(c => c.id) || [];
                const moduleCompletedCount = moduleClassesIds.filter(classId => completedModules.includes(classId)).length;
                const moduleTotalCount = moduleClassesIds.length;
                const moduleCompleted = moduleTotalCount > 0 && moduleCompletedCount === moduleTotalCount;

                return (
                  <div 
                    key={module.id} 
                    className={`module-card ${moduleCompleted ? 'completed' : ''}`}
                  >
                    <div className="module-header">
                      <div className="module-number">Módulo {index + 1}</div>
                      <div 
                        className="module-progress-indicator"
                        title={`${moduleCompletedCount} de ${moduleTotalCount} lecciones completadas`}
                      >
                        {moduleCompleted ? (
                          <CheckIcon size={16} />
                        ) : (
                          <span>{moduleCompletedCount}/{moduleTotalCount}</span>
                        )}
                      </div>
                    </div>
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>
                    <div className="module-info">
                      <span className="module-duration">
                        <ClockIcon size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        {module.duration}
                      </span>
                      {module.difficulty && (
                        <span className={`module-difficulty ${module.difficulty.toLowerCase()}`}>
                          {module.difficulty}
                        </span>
                      )}
                    </div>
                    <button 
                      className="btn-start-module"
                      onClick={() => startModule(module.id)}
                      title={!isAuthenticated ? 'Inicia sesión para comenzar' : 'Comenzar módulo'}
                    >
                      {!isAuthenticated && (
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          style={{ marginRight: '6px', verticalAlign: 'middle' }}
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      )}
                      {isAuthenticated ? 'Comenzar Módulo →' : 'Iniciar sesión para comenzar'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-modules">
              <p>Los módulos para esta práctica estarán disponibles próximamente.</p>
            </div>
          )}
        </div>

        <div className="practice-sidebar">
          <div className="sidebar-card">
            <h3>
              <ClipboardIcon size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Información General
            </h3>
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
              <h3>
                <CheckCircleIcon size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                Requisitos
              </h3>
              <ul>
                {practice.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Login */}
      {showLoginModal && (
        <>
          <div className="overlay blur" onClick={() => setShowLoginModal(false)} />
          <LoginModal onClose={() => setShowLoginModal(false)} />
        </>
      )}
    </div>
  )
}
