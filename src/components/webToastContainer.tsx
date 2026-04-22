import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import Toast, { ToastType } from './Toast';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface WebToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const WebToastContext = createContext<WebToastContextType | undefined>(undefined);

type ToastAction =
  | { type: 'ADD_TOAST'; payload: ToastMessage }
  | { type: 'REMOVE_TOAST'; payload: string };

const toastReducer = (state: ToastMessage[], action: ToastAction): ToastMessage[] => {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.payload];
    case 'REMOVE_TOAST':
      return state.filter(toast => toast.id !== action.payload);
    default:
      return state;
  }
};

export function WebToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const showToast = (type: ToastType, message: string, duration: number = 3000) => {
    const id = generateId();
    dispatch({ type: 'ADD_TOAST', payload: { id, type, message, duration } });
  };

  const showSuccess = (message: string, duration?: number) => {
    showToast('success', message, duration);
  };

  const showError = (message: string, duration?: number) => {
    showToast('error', message, duration);
  };

  const showInfo = (message: string, duration?: number) => {
    showToast('info', message, duration);
  };

  const showWarning = (message: string, duration?: number) => {
    showToast('warning', message, duration);
  };

  useEffect(() => {
    const handleSmartBetNotification = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string; type?: ToastType }>;
      const detail = customEvent.detail;
      if (!detail || !detail.message) return;

      const type = detail.type || 'error';
      showToast(type, detail.message, 3000);
    };

    window.addEventListener('smartbet-notification', handleSmartBetNotification as EventListener);
    return () => {
      window.removeEventListener('smartbet-notification', handleSmartBetNotification as EventListener);
    };
  }, []);

  const handleRemoveToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  const value: WebToastContextType = {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <WebToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast id={toast.id} type={toast.type} message={toast.message} duration={toast.duration} onClose={handleRemoveToast} />
          </div>
        ))}
      </div>
    </WebToastContext.Provider>
  );
}

export const useWebToast = (): WebToastContextType => {
  const context = useContext(WebToastContext);
  if (context === undefined) {
    throw new Error('useWebToast must be used within a WebToastProvider');
  }
  return context;
};
