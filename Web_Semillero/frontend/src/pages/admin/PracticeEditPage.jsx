import { useState, useRef, useEffect } from "react";
import { useNavigate, UNSAFE_NavigationContext } from "react-router-dom";
// Custom hook para bloquear navegación de React Router v6+
import { useContext } from "react";
function useBlocker(blocker, when = true) {
  const { navigator } = useContext(UNSAFE_NavigationContext);
  useEffect(() => {
    if (!when) return;
    const push = navigator.push;
    navigator.push = (...args) => {
      const result = blocker();
      if (result instanceof Promise) {
        result.then(ok => {
          if (ok) push.apply(navigator, args);
        });
      } else if (result) {
        push.apply(navigator, args);
      }
    };
    return () => {
      navigator.push = push;
    };
  }, [blocker, when, navigator]);
}
import { createPractice, updatePractice } from '../../services/practicesApi';
import './CoursesManagement.css';
import './PracticeEditPage.css';
import Swal from 'sweetalert2';

// Deep clone utility
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
// Deep equal utility
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (let key of keysA) {
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

const PracticeEditPage = ({ initialPractice = null, onClose }) => {
  const initial = deepClone(initialPractice || {
    id: Date.now(),
    title: '',
    description: '',
    icon: '🎓',
    level: 'beginner',
    type: 'linux-terminal', // Tipo de práctica: 'linux-terminal', 'teorica', 'quiz', 'practica-guiada'
    modules: []
  });
  
  // Asegurarse de que siempre haya un tipo definido
  if (!initial.type) {
    initial.type = 'linux-terminal';
  }
  
  const [editingCourse, setEditingCourse] = useState(deepClone(initial));
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState([]);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [saving, setSaving] = useState(false);

  const toggleModule = (modIdx) => {
    setExpandedModules((prev) =>
      prev.includes(modIdx)
        ? prev.filter((idx) => idx !== modIdx)
        : [...prev, modIdx]
    );
  };
  const toggleClass = (modIdx, clsIdx) => {
    setExpandedClasses((prev) => {
      const current = prev[modIdx] || [];
      return {
        ...prev,
        [modIdx]: current.includes(clsIdx)
          ? current.filter((idx) => idx !== clsIdx)
          : [...current, clsIdx],
      };
    });
  };

  // Detectar cambios para advertencia (deep)
  const isCourseChanged = () => {
    return !deepEqual(editingCourse, initial);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const practiceData = {
      title: editingCourse.title,
      description: editingCourse.description,
      icon: editingCourse.icon,
      level: editingCourse.level,
      type: editingCourse.type || 'linux-terminal',
      modules: editingCourse.modules || [],
    };
    try {
      if (editingCourse.id && initialPractice) {
        await updatePractice(editingCourse.id, practiceData);
      } else {
        await createPractice(practiceData);
      }
      setIsDirty(false);
      await Swal.fire({
        icon: 'success',
        title: 'Cambios guardados correctamente',
        showConfirmButton: false,
        timer: 1500
      });
      if (onClose) onClose();
    } catch (error) {
      alert(error.message || 'Error al guardar la práctica');
    } finally {
      setSaving(false);
    }
  };

  // Marcar dirty en cualquier cambio
  const handleChange = (updater) => {
    setEditingCourse(updater);
    setIsDirty(true);
  };

  // Confirmación al salir si hay cambios
  const handleBack = async () => {
    if (isDirty && isCourseChanged()) {
      const result = await Swal.fire({
        title: 'Cambios sin guardar',
        text: 'Tienes cambios sin guardar. ¿Seguro que quieres salir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Salir sin guardar',
        cancelButtonText: 'Cancelar',
      });
      if (!result.isConfirmed) return;
    }
    if (onClose) onClose();
    else navigate('/admin');
  };

  // Bloquear navegación de React Router si hay cambios sin guardar en cualquier campo
  useBlocker(async () => {
    if (isDirty && isCourseChanged()) {
      const result = await Swal.fire({
        title: 'Estás editando',
        text: 'Tienes cambios sin guardar en la edición de la práctica, módulo, clase o actividad. ¿Seguro que quieres salir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Salir sin guardar',
        cancelButtonText: 'Cancelar',
      });
      return result.isConfirmed;
    }
    return true;
  }, isDirty && isCourseChanged());

  // Advertencia al recargar/cerrar pestaña
  useEffect(() => {
    const handler = (e) => {
      if (isDirty && isCourseChanged()) {
        e.preventDefault();
        e.returnValue = 'Tienes cambios sin guardar en la edición de la práctica, módulo, clase o actividad.';
        return 'Tienes cambios sin guardar en la edición de la práctica, módulo, clase o actividad.';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty, editingCourse]);

  return (
    <div className="practice-edit-page">
      <button className="btn-back" type="button" onClick={handleBack}>
        ← Volver
      </button>
      <h1>{initialPractice ? 'Editar práctica' : 'Nueva práctica'}</h1>
      <form onSubmit={handleSave} className="practice-edit-form">
        <div className="form-group">
          <label>Título *</label>
          <input
            type="text"
            value={editingCourse.title}
            onChange={(e) => handleChange({ ...editingCourse, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción *</label>
          <textarea
            value={editingCourse.description}
            onChange={(e) => handleChange({ ...editingCourse, description: e.target.value })}
            rows="3"
            required
          />
        </div>
        <div className="form-group">
          <label>Icono (emoji)</label>
          <input
            type="text"
            value={editingCourse.icon}
            onChange={(e) => handleChange({ ...editingCourse, icon: e.target.value })}
            maxLength="2"
          />
        </div>
        <div className="form-group">
          <label>Nivel *</label>
          <select
            value={editingCourse.level}
            onChange={(e) => handleChange({ ...editingCourse, level: e.target.value })}
            required
          >
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>
        <div className="form-group">
          <label>Tipo de práctica *</label>
          <div className="field-desc-text" style={{ marginBottom: '8px' }}>
            Selecciona el formato de contenido para esta práctica.
          </div>
          <select
            value={editingCourse.type || 'linux-terminal'}
            onChange={(e) => handleChange({ ...editingCourse, type: e.target.value })}
            required
          >
            <option value="linux-terminal">🖥️ Terminal Linux (comandos interactivos)</option>
            <option value="teorica">📚 Teórica (contenido de lectura)</option>
            <option value="quiz">❓ Quiz (preguntas y respuestas)</option>
            <option value="practica-guiada">🎯 Práctica guiada (pasos a seguir)</option>
          </select>
        </div>
        {/* Módulos */}
        <div className="form-group">
          <label>Módulos</label>
          <div className="modules-list">
            {(editingCourse.modules || []).map((mod, modIdx) => {
              const expanded = expandedModules.includes(modIdx);
              return (
                <div key={mod.id || modIdx} className={`module-card${expanded ? ' expanded' : ''}`}>
                  <div className="module-header" onClick={() => toggleModule(modIdx)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="module-title-preview">{mod.title || 'Sin título'}</span>
                      <span className="module-badge">{(mod.classes?.length || 0)} clases</span>
                    </div>
                    <span className="module-toggle-icon" style={{ fontSize: 18 }}>{expanded ? '▼' : '▶'}</span>
                  </div>
                  {expanded && (
                    <>
                      <div className="module-details">
                        <div style={{ marginBottom: '20px' }}>
                          <label className="field-desc">Título del módulo</label>
                          <div className="field-desc-text">Escribe un nombre corto y claro para el módulo.</div>
                          <input
                            type="text"
                            className="module-title-input"
                            placeholder="Título del módulo"
                            value={mod.title || ''}
                            onChange={e => {
                              const modules = [...editingCourse.modules];
                              modules[modIdx].title = e.target.value;
                              handleChange({ ...editingCourse, modules });
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                          <label className="field-desc">Descripción del módulo</label>
                          <textarea
                            className="module-desc-input"
                            placeholder="Descripción del módulo"
                            value={mod.description || ''}
                            onChange={e => {
                              const modules = [...editingCourse.modules];
                              modules[modIdx].description = e.target.value;
                              handleChange({ ...editingCourse, modules });
                            }}
                            rows={2}
                          />
                        </div>
                        {/* Clases (collapsible) */}
                        <div className="classes-list">
                          <div className="section-label">Clases</div>
                          {(mod.classes || []).map((cls, clsIdx) => {
                            const classExpanded = (expandedClasses[modIdx] || []).includes(clsIdx);
                            return (
                              <div key={cls.id || clsIdx} className={`class-card${classExpanded ? ' expanded' : ''}`}>
                                <div className="class-header" onClick={() => toggleClass(modIdx, clsIdx)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="class-title-preview">{cls.title || 'Sin título'}</span>
                                    <span className="class-badge">
                                      {Array.isArray(cls.exercises) ? cls.exercises.length : 0} {
                                        editingCourse.type === 'linux-terminal' ? 'ejercicios' :
                                        editingCourse.type === 'teorica' ? 'contenidos' :
                                        editingCourse.type === 'quiz' ? 'preguntas' :
                                        editingCourse.type === 'practica-guiada' ? 'pasos' :
                                        'items'
                                      }
                                    </span>
                                  </div>
                                  <span className="class-toggle-icon" style={{ fontSize: 16 }}>{classExpanded ? '▼' : '▶'}</span>
                                </div>
                                {classExpanded && (
                                  <div className="class-details">
                                    <div style={{ marginBottom: '16px' }}>
                                      <label className="field-desc">Título de la clase</label>
                                      <input
                                        type="text"
                                        className="class-title-input"
                                        placeholder="Título de la clase"
                                        value={cls.title || ''}
                                        onChange={e => {
                                          const modules = [...editingCourse.modules];
                                          modules[modIdx].classes[clsIdx].title = e.target.value;
                                          handleChange({ ...editingCourse, modules });
                                        }}
                                      />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                      <label className="field-desc">Duración</label>
                                      <input
                                        type="text"
                                        className="class-duration-input"
                                        placeholder="Duración"
                                        value={cls.duration || ''}
                                        onChange={e => {
                                          const modules = [...editingCourse.modules];
                                          modules[modIdx].classes[clsIdx].duration = e.target.value;
                                          handleChange({ ...editingCourse, modules });
                                        }}
                                      />
                                    </div>
                                    {/* Ejercicios/Actividades según tipo */}
                                    <div className="exercises-list">
                                      <div className="section-label section-label--small">
                                        {editingCourse.type === 'linux-terminal' && 'Ejercicios'}
                                        {editingCourse.type === 'teorica' && 'Contenido'}
                                        {editingCourse.type === 'quiz' && 'Preguntas'}
                                        {editingCourse.type === 'practica-guiada' && 'Pasos'}
                                      </div>
                                      {Array.isArray(cls.exercises) && cls.exercises.length > 0 ? (
                                        cls.exercises.map((ex, exIdx) => (
                                          <div key={ex.id || exIdx} className="exercise-card">
                                            {/* Debug: Mostrar tipo actual */}
                                            {!editingCourse.type && (
                                              <div style={{ background: '#fff3cd', padding: '10px', borderRadius: '8px', marginBottom: '10px', color: '#856404' }}>
                                                ⚠️ Tipo de práctica no definido. Por favor selecciona un tipo arriba.
                                              </div>
                                            )}
                                            
                                            {/* TIPO: Linux Terminal */}
                                            {editingCourse.type === 'linux-terminal' && (
                                              <>
                                                {/* Título */}
                                                <div style={{ marginBottom: '14px' }}>
                                                  <div className="field-title">📄 Título
                                                    <span style={{ color: '#aaa', fontSize: '0.95em', fontWeight: 400, marginLeft: 8 }}>
                                                      Lo que verá el estudiante
                                                    </span>
                                                  </div>
                                                  <input
                                                    type="text"
                                                    className="exercise-title-input"
                                                    placeholder="Título del ejercicio"
                                                    value={ex.title || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].title = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                  />
                                                </div>
                                                {/* Instrucción */}
                                                <div style={{ marginBottom: '14px' }}>
                                                  <div className="field-title">📝 Tarea para el estudiante
                                                    <span style={{ color: '#aaa', fontSize: '0.95em', fontWeight: 400, marginLeft: 8 }}>
                                                      Lo que verá en la práctica
                                                    </span>
                                                  </div>
                                                  <textarea
                                                    className="exercise-instruction-input"
                                                    placeholder="Describe la tarea para el estudiante"
                                                    value={ex.instruction || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].instruction = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    rows={2}
                                                  />
                                                </div>
                                                {/* Comando esperado SOLO input con estilo terminal */}
                                                <div style={{ marginBottom: '14px' }}>
                                                  <div className="field-title">💻 Comando correcto
                                                    <span style={{ color: '#aaa', fontSize: '0.95em', fontWeight: 400, marginLeft: 8 }}>
                                                      Lo que el estudiante debe escribir
                                                    </span>
                                                  </div>
                                                  <div className="command-box" style={{ marginTop: 6, marginBottom: 6, padding: 0 }}>
                                                    <span className="prompt">$</span>
                                                    <input
                                                      type="text"
                                                      className="exercise-command-input terminal-input-style"
                                                      placeholder="Comando esperado"
                                                      value={ex.expectedCommand || ''}
                                                      onChange={e => {
                                                        const modules = [...editingCourse.modules];
                                                        modules[modIdx].classes[clsIdx].exercises[exIdx].expectedCommand = e.target.value;
                                                        handleChange({ ...editingCourse, modules });
                                                      }}
                                                      style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#eafbe7',
                                                        fontFamily: 'Fira Mono, Consolas, monospace',
                                                        fontSize: '1.1em',
                                                        outline: 'none',
                                                        width: '100%',
                                                        padding: '10px 0',
                                                        marginLeft: 0
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                                {/* Explicación */}
                                                <div style={{ marginBottom: '14px' }}>
                                                  <div className="field-title">💡 Explicación
                                                    <span style={{ color: '#aaa', fontSize: '0.95em', fontWeight: 400, marginLeft: 8 }}>
                                                      Se mostrará cuando acierte o solicite ayuda
                                                    </span>
                                                  </div>
                                                  <textarea
                                                    className="exercise-explanation-input"
                                                    placeholder="Explicación del comando o tips para el estudiante"
                                                    value={ex.explanation || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].explanation = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    rows={2}
                                                  />
                                                </div>
                                              </>
                                            )}

                                            {/* TIPO: Teórica */}
                                            {editingCourse.type === 'teorica' && (
                                              <>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Título del contenido</label>
                                                  <input
                                                    type="text"
                                                    className="exercise-title-input"
                                                    placeholder="Ej: Introducción a sistemas operativos"
                                                    value={ex.title || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].title = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                  />
                                                </div>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Contenido de lectura</label>
                                                  <textarea
                                                    className="exercise-explanation-input"
                                                    placeholder="Escribe el contenido teórico aquí..."
                                                    value={ex.content || ex.explanation || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].content = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    rows={5}
                                                  />
                                                </div>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Recursos adicionales (URLs, separadas por coma)</label>
                                                  <input
                                                    type="text"
                                                    className="exercise-instruction-input"
                                                    placeholder="https://ejemplo.com, https://otro.com"
                                                    value={ex.resources || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].resources = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                  />
                                                </div>
                                              </>
                                            )}

                                            {/* TIPO: Quiz */}
                                            {editingCourse.type === 'quiz' && (
                                              <>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Pregunta</label>
                                                  <textarea
                                                    className="exercise-title-input"
                                                    placeholder="Escribe la pregunta aquí"
                                                    value={ex.question || ex.title || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].question = e.target.value;
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].title = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    rows={2}
                                                  />
                                                </div>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Opciones (una por línea)</label>
                                                  <textarea
                                                    className="exercise-instruction-input"
                                                    placeholder="Opción A&#10;Opción B&#10;Opción C&#10;Opción D"
                                                    value={ex.options || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].options = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    rows={4}
                                                  />
                                                </div>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Respuesta correcta</label>
                                                  <input
                                                    type="text"
                                                    className="exercise-command-input"
                                                    placeholder="Escribe la opción correcta exactamente"
                                                    value={ex.correctAnswer || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].correctAnswer = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                  />
                                                </div>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Explicación de la respuesta</label>
                                                  <textarea
                                                    className="exercise-explanation-input"
                                                    placeholder="Explica por qué esta es la respuesta correcta"
                                                    value={ex.explanation || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].explanation = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    rows={2}
                                                  />
                                                </div>
                                              </>
                                            )}

                                            {/* TIPO: Práctica Guiada */}
                                            {editingCourse.type === 'practica-guiada' && (
                                              <>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Nombre del paso</label>
                                                  <input
                                                    type="text"
                                                    className="exercise-title-input"
                                                    placeholder="Ej: Paso 1 - Crear archivo"
                                                    value={ex.title || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].title = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                  />
                                                </div>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Descripción del paso</label>
                                                  <textarea
                                                    className="exercise-instruction-input"
                                                    placeholder="Describe qué debe hacer el usuario en este paso"
                                                    value={ex.description || ex.instruction || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].description = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    rows={3}
                                                  />
                                                </div>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Código o ejemplo (opcional)</label>
                                                  <textarea
                                                    className="exercise-command-input"
                                                    placeholder="Código de ejemplo o comando a ejecutar"
                                                    value={ex.code || ex.expectedCommand || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].code = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    rows={2}
                                                  />
                                                </div>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Notas adicionales</label>
                                                  <textarea
                                                    className="exercise-explanation-input"
                                                    placeholder="Consejos, advertencias o información adicional"
                                                    value={ex.notes || ex.explanation || ''}
                                                    onChange={e => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].notes = e.target.value;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    rows={2}
                                                  />
                                                </div>
                                              </>
                                            )}

                                            {/* Mensaje si el tipo no coincide con ninguno */}
                                            {editingCourse.type && 
                                             editingCourse.type !== 'linux-terminal' && 
                                             editingCourse.type !== 'teorica' && 
                                             editingCourse.type !== 'quiz' && 
                                             editingCourse.type !== 'practica-guiada' && (
                                              <div style={{ background: '#f8d7da', padding: '15px', borderRadius: '8px', color: '#721c24' }}>
                                                ⚠️ Tipo de práctica no reconocido: "<strong>{editingCourse.type}</strong>". 
                                                Los tipos válidos son: linux-terminal, teorica, quiz, practica-guiada
                                              </div>
                                            )}

                                            <button type="button" className="btn-delete-exercise" onClick={() => {
                                              const modules = [...editingCourse.modules];
                                              modules[modIdx].classes[clsIdx].exercises.splice(exIdx, 1);
                                              handleChange({ ...editingCourse, modules });
                                            }}>
                                              🗑️ Eliminar {
                                                editingCourse.type === 'linux-terminal' ? 'ejercicio' :
                                                editingCourse.type === 'teorica' ? 'contenido' :
                                                editingCourse.type === 'quiz' ? 'pregunta' :
                                                'paso'
                                              }
                                            </button>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="no-exercises">
                                          No hay {
                                            editingCourse.type === 'linux-terminal' ? 'ejercicios' :
                                            editingCourse.type === 'teorica' ? 'contenido' :
                                            editingCourse.type === 'quiz' ? 'preguntas' :
                                            'pasos'
                                          } aún.
                                        </div>
                                      )}
                                      <button type="button" className="btn-add-exercise" onClick={() => {
                                        const modules = [...editingCourse.modules];
                                        if (!modules[modIdx].classes[clsIdx].exercises) modules[modIdx].classes[clsIdx].exercises = [];
                                        
                                        // Crear estructura según el tipo
                                        let newItem = { id: Date.now() + Math.random() };
                                        if (editingCourse.type === 'linux-terminal') {
                                          newItem = { ...newItem, title: '', instruction: '', expectedCommand: '', explanation: '' };
                                        } else if (editingCourse.type === 'teorica') {
                                          newItem = { ...newItem, title: '', content: '', resources: '' };
                                        } else if (editingCourse.type === 'quiz') {
                                          newItem = { ...newItem, question: '', title: '', options: '', correctAnswer: '', explanation: '' };
                                        } else if (editingCourse.type === 'practica-guiada') {
                                          newItem = { ...newItem, title: '', description: '', code: '', notes: '' };
                                        }
                                        
                                        modules[modIdx].classes[clsIdx].exercises.push(newItem);
                                        handleChange({ ...editingCourse, modules });
                                      }}>
                                        + Agregar {
                                          editingCourse.type === 'linux-terminal' ? 'ejercicio' :
                                          editingCourse.type === 'teorica' ? 'contenido' :
                                          editingCourse.type === 'quiz' ? 'pregunta' :
                                          'paso'
                                        }
                                      </button>
                                    </div>
                                    <button type="button" className="btn-delete-class" onClick={() => {
                                      const modules = [...editingCourse.modules];
                                      modules[modIdx].classes.splice(clsIdx, 1);
                                      handleChange({ ...editingCourse, modules });
                                      setExpandedClasses({
                                        ...expandedClasses,
                                        [modIdx]: (expandedClasses[modIdx] || []).filter(idx => idx !== clsIdx)
                                      });
                                    }}>🗑️ Eliminar clase</button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <button type="button" className="btn-add-class" onClick={() => {
                            const modules = [...editingCourse.modules];
                            if (!modules[modIdx].classes) modules[modIdx].classes = [];
                            modules[modIdx].classes.push({ id: Date.now() + Math.random(), title: '', duration: '', exercises: [] });
                            handleChange({ ...editingCourse, modules });
                          }}>+ Agregar clase</button>
                        </div>
                      </div>
                      {/* Botón eliminar módulo al final de la card, alineado con el contenido */}
                      <button
                        type="button"
                        className="btn-delete-module"
                        style={{ marginTop: 32, marginBottom: 0, borderRadius: '50px', width: '100%' }}
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: '¿Eliminar módulo?',
                            text: 'Esta acción no se puede deshacer. ¿Deseas eliminar este módulo?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Eliminar',
                            cancelButtonText: 'Cancelar',
                          });
                          if (!result.isConfirmed) return;
                          const modules = [...editingCourse.modules];
                          modules.splice(modIdx, 1);
                          handleChange({ ...editingCourse, modules });
                          setExpandedModules(expandedModules.filter(idx => idx !== modIdx));
                          setExpandedClasses(prev => {
                            const copy = { ...prev };
                            delete copy[modIdx];
                            return copy;
                          });
                        }}
                      >🗑️ Eliminar módulo</button>
                    </>
                  )}
                </div>
              );
            })}
            <button type="button" className="btn-add-module" onClick={() => {
              const modules = editingCourse.modules ? [...editingCourse.modules] : [];
              modules.push({ id: Date.now() + Math.random(), title: '', description: '', classes: [] });
              handleChange({ ...editingCourse, modules });
            }}>+ Agregar módulo</button>
          </div>
        </div>
        <div className="modal-actions">
          {onClose && (
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
          )}
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PracticeEditPage;
