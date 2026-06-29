import React, { useMemo, useState } from 'react';
import { icons } from '../../constants/icons';
import Sorting from '../common/Sorting';
import { useSettings } from '../../context/SettingsContext';

const statusStyles = {
  'In Stock': 'border-[#A8EBC4] bg-[#DFF9EA] text-[#00A650]',
  'Low Stock': 'border-[#FDBA74] bg-[#FFF3E7] text-[#FF5C00]',
  'Out of Stock': 'border-[#FFB3B3] bg-[#FFF0F0] text-[#F01818]',
};

const sortHeaders = [
  { key: 'name', label: 'Item Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'unit', label: 'Unit', sortable: true },
  { key: 'purchased', label: 'Purchased', sortable: true },
  { key: 'sold', label: 'Sold', sortable: true },
  { key: 'inStock', label: 'In Stock', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'lastUpdated', label: 'Last Updated', sortable: true },
];

const InventoryTable = ({ items, onEditItem }) => {
  const { settings } = useSettings();
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
    <div className="overflow-hidden rounded-lg border border-[#EAECF3] bg-white shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
      <div className="overflow-x-auto ">
        <table className="min-w-[1120px] w-full border-collapse text-left">
          <thead>
            <tr className="h-9 bg-[#F9FAFC]">
              <Sorting columns={sortHeaders} sortConfig={sortConfig} onSortChange={setSortConfig} />
              <th className="whitespace-nowrap px-5 text-[11px] font-bold text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => {
              const stockTone = item.inStock === 0 ? 'text-[#FF0000]' : item.inStock <= settings.low_stock_threshold ? 'text-[#FF5C00]' : 'text-[#00A650]';

              return (
                <tr key={item.id} className="h-[49px] border-t border-[#EEF0F5] bg-white text-[12px] font-semibold text-[#10112B]">
                  <td className="px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EDFF] text-[15px]">
                        {item.icon}
                      </div>
                      <span className="text-[#202B6E]">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 text-[#6D28D9]">{item.category}</td>
                  <td className="px-5 text-black">₹{item.price.toFixed(2)}</td>
                  <td className="px-5 text-[#6D28D9]">{item.unit}</td>
                  <td className="px-5 text-black">{item.purchased}</td>
                  <td className="px-5 text-black">{item.sold}</td>
                  <td className={`px-5 ${stockTone}`}>{item.inStock}</td>
                  <td className="px-5 min-w-[130px]">
                    <span className={`inline-flex rounded-md border px-2.5 py-1 text-[11px] font-medium ${statusStyles[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 text-[#6D28D9] min-w-[180px]">{item.lastUpdated}</td>
                  <td className="px-5">
                    <button
                      onClick={() => onEditItem?.(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-[#7C3AED] transition hover:bg-[#F3ECFF] hover:text-[#5B21B6]"
                      type="button"
                      aria-label={`Edit ${item.name}`}
                    >
                      <icons.edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
