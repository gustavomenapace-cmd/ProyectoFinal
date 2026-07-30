import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, userToDelete }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !userToDelete) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(userToDelete._id || userToDelete.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--danger-color)' }}>
            <AlertTriangle size={24} />
            <h3>Confirmar Eliminación</h3>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ paddingTop: '0.75rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            ¿Está seguro de que desea eliminar al usuario{' '}
            <strong style={{ color: 'white' }}>{userToDelete.nombre} {userToDelete.apellido}</strong> ({userToDelete.email})?
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.5rem' }}>
            Esta acción registrará la eliminación en el historial de auditoría y no se puede deshacer.
          </p>
        </div>

        <div className="modal-footer" style={{ borderTop: 'none' }}>
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="btn-danger" onClick={handleConfirm} disabled={loading}>
            <Trash2 size={16} />
            <span>{loading ? 'Eliminando...' : 'Sí, Eliminar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
