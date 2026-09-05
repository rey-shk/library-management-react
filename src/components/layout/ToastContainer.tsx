import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import type { ToastMessage } from '../../types';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useLibrary();

  if (toasts.length === 0) return null;

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} style={{ color: '#10b981' }} />;
      case 'error':
        return <AlertCircle size={18} style={{ color: '#f43f5e' }} />;
      case 'warning':
        return <AlertTriangle size={18} style={{ color: '#f59e0b' }} />;
      case 'info':
      default:
        return <Info size={18} style={{ color: '#38bdf8' }} />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon(toast.type)}</div>
          <div style={{ flex: 1 }}>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-desc">{toast.message}</div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
