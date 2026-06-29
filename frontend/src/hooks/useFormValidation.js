import React, { useState, useCallback } from 'react';

/**
 * Shared form validation hook.
 * @param {Object} rules - { fieldName: (value) => errorString | '' }
 */
export const useFormValidation = (rules) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback(
    (fields) => {
      const newErrors = {};
      for (const [field, ruleFn] of Object.entries(rules)) {
        const error = ruleFn(fields[field] ?? '');
        if (error) newErrors[field] = error;
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [rules],
  );

  const touch = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback(
    (field, value) => {
      if (!rules[field]) return;
      const error = rules[field](value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [rules],
  );

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return { errors, touched, validate, touch, validateField, clearErrors };
};

/** Reusable error message component */
export const FieldError = ({ message }) => {
  if (!message) return null;

  return React.createElement(
    'span',
    { className: 'mt-0.5 flex items-center gap-1 text-[11px] font-medium text-[#EF4444]' },
    React.createElement(
      'svg',
      { className: 'h-3 w-3 shrink-0', viewBox: '0 0 20 20', fill: 'currentColor' },
      React.createElement('path', {
        fillRule: 'evenodd',
        d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z',
        clipRule: 'evenodd',
      }),
    ),
    message,
  );
};

/** Returns border classes based on error/touched state */
export const fieldBorderClass = (error, touched = true) => {
  if (error && touched) {
    return 'border-[#EF4444] bg-[#FEF2F2] focus:border-[#EF4444] focus:ring-1 focus:ring-[#FECACA]';
  }
  return 'border-[#DDE1EC] bg-white focus:border-[#7C3AED]/60 focus:ring-1 focus:ring-[#C4B5FD]/20';
};
