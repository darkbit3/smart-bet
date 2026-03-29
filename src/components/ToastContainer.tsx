import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import Toast, { ToastProps, ToastType } from './Toast';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

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

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const showToast = (type: ToastType, message: string, duration?: number) => {
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

  const handleRemoveToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
              onClose={handleRemoveToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
