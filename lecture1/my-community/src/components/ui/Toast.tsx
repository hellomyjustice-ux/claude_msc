'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const typeClasses = {
  success: 'bg-[#3D8A50] text-[#F0ECE0]',
  error: 'bg-[#9C4038] text-[#F0ECE0]',
  info: 'bg-[#2B3A4E] text-[#F0ECE0]',
};

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 text-sm shadow-lg animate-in slide-in-from-bottom-2 duration-200 ${typeClasses[type]}`}
    >
      <span>{message}</span>
      <button onClick={onClose} aria-label="알림 닫기" className="opacity-70 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
}
