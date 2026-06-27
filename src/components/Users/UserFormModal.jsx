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

const inputCls =
  'h-10 w-full rounded-md border border-[#DDE1EC] bg-white px-3 text-[13px] font-medium text-[#7C3AED] outline-none transition-colors placeholder:text-[#A78BFA] focus:border-[#7C3AED]';

const UserFormModal = ({ isOpen, mode = 'add', user = null, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState(emptyForm);

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
  }, [isOpen, mode, user]);

  if (!isOpen) return null;

  const isEdit = mode === 'edit';

  const updateField = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave && onSave({ ...form, id: isEdit ? user?.id : undefined });
  };

  const handleDelete = () => {
    onDelete && onDelete(user);
  };

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
            <input
              type="text"
              placeholder="First Name"
              value={form.firstName}
              onChange={updateField('firstName')}
              className={inputCls}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={updateField('lastName')}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={updateField('username')}
              className={inputCls}
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={updateField('password')}
              className={inputCls}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={updateField('email')}
            className={inputCls}
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.role}
              onChange={updateField('role')}
              className={`${inputCls} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%237C3AED%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9`}
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={updateField('phone')}
              className={inputCls}
            />
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