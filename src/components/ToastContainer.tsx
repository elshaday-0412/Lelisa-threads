import React from 'react';
import { useApp } from '../context/AppContext.js';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map(t => {
        let icon = <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />;
        if (t.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
        } else if (t.type === 'info') {
          icon = <Info className="w-4 h-4 text-blue-500 shrink-0" />;
        }

        return (
          <div
            key={t.id}
            className="pointer-events-auto bg-white border border-[#E5E1DA] shadow-xl rounded-sm p-4 flex items-start gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200"
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">{t.title}</h4>
              {t.message && <p className="text-xs text-gray-600 font-light mt-0.5 leading-relaxed">{t.message}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-black transition-colors shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
