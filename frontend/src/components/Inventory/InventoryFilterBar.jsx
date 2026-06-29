import React from 'react';
import { icons } from '../../constants/icons';

const FieldWrapper = ({ label, children }) => (
  <label className="flex min-w-0 flex-1 flex-col gap-1.5">
    <span className="text-[11px] font-semibold text-[#6D28D9]">{label}</span>
    {children}
  </label>
);

const selectClass = 'h-10 w-full appearance-none rounded-md border border-[#DDE1EC] bg-white px-3 pr-9 text-[12px] font-medium text-[#4B5371] outline-none transition focus:border-[#7C3AED]/50';
const inputClass = 'h-10 w-full rounded-md border border-[#DDE1EC] bg-white px-3 pr-9 text-[12px] font-medium text-[#4B5371] outline-none transition focus:border-[#7C3AED]/50';

const InventoryFilterBar = () => {
  return (
    <section className="rounded-lg border border-[#EAECF3] bg-white p-3 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto_auto] xl:items-end">
        <FieldWrapper label="Category">
          <div className="relative">
            <icons.dashboard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
            <select className={`${selectClass} pl-8`} defaultValue="all">
              <option value="all">All Categories</option>
              <option value="beverage">Beverage</option>
              <option value="timsum">Steamed Timsum</option>
              <option value="porridge">Porridge</option>
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E667D]" />
          </div>
        </FieldWrapper>

        <FieldWrapper label="Item Name">
          <div className="relative">
            <icons.fileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
            <select className={`${selectClass} pl-8`} defaultValue="all">
              <option value="all">All Items</option>
              <option value="coffee">Coffee Black</option>
              <option value="tea">Tea C</option>
              <option value="dimsum">Steamed Dimsum</option>
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E667D]" />
          </div>
        </FieldWrapper>

        <FieldWrapper label="Status">
          <div className="relative">
            <select className={selectClass} defaultValue="all">
              <option value="all">All Status</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E667D]" />
          </div>
        </FieldWrapper>

        <FieldWrapper label="Date From">
          <div className="relative">
            <input className={inputClass} defaultValue="30-05-2026" />
            <icons.calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
          </div>
        </FieldWrapper>

        <FieldWrapper label="Date To">
          <div className="relative">
            <input className={inputClass} defaultValue="30-05-2026" />
            <icons.calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
          </div>
        </FieldWrapper>

        <button className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#7C3AED] px-5 text-[12px] font-bold text-white shadow-sm shadow-[#7C3AED]/20 transition hover:bg-[#6D28D9]" type="button">
          <icons.filter className="h-4 w-4" />
          Filter
        </button>
        <button className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#DDE1EC] bg-white px-5 text-[12px] font-semibold text-[#343B58] transition hover:bg-[#F8F8FB]" type="button">
          <icons.refresh className="h-4 w-4" />
          Reset
        </button>
      </div>
    </section>
  );
};

export default InventoryFilterBar;
