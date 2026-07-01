'use client';

import { useEffect, useRef } from 'react';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = '삭제',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    cancelRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-[#2B3A4E]/50" onClick={onCancel} aria-hidden="true" />
      <div className="relative bg-[#F0ECE0] border border-[#D4C49A] p-8 max-w-sm w-full animate-in fade-in duration-200">
        <h2 id="modal-title" className="text-lg font-medium text-[#2B3A4E] mb-3">
          {title}
        </h2>
        <p className="text-sm text-[#3D5060] mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button ref={cancelRef} variant="ghost" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className="!bg-[#9C4038] !border-[#9C4038] hover:!bg-[#7A3028]"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
