import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>🔧 Panel Admin</h2>
        </div>
        
        <nav className="admin-nav">
          <Link 
            to="/admin/dashboard" 
            className={`admin-nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
          
          <Link 
            to="/admin/users" 
            className={`admin-nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}
          >
            <span className="nav-icon">👥</span>
            Usuarios
          </Link>
          
          <Link 
            to="/" 
            className="admin-nav-link back-link"
          >
            <span className="nav-icon">🏠</span>
            Volver al sitio
          </Link>
        </nav>
      </aside>
      
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
