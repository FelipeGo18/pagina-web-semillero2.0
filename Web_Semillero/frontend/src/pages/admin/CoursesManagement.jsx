import { useState, useEffect } from 'react';
import { getAllPractices, createPractice, updatePractice, deletePractice, getPractice } from '../../services/practicesApi';
import { useNavigate } from 'react-router-dom';
import PracticeEditPage from './PracticeEditPage';
import Swal from 'sweetalert2';
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
  const [showEditPage, setShowEditPage] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  // Accordion state for expanded modules
  const [expandedModules, setExpandedModules] = useState([]);
  // Accordion state for expanded classes per module (object: { [modIdx]: [clsIdx, ...] })
  const [expandedClasses, setExpandedClasses] = useState({});

  // Toggle expand/collapse for a module
  const toggleModule = (modIdx) => {
    setExpandedModules((prev) =>
      prev.includes(modIdx)
        ? prev.filter((idx) => idx !== modIdx)
        : [...prev, modIdx]
    );
  };

  // Toggle expand/collapse for a class inside a module
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
    navigate('/admin/practices/new');
  };

  const handleEdit = async (course) => {
    try {
      const fullCourse = await getPractice(course.id);
      setEditingCourse({ ...fullCourse });
      setShowEditPage(true);
    } catch (err) {
      alert('Error al cargar la práctica: ' + (err.message || ''));
    }
  };

  const handleDelete = async (courseId) => {
    const result = await Swal.fire({
      title: '¿Eliminar práctica?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#666',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deletePractice(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
      
      Swal.fire({
        title: '¡Eliminada!',
        text: 'La práctica ha sido eliminada correctamente',
        icon: 'success',
        confirmButtonColor: '#e53935',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al eliminar la práctica',
        icon: 'error',
        confirmButtonColor: '#e53935'
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const practiceData = {
      title: editingCourse.title,
      description: editingCourse.description,
      icon: editingCourse.icon,
      modules: editingCourse.modules || [],
      // Puedes agregar más campos aquí si los usas en el formulario
    };
    try {
      if (editingCourse.id && courses.find(c => c.id === editingCourse.id)) {
        // Editar en backend
        const updated = await updatePractice(editingCourse.id, practiceData);
        setCourses(courses.map(c => c.id === editingCourse.id ? updated : c));
      } else {
        // Crear en backend
        const newPractice = await createPractice(practiceData);
        setCourses([...courses, newPractice]);
      }
      setShowModal(false);
      setEditingCourse(null);
    } catch (error) {
      alert(error.message || 'Error al guardar la práctica');
    }
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

  if (showEditPage && editingCourse) {
    return <PracticeEditPage initialPractice={editingCourse} onClose={() => { setShowEditPage(false); setEditingCourse(null); }} />;
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
            <div className="course-icon">
              {course.iconSvg ? (
                course.iconSvg.startsWith('data:image') ? (
                  <img src={course.iconSvg} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: course.iconSvg }} />
                )
              ) : (
                <span dangerouslySetInnerHTML={{ __html: course.icon }} />
              )}
            </div>
            <div className="course-info">
              <h3>{course.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: course.description }} />
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
    </div>
  );
};

export default CoursesManagement;
