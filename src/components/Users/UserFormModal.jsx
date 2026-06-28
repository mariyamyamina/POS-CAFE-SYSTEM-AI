import React, { useEffect, useState } from 'react';

const ROLE_OPTIONS = ['Cashier', 'Manager', 'Supervisor', 'Accountant'];

const emptyForm = {
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  email: '',
  role: 'Cashier',
  phone: '',
  isActive: true,
};

const emptyErrors = {
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  email: '',
  phone: '',
};

const inputCls = (hasError) =>
  `h-10 w-full rounded-md border bg-white px-3 text-[13px] font-medium outline-none transition-colors placeholder:text-[#A78BFA] ${
    hasError
      ? 'border-[#EF4444] text-[#7C3AED] focus:border-[#EF4444]'
      : 'border-[#DDE1EC] text-[#7C3AED] focus:border-[#7C3AED]'
  }`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Allows digits, with optional leading +, spaces, hyphens — at least 7 digits total
const PHONE_RE = /^\+?[0-9\s-]{7,15}$/;

const UserFormModal = ({ isOpen, mode = 'add', user = null, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);
  const [touched, setTouched] = useState({});

  // Populate the form whenever the modal opens — empty for "add",
  // pre-filled with the selected user's data for "edit".
  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        password: '',
        email: user.email || '',
        role: user.role || 'Cashier',
        phone: user.phone || '',
        isActive: user.status === 'Active',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors(emptyErrors);
    setTouched({});
  }, [isOpen, mode, user]);

  if (!isOpen) return null;

  const isEdit = mode === 'edit';

  // Returns an error string for a field, or '' if valid.
  const validateField = (field, value, currentForm = form) => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        return '';

      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        return '';

      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.trim().length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_.]+$/.test(value.trim())) {
          return 'Only letters, numbers, "_" and "." are allowed';
        }
        return '';

      case 'password':
        // Required for new users. For edits, blank means "keep existing password".
        if (!isEdit && !value) return 'Password is required';
        if (value && value.length < 6) return 'Password must be at least 6 characters';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address';
        return '';

      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!PHONE_RE.test(value.trim())) return 'Enter a valid phone number';
        return '';

      default:
        return '';
    }
  };

  const validateAll = (currentForm) => {
    const nextErrors = {};
    Object.keys(emptyErrors).forEach((field) => {
      nextErrors[field] = validateField(field, currentForm[field], currentForm);
    });
    return nextErrors;
  };

  const updateField = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);

    // Live-validate only fields the user has already interacted with,
    // so errors don't appear before they've had a chance to type.
    if (touched[field] && field !== 'isActive' && field !== 'role') {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value, nextForm) }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, form[field], form) }));
  };

  const handleSave = () => {
    const nextErrors = validateAll(form);
    setErrors(nextErrors);
    setTouched({
      firstName: true,
      lastName: true,
      username: true,
      password: true,
      email: true,
      phone: true,
    });

    const hasErrors = Object.values(nextErrors).some((msg) => msg);
    if (hasErrors) return;

    onSave && onSave({ ...form, id: isEdit ? user?.id : undefined });
  };

  const handleDelete = () => {
    onDelete && onDelete(user);
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[513px] overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-[#EAECF3] bg-[#F9FAFB] px-6 py-5">
          <h2 className="text-[18px] font-bold text-[#111827]">
            {isEdit ? 'Edit User' : 'Add New User'}
          </h2>
          <p className="mt-0.5 text-[13px] font-medium text-[#7C3AED]">
            Fill in the user details below
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={updateField('firstName')}
                onBlur={handleBlur('firstName')}
                className={inputCls(showError('firstName'))}
              />
              {showError('firstName') && (
                <p className="mt-1 text-[11px] font-medium text-[#EF4444]">{errors.firstName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={updateField('lastName')}
                onBlur={handleBlur('lastName')}
                className={inputCls(showError('lastName'))}
              />
              {showError('lastName') && (
                <p className="mt-1 text-[11px] font-medium text-[#EF4444]">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={updateField('username')}
                onBlur={handleBlur('username')}
                className={inputCls(showError('username'))}
              />
              {showError('username') && (
                <p className="mt-1 text-[11px] font-medium text-[#EF4444]">{errors.username}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder={isEdit ? 'Password (leave blank to keep current)' : 'Password'}
                value={form.password}
                onChange={updateField('password')}
                onBlur={handleBlur('password')}
                className={inputCls(showError('password'))}
              />
              {showError('password') && (
                <p className="mt-1 text-[11px] font-medium text-[#EF4444]">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={updateField('email')}
              onBlur={handleBlur('email')}
              className={inputCls(showError('email'))}
            />
            {showError('email') && (
              <p className="mt-1 text-[11px] font-medium text-[#EF4444]">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.role}
              onChange={updateField('role')}
              className={`${inputCls(false)} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%237C3AED%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9`}
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <div>
              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={updateField('phone')}
                onBlur={handleBlur('phone')}
                className={inputCls(showError('phone'))}
              />
              {showError('phone') && (
                <p className="mt-1 text-[11px] font-medium text-[#EF4444]">{errors.phone}</p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 pt-1 text-[13px] font-medium text-[#374151]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={updateField('isActive')}
              className="h-4 w-4 rounded border-[#DDE1EC] accent-[#2563EB]"
            />
            Active User
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-[#EAECF3] bg-[#F9FAFB] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center rounded-md border border-[#DDE1EC] bg-white px-5 text-[13px] font-semibold text-[#374151] transition hover:bg-[#F8F8FB]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex h-10 items-center rounded-md bg-[#7C3AED] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#6D28D9]"
          >
            Save User
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex h-10 items-center rounded-md bg-[#EF4444] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#DC2626]"
            >
              Delete User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;