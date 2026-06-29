import React, { useEffect, useState } from 'react';
import { icons } from '../../constants/icons';
import { rolesApi } from '../../api';

const FieldWrapper = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[11px] font-semibold text-[#6D28D9]">{label || '\u00A0'}</span>
    {children}
  </div>
);

const selectClass = 'h-10 w-full appearance-none rounded-md border border-[#DDE1EC] bg-white px-3 pr-9 text-[12px] font-medium text-[#4B5371] outline-none transition focus:border-[#7C3AED]/50';
const inputClass  = 'h-10 w-full rounded-md border border-[#DDE1EC] bg-white px-3 text-[12px] font-medium text-[#4B5371] outline-none transition focus:border-[#7C3AED]/50';

const defaultFilters = { search: '', role: 'all', status: 'all' };

const UsersFilterBar = ({ onFilter }) => {
  const [filters, setFilters] = useState(defaultFilters);
  const [roleOptions, setRoleOptions] = useState([]);

  // Load roles from backend for dynamic dropdown
  useEffect(() => {
    rolesApi.getRoles()
      .then((data) => setRoleOptions(data.map((r) => r.name)))
      .catch(console.error);
  }, []);

  const handleChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFilter = () => {
    onFilter?.(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onFilter?.(defaultFilters);
  };

  // Allow pressing Enter in search to trigger filter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleFilter();
  };

  return (
    <section className="rounded-lg border border-[#EAECF3] bg-white p-3 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto_auto] xl:items-end">

        {/* Search */}
        <FieldWrapper label="Search">
          <div className="relative">
            <icons.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
            <input
              className={`${inputClass} pl-8`}
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={handleChange('search')}
              onKeyDown={handleKeyDown}
            />
          </div>
        </FieldWrapper>

        {/* Role */}
        <FieldWrapper label="Role">
          <div className="relative">
            <select
              className={selectClass}
              value={filters.role}
              onChange={handleChange('role')}
            >
              <option value="all">All Roles</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E667D]" />
          </div>
        </FieldWrapper>

        {/* Status */}
        <FieldWrapper label="Status">
          <div className="relative">
            <select
              className={selectClass}
              value={filters.status}
              onChange={handleChange('status')}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E667D]" />
          </div>
        </FieldWrapper>

        {/* Filter button */}
        <FieldWrapper label="">
          <button
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#7C3AED] px-5 text-[12px] font-bold text-white shadow-sm shadow-[#7C3AED]/20 transition hover:bg-[#6D28D9]"
            type="button"
            onClick={handleFilter}
          >
            <icons.filter className="h-4 w-4" />
            Filter
          </button>
        </FieldWrapper>

        {/* Reset button */}
        <FieldWrapper label="">
          <button
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#DDE1EC] bg-white px-5 text-[12px] font-semibold text-[#343B58] transition hover:bg-[#F8F8FB]"
            type="button"
            onClick={handleReset}
          >
            <icons.refresh className="h-4 w-4" />
            Reset
          </button>
        </FieldWrapper>

      </div>
    </section>
  );
};

export default UsersFilterBar;
