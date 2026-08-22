import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { registerToastListener, type ToastItem } from '../utils/toast';

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    registerToastListener((message, type = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      setToasts(prev => [...prev.slice(-3), { id, message, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    });
    return () => {
      registerToastListener(null);
    };
  }, []);

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{t.message}</span>
          <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} aria-label="Dismiss notification">
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
