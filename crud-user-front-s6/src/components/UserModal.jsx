import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

export default function UserModal({ isOpen, onClose, onSave, editingUser }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    edad: '',
    genero: 'Otro',
    telefono: '',
    direccion: '',
    localidad: '',
    provincia: '',
    pais: 'Argentina',
    codigoPostal: '',
    role: 'USER',
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingUser) {
      let formattedDate = '';
      if (editingUser.fechaNacimiento) {
        formattedDate = new Date(editingUser.fechaNacimiento).toISOString().split('T')[0];
      }
      setFormData({
        nombre: editingUser.nombre || '',
        apellido: editingUser.apellido || '',
        email: editingUser.email || '',
        password: '', // No forzamos reingreso
        fechaNacimiento: formattedDate,
        edad: editingUser.edad || '',
        genero: editingUser.genero || 'Otro',
        telefono: editingUser.telefono || '',
        direccion: editingUser.direccion || '',
        localidad: editingUser.localidad || '',
        provincia: editingUser.provincia || '',
        pais: editingUser.pais || 'Argentina',
        codigoPostal: editingUser.codigoPostal || '',
        role: editingUser.role || 'USER',
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        fechaNacimiento: '',
        edad: '',
        genero: 'Masculino',
        telefono: '',
        direccion: '',
        localidad: '',
        provincia: '',
        pais: 'Argentina',
        codigoPostal: '',
        role: 'USER',
      });
    }
    setError(null);
  }, [editingUser, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    // Auto calcular edad si cambia la fecha de nacimiento
    if (name === 'fechaNacimiento' && value) {
      const birth = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age >= 0) {
        updated.edad = age;
      }
    }

    setFormData(updated);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas antes de enviar al DTO
    if (!editingUser && !formData.password) {
      setError('La contraseña es obligatoria para nuevos usuarios');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      const dataToSend = { ...formData };
      dataToSend.edad = Number(formData.edad);

      // Si es edición y no escribió password, se omite para no sobrescribir con string vacío
      if (editingUser && !dataToSend.password) {
        delete dataToSend.password;
      }

      // En edición el email no puede modificarse
      if (editingUser) {
        delete dataToSend.email;
      }

      await onSave(dataToSend, editingUser ? editingUser._id || editingUser.id : null);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert-error" style={{ marginBottom: '1rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="modal-grid">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email * {editingUser && '(No modificable)'}</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!!editingUser}
                  required={!editingUser}
                />
              </div>

              <div className="form-group">
                <label>Contraseña {editingUser ? '(Opcional)' : '*'}</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  placeholder={editingUser ? 'Dejar en blanco para mantener' : 'Mínimo 6 caracteres'}
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingUser}
                />
              </div>

              <div className="form-group">
                <label>Fecha Nacimiento *</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Edad *</label>
                <input
                  type="number"
                  name="edad"
                  min="1"
                  max="120"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.edad}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Género *</label>
                <select
                  name="genero"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.genero}
                  onChange={handleChange}
                  required
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro / No especificado</option>
                </select>
              </div>

              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="text"
                  name="telefono"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Dirección *</label>
                <input
                  type="text"
                  name="direccion"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Localidad *</label>
                <input
                  type="text"
                  name="localidad"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.localidad}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Provincia *</label>
                <input
                  type="text"
                  name="provincia"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.provincia}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>País *</label>
                <input
                  type="text"
                  name="pais"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.pais}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Código Postal *</label>
                <input
                  type="text"
                  name="codigoPostal"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Rol del Usuario *</label>
                <select
                  name="role"
                  className="form-control"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="USER">USER (Usuario Estándar)</option>
                  <option value="ADMIN">ADMIN (Administrador)</option>
                  <option value="ROOT">ROOT (Super Administrador)</option>
                  <option value="GUEST">GUEST (Invitado)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={submitting}>
              {editingUser ? <Save size={18} /> : <UserPlus size={18} />}
              <span>{submitting ? 'Guardando...' : editingUser ? 'Guardar Cambios' : 'Crear Usuario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
