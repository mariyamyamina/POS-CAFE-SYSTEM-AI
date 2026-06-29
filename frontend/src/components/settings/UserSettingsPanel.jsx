import React, { useState } from 'react';
import { icons } from '../../constants/icons';

import { rolesApi } from '../../api';

const PAGE_PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'billing', label: 'Billing' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'itemRequest', label: 'Item Request' },
  { key: 'salesReport', label: 'Sales Report' },
  { key: 'users', label: 'Users' },
  { key: 'settings', label: 'Settings' },
];

const allFalse = () =>
  PAGE_PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: false }), {});

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
  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editingRoleName, setEditingRoleName] = useState('');

  React.useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await rolesApi.getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (roleId, key) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId
          ? { ...role, permissions: { ...role.permissions, [key]: !role.permissions[key] } }
          : role
      )
    );
  };

  const handleAddRole = async () => {
    const name = newRoleName.trim();
    if (!name) return;
    try {
      const newRole = await rolesApi.createRole({ name, permissions: allFalse() });
      setRoles((prev) => [...prev, newRole]);
      setNewRoleName('');
    } catch (error) {
      console.error('Failed to add role:', error);
      alert(error.message || 'Failed to add role');
    }
  };

  const handleSaveRole = async (role) => {
    try {
      const nameToSave = editingRoleId === role.id ? editingRoleName : role.name;
      await rolesApi.updateRole(role.id, { name: nameToSave, permissions: role.permissions });
      
      // Update local state to reflect the saved name
      setRoles((prev) =>
        prev.map((r) => (r.id === role.id ? { ...r, name: nameToSave } : r))
      );
      
      if (editingRoleId === role.id) {
        setEditingRoleId(null);
      }
      
      alert('Role saved successfully');
    } catch (error) {
      console.error('Failed to save role:', error);
      alert(error.message || 'Failed to save role');
    }
  };

  const handleDeleteRole = async (role) => {
    if (!window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) return;
    try {
      await rolesApi.deleteRole(role.id);
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
    } catch (error) {
      console.error('Failed to delete role:', error);
      alert(error.message || 'Failed to delete role');
    }
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
            {loading ? (
              <tr>
                <td colSpan={PAGE_PERMISSIONS.length + 2} className="px-4 py-8 text-center text-[13px] text-gray-500">
                  Loading roles...
                </td>
              </tr>
            ) : (
              roles.map((role) => (
              <tr key={role.id} className="border-t border-[#EAECF3]">
                <td className="whitespace-nowrap px-4 py-3 text-[13px] font-medium text-[#374151]">
                  {editingRoleId === role.id ? (
                    <input
                      type="text"
                      value={editingRoleName}
                      onChange={(e) => setEditingRoleName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRole(role);
                        if (e.key === 'Escape') setEditingRoleId(null);
                      }}
                      autoFocus
                      className="h-8 w-[120px] rounded-md border border-[#7C3AED] bg-white px-2 outline-none"
                    />
                  ) : (
                    role.name
                  )}
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
                    {editingRoleId === role.id ? (
                      <button
                        type="button"
                        aria-label="Cancel editing"
                        onClick={() => setEditingRoleId(null)}
                        className="text-[#9CA3AF] transition hover:text-[#374151]"
                      >
                        <icons.close className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Edit ${role.name}`}
                        onClick={() => {
                          setEditingRoleId(role.id);
                          setEditingRoleName(role.name);
                        }}
                        className="text-[#7C3AED] transition hover:text-[#6D28D9]"
                      >
                        <icons.edit className="h-4 w-4" />
                      </button>
                    )}
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
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserSettingsPanel;