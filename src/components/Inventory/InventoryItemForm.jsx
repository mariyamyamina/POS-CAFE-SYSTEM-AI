import React from 'react';
import { icons } from '../../constants/icons';

const inputClass = 'h-[35px] w-full rounded-md border border-[#DDE1EC] bg-white px-3 text-[11px] font-medium text-[#10112B] outline-none transition placeholder:text-[#7C3AED] focus:border-[#7C3AED]/50';
const selectClass = `${inputClass} appearance-none pr-9 text-[#7C3AED]`;

const Field = ({ label, required, hint, children }) => (
  <label className="flex min-w-0 flex-col gap-2">
    <span className="text-[12px] font-semibold text-[#1B2047]">
      {label}{required && <span className="text-[#EF4444]"> *</span>}
    </span>
    {children}
    {hint && <span className="text-[10px] font-medium text-[#7C3AED]">{hint}</span>}
  </label>
);

const SelectField = ({ defaultValue, children }) => (
  <div className="relative">
    <select className={selectClass} defaultValue={defaultValue}>
      {children}
    </select>
    <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9AA1B4]" />
  </div>
);

const getItemCode = (item) => {
  if (!item) {
    return 'ITM-0001999';
  }

  return `ITM-${String(1999 + item.id).padStart(7, '0')}`;
};

const InventoryItemForm = ({ mode = 'add', item, onCancel, onSave }) => {
  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Item' : 'Add New Item';
  const subtitle = isEdit ? 'Update item details in your inventory' : 'Add a new item to your inventory';
  const itemName = item?.name || '';
  const category = item?.category || '';
  const unit = item?.unit || '';
  const price = item ? item.price.toFixed(2) : '';
  const inStock = item ? String(item.inStock) : '';
  const status = item?.status || 'Out of Stock';

  return (
    <main className="flex-1 overflow-y-auto px-3 pb-5 lg:px-5">
      <div className="mb-4 flex items-center gap-2 text-[12px] font-medium">
        <button onClick={onCancel} className="text-[#6D28D9]" type="button">Inventory</button>
        <span className="text-[#9CA3B8]">&gt;</span>
        <span className="text-[#26305F]">{isEdit ? 'Edit Inventory' : 'Add Inventory'}</span>
      </div>

      <section className="rounded-lg border border-[#EAECF3] bg-white px-7 py-5 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
        <div className="mx-auto max-w-[915px] text-center">
          <h2 className="text-[17px] font-bold text-[#2D2B6C]">{title}</h2>
          <p className="mt-1 text-[12px] font-medium text-[#7C3AED]">{subtitle}</p>
          <div className="mt-4 h-px bg-[#EEF0F5]" />
        </div>

        <form
          className="mt-7 grid grid-cols-1 gap-x-4 gap-y-5 xl:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSave?.();
          }}
        >
          <Field label="Item Code" hint="Auto-generated">
            <input className={inputClass} defaultValue={getItemCode(item)} readOnly />
          </Field>

          <Field label="Item Name" required>
            <input className={inputClass} defaultValue={itemName} placeholder="Enter item name" />
          </Field>

          <Field label="Item Image">
            <button
              className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed border-[#DDE1EC] bg-white text-center transition hover:border-[#7C3AED]/60 hover:bg-[#FBFAFF]"
              type="button"
            >
              <span className="flex h-7 w-9 items-center justify-center rounded-full bg-[#7C3AED] text-white">
                <icons.upload className="h-5 w-5" />
              </span>
              <span className="mt-3 text-[12px] font-medium text-[#1F2548]">Click to upload or drag and drop</span>
              <span className="mt-2 text-[10px] font-medium text-[#7C3AED]">PNG, JPG or WEBP (Max. 2MB)</span>
            </button>
          </Field>

          <Field label="Item Description">
            <textarea
              className="h-32 w-full resize-none rounded-md border border-[#DDE1EC] bg-white px-3 py-3 text-[11px] font-medium text-[#10112B] outline-none transition placeholder:text-[#7C3AED] focus:border-[#7C3AED]/50"
              placeholder="Enter item description"
              defaultValue={isEdit ? `${itemName} inventory item` : ''}
            />
          </Field>

          <Field label="Category" required>
            <SelectField defaultValue={category}>
              <option value="" disabled>Select category</option>
              <option value="Beverage">Beverage</option>
              <option value="Steamed Timsum">Steamed Timsum</option>
              <option value="Porridge">Porridge</option>
              <option value="Noodle/Dumplings">Noodle/Dumplings</option>
              <option value="Bake">Bake</option>
            </SelectField>
          </Field>

          <Field label="Price" required>
            <div className="relative">
              <input className={`${inputClass} pr-14`} defaultValue={price} placeholder="Enter price" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#7C3AED]">
                {price || '0.00'}
              </span>
            </div>
          </Field>

          <Field label="Unit" required>
            <SelectField defaultValue={unit}>
              <option value="" disabled>Select unit</option>
              <option value="Cup">Cup</option>
              <option value="Glass">Glass</option>
              <option value="Pcs">Pcs</option>
              <option value="Bowl">Bowl</option>
            </SelectField>
          </Field>

          <Field label="In Stock" required>
            <div className="relative">
              <input className={`${inputClass} pr-10`} defaultValue={inStock} placeholder="Enter stock quantity" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#7C3AED]">
                {inStock || '0'}
              </span>
            </div>
          </Field>

          <Field label="Status" hint="Status is auto-populated based on In Stock quantity.">
            <SelectField defaultValue={status}>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="In Stock">In Stock</option>
            </SelectField>
          </Field>

          <Field label="Supplier">
            <SelectField defaultValue="">
              <option value="" disabled>Select supplier</option>
              <option value="main">Main Supplier</option>
              <option value="beverage">Beverage Supplier</option>
              <option value="kitchen">Kitchen Supplier</option>
            </SelectField>
          </Field>

          <div className="flex justify-center gap-3 pt-1 xl:col-span-2">
            <button
              onClick={onCancel}
              className="h-9 min-w-[90px] rounded-md border border-[#CBD2E1] bg-white px-6 text-[12px] font-semibold text-[#111827] transition hover:bg-[#F8F8FB]"
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex h-9 min-w-[98px] items-center justify-center gap-2 rounded-md bg-[#6D28D9] px-6 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#5B21B6]"
              type="submit"
            >
              <icons.save className="h-4 w-4" />
              Save
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default InventoryItemForm;
