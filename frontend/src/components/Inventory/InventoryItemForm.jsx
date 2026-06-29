import React, { useState, useRef } from 'react';
import { icons } from '../../constants/icons';
import { FieldError, fieldBorderClass } from '../../hooks/useFormValidation';

/* ─── Validation rules (run live during render) ─────────────────────── */
const validate = {
  itemName: (v) => v.trim()                    ? '' : 'Item name is required.',
  category: (v) => v                           ? '' : 'Please select a category.',
  price:    (v) => parseFloat(v) > 0           ? '' : 'Price must be greater than 0.',
  unit:     (v) => v                           ? '' : 'Please select a unit.',
  inStock:  (v) => v !== '' && Number(v) >= 0  ? '' : 'Stock quantity is required.',
};

/* ─── Base classes ──────────────────────────────────────────────────── */
const BASE_INPUT  = 'h-[35px] w-full rounded-md border bg-white px-3 text-[11px] font-medium text-[#10112B] outline-none transition placeholder:text-[#9AA1B4]';
const BASE_SELECT = `${BASE_INPUT} appearance-none pr-9 text-[#7C3AED]`;

const getItemCode = (item) =>
  item ? `ITM-${String(1999 + item.id).padStart(7, '0')}` : 'ITM-0001999';

/* ─── Styling helpers ───────────────────────────────────────────────── */
const inputCls = (hasErr) => `${BASE_INPUT} ${fieldBorderClass(hasErr)}`;

const selectCls = (hasErr) => `${BASE_SELECT} ${fieldBorderClass(hasErr)}`;

/* ─── Error message ─────────────────────────────────────────────────── */
const Err = ({ msg }) => <FieldError message={msg} />;

/* ─── Field wrapper ─────────────────────────────────────────────────── */
const Field = ({ label, required, hint, errMsg, children }) => (
  <div className="flex min-w-0 flex-col gap-1">
    <span className="mb-0.5 text-[12px] font-semibold text-[#1B2047]">
      {label}{required && <span className="text-red-500"> *</span>}
    </span>
    {children}
    {hint && !errMsg && <span className="text-[10px] font-medium text-[#7C3AED]">{hint}</span>}
    <FieldError message={errMsg} />
  </div>
);

/* ─── Select with chevron ───────────────────────────────────────────── */
const SelectInput = ({ value, onChange, onBlur, hasErr, children }) => (
  <div className="relative">
    <select className={selectCls(hasErr)} value={value} onChange={onChange} onBlur={onBlur}>
      {children}
    </select>
    <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9AA1B4]" />
  </div>
);

