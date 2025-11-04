import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminApi';
import './AdminDashboard.css';

// SVG Icons
const UsersIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const StudentIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 12v5c0 1.5 2 3 6 3s6-1.5 6-3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const InstructorIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const AdminIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ProgressIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ActivityIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Faltaba definir el estado para showPracticeEdit
  const [showPracticeEdit, setShowPracticeEdit] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getStats();
        // Adaptar para extraer los datos de la estructura anidada
        if (data && data.stats) {
          setStats({
            totalUsers: data.stats.users.total,
            totalStudents: data.stats.users.students,
            totalInstructors: data.stats.users.instructors,
            totalAdmins: data.stats.users.admins,
            activeUsers: data.stats.users.active,
            recentUsers: data.stats.users.recent,
            totalProgress: data.stats.progress.total,
            completedPractices: data.stats.progress.completed
          });
        } else {
          setStats(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.response?.data?.message || 'Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  // Valores por defecto para stats
  const safeStats = {
    totalUsers: 0,
    activeUsers: 0,
    recentUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalAdmins: 0,
    totalProgress: 0,
    completedPractices: 0,
    ...stats
  };

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      <div className="stats-grid">
        {/* User Statistics */}
        <div className="stat-card users-card">
          <div className="stat-icon"><UsersIcon /></div>
          <div className="stat-content">
            <h3>Total Usuarios</h3>
            <p className="stat-number">{safeStats.totalUsers}</p>
            <div className="stat-details">
              <span>Activos: {safeStats.activeUsers}</span>
              <span>Nuevos (7d): {safeStats.recentUsers}</span>
            </div>
          </div>
        </div>

        {/* Students */}
        <div className="stat-card students-card">
          <div className="stat-icon"><StudentIcon /></div>
          <div className="stat-content">
            <h3>Estudiantes</h3>
            <p className="stat-number">{safeStats.totalStudents}</p>
          </div>
        </div>

        {/* Instructors */}
        <div className="stat-card instructors-card">
          <div className="stat-icon"><InstructorIcon /></div>
          <div className="stat-content">
            <h3>Instructores</h3>
            <p className="stat-number">{safeStats.totalInstructors}</p>
          </div>
        </div>

        {/* Admins */}
        <div className="stat-card admins-card">
          <div className="stat-icon"><AdminIcon /></div>
          <div className="stat-content">
            <h3>Administradores</h3>
            <p className="stat-number">{safeStats.totalAdmins}</p>
          </div>
        </div>

        {/* Progress Statistics */}
        <div className="stat-card progress-card">
          <div className="stat-icon"><ProgressIcon /></div>
          <div className="stat-content">
            <h3>Progreso Total</h3>
            <p className="stat-number">{safeStats.totalProgress}</p>
            <div className="stat-details">
              <span>Prácticas completadas: {safeStats.completedPractices}</span>
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <div className="stat-card activity-card large">
          <div className="stat-icon"><ActivityIcon /></div>
          <div className="stat-content">
            <h3>Actividad Reciente</h3>
            <div className="activity-summary">
              <div className="activity-item">
                <span className="activity-label">Usuarios activos:</span>
                <span className="activity-value">{safeStats.activeUsers}</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">Nuevos usuarios (7 días):</span>
                <span className="activity-value">{safeStats.recentUsers}</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">Tasa de actividad:</span>
                <span className="activity-value">
                  {safeStats.totalUsers > 0 
                    ? Math.round((safeStats.activeUsers / safeStats.totalUsers) * 100) 
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
