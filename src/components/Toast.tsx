import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let addToast: ((msg: string, type?: Toast['type']) => void) | null = null;

export function toast(message: string, type: Toast['type'] = 'success') {
  addToast?.(message, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    addToast = (message, type = 'success') => {
      const id = `${Date.now()}`;
      setToasts(prev => [...prev.slice(-3), { id, message, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };
    return () => { addToast = null; };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{t.message}</span>
          <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
