import React, { useEffect } from 'react';
import { icons } from '../../constants/icons';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md bg-text-900 px-4 py-2.5 text-[12px] font-semibold text-white shadow-lg">
      <icons.info className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
};

export default Toast;