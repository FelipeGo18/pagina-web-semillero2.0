import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminApi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getStats();
        setStats(data);
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

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      
      <div className="stats-grid">
        {/* User Statistics */}
        <div className="stat-card users-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Usuarios</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <div className="stat-details">
              <span>Activos: {stats.activeUsers}</span>
              <span>Nuevos (7d): {stats.recentUsers}</span>
            </div>
          </div>
        </div>

        {/* Students */}
        <div className="stat-card students-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>Estudiantes</h3>
            <p className="stat-number">{stats.totalStudents}</p>
          </div>
        </div>

        {/* Instructors */}
        <div className="stat-card instructors-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <h3>Instructores</h3>
            <p className="stat-number">{stats.totalInstructors}</p>
          </div>
        </div>

        {/* Admins */}
        <div className="stat-card admins-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <h3>Administradores</h3>
            <p className="stat-number">{stats.totalAdmins}</p>
          </div>
        </div>

        {/* Progress Statistics */}
        <div className="stat-card progress-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Progreso Total</h3>
            <p className="stat-number">{stats.totalProgress}</p>
            <div className="stat-details">
              <span>Prácticas completadas: {stats.completedPractices}</span>
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <div className="stat-card activity-card large">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Actividad Reciente</h3>
            <div className="activity-summary">
              <div className="activity-item">
                <span className="activity-label">Usuarios activos:</span>
                <span className="activity-value">{stats.activeUsers}</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">Nuevos usuarios (7 días):</span>
                <span className="activity-value">{stats.recentUsers}</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">Tasa de actividad:</span>
                <span className="activity-value">
                  {stats.totalUsers > 0 
                    ? Math.round((stats.activeUsers / stats.totalUsers) * 100) 
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
