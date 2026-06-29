import React from 'react';
import { icons } from '../../constants/icons';

const Sorting = ({ columns = [], sortConfig = {}, onSortChange }) => {
  const handleSort = (key, sortable) => {
    if (!sortable || !onSortChange) return;

    if (sortConfig.key !== key) {
      onSortChange({ key, direction: 'asc' });
      return;
    }

    if (sortConfig.direction === 'asc') {
      onSortChange({ key, direction: 'desc' });
      return;
    }

    onSortChange({ key: null, direction: null });
  };

  return (
    <>
      {columns.map((column) => {
        const isActive = sortConfig.key === column.key;
        const isSortable = column.sortable !== false;
        const activeDirection = isActive ? sortConfig.direction : null;

        return (
          <th
            key={column.key}
            className={`whitespace-nowrap px-5 text-[11px] font-bold text-black ${column.className || ''}`}
          >
            {isSortable ? (
              <button
                type="button"
                onClick={() => handleSort(column.key, isSortable)}
                className="inline-flex items-center gap-1 text-left transition hover:text-[#7C3AED]"
              >
                <span>{column.label}</span>
                <span className={`flex flex-col ${isActive ? 'text-[#7C3AED]' : 'text-[#B8BECC]'}`}>
                  <icons.chevronDown className={`h-2.5 w-2.5 rotate-180 ${activeDirection === 'desc' ? 'text-[#7C3AED]' : ''}`} />
                  <icons.chevronDown className={`-mt-1.5 h-2.5 w-2.5 ${activeDirection === 'asc' ? 'text-[#7C3AED]' : ''}`} />
                </span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1">{column.label}</span>
            )}
          </th>
        );
      })}
    </>
  );
};

export default Sorting;
