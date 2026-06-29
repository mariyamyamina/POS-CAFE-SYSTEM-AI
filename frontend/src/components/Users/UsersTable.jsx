import React, { useMemo, useState } from 'react';
import { icons } from '../../constants/icons';
import Sorting from '../common/Sorting';

const statusStyles = {
  'Active': 'bg-[#D1FAE5] text-[#059669]',
  'Inactive': 'bg-[#FEE2E2] text-[#DC2626]',
  'Pending': 'bg-[#FEF3C7] text-[#D97706]',
};

const SortIcon = () => (
  <span className="flex flex-col text-[#B8BECC]">
    <icons.chevronDown className="h-2.5 w-2.5 rotate-180" />
    <icons.chevronDown className="-mt-1.5 h-2.5 w-2.5" />
  </span>
);

const sortableHeaders = [
  { key: 'firstName', label: 'First Name', sortable: true },
  { key: 'lastName', label: 'Last Name', sortable: true },
  { key: 'username', label: 'Username', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'phone', label: 'Phone No', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created At', sortable: false },
];

const UsersTable = ({ items, onEditUser }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const sortedItems = useMemo(() => {
    const source = [...(items || [])];
    const { key, direction } = sortConfig;

    if (!key) {
      return source;
    }

    source.sort((a, b) => {
      const left = a[key];
      const right = b[key];

      if (typeof left === 'number' && typeof right === 'number') {
        return direction === 'asc' ? left - right : right - left;
      }

      const leftValue = String(left ?? '').toLowerCase();
      const rightValue = String(right ?? '').toLowerCase();
      if (leftValue < rightValue) return direction === 'asc' ? -1 : 1;
      if (leftValue > rightValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return source;
  }, [items, sortConfig]);

  return (
    <div className="overflow-x-auto m-3 border border-gray-100 ">
      <table className="min-w-[1000px] w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[#EAECF3] py-4">
            <Sorting columns={sortableHeaders} sortConfig={sortConfig} onSortChange={setSortConfig} />
            <th className="px-4 py-6" />
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr
              key={item.id}
              className="border-b border-[#EAECF3] last:border-b-0 hover:bg-[#FAFAFA] transition-colors"
            >
              {/* First Name */}
              <td className="px-4 py-[14px] text-xs font-medium text-[#7C3AED]">
                {item.firstName}
              </td>
              {/* Last Name */}
              <td className="px-4 py-[14px] text-xs font-medium text-[#7C3AED]">
                {item.lastName}
              </td>
              {/* Username */}
              <td className="px-4 py-[14px] text-xs font-medium text-[#7C3AED]">
                {item.username}
              </td>
              {/* Email */}
              <td className="px-4 py-[14px] text-xs font-medium text-[#7C3AED]">
                {item.email}
              </td>
              {/* Role */}
              <td className="px-4 py-[14px] text-xs font-medium text-[#7C3AED]">
                {item.role}
              </td>
              {/* Phone */}
              <td className="px-4 py-[14px] text-xs font-medium text-[#7C3AED]">
                {item.phone}
              </td>
              {/* Status */}
              <td className="px-4 py-[14px]">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-[3px] text-xs font-semibold ${statusStyles[item.status] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {item.status}
                </span>
              </td>
              {/* Created At */}
              <td className="px-4 py-[14px]">
                <span className="block text-xs font-medium text-[#7C3AED] leading-tight">
                  {item.createdAtDate}
                </span>
                <span className="block text-xs text-[#7C3AED] leading-tight mt-0.5">
                  {item.createdAtTime}
                </span>
              </td>
              {/* Edit */}
              <td className="px-4 py-[14px]">
                <button
                  onClick={() => onEditUser?.(item)}
                  className="flex h-7 w-7 items-center justify-center rounded text-[#7C3AED] transition hover:bg-[#F3ECFF]"
                  type="button"
                  aria-label={`Edit ${item.firstName}`}
                >
                  <icons.edit className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