/* ─── Main form ─────────────────────────────────────────────────────── */
const InventoryItemForm = ({ mode = 'add', item, onCancel, onSave }) => {
  const isEdit = mode === 'edit';

  const [fields, setFields] = useState({
    itemName:    item?.name                           || '',
    category:    item?.category                       || '',
    price:       item ? String(item.price.toFixed(2)) : '',
    unit:        item?.unit                           || '',
    inStock:     item ? String(item.inStock)          : '',
    status:      item?.status                         || 'Out of Stock',
    supplier:    '',
    description: isEdit ? `${item?.name || ''} inventory item` : '',
  });

  // touched: tracks which fields user has blurred
  const [touched,   setTouched]   = useState({});
  // submitted: true after first Save click — shows ALL errors regardless of touched
  const [submitted, setSubmitted] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileRef = useRef(null);

  /* Live error for a field — shown if submitted OR if user has touched that field */
  const e = (field) => {
    if (!submitted && !touched[field]) return '';
    return validate[field] ? validate[field](fields[field]) : '';
  };

  const set = (field) => (ev) => setFields((p) => ({ ...p, [field]: ev.target.value }));
  const touch = (field) => () => setTouched((p) => ({ ...p, [field]: true }));

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setSubmitted(true); // ← this triggers re-render; e() will now show ALL errors
    // Check if there are any actual errors from current field values
    const hasErrors = Object.keys(validate).some((f) => validate[f](fields[f]));
    if (!hasErrors) onSave?.();
  };

  // Banner: show after submitted AND there are still errors
  const anyError = submitted && Object.keys(validate).some((f) => validate[f](fields[f]));

  return (
    <main className="flex-1 overflow-y-auto px-3 pb-5 lg:px-5">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-[12px] font-medium">
        <button onClick={onCancel} className="text-[#6D28D9]" type="button">Inventory</button>
        <span className="text-[#9CA3B8]">&gt;</span>
        <span className="text-[#26305F]">{isEdit ? 'Edit Inventory' : 'Add Inventory'}</span>
      </div>

      <section className="rounded-lg border border-[#EAECF3] bg-white px-7 py-5 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
        <div className="mx-auto max-w-[915px] text-center">
          <h2 className="text-[17px] font-bold text-[#2D2B6C]">{isEdit ? 'Edit Item' : 'Add New Item'}</h2>
          <p className="mt-1 text-[12px] font-medium text-[#7C3AED]">
            {isEdit ? 'Update item details in your inventory' : 'Add a new item to your inventory'}
          </p>
          <div className="mt-4 h-px bg-[#EEF0F5]" />
        </div>

        {/* Error banner — only shown after first submit with errors */}
        {anyError && (
          <div className="mx-auto mt-5 flex max-w-[915px] items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Please fill in all required fields marked in red.
          </div>
        )}

        <form className="mt-7 grid grid-cols-1 gap-x-4 gap-y-5 xl:grid-cols-2" onSubmit={handleSubmit}>

          {/* Item Code — read-only */}
          <Field label="Item Code" hint="Auto-generated">
            <input className={`${BASE_INPUT} border-[#DDE1EC] bg-[#F9FAFC] text-[#7C3AED]`} defaultValue={getItemCode(item)} readOnly />
          </Field>

          {/* Item Name */}
          <Field label="Item Name" required errMsg={e('itemName')}>
            <input
              className={inputCls(Boolean(e('itemName')))}
              value={fields.itemName}
              onChange={set('itemName')}
              onBlur={touch('itemName')}
              placeholder="Enter item name"
            />
          </Field>

          {/* Item Image */}
          <Field label="Item Image">
            <button
              className={`flex h-32 flex-col items-center justify-center rounded-md border border-dashed bg-white text-center transition
                ${imageFile ? 'border-[#7C3AED] bg-[#FBFAFF]' : 'border-[#DDE1EC] hover:border-[#7C3AED]/60 hover:bg-[#FBFAFF]'}`}
              type="button"
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(ev) => setImageFile(ev.target.files[0])} />
              <span className="flex h-7 w-9 items-center justify-center rounded-full bg-[#7C3AED] text-white">
                <icons.upload className="h-5 w-5" />
              </span>
              <span className="mt-3 text-[12px] font-medium text-[#1F2548]">
                {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
              </span>
              <span className="mt-2 text-[10px] font-medium text-[#7C3AED]">PNG, JPG or WEBP (Max. 2MB)</span>
            </button>
          </Field>

          {/* Description */}
          <Field label="Item Description">
            <textarea
              className="h-32 w-full resize-none rounded-md border border-[#DDE1EC] bg-white px-3 py-3 text-[11px] font-medium text-[#10112B] outline-none transition placeholder:text-[#9AA1B4] focus:border-[#7C3AED]/50"
              placeholder="Enter item description"
              value={fields.description}
              onChange={set('description')}
            />
          </Field>

          {/* Category */}
          <Field label="Category" required errMsg={e('category')}>
            <SelectInput value={fields.category} onChange={set('category')} onBlur={touch('category')} hasErr={Boolean(e('category'))}>
              <option value="" disabled>Select category</option>
              <option value="Beverage">Beverage</option>
              <option value="Steamed Timsum">Steamed Timsum</option>
              <option value="Porridge">Porridge</option>
              <option value="Noodle/Dumplings">Noodle/Dumplings</option>
              <option value="Bake">Bake</option>
            </SelectInput>
          </Field>

          {/* Price */}
          <Field label="Price" required errMsg={e('price')}>
            <div className="relative">
              <input
                className={`${inputCls(Boolean(e('price')))} pr-14`}
                value={fields.price}
                onChange={set('price')}
                onBlur={touch('price')}
                placeholder="0.00"
                type="number"
                min="0"
                step="0.01"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#7C3AED]">
                {fields.price || '0.00'}
              </span>
            </div>
          </Field>

          {/* Unit */}
          <Field label="Unit" required errMsg={e('unit')}>
            <SelectInput value={fields.unit} onChange={set('unit')} onBlur={touch('unit')} hasErr={Boolean(e('unit'))}>
              <option value="" disabled>Select unit</option>
              <option value="Cup">Cup</option>
              <option value="Glass">Glass</option>
              <option value="Pcs">Pcs</option>
              <option value="Bowl">Bowl</option>
            </SelectInput>
          </Field>

          {/* In Stock */}
          <Field label="In Stock" required errMsg={e('inStock')}>
            <div className="relative">
              <input
                className={`${inputCls(Boolean(e('inStock')))} pr-10`}
                value={fields.inStock}
                onChange={set('inStock')}
                onBlur={touch('inStock')}
                placeholder="0"
                type="number"
                min="0"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#7C3AED]">
                {fields.inStock || '0'}
              </span>
            </div>
          </Field>

          {/* Status */}
          <Field label="Status" hint="Status is auto-populated based on In Stock quantity.">
            <SelectInput value={fields.status} onChange={set('status')} onBlur={() => {}}>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="In Stock">In Stock</option>
            </SelectInput>
          </Field>

          {/* Supplier */}
          <Field label="Supplier">
            <SelectInput value={fields.supplier} onChange={set('supplier')} onBlur={() => {}}>
              <option value="" disabled>Select supplier</option>
              <option value="main">Main Supplier</option>
              <option value="beverage">Beverage Supplier</option>
              <option value="kitchen">Kitchen Supplier</option>
            </SelectInput>
          </Field>

          {/* Actions */}
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
