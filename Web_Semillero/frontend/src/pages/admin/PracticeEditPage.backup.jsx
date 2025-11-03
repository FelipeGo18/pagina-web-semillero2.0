import { useState, useRef, useEffect } from "react";
import { useNavigate, UNSAFE_NavigationContext } from "react-router-dom";
// Custom hook para bloquear navegación de React Router v6+
import { useContext } from "react";
const colors = { blanco: '#fff', borde: '#e0e0e0', negro: '#222', grisClaro: '#f7f7fa', grisMedio: '#888', grisOscuro: '#444', rojoPiloto: '#e53935' };

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
import QuillEditor from '../../components/QuillEditor';

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
    duration: '', // Duración total
    objectives: [], // Objetivos de la práctica
    topics: [], // Temas a desarrollar
    requirements: [], // Requisitos de la práctica
    modules: []
  });
  
  // Asegurarse de que siempre haya un tipo definido
  if (!initial.type) {
    initial.type = 'linux-terminal';
  }
  
  // Si el campo 'icon' contiene SVG o base64, moverlo a 'iconSvg' y limpiar 'icon'
  if (initial.icon && typeof initial.icon === 'string') {
    const iconTrimmed = initial.icon.trim();
    if (iconTrimmed.startsWith('<svg') || iconTrimmed.startsWith('data:image') || iconTrimmed.length > 10) {
      initial.iconSvg = initial.icon;
      initial.icon = '';
    }
  }
  
  // Si ya tiene iconSvg, asegurar que icon esté vacío
  if (initial.iconSvg && !initial.icon) {
    initial.icon = '';
  }
  
  const [editingCourse, setEditingCourse] = useState(deepClone(initial));
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState([]);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [saving, setSaving] = useState(false);

  // Estado para el tipo de icono (emoji o imagen)
  const [iconType, setIconType] = useState(() => {
    // Si hay iconSvg guardado, seleccionar automáticamente 'image'
    if (initial.iconSvg) return 'image';
    // Si solo hay icon (emoji), seleccionar 'emoji'
    if (initial.icon && !initial.iconSvg) return 'emoji';
    // Por defecto emoji
    return 'emoji';
  });

  // Sincronizar iconType cuando cambia editingCourse
  useEffect(() => {
    if (editingCourse.iconSvg) {
      setIconType('image');
    } else if (editingCourse.icon) {
      setIconType('emoji');
    }
    // eslint-disable-next-line
  }, [editingCourse.iconSvg, editingCourse.icon]);

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
    
    // Filtrar líneas vacías de objetivos, temas y requisitos antes de guardar
    const objectives = Array.isArray(editingCourse.objectives) 
      ? editingCourse.objectives.filter(obj => obj && obj.trim() !== '')
      : [];
    
    const topics = Array.isArray(editingCourse.topics) 
      ? editingCourse.topics.filter(topic => topic && topic.trim() !== '')
      : [];
    
    const requirements = Array.isArray(editingCourse.requirements)
      ? editingCourse.requirements.filter(req => req && req.trim() !== '')
      : [];
    
    const practiceData = {
      title: editingCourse.title,
      description: editingCourse.description,
      icon: editingCourse.icon,
      iconSvg: editingCourse.iconSvg,
      level: editingCourse.level,
      type: editingCourse.type || 'linux-terminal',
      duration: editingCourse.duration,
      objectives: objectives,
      topics: topics,
      requirements: requirements,
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
          <QuillEditor
            value={editingCourse.description}
            onChange={val => handleChange({ ...editingCourse, description: val })}
            placeholder="Descripción de la práctica"
          />
        </div>
        <div className="form-group">
          {/* Icono moderno con radio, preview y upload */}
          <div style={{
            background: colors.blanco,
            border: `2px solid ${colors.borde}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <label style={{
              fontWeight: '600',
              color: colors.negro,
              marginBottom: '16px',
              display: 'block',
              fontSize: '1.05rem'
            }}>Ícono de la práctica</label>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr',
              gap: '24px'
            }}>
              {/* Preview Card */}
              <div>
                <div style={{
                  width: '120px',
                  height: '120px',
                  border: `2px solid ${colors.borde}`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: colors.grisClaro,
                  fontSize: '4rem',
                  overflow: 'hidden'
                }}>
                  {iconType === 'emoji' ? (
                    editingCourse.icon || '?'
                  ) : editingCourse.iconSvg ? (
                    // Si es SVG puro (texto), mostrar embebido; si es base64, mostrar como imagen
                    editingCourse.iconSvg.startsWith('data:image') ? (
                      <img src={editingCourse.iconSvg} alt="icono" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: editingCourse.iconSvg }} style={{ width: '100%', height: '100%', display: 'block' }} />
                    )
                  ) : (
                    <span style={{ color: colors.grisMedio, fontSize: '1rem' }}>Sin ícono</span>
                  )}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: colors.grisMedio,
                  marginTop: '8px',
                  textAlign: 'center'
                }}>Vista previa</div>
              </div>

              {/* Options */}
              <div>
                {/* Radio Buttons - Estilo moderno y limpio */}
                <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                  <label style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '14px 16px',
                    border: `2px solid ${iconType === 'emoji' ? colors.rojoPiloto : colors.borde}`,
                    borderRadius: '8px',
                    background: iconType === 'emoji' ? colors.rojoPiloto : colors.blanco,
                    color: iconType === 'emoji' ? colors.blanco : colors.negro,
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}>
                    <input
                      type="radio"
                      name="iconType"
                      checked={iconType === 'emoji'}
                      onChange={() => setIconType('emoji')}
                      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                    />
                    <span style={{ fontSize: '1.2em' }}>😀</span>
                    <span>Emoji</span>
                  </label>

                  <label style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '14px 16px',
                    border: `2px solid ${iconType === 'image' ? colors.rojoPiloto : colors.borde}`,
                    borderRadius: '8px',
                    background: iconType === 'image' ? colors.rojoPiloto : colors.blanco,
                    color: iconType === 'image' ? colors.blanco : colors.negro,
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}>
                    <input
                      type="radio"
                      name="iconType"
                      checked={iconType === 'image'}
                      onChange={() => setIconType('image')}
                      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                    />
                    <span style={{ fontSize: '1.2em' }}>🖼️</span>
                    <span>Imagen</span>
                  </label>
                </div>

                {/* Input basado en selección */}
                {iconType === 'emoji' ? (
                  <input
                    type="text"
                    value={editingCourse.icon}
                    onChange={e => handleChange({ ...editingCourse, icon: e.target.value, iconSvg: undefined })}
                    placeholder="🐧"
                    maxLength="2"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${colors.borde}`,
                      borderRadius: '8px',
                      fontSize: '2rem',
                      textAlign: 'center',
                      background: colors.blanco
                    }}
                  />
                ) : (
                  <div>
                    {editingCourse.iconSvg ? (
                      <>
                        <div style={{ marginBottom: 8 }}>
                          {/* La vista previa ya se muestra a la izquierda */}
                        </div>
                        <button
                          onClick={() => handleChange({ ...editingCourse, iconSvg: undefined })}
                          style={{
                            marginTop: '12px',
                            padding: '8px 16px',
                            background: colors.blanco,
                            color: colors.rojoPiloto,
                            border: `2px solid ${colors.rojoPiloto}`,
                            borderRadius: '50px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            width: '100%'
                          }}
                        >
                          🗑️ Quitar imagen
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept=".svg,.png,.jpg,.jpeg"
                          onChange={e => {
                            const file = e.target.files && e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = ev => {
                              handleChange({ ...editingCourse, iconSvg: ev.target.result, icon: '' });
                            };
                            reader.readAsDataURL(file);
                          }}
                          style={{ display: 'none' }}
                          id="file-upload-main"
                        />
                        <label
                          htmlFor="file-upload-main"
                          style={{
                            display: 'block',
                            padding: '16px 24px',
                            border: `2px dashed ${colors.borde}`,
                            borderRadius: '8px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: colors.grisClaro,
                            color: colors.grisOscuro,
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            marginBottom: 8
                          }}
                        >
                          � Seleccionar archivo
                        </label>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Duración total</label>
          <input
            type="text"
            value={editingCourse.duration || ''}
            onChange={(e) => handleChange({ ...editingCourse, duration: e.target.value })}
            placeholder="Ej: 20-25 horas"
          />
        </div>
        <div className="form-group">
          <label>Objetivos</label>
          <div style={{ marginBottom: 8, color: '#888', fontSize: '0.95em' }}>
            Un objetivo por línea. Presiona Enter para agregar otro.
          </div>
          <textarea
            value={Array.isArray(editingCourse.objectives) ? editingCourse.objectives.join('\n') : ''}
            onChange={(e) => {
              const lines = e.target.value.split('\n');
              handleChange({ ...editingCourse, objectives: lines });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
              }
            }}
            placeholder="Comprender la arquitectura básica de Linux&#10;Dominar comandos esenciales del terminal&#10;Navegar y administrar el sistema de archivos"
            rows={6}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '1em' }}
          />
        </div>
        <div className="form-group">
          <label>Temas a desarrollar</label>
          <div style={{ marginBottom: 8, color: '#888', fontSize: '0.95em' }}>
            Un tema por línea. Presiona Enter para agregar otro.
          </div>
          <textarea
            value={Array.isArray(editingCourse.topics) ? editingCourse.topics.join('\n') : ''}
            onChange={(e) => {
              const lines = e.target.value.split('\n');
              handleChange({ ...editingCourse, topics: lines });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
              }
            }}
            placeholder="Introducción al sistema operativo&#10;Comandos básicos del terminal&#10;Gestión de archivos y directorios"
            rows={6}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '1em' }}
          />
        </div>
        <div className="form-group">
          <label>Requisitos</label>
          <div style={{ marginBottom: 8, color: '#888', fontSize: '0.95em' }}>
            Un requisito por línea. Presiona Enter para agregar otro.
          </div>
          <textarea
            value={Array.isArray(editingCourse.requirements) ? editingCourse.requirements.join('\n') : ''}
            onChange={(e) => {
              const lines = e.target.value.split('\n');
              handleChange({ ...editingCourse, requirements: lines });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
              }
            }}
            placeholder="Computador con Linux instalado o máquina virtual&#10;Acceso al terminal"
            rows={4}
            style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '1em' }}
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
            <option value="linux-terminal">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="14" height="10" rx="2" stroke="#333" strokeWidth="2"/>
                  <rect x="6" y="7" width="8" height="4" rx="1" fill="#333"/>
                </svg>
                Terminal Linux (comandos interactivos)
              </span>
            </option>
            <option value="teorica">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="3" width="12" height="14" rx="2" stroke="#333" strokeWidth="2"/>
                  <line x1="7" y1="7" x2="13" y2="7" stroke="#333" strokeWidth="1.5"/>
                  <line x1="7" y1="10" x2="13" y2="10" stroke="#333" strokeWidth="1.5"/>
                  <line x1="7" y1="13" x2="11" y2="13" stroke="#333" strokeWidth="1.5"/>
                </svg>
                Teórica (contenido de lectura)
              </span>
            </option>
            <option value="quiz">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="8" stroke="#333" strokeWidth="2"/>
                  <text x="10" y="14" textAnchor="middle" fontSize="10" fill="#333">?</text>
                </svg>
                Quiz (preguntas y respuestas)
              </span>
            </option>
            <option value="practica-guiada">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="8" stroke="#333" strokeWidth="2"/>
                  <path d="M10 6v4l3 2" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Práctica guiada (pasos a seguir)
              </span>
            </option>
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
                    <span className="module-toggle-icon" style={{ fontSize: 18 }}>
                      {expanded ? (
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 8l5 5 5-5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5l5 5-5 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
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
                          <QuillEditor
                            value={mod.description || ''}
                            onChange={val => {
                              const modules = [...editingCourse.modules];
                              modules[modIdx].description = val;
                              handleChange({ ...editingCourse, modules });
                            }}
                            placeholder="Descripción del módulo"
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
                                  <span className="class-toggle-icon" style={{ fontSize: 16 }}>
                                    {classExpanded ? (
                                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 8l5 5 5-5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    ) : (
                                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 5l5 5-5 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    )}
                                  </span>
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
                                    {/* Secciones de la clase */}
                                    <div className="sections-list">
                                      <div className="section-label section-label--small">Secciones</div>
                                      {Array.isArray(cls.sections) && cls.sections.length > 0 ? (
                                        cls.sections.map((sec, secIdx) => (
                                          <div key={sec.id || secIdx} className="section-card">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                              <input
                                                type="text"
                                                className="section-title-input"
                                                placeholder="Título de la sección"
                                                value={sec.title || ''}
                                                onChange={e => {
                                                  const modules = [...editingCourse.modules];
                                                  modules[modIdx].classes[clsIdx].sections[secIdx].title = e.target.value;
                                                  handleChange({ ...editingCourse, modules });
                                                }}
                                              />
                                              {/* Mensaje de ayuda eliminado, solo disponible en el campo principal de icono */}
                                              {/* Eliminado input y preview de SVG en secciones, solo disponible en el campo principal de icono */}
                                              <button type="button" className="btn-delete-section" onClick={async () => {
                                                const result = await Swal.fire({
                                                  title: '¿Eliminar sección?',
                                                  text: 'Esta acción no se puede deshacer. ¿Deseas eliminar esta sección?',
                                                  icon: 'warning',
                                                  showCancelButton: true,
                                                  confirmButtonColor: '#d33',
                                                  cancelButtonColor: '#3085d6',
                                                  confirmButtonText: 'Eliminar',
                                                  cancelButtonText: 'Cancelar'
                                                });
                                                if (result.isConfirmed) {
                                                  const modules = [...editingCourse.modules];
                                                  modules[modIdx].classes[clsIdx].sections.splice(secIdx, 1);
                                                  handleChange({ ...editingCourse, modules });
                                                }
                                              }}>
                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <rect x="5" y="6.5" width="10" height="9" rx="2" stroke="#c00" strokeWidth="2"/>
                                                  <path d="M8 9v4" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                                                  <path d="M12 9v4" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                                                  <path d="M3 6.5h14" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                                                  <path d="M8.5 4.5h3a1 1 0 0 1 1 1V6.5h-5V5.5a1 1 0 0 1 1-1z" stroke="#c00" strokeWidth="2"/>
                                                </svg>
                                              </button>
                                            </div>
                                            <QuillEditor
                                              value={sec.content || ''}
                                              onChange={val => {
                                                const modules = [...editingCourse.modules];
                                                modules[modIdx].classes[clsIdx].sections[secIdx].content = val;
                                                handleChange({ ...editingCourse, modules });
                                              }}
                                              placeholder="Contenido enriquecido de la sección"
                                            />
                                          </div>
                                        ))
                                      ) : (
                                        <div className="no-sections">No hay secciones aún.</div>
                                      )}
                                      <button
                                        type="button"
                                        className="btn-add-section"
                                        style={{
                                          background: '#e53935',
                                          color: '#fff',
                                          border: 'none',
                                          borderRadius: 6,
                                          padding: '8px 18px',
                                          fontWeight: 600,
                                          fontSize: 15,
                                          marginTop: 10,
                                          boxShadow: '0 2px 8px #e5393522',
                                          cursor: 'pointer',
                                          transition: 'background 0.2s',
                                        }}
                                        onClick={() => {
                                          const modules = [...editingCourse.modules];
                                          if (!modules[modIdx].classes[clsIdx].sections) modules[modIdx].classes[clsIdx].sections = [];
                                          modules[modIdx].classes[clsIdx].sections.push({ id: Date.now() + Math.random(), title: '', content: '' });
                                          handleChange({ ...editingCourse, modules });
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background = '#b71c1c'}
                                        onMouseOut={e => e.currentTarget.style.background = '#e53935'}
                                      >+ Agregar sección</button>
                                    </div>

                                    {/* Ejercicios/Actividades después de las secciones */}
                                    <div className="exercises-list" style={{ marginTop: 32 }}>
                                      <div className="section-label section-label--small">
                                        {editingCourse.type === 'linux-terminal' && 'Ejercicios'}
                                        {editingCourse.type === 'teorica' && 'Contenido'}
                                        {editingCourse.type === 'quiz' && 'Preguntas'}
                                        {editingCourse.type === 'practica-guiada' && 'Pasos'}
                                      </div>
                                      {Array.isArray(cls.exercises) && cls.exercises.length > 0 ? (
                                        cls.exercises.map((ex, exIdx) => (
                                          <div key={ex.id || exIdx} className="exercise-card">
                                            {/* TIPO: Linux Terminal */}
                                            {editingCourse.type === 'linux-terminal' && (
                                              <>
                                                {/* Título */}
                                                <div style={{ marginBottom: '14px' }}>
                                                  <div className="field-title">
                                                    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: 'middle', marginRight: 8 }} xmlns="http://www.w3.org/2000/svg">
                                                      <rect x="4" y="3" width="12" height="14" rx="2" stroke="#1976d2" strokeWidth="2" fill="#e3f2fd"/>
                                                      <line x1="7" y1="7" x2="13" y2="7" stroke="#1976d2" strokeWidth="1.5"/>
                                                    </svg>
                                                    Título
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
                                                  <div className="field-title">
                                                    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: 'middle', marginRight: 8 }} xmlns="http://www.w3.org/2000/svg">
                                                      <rect x="4" y="3" width="12" height="14" rx="2" stroke="#1976d2" strokeWidth="2" fill="#e3f2fd"/>
                                                      <path d="M7 13l6-6" stroke="#1976d2" strokeWidth="1.5"/>
                                                      <circle cx="7" cy="13" r="1.2" fill="#1976d2"/>
                                                    </svg>
                                                    Tarea para el estudiante
                                                    <span style={{ color: '#aaa', fontSize: '0.95em', fontWeight: 400, marginLeft: 8 }}>
                                                      Lo que verá en la práctica
                                                    </span>
                                                  </div>
                                                  <QuillEditor
                                                    value={ex.instruction || ''}
                                                    onChange={val => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].instruction = val;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    placeholder="Describe la tarea para el estudiante"
                                                  />
                                                </div>
                                                {/* Comando esperado SOLO input con estilo terminal */}
                                                <div style={{ marginBottom: '14px' }}>
                                                  <div className="field-title">
                                                    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: 'middle', marginRight: 8 }} xmlns="http://www.w3.org/2000/svg">
                                                      <rect x="3" y="4" width="14" height="10" rx="2" stroke="#1976d2" strokeWidth="2" fill="#e3f2fd"/>
                                                      <rect x="6" y="7" width="8" height="4" rx="1" fill="#1976d2"/>
                                                    </svg>
                                                    Comando correcto
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
                                                  <div className="field-title">
                                                    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: 'middle', marginRight: 8 }} xmlns="http://www.w3.org/2000/svg">
                                                      <circle cx="10" cy="10" r="8" stroke="#c00" strokeWidth="2" fill="#fff3cd"/>
                                                      <path d="M10 6v4" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                                                      <circle cx="10" cy="14" r="1" fill="#c00"/>
                                                    </svg>
                                                    Explicación
                                                    <span style={{ color: '#aaa', fontSize: '0.95em', fontWeight: 400, marginLeft: 8 }}>
                                                      Se mostrará cuando acierte o solicite ayuda
                                                    </span>
                                                  </div>
                                                  <QuillEditor
                                                    value={ex.explanation || ''}
                                                    onChange={val => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].explanation = val;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    placeholder="Explicación del comando o tips para el estudiante"
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
                                                  <QuillEditor
                                                    value={ex.content || ex.explanation || ''}
                                                    onChange={val => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].content = val;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    placeholder="Escribe el contenido teórico aquí..."
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
                                                  <QuillEditor
                                                    value={ex.description || ex.instruction || ''}
                                                    onChange={val => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].description = val;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    placeholder="Describe qué debe hacer el usuario en este paso"
                                                  />
                                                </div>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Código o ejemplo (opcional)</label>
                                                  <QuillEditor
                                                    value={ex.code || ex.expectedCommand || ''}
                                                    onChange={val => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].code = val;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    placeholder="Código de ejemplo o comando a ejecutar"
                                                  />
                                                </div>
                                                <div style={{ marginBottom: '14px' }}>
                                                  <label className="field-desc">Notas adicionales</label>
                                                  <QuillEditor
                                                    value={ex.notes || ex.explanation || ''}
                                                    onChange={val => {
                                                      const modules = [...editingCourse.modules];
                                                      modules[modIdx].classes[clsIdx].exercises[exIdx].notes = val;
                                                      handleChange({ ...editingCourse, modules });
                                                    }}
                                                    placeholder="Consejos, advertencias o información adicional"
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
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="10" cy="10" r="9" stroke="#c00" strokeWidth="2" fill="#fff3cd"/>
                                                    <path d="M10 6v4" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                                                    <circle cx="10" cy="14" r="1" fill="#c00"/>
                                                  </svg>
                                                  <span>
                                                    Tipo de práctica no reconocido: "<strong>{editingCourse.type}</strong>". <br/>
                                                    Los tipos válidos son: linux-terminal, teorica, quiz, practica-guiada
                                                  </span>
                                                </span>
                                              </div>
                                            )}
                                            <button type="button" className="btn-delete-exercise" onClick={async () => {
                                              const result = await Swal.fire({
                                                title: '¿Eliminar ejercicio?',
                                                text: 'Esta acción no se puede deshacer. ¿Deseas eliminar este ejercicio?',
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#d33',
                                                cancelButtonColor: '#3085d6',
                                                confirmButtonText: 'Eliminar',
                                                cancelButtonText: 'Cancelar'
                                              });
                                              if (result.isConfirmed) {
                                                const modules = [...editingCourse.modules];
                                                modules[modIdx].classes[clsIdx].exercises.splice(exIdx, 1);
                                                handleChange({ ...editingCourse, modules });
                                              }
                                            }}>
                                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <rect x="5" y="6.5" width="10" height="9" rx="2" stroke="#c00" strokeWidth="2"/>
                                                  <path d="M8 9v4" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                                                  <path d="M12 9v4" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                                                  <path d="M3 6.5h14" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                                                  <path d="M8.5 4.5h3a1 1 0 0 1 1 1V6.5h-5V5.5a1 1 0 0 1 1-1z" stroke="#c00" strokeWidth="2"/>
                                                </svg>
                                                Eliminar {
                                                  editingCourse.type === 'linux-terminal' ? 'ejercicio' :
                                                  editingCourse.type === 'teorica' ? 'contenido' :
                                                  editingCourse.type === 'quiz' ? 'pregunta' :
                                                  'paso'
                                                }
                                              </span>
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
                                      </button>
                                    </div>
                                    <button type="button" className="btn-delete-class" onClick={async () => {
                                      const result = await Swal.fire({
                                        title: '¿Eliminar clase?',
                                        text: 'Esta acción no se puede deshacer. ¿Deseas eliminar esta clase?',
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#d33',
                                        cancelButtonColor: '#3085d6',
                                        confirmButtonText: 'Eliminar',
                                        cancelButtonText: 'Cancelar'
                                      });
                                      if (result.isConfirmed) {
                                        const modules = [...editingCourse.modules];
                                        modules[modIdx].classes.splice(clsIdx, 1);
                                        handleChange({ ...editingCourse, modules });
                                        setExpandedClasses({
                                          ...expandedClasses,
                                          [modIdx]: (expandedClasses[modIdx] || []).filter(idx => idx !== clsIdx)
                                        });
                                      }
                                    }}>
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    </div>
                                    <button type="button" className="btn-delete-class" onClick={() => {
                                      const modules = [...editingCourse.modules];
                                      modules[modIdx].classes.splice(clsIdx, 1);
                                      handleChange({ ...editingCourse, modules });
                                      setExpandedClasses({
                                        ...expandedClasses,
                                        [modIdx]: (expandedClasses[modIdx] || []).filter(idx => idx !== clsIdx)
                                      });
                                    }}>
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <rect x="5" y="6.5" width="10" height="9" rx="2" stroke="#c00" strokeWidth="2"/>
                                          <path d="M8 9v4" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                                          <path d="M12 9v4" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                                          <path d="M3 6.5h14" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                                          <path d="M8.5 4.5h3a1 1 0 0 1 1 1V6.5h-5V5.5a1 1 0 0 1 1-1z" stroke="#c00" strokeWidth="2"/>
                                        </svg>
                                        Eliminar clase
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <button type="button" className="btn-add-class" onClick={() => {
                            const modules = [...editingCourse.modules];
                            if (!modules[modIdx].classes) modules[modIdx].classes = [];
                            modules[modIdx].classes.push({ id: Date.now() + Math.random(), title: '', duration: '', sections: [], exercises: [] });
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
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="6.5" width="10" height="9" rx="2" stroke="#c00" strokeWidth="2"/>
                            <path d="M8 9v4" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M12 9v4" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M3 6.5h14" stroke="#c00" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M8.5 4.5h3a1 1 0 0 1 1 1V6.5h-5V5.5a1 1 0 0 1 1-1z" stroke="#c00" strokeWidth="2"/>
                          </svg>
                          Eliminar módulo
                        </span>
                      </button>
                    </>
                  )}
                </div>
              );
            })}
            <button type="button" className="btn-add-module" onClick={() => {
              const modules = editingCourse.modules ? [...editingCourse.modules] : [];
              // Generar el siguiente ID de módulo secuencialmente (1, 2, 3, ...)
              const nextModuleId = modules.length > 0 
                ? Math.max(...modules.map(m => typeof m.id === 'number' ? m.id : 0)) + 1 
                : 1;
              modules.push({ id: nextModuleId, title: '', description: '', classes: [] });
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
