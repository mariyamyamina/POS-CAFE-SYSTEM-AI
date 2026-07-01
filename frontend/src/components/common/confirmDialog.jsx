import React, { useEffect } from 'react';

/* ─── Default icon (used if no `icon` prop is passed) ───────────────────
   Swap this for icons.alertTriangle from your constants/icons.js if you
   have one — kept as inline SVG here so this component works standalone. */
const DefaultIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

/* ─── Confirm button color variants ──────────────────────────────────── */
const VARIANT_STYLES = {
  success: 'bg-[#16A34A] hover:bg-[#15803D] text-white',
  danger: 'bg-[#EF4444] hover:bg-[#DC2626] text-white',
  neutral: 'bg-[#374151] hover:bg-[#1F2937] text-white',
  primary: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white',
};

/**
 * Controlled confirmation dialog. Prefer using it via the `useConfirm()`
 * hook (see ConfirmContext.jsx) rather than rendering this directly in
 * every page — the hook manages isOpen/resolve for you.
 */
const ConfirmDialog = ({
  isOpen,
  icon: Icon = DefaultIcon,
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  confirmVariant = 'primary', // 'success' | 'danger' | 'neutral' | 'primary'
  hideCancel = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.();
      if (e.key === 'Enter') onConfirm?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onCancel, onConfirm]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div className="w-full max-w-[420px] rounded-xl bg-white px-8 py-8 text-center shadow-[0_10px_40px_rgba(20,18,56,0.15)]">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1E6]">
          <Icon className="h-7 w-7 text-[#FF973E]" />
        </span>

        <h3 className="text-[18px] font-bold text-[#1B2047]">{title}</h3>
        {message && (
          <p className="mt-2 text-[13px] font-medium text-[#6B7280]">{message}</p>
        )}

        <div className="mt-7 flex justify-center gap-3">
          {!hideCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="h-10 min-w-[100px] rounded-md border border-[#CBD2E1] bg-white px-6 text-[13px] font-semibold text-[#111827] transition hover:bg-[#F8F8FB]"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`flex h-10 min-w-[100px] items-center justify-center gap-2 rounded-md px-6 text-[13px] font-bold transition ${
              VARIANT_STYLES[confirmVariant] || VARIANT_STYLES.primary
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;