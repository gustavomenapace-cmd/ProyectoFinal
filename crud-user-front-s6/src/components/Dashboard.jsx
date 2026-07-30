import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserCheck,
  Shield,
  Search,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  RefreshCw,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getUsersApi, createUserApi, updateUserApi, deleteUserApi } from '../api/users';
import UserModal from './UserModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function Dashboard({ authData, onLogout, addToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const role = authData?.role?.toUpperCase() || 'USER';
  const canManage = role === 'ROOT' || role === 'ADMIN';

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsersApi(authData.token);
      if (res && res.success) {
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else if (res.data) {
          // Si el backend retornó un solo usuario (caso perfil propio de un USER)
          setUsers([res.data]);
        } else {
          setUsers([]);
        }
      } else {
        setError(res.message || 'Error al obtener usuarios');
      }
    } catch (err) {
      if (err.status === 401) {
        addToast('Sesión caducada. Por favor inicie sesión nuevamente.', 'error');
        onLogout();
      } else {
        setError(err.message || 'Error de conexión con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  }, [authData.token, onLogout, addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Manejadores CRUD
  const handleCreateOrUpdate = async (userData, userId) => {
    if (userId) {
      // Editar
      const res = await updateUserApi(authData.token, userId, userData);
      if (res && res.success) {
        addToast('Usuario actualizado correctamente', 'success');
        fetchUsers();
      }
    } else {
      // Crear
      const res = await createUserApi(authData.token, userData);
      if (res && res.success) {
        addToast('Usuario creado correctamente', 'success');
        fetchUsers();
      }
    }
  };

  const handleDelete = async (userId) => {
    const res = await deleteUserApi(authData.token, userId);
    if (res && res.success) {
      addToast('Usuario eliminado correctamente', 'success');
      fetchUsers();
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Filtrado local
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      `${u.nombre} ${u.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.localidad && u.localidad.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeClass = (r) => {
    switch (r?.toUpperCase()) {
      case 'ROOT':
        return 'badge-root';
      case 'ADMIN':
        return 'badge-admin';
      case 'USER':
        return 'badge-user';
      default:
        return 'badge-guest';
    }
  };

  const formatDate = (d) => {
    if (!d) return 'Nunca';
    try {
      return new Date(d).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(d);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* BARRA SUPERIOR DE NAVEGACIÓN */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="nav-brand-icon">
            <Users size={20} />
          </div>
          <span>CRUD Users Portal</span>
        </div>

        <div className="nav-user-profile">
          <button
            className="btn-action"
            onClick={fetchUsers}
            title="Recargar datos"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>

          <div className="user-info-badge">
            <div className="avatar">
              {authData.email ? authData.email[0].toUpperCase() : 'U'}
            </div>
            <div className="user-name-role">
              <span className="user-name">{authData.email}</span>
              <span className={`badge-role ${getRoleBadgeClass(role)}`}>
                {role}
              </span>
            </div>
          </div>

          <button className="btn-logout" onClick={onLogout} title="Cerrar sesión">
            <LogOut size={16} />
            <span>Salir</span>
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-content">
        {/* TARJETAS DE MÉTRICAS */}
        <div className="summary-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h4>Total Registrados</h4>
              <div className="stat-value">{users.length}</div>
            </div>
            <div className="stat-icon-wrapper">
              <Users size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h4>Administradores</h4>
              <div className="stat-value">
                {users.filter((u) => u.role === 'ADMIN' || u.role === 'ROOT').length}
              </div>
            </div>
            <div className="stat-icon-wrapper">
              <Shield size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h4>Estado de Sesión</h4>
              <div className="stat-value" style={{ fontSize: '1.1rem', color: '#34D399' }}>
                <CheckCircle size={18} style={{ display: 'inline', marginRight: '6px' }} />
                Activa
              </div>
            </div>
            <div className="stat-icon-wrapper">
              <Clock size={24} />
            </div>
          </div>
        </div>

        {/* BARRA DE HERRAMIENTAS / BÚSQUEDA / FILTRO */}
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, email o localidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="toolbar-right">
            <select
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">Todos los Roles</option>
              <option value="ROOT">ROOT</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
              <option value="GUEST">GUEST</option>
            </select>

            {canManage && (
              <button className="btn-add" onClick={openCreateModal}>
                <Plus size={18} />
                <span>Nuevo Usuario</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* TABLA DE USUARIOS */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Ubicación</th>
                <th>Contacto</th>
                <th>Edad / Género</th>
                <th>Último Login</th>
                {canManage && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={canManage ? 7 : 6} className="empty-state">
                    <RefreshCw size={28} className="spin" />
                    <p style={{ marginTop: '0.5rem' }}>Cargando usuarios desde el backend...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 7 : 6} className="empty-state">
                    <Users size={32} />
                    <p style={{ marginTop: '0.5rem' }}>No se encontraron usuarios que coincidan con la búsqueda.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id || u.id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar">
                          {u.nombre ? u.nombre[0].toUpperCase() : 'U'}
                        </div>
                        <div className="user-cell-info">
                          <span className="user-full-name">
                            {u.nombre} {u.apellido}
                          </span>
                          <span className="user-email-sub">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-role ${getRoleBadgeClass(u.role)}`}>
                        {u.role || 'USER'}
                      </span>
                    </td>
                    <td>
                      <div className="location-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>{u.localidad || '-'}, {u.provincia || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="location-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>{u.telefono || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <span>{u.edad || '-'} años ({u.genero || 'Otro'})</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                        {formatDate(u.ultimoLogin)}
                      </span>
                    </td>
                    {canManage && (
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action edit"
                            onClick={() => openEditModal(u)}
                            title="Editar usuario"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => openDeleteModal(u)}
                            title="Eliminar usuario"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL CREAR / EDITAR */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateOrUpdate}
        editingUser={editingUser}
      />

      {/* MODAL BORRAR */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        userToDelete={userToDelete}
      />
    </div>
  );
}
