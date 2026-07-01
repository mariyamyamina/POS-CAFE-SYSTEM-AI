import React, { useEffect, useState } from 'react';
import { icons } from '../../constants/icons';
import { categoriesApi, inventoryApi } from '../../api';

const FieldWrapper = ({ label, children }) => (
  <label className="flex min-w-0 flex-1 flex-col gap-1.5">
    <span className="text-[11px] font-semibold text-[#6D28D9]">{label}</span>
    {children}
  </label>
);

const selectClass =
  'h-10 w-full appearance-none rounded-md border border-[#DDE1EC] bg-white px-3 pr-9 text-[12px] font-medium text-[#4B5371] outline-none transition focus:border-[#7C3AED]/50';
const inputClass =
  'h-10 w-full rounded-md border border-[#DDE1EC] bg-white px-3 pr-9 text-[12px] font-medium text-[#4B5371] outline-none transition focus:border-[#7C3AED]/50';

const today = () => new Date().toISOString().slice(0, 10);

const InventoryFilterBar = ({ filters, onFilterChange, onReset }) => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);

  // Load real categories from backend
  useEffect(() => {
    categoriesApi.getCategories().then((data) => setCategories(data || [])).catch(() => {});
  }, []);

  // Load inventory items from backend
  useEffect(() => {
    inventoryApi.getItems().then((data) => setItems(data || [])).catch(() => {});
  }, []);

  // Sync local state if parent resets filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const set = (key) => (e) => setLocalFilters({ ...localFilters, [key]: e.target.value });

  return (
    <section className="rounded-lg border border-[#EAECF3] bg-white p-3 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto_auto] xl:items-end">

        {/* Category — populated from backend */}
        <FieldWrapper label="Category">
          <div className="relative">
            <icons.dashboard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
            <select
              className={`${selectClass} pl-8`}
              value={localFilters?.categoryId ?? 'all'}
              onChange={set('categoryId')}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
              ))}
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E667D]" />
          </div>
        </FieldWrapper>

        {/* Search by item name */}
        <FieldWrapper label="Item Name">
          <div className="relative">
            <icons.fileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
            <select
              className={`${selectClass} pl-8`}
              value={localFilters?.itemId ?? 'all'}
              onChange={set('itemId')}
            >
              <option value="all">All Items</option>
              {items.map((item) => (
                <option key={item.id} value={String(item.id)}>{item.name}</option>
              ))}
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E667D]" />
          </div>
        </FieldWrapper>

        {/* Status */}
        <FieldWrapper label="Status">
          <div className="relative">
            <select className={selectClass} value={localFilters?.status ?? 'all'} onChange={set('status')}>
              <option value="all">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E667D]" />
          </div>
        </FieldWrapper>

        {/* Date From */}
        <FieldWrapper label="Date From">
          <div className="relative">
            <input
              className={`${inputClass} [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer`}
              type="date"
              value={localFilters?.dateFrom ?? ''}
              onChange={set('dateFrom')}
              onClick={(e) => e.target.showPicker?.()}
            />
            <icons.calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
          </div>
        </FieldWrapper>

        {/* Date To */}
        <FieldWrapper label="Date To">
          <div className="relative">
            <input
              className={`${inputClass} [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer`}
              type="date"
              value={localFilters?.dateTo ?? ''}
              onChange={set('dateTo')}
              onClick={(e) => e.target.showPicker?.()}
            />
            <icons.calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
          </div>
        </FieldWrapper>

        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#7C3AED] px-5 text-[12px] font-bold text-white shadow-sm shadow-[#7C3AED]/20 transition hover:bg-[#6D28D9]"
          type="button"
          onClick={() => onFilterChange?.(localFilters)}
        >
          <icons.filter className="h-4 w-4" />
          Filter
        </button>

        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#DDE1EC] bg-white px-5 text-[12px] font-semibold text-[#343B58] transition hover:bg-[#F8F8FB]"
          type="button"
          onClick={onReset}
        >
          <icons.refresh className="h-4 w-4" />
          Reset
        </button>
      </div>
    </section>
  );
};

export default InventoryFilterBar;
