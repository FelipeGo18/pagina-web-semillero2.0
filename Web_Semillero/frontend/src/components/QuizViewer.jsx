import { useState } from 'react'
import './QuizViewer.css'

export default function QuizViewer({ questions = [], onComplete, isCompleted }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]
  
  if (!currentQuestion) {
    return (
      <div className="quiz-viewer">
        <div className="no-questions">
          <p>No hay preguntas disponibles para este quiz.</p>
        </div>
      </div>
    )
  }

  const options = currentQuestion.options 
    ? currentQuestion.options.split('\n').filter(opt => opt.trim()) 
    : []

  const handleSelectAnswer = (option) => {
    if (showResults) return // No permitir cambios después de enviar
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: option
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    // Calcular puntuación
    let correct = 0
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] && selectedAnswers[idx].trim() === q.correctAnswer.trim()) {
        correct++
      }
    })
    
    const finalScore = (correct / questions.length) * 100
    setScore(finalScore)
    setShowResults(true)
    
    // Si aprueba (>=70%), marcar como completado
    if (finalScore >= 70 && !isCompleted) {
      onComplete()
    }
  }

  const handleRetry = () => {
    setSelectedAnswers({})
    setShowResults(false)
    setScore(0)
    setCurrentQuestionIndex(0)
  }

  const allQuestionsAnswered = questions.every((_, idx) => selectedAnswers[idx])
  const isCorrect = showResults && selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer

  return (
    <div className="quiz-viewer">
      {/* Progreso del quiz */}
      <div className="quiz-progress">
        <div className="progress-info">
          <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
          <span className="answered-count">
            {Object.keys(selectedAnswers).length} respondidas
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {!showResults ? (
        <>
          {/* Pregunta actual */}
          <div className="question-card">
            <div className="question-header">
              <span className="question-number">Pregunta {currentQuestionIndex + 1}</span>
            </div>
            <h3 className="question-text">{currentQuestion.question || currentQuestion.title}</h3>
            
            {/* Opciones */}
            <div className="options-list">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-button ${selectedAnswers[currentQuestionIndex] === option ? 'selected' : ''}`}
                  onClick={() => handleSelectAnswer(option)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="option-text">{option}</span>
                  {selectedAnswers[currentQuestionIndex] === option && (
                    <span className="check-mark">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div className="quiz-navigation">
            <button 
              className="nav-btn"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              ← Anterior
            </button>
            
            <div className="question-dots">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  className={`dot ${idx === currentQuestionIndex ? 'active' : ''} ${selectedAnswers[idx] ? 'answered' : ''}`}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  title={`Pregunta ${idx + 1}`}
                />
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button 
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                title={!allQuestionsAnswered ? 'Responde todas las preguntas' : ''}
              >
                Enviar Quiz
              </button>
            ) : (
              <button 
                className="nav-btn"
                onClick={handleNext}
              >
                Siguiente →
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Resultados */}
          <div className="quiz-results">
            <div className={`results-card ${score >= 70 ? 'passed' : 'failed'}`}>
              <div className="results-icon">
                {score >= 70 ? '🎉' : '😞'}
              </div>
              <h2>¡Quiz Completado!</h2>
              <div className="score-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="score-bg" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    className="score-progress"
                    style={{
                      strokeDasharray: `${score * 2.827}, 282.7`,
                      stroke: score >= 70 ? '#2ecc71' : '#e74c3c'
                    }}
                  />
                </svg>
                <div className="score-text">
                  <span className="score-number">{Math.round(score)}%</span>
                  <span className="score-label">Puntuación</span>
                </div>
              </div>
              <div className="results-details">
                <div className="detail-item">
                  <span className="detail-label">Correctas:</span>
                  <span className="detail-value correct">
                    {Object.entries(selectedAnswers).filter(([idx, ans]) => 
                      ans === questions[idx].correctAnswer
                    ).length}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Incorrectas:</span>
                  <span className="detail-value incorrect">
                    {Object.entries(selectedAnswers).filter(([idx, ans]) => 
                      ans !== questions[idx].correctAnswer
                    ).length}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total:</span>
                  <span className="detail-value">{questions.length}</span>
                </div>
              </div>
              <p className="results-message">
                {score >= 70 
                  ? '¡Excelente trabajo! Has aprobado el quiz.' 
                  : 'No alcanzaste el 70% requerido. ¡Intenta de nuevo!'}
              </p>
              <button className="retry-btn" onClick={handleRetry}>
                🔄 Intentar de nuevo
              </button>
            </div>

            {/* Revisión de respuestas */}
            <div className="answers-review">
              <h3>Revisión de Respuestas</h3>
              {questions.map((q, idx) => {
                const userAnswer = selectedAnswers[idx]
                const isCorrect = userAnswer === q.correctAnswer
                
                return (
                  <div key={idx} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-header">
                      <span className="review-number">Pregunta {idx + 1}</span>
                      <span className={`review-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? '✓ Correcta' : '✗ Incorrecta'}
                      </span>
                    </div>
                    <p className="review-question">{q.question || q.title}</p>
                    <div className="review-answers">
                      <div className="answer-line">
                        <span className="answer-label">Tu respuesta:</span>
                        <span className={`answer-value ${isCorrect ? 'correct' : 'incorrect'}`}>
                          {userAnswer}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="answer-line">
                          <span className="answer-label">Respuesta correcta:</span>
                          <span className="answer-value correct">{q.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                    {q.explanation && (
                      <div className="explanation">
                        <strong>💡 Explicación:</strong>
                        <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
