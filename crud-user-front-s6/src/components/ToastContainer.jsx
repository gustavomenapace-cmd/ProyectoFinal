import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} style={{ color: '#10B981' }} />}
          {toast.type === 'error' && <AlertCircle size={18} style={{ color: '#EF4444' }} />}
          {toast.type === 'info' && <Info size={18} style={{ color: '#6366F1' }} />}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
