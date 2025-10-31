import { useState, useEffect } from 'react';
import { getAllPractices } from '../../services/practicesApi';
import './CoursesManagement.css';

// SVG Icons
const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ModulesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="13 2 13 9 20 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Cargar prácticas desde la API
    const loadPractices = async () => {
      try {
        setLoading(true);
        const data = await getAllPractices();
        setCourses(data);
      } catch (error) {
        console.error('Error al cargar prácticas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPractices();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingCourse({
      id: Date.now(),
      title: '',
      description: '',
      icon: '🎓',
      level: 'beginner',
      modules: []
    });
    setShowModal(true);
  };

  const handleEdit = (course) => {
    setEditingCourse({ ...course });
    setShowModal(true);
  };

  const handleDelete = (courseId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta práctica?')) {
      return;
    }
    setCourses(courses.filter(c => c.id !== courseId));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (courses.find(c => c.id === editingCourse.id)) {
      // Actualizar
      setCourses(courses.map(c => c.id === editingCourse.id ? editingCourse : c));
    } else {
      // Crear nuevo
      setCourses([...courses, editingCourse]);
    }
    setShowModal(false);
    setEditingCourse(null);
  };

  const getLevelBadge = (level) => {
    const levels = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado'
    };
    return levels[level] || level;
  };

  if (loading) {
    return (
      <div className="courses-management">
        <div className="loading">Cargando prácticas...</div>
      </div>
    );
  }

  return (
    <div className="courses-management">
      <div className="courses-header">
        <h1>Gestión de Prácticas</h1>
        <button className="btn-create" onClick={handleCreate}>
          <AddIcon />
          Nueva Práctica
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar prácticas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-icon">{course.icon}</div>
            <div className="course-info">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta">
                <span className={`level-badge level-${course.level}`}>
                  {getLevelBadge(course.level)}
                </span>
                <span className="modules-count">
                  <ModulesIcon />
                  {course.modules?.length || 0} módulos
                </span>
              </div>
            </div>
            <div className="course-actions">
              <button 
                onClick={() => handleEdit(course)}
                className="btn-edit"
                title="Editar práctica"
              >
                <EditIcon />
              </button>
              <button 
                onClick={() => handleDelete(course.id)}
                className="btn-delete"
                title="Eliminar práctica"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron prácticas</p>
        </div>
      )}

      {/* Modal */}
      {showModal && editingCourse && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingCourse.id ? 'Editar Práctica' : 'Nueva Práctica'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Icono (emoji)</label>
                <input
                  type="text"
                  value={editingCourse.icon}
                  onChange={(e) => setEditingCourse({ ...editingCourse, icon: e.target.value })}
                  maxLength="2"
                />
              </div>

              <div className="form-group">
                <label>Nivel *</label>
                <select
                  value={editingCourse.level}
                  onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                  required
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesManagement;
