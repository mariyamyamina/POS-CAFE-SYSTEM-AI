import React from 'react';
import { icons } from '../../constants/icons';

const statusStyles = {
  'In Stock': 'border-[#A8EBC4] bg-[#DFF9EA] text-[#00A650]',
  'Low Stock': 'border-[#FDBA74] bg-[#FFF3E7] text-[#FF5C00]',
  'Out of Stock': 'border-[#FFB3B3] bg-[#FFF0F0] text-[#F01818]',
};

const sortHeaders = ['Item Name', 'Category', 'Price', 'Unit', 'Purchased', 'Sold', 'In Stock', 'Status', 'Last Updated'];

const InventoryTable = ({ items, onEditItem }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-[#EAECF3] bg-white shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-[1120px] w-full border-collapse text-left">
          <thead>
            <tr className="h-9 bg-[#F9FAFC]">
              {sortHeaders.map((header) => (
                <th key={header} className="whitespace-nowrap px-5 text-[11px] font-bold text-black">
                  <span className="inline-flex items-center gap-1">
                    {header}
                    <span className="flex flex-col text-[#B8BECC]">
                      <icons.chevronDown className="h-2.5 w-2.5 rotate-180" />
                      <icons.chevronDown className="-mt-1.5 h-2.5 w-2.5" />
                    </span>
                  </span>
                </th>
              ))}
              <th className="whitespace-nowrap px-5 text-[11px] font-bold text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const stockTone = item.inStock === 0 ? 'text-[#FF0000]' : item.inStock <= 10 ? 'text-[#FF5C00]' : 'text-[#00A650]';

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
                  <td className="px-5 text-black">${item.price.toFixed(2)}</td>
                  <td className="px-5 text-[#6D28D9]">{item.unit}</td>
                  <td className="px-5 text-black">{item.purchased}</td>
                  <td className="px-5 text-black">{item.sold}</td>
                  <td className={`px-5 ${stockTone}`}>{item.inStock}</td>
                  <td className="px-5">
                    <span className={`inline-flex rounded-md border px-2.5 py-1 text-[11px] font-medium ${statusStyles[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 text-[#6D28D9]">{item.lastUpdated}</td>
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
