import React, { useState } from 'react';
import { icons } from '../../constants/icons';

const PAGE_PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'billing', label: 'Billing' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'itemRequest', label: 'Item Request' },
  { key: 'salesReport', label: 'Sales Report' },
  { key: 'users', label: 'Users' },
  { key: 'settings', label: 'Settings' },
];

const allTrue = () =>
  PAGE_PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: true }), {});
const allFalse = () =>
  PAGE_PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: false }), {});

const INITIAL_ROLES = [
  { id: 1, name: 'admin', permissions: allTrue() },
  {
    id: 2,
    name: 'manager',
    permissions: { dashboard: true, billing: true, inventory: true, itemRequest: true, salesReport: true, users: false, settings: false },
  },
  {
    id: 3,
    name: 'cashier',
    permissions: { dashboard: true, billing: true, inventory: false, itemRequest: false, salesReport: true, users: false, settings: false },
  },
  {
    id: 4,
    name: 'supervisor',
    permissions: { dashboard: true, billing: false, inventory: true, itemRequest: true, salesReport: false, users: false, settings: false },
  },
  {
    id: 5,
    name: 'Accountant',
    permissions: { dashboard: false, billing: false, inventory: false, itemRequest: false, salesReport: true, users: false, settings: false },
  },
];

const Checkbox = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#374151]">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-[#DDE1EC] accent-[#7C3AED]"
    />
    {label}
  </label>
);

const UserSettingsPanel = () => {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [newRoleName, setNewRoleName] = useState('');

  const togglePermission = (roleId, key) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId
          ? { ...role, permissions: { ...role.permissions, [key]: !role.permissions[key] } }
          : role
      )
    );
  };

  const handleAddRole = () => {
    const name = newRoleName.trim();
    if (!name) return;
    setRoles((prev) => [...prev, { id: Date.now(), name, permissions: allFalse() }]);
    setNewRoleName('');
    // Wire this up to your role-create API.
    console.log('Add role:', name);
  };

  const handleSaveRole = (role) => {
    // Wire this up to your role-update API.
    console.log('Save role:', role);
  };

  const handleDeleteRole = (role) => {
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    // Wire this up to your role-delete API.
    console.log('Delete role:', role);
  };

  return (
    <div className="flex flex-col gap-4 border-t border-[#EAECF3] pt-5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder="Role Name"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
          className="h-10 w-full flex-1 rounded-md border border-[#DDE1EC] bg-white px-3 text-[13px] font-medium text-[#374151] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#7C3AED]"
        />
        <button
          type="button"
          onClick={handleAddRole}
          className="flex h-10 items-center justify-center gap-1.5 rounded-md bg-[#7C3AED] px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#6D28D9] sm:w-auto"
        >
          <icons.plus className="h-4 w-4" />
          Add Role
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border border-[#EAECF3]">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="bg-[#F3F4F8]">
              <th className="whitespace-nowrap px-4 py-3 text-[13px] font-semibold text-[#374151]">Role</th>
              <th
                className="px-4 py-3 text-[13px] font-semibold text-[#374151]"
                colSpan={PAGE_PERMISSIONS.length}
              >
                Page Permissions
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-[13px] font-semibold text-[#374151]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-t border-[#EAECF3]">
                <td className="whitespace-nowrap px-4 py-3 text-[13px] font-medium text-[#374151]">
                  {role.name}
                </td>
                {PAGE_PERMISSIONS.map((perm) => (
                  <td key={perm.key} className="whitespace-nowrap px-3 py-3">
                    <Checkbox
                      checked={!!role.permissions[perm.key]}
                      onChange={() => togglePermission(role.id, perm.key)}
                      label={perm.label}
                    />
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSaveRole(role)}
                      className="flex h-8 items-center rounded-md bg-[#7C3AED] px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#6D28D9]"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      aria-label={`Edit ${role.name}`}
                      className="text-[#7C3AED] transition hover:text-[#6D28D9]"
                    >
                      <icons.edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRole(role)}
                      aria-label={`Delete ${role.name}`}
                      className="text-[#EF4444] transition hover:text-[#DC2626]"
                    >
                      <icons.trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserSettingsPanel;