import { useState, useEffect, useRef } from 'react'
import './InteractiveTerminal.css'
import { CheckIcon, LightbulbIcon } from './Icons'

export default function InteractiveTerminal({ lesson, onComplete, onNext, isCompleted }) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [completedExercises, setCompletedExercises] = useState([])
  const [terminalHistory, setTerminalHistory] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [commandStatus, setCommandStatus] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  
  const terminalEndRef = useRef(null)
  const inputRef = useRef(null)

  // Sistema de archivos simulado
  const [fileSystem, setFileSystem] = useState({
    '/home/estudiante': {
      type: 'dir',
      files: {}
    }
  })
  const [currentPath, setCurrentPath] = useState('/home/estudiante')

  // Ejercicio actual
  const currentExercise = lesson.exercises?.[currentExerciseIndex]
  const allExercisesCompleted = completedExercises.length === lesson.exercises?.length

  // Resetear al cambiar de lección
  useEffect(() => {
    setShowCelebration(false)
    setCurrentExerciseIndex(0)
    setCompletedExercises([])
    setTerminalHistory([
      { type: 'system', text: `=== ${lesson.title} ===` },
      { type: 'system', text: 'Terminal lista. Escribe "help" para ver comandos disponibles.' }
    ])
    setCurrentInput('')
    setShowHint(false)
    setCurrentHintIndex(0)
    setCommandStatus(null)
    setCurrentSection(0)
  }, [lesson.id])

  // Scroll automático desactivado - el usuario prefiere sin scroll
  // useEffect(() => {
  //   terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  // }, [terminalHistory])

  // Validación en tiempo real
  useEffect(() => {
    if (!currentExercise) return
    
    const input = currentInput.trim().toLowerCase()
    if (input === '') {
      setCommandStatus(null)
      return
    }

    const expected = currentExercise.expectedCommand.toLowerCase()
    
    if (input === expected) {
      setCommandStatus('correct')
    } else if (expected.startsWith(input)) {
      setCommandStatus('partial')
    } else if (input.startsWith(expected.split(' ')[0])) {
      setCommandStatus('almost')
    } else {
      setCommandStatus('incorrect')
    }
  }, [currentInput, currentExercise])

  // Celebración
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  // Ejecutar comando
  const executeCommand = (cmd) => {
    const command = cmd.trim()
    const lowerCmd = command.toLowerCase()
    
    let output = ''
    let isCorrect = false

    // Agregar comando al historial
    setTerminalHistory(prev => [
      ...prev,
      { type: 'command', text: `$ ${command}` }
    ])

    // Comandos básicos
    switch(true) {
      case lowerCmd === 'pwd':
        output = currentPath
        isCorrect = currentExercise?.expectedCommand === 'pwd'
        break

      case lowerCmd === 'ls':
        const currentDir = fileSystem[currentPath]
        const files = currentDir?.files || {}
        output = Object.keys(files).join('  ') || ''
        isCorrect = currentExercise?.expectedCommand === 'ls'
        break

      case lowerCmd.startsWith('ls -'):
        const options = lowerCmd.substring(3).trim()
        const dir = fileSystem[currentPath]
        const fileList = dir?.files || {}
        
        if (options.includes('l')) {
          const entries = Object.entries(fileList).map(([name, info]) => {
            const perms = info.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'
            const size = info.size || 0
            return `${perms} 1 estudiante estudiante ${size} Oct 30 14:30 ${name}`
          })
          output = entries.join('\n')
        } else {
          output = Object.keys(fileList).join('  ')
        }
        
        isCorrect = currentExercise?.expectedCommand.startsWith('ls -')
        break

      case lowerCmd === 'date':
        output = new Date().toString()
        isCorrect = currentExercise?.expectedCommand === 'date'
        break

      case lowerCmd.startsWith('date +'):
        const format = command.substring(6)
        const now = new Date()
        if (format === '%Y') output = now.getFullYear().toString()
        else if (format === '%m') output = (now.getMonth() + 1).toString().padStart(2, '0')
        else if (format === '%d') output = now.getDate().toString().padStart(2, '0')
        else if (format === '%H:%M') output = `${now.getHours()}:${now.getMinutes()}`
        else if (format === '%Y-%m-%d') output = now.toISOString().split('T')[0]
        else output = now.toString()
        
        isCorrect = currentExercise?.expectedCommand === command.toLowerCase()
        break

      case lowerCmd === 'whoami':
        output = 'estudiante'
        isCorrect = currentExercise?.expectedCommand === 'whoami'
        break

      case lowerCmd.startsWith('touch '):
        const fileName = command.substring(6).trim()
        if (fileName) {
          const dir = fileSystem[currentPath]
          dir.files[fileName] = { type: 'file', size: 0 }
          setFileSystem({...fileSystem})
          output = `Archivo '${fileName}' creado exitosamente`
          isCorrect = currentExercise?.expectedCommand.startsWith('touch')
        } else {
          output = 'Error: especifica un nombre de archivo'
        }
        break

      case lowerCmd.startsWith('mkdir '):
        const dirName = command.substring(6).trim()
        const hasP = dirName.startsWith('-p ')
        const actualDirName = hasP ? dirName.substring(3).trim() : dirName
        
        if (actualDirName) {
          if (hasP && actualDirName.includes('/')) {
            const parts = actualDirName.split('/')
            let currentDirPath = currentPath
            parts.forEach(part => {
              const fullPath = `${currentDirPath}/${part}`
              if (!fileSystem[fullPath]) {
                fileSystem[fullPath] = { type: 'dir', files: {} }
                fileSystem[currentDirPath].files[part] = { type: 'dir' }
              }
              currentDirPath = fullPath
            })
            output = `mkdir: se ha creado el directorio '${actualDirName}'`
          } else {
            const dir = fileSystem[currentPath]
            dir.files[actualDirName] = { type: 'dir' }
            fileSystem[`${currentPath}/${actualDirName}`] = { type: 'dir', files: {} }
            output = `mkdir: se ha creado el directorio '${actualDirName}'`
          }
          setFileSystem({...fileSystem})
          isCorrect = currentExercise?.expectedCommand.startsWith('mkdir')
        } else {
          output = 'Error: especifica un nombre de directorio'
        }
        break

      case lowerCmd.startsWith('cd '):
        const target = command.substring(3).trim()
        if (target === '~' || target === '') {
          setCurrentPath('/home/estudiante')
          output = ''
        } else if (target === '/') {
          setCurrentPath('/')
          output = ''
        } else if (target.startsWith('/')) {
          if (fileSystem[target]) {
            setCurrentPath(target)
            output = ''
          } else {
            output = `cd: ${target}: No existe el directorio`
          }
        }
        isCorrect = currentExercise?.expectedCommand.startsWith('cd')
        break

      case lowerCmd === 'clear':
        setTerminalHistory([])
        setCurrentInput('')
        return

      case lowerCmd === 'help':
        output = `Comandos disponibles:
pwd       - Muestra el directorio actual
ls        - Lista archivos y directorios
ls -l     - Lista detallada
date      - Muestra fecha y hora
whoami    - Muestra tu usuario
touch     - Crea archivos vacíos
mkdir     - Crea directorios
cd        - Cambia de directorio
clear     - Limpia la terminal
help      - Muestra esta ayuda`
        break

      default:
        output = `bash: ${command.split(' ')[0]}: command not found`
    }

    // Agregar output al historial
    if (output) {
      setTerminalHistory(prev => [
        ...prev,
        { type: isCorrect ? 'success' : 'output', text: output }
      ])
    }

    // Verificar si completó el ejercicio
    if (isCorrect && currentExercise && !completedExercises.includes(currentExerciseIndex)) {
      setCompletedExercises(prev => [...prev, currentExerciseIndex])
      setShowCelebration(true)
      
      setTerminalHistory(prev => [
        ...prev,
        { 
          type: 'celebration', 
          text: `✨ ${currentExercise.successMessage}` 
        }
      ])

      // Si completó todos los ejercicios
      if (completedExercises.length + 1 === lesson.exercises?.length) {
        setTimeout(() => {
          setTerminalHistory(prev => [
            ...prev,
            { 
              type: 'completion', 
              text: '🎉 ¡FELICITACIONES! Has completado todos los ejercicios.' 
            }
          ])
          onComplete?.()
        }, 1000)
      }
    }

    setCurrentInput('')
    setCommandStatus(null)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput)
    }
  }

  const nextExercise = () => {
    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setShowHint(false)
      setCurrentHintIndex(0)
    }
  }

  const showNextHint = () => {
    if (!currentExercise) return
    
    if (!showHint) {
      setShowHint(true)
      setCurrentHintIndex(0)
    } else if (currentHintIndex < currentExercise.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1)
    }
  }

  const nextSection = () => {
    if (currentSection < lesson.sections.length - 1) {
      setCurrentSection(prev => prev + 1)
    } else {
      // Si ya estamos en la última sección, avanzar a ejercicios
      setCurrentSection(lesson.sections.length)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1)
    }
  }

  // Verificar si todas las secciones han sido vistas
  const allSectionsViewed = currentSection >= lesson.sections.length
  const isViewingSections = !allSectionsViewed && lesson.sections && lesson.sections.length > 0

  if (!lesson) return null

  return (
    <div className="interactive-terminal-container">
      {/* Celebración */}
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-icon">
            <CheckIcon size={80} />
          </div>
        </div>
      )}

      {/* Secciones teóricas - Solo mostrar si NO se han visto todas */}
      {isViewingSections && (
        <div className="theory-sections">
          <div className="section-navigation">
            <button 
              onClick={prevSection} 
              disabled={currentSection === 0}
              className="section-nav-btn"
            >
              ← Anterior
            </button>
            <span className="section-indicator">
              Sección {currentSection + 1} de {lesson.sections.length}
            </span>
            <button 
              onClick={nextSection} 
              className="section-nav-btn"
            >
              {currentSection === lesson.sections.length - 1 ? 'Ir a Práctica →' : 'Siguiente →'}
            </button>
          </div>

          <div className="theory-content">
            <h3>{lesson.sections[currentSection].title}</h3>
            <div 
              dangerouslySetInnerHTML={{ 
                __html: lesson.sections[currentSection].content 
              }} 
            />
          </div>
        </div>
      )}

      {/* Ejercicios - Solo mostrar cuando se hayan visto todas las secciones */}
      {allSectionsViewed && lesson.exercises && lesson.exercises.length > 0 && (
        <div className="exercises-section">
          {/* Botón para volver a la teoría */}
          <div className="back-to-theory">
            <button 
              onClick={() => setCurrentSection(0)}
              className="back-theory-btn"
            >
              ← Volver a repasar la teoría
            </button>
          </div>

          <div className="exercise-progress">
            <h4>Ejercicios Prácticos</h4>
            <div className="exercise-dots">
              {lesson.exercises.map((ex, idx) => (
                <div
                  key={idx}
                  className={`exercise-dot ${
                    completedExercises.includes(idx) ? 'completed' : 
                    idx === currentExerciseIndex ? 'current' : 'pending'
                  }`}
                  title={ex.title}
                >
                  {completedExercises.includes(idx) ? (
                    <CheckIcon size={12} />
                  ) : (
                    idx + 1
                  )}
                </div>
              ))}
            </div>
            <span className="progress-text">
              {completedExercises.length} de {lesson.exercises.length} completados
            </span>
          </div>

          {/* Ejercicio actual */}
          {currentExercise && !allExercisesCompleted && (
            <div className="current-exercise">
              <h3>{currentExercise.title}</h3>
              <div className="exercise-instruction">
                <strong>📝 Tarea:</strong> {currentExercise.instruction}
              </div>
              <div 
                className="exercise-explanation"
                dangerouslySetInnerHTML={{ __html: currentExercise.explanation }}
              />

              {/* Sistema de pistas */}
              <div className="hint-system">
                <button 
                  onClick={showNextHint}
                  className="hint-btn"
                >
                  <LightbulbIcon size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  {!showHint ? 'Mostrar pista' : 
                      currentHintIndex < currentExercise.hints.length - 1 ? 
                      'Siguiente pista' : 'Última pista'}
                </button>

                {showHint && (
                  <div className="hint-content">
                    <div className="hint-text">
                      {currentExercise.hints[currentHintIndex]}
                    </div>
                  </div>
                )}
              </div>

              {completedExercises.includes(currentExerciseIndex) && 
               currentExerciseIndex < lesson.exercises.length - 1 && (
                <button onClick={nextExercise} className="next-exercise-btn">
                  Siguiente Ejercicio →
                </button>
              )}
            </div>
          )}

          {allExercisesCompleted && (
            <div className="all-completed">
              <h3>🎉 ¡Lección Completada!</h3>
              <p>Has dominado todos los ejercicios.</p>
              {onNext && (
                <button onClick={() => {
                  setShowCelebration(false);
                  onNext();
                }} className="next-lesson-btn">
                  Siguiente Lección →
                </button>
              )}
            </div>
          )}

          {/* Terminal - Solo mostrar en la sección de práctica */}
          <div className="terminal-widget">
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span className="btn-close"></span>
                <span className="btn-minimize"></span>
                <span className="btn-maximize"></span>
              </div>
              <span className="terminal-title">estudiante@linux: ~</span>
              {commandStatus && (
                <div className={`command-status status-${commandStatus}`}>
                  {commandStatus === 'correct' && (
                    <>
                      <CheckIcon size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      Correcto - <strong>Presiona Enter ↵</strong>
                    </>
                  )}
                  {commandStatus === 'partial' && '✏️ Continúa...'}
                  {commandStatus === 'almost' && '⚠️ Casi...'}
                  {commandStatus === 'incorrect' && '✗ Incorrecto'}
                </div>
              )}
            </div>

            <div className="terminal-body">
              {terminalHistory.map((item, idx) => (
                <div key={idx} className={`terminal-line ${item.type}`}>
                  {item.text}
                </div>
              ))}

              <div className="terminal-input-line">
                <span className="terminal-prompt">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`terminal-input ${commandStatus || ''}`}
                  placeholder="Escribe tu comando aquí..."
                  autoFocus
                />
              </div>
              
              {/* Mensaje para presionar Enter cuando el comando es correcto */}
              {commandStatus === 'correct' && (
                <div className="enter-hint">
                  <span className="enter-key">↵ Enter</span> para confirmar y continuar
                </div>
              )}
              
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Contenido adicional - Dentro de la sección de ejercicios */}
          {lesson.additionalContent && allExercisesCompleted && (
            <div className="additional-content">
              {lesson.additionalContent.commonMistakes && (
                <div className="content-box mistakes-box">
                  <h4>⚠️ Errores Comunes</h4>
                  <ul>
                    {lesson.additionalContent.commonMistakes.map((mistake, idx) => (
                      <li key={idx} dangerouslySetInnerHTML={{ __html: mistake }} />
                    ))}
                  </ul>
                </div>
              )}

              {lesson.additionalContent.relatedCommands && (
                <div className="content-box related-box">
                  <h4>🔗 Comandos Relacionados</h4>
                  <ul>
                    {lesson.additionalContent.relatedCommands.map((cmd, idx) => (
                      <li key={idx}>
                        <code>{cmd.command}</code> - {cmd.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lesson.additionalContent.realWorldUse && (
                <div className="content-box realworld-box">
                  <div dangerouslySetInnerHTML={{ __html: lesson.additionalContent.realWorldUse }} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
