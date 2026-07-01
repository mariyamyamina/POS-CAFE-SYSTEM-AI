import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import ConfirmDialog from '../components/common/ConfirmDialog';

const ConfirmContext = createContext(null);

/**
 * Wrap your app root with this once (e.g. in App.jsx or main.jsx):
 *
 *   <ConfirmProvider>
 *     <App />
 *   </ConfirmProvider>
 *
 * Then anywhere in the tree:
 *
 *   const confirm = useConfirm();
 *
 *   const handleDelete = async () => {
 *     const ok = await confirm({
 *       title: 'Delete Item?',
 *       message: 'This action cannot be undone.',
 *       confirmLabel: 'Delete',
 *       confirmVariant: 'danger',
 *     });
 *     if (ok) { ... }
 *   };
 */
export const ConfirmProvider = ({ children }) => {
  const [dialogOptions, setDialogOptions] = useState(null);
  const resolverRef = useRef(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialogOptions(options);
    });
  }, []);

  const handleConfirm = () => {
    resolverRef.current?.(true);
    resolverRef.current = null;
    setDialogOptions(null);
  };

  const handleCancel = () => {
    resolverRef.current?.(false);
    resolverRef.current = null;
    setDialogOptions(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        isOpen={Boolean(dialogOptions)}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        {...dialogOptions}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within a <ConfirmProvider>');
  }
  return ctx;
};