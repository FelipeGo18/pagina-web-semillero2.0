import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { adminService } from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';
import './UsersManagement.css';

const UsersManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== 'all' && { role: roleFilter })
      };
      const data = await adminService.getUsers(params);
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };


  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUser(editingUser._id, {
        role: editingUser.role,
        isActive: editingUser.isActive
      });
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      alert(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (userId === currentUser._id) {
      Swal.fire('No permitido', 'No puedes eliminarte a ti mismo', 'error');
      return;
    }
    const result = await Swal.fire({
      title: '¿Estás seguro de eliminar?',
      text: `¿Quieres eliminar al usuario "${username}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    try {
      await adminService.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      Swal.fire('Error', err.response?.data?.message || 'Error al eliminar usuario', 'error');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-admin';
      case 'instructor':
        return 'badge-instructor';
      default:
        return 'badge-student';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'instructor':
        return 'Instructor';
      default:
        return 'Estudiante';
    }
  };

  return (
    <div className="users-management">
      <h1>Gestión de Usuarios</h1>

      {/* Filters */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="Buscar por nombre, email o usuario..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        
        <select value={roleFilter} onChange={handleRoleFilterChange} className="role-filter">
          <option value="all">Todos los roles</option>
          <option value="student">Estudiantes</option>
          <option value="instructor">Instructores</option>
          <option value="admin">Administradores</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="loading">Cargando usuarios...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="btn-edit"
                          title="Editar usuario"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#333333" d="M3 21V3h10.925l-2 2H5v14h14v-6.95l2-2V21zm6-6v-4.25L19.625.125L23.8 4.4L13.25 15zM21.025 4.4l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id, user.username)}
                          className="btn-delete"
                          title="Eliminar usuario"
                          disabled={user._id === currentUser._id}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#333333" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="pagination-btn"
            >
              ← Anterior
            </button>
            <span className="pagination-info">
              Página {page} de {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="pagination-btn"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Usuario</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Usuario:</label>
                <input type="text" value={editingUser.username} disabled />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input type="email" value={editingUser.email} disabled />
              </div>

              <div className="form-group">
                <label>Rol:</label>
                <select 
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  required
                >
                  <option value="student">Estudiante</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={editingUser.isActive}
                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                  />
                  Usuario Activo
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
