import React, { useState, useRef, useEffect } from 'react';
import { icons } from '../../constants/icons';
import { FieldError, fieldBorderClass } from '../../hooks/useFormValidation';
import { categoriesApi, inventoryApi } from '../../api';
import { useConfirm } from '../../context/ConfirmContext';

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

// Hardcoded supplier list — no Suppliers module yet, per earlier decision.
const SUPPLIER_OPTIONS = [
  { value: 'Main Supplier', label: 'Main Supplier' },
  { value: 'Beverage Supplier', label: 'Beverage Supplier' },
  { value: 'Kitchen Supplier', label: 'Kitchen Supplier' },
];

/* ─── Main form ─────────────────────────────────────────────────────── */
const InventoryItemForm = ({ mode = 'add', item, onCancel, onSave }) => {
  const isEdit = mode === 'edit';
  const confirm = useConfirm();

  const [fields, setFields] = useState({
    itemName:    item?.name                                   || '',
    category:    item?.category_id ? String(item.category_id) : '',
    price:       item ? String(item.price.toFixed(2))         : '',
    unit:        item?.unit                                   || '',
    inStock:     item ? String(item.in_stock)                 : '',
    supplier:    item?.supplier                                || '',
    description: item?.description                             || '',
  });

  // touched: tracks which fields user has blurred
  const [touched,   setTouched]   = useState({});
  // submitted: true after first Save click — shows ALL errors regardless of touched
  const [submitted, setSubmitted] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await categoriesApi.getCategories();
        if (isMounted) setCategories(data || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        if (isMounted) setCategoriesLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  /* Live error for a field — shown if submitted OR if user has touched that field */
  const e = (field) => {
    if (!submitted && !touched[field]) return '';
    return validate[field] ? validate[field](fields[field]) : '';
  };

  const set = (field) => (ev) => setFields((p) => ({ ...p, [field]: ev.target.value }));
  const touch = (field) => () => setTouched((p) => ({ ...p, [field]: true }));

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitted(true); // ← this triggers re-render; e() will now show ALL errors

    const hasErrors = Object.keys(validate).some((f) => validate[f](fields[f]));
    if (hasErrors) return;

    const ok = await confirm({
      icon: icons.save,
      title: isEdit ? 'Update Item?' : 'Add New Item?',
      message: isEdit
        ? 'Save changes to this inventory item?'
        : 'Add this item to your inventory?',
      confirmLabel: isEdit ? 'Update' : 'Add Item',
      confirmVariant: 'success',
    });
    if (!ok) return;

    setSaving(true);
    setSaveError('');

    const payload = {
      name: fields.itemName,
      category_id: Number(fields.category),
      price: parseFloat(fields.price),
      unit: fields.unit,
      description: fields.description || null,
      in_stock: Number(fields.inStock),
      purchased: Number(fields.inStock) || 0,
      supplier: fields.supplier || null,
    };

    try {
      if (isEdit) {
        await inventoryApi.updateItem(item.id, payload, imageFile);
      } else {
        await inventoryApi.createItem(payload, imageFile);
      }
      onSave?.();
    } catch (error) {
      setSaveError(error.message || 'Failed to save item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelClick = async () => {
    const ok = await confirm({
      title: 'Discard Changes?',
      message: 'Any unsaved changes to this item will be lost.',
      confirmLabel: 'Discard',
      confirmVariant: 'danger',
    });
    if (ok) onCancel?.();
  };

  // Banner: show after submitted AND there are still errors, OR a failed save request
  const anyError = (submitted && Object.keys(validate).some((f) => validate[f](fields[f]))) || Boolean(saveError);

  return (
    <main className="flex-1 overflow-y-auto px-3 pb-5 lg:px-5">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-[12px] font-medium">
        <button onClick={handleCancelClick} className="text-[#6D28D9]" type="button">Inventory</button>
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

        {/* Error banner — shown for validation errors OR a failed save request */}
        {anyError && (
          <div className="mx-auto mt-5 flex max-w-[915px] items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {saveError || 'Please fill in all required fields marked in red.'}
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
                {imageFile ? imageFile.name : isEdit && item?.image_url ? 'Click to replace image' : 'Click to upload or drag and drop'}
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
              <option value="" disabled>{categoriesLoading ? 'Loading categories…' : 'Select category'}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
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


          {/* Status — informational only, computed server-side from In Stock vs threshold */}
          <Field label="Status" hint="Status is auto-calculated based on In Stock quantity.">
            <input
              className={`${BASE_INPUT} border-[#DDE1EC] bg-[#F9FAFC] text-[#7C3AED]`}
              value={Number(fields.inStock) === 0 || fields.inStock === '' ? 'Out of Stock' : 'Calculated on save'}
              readOnly
            />
          </Field>

          {/* Supplier */}
          <Field label="Supplier">
            <SelectInput value={fields.supplier} onChange={set('supplier')} onBlur={() => {}}>
              <option value="" disabled>Select supplier</option>
              {SUPPLIER_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </SelectInput>
          </Field>

          {/* Actions */}
          <div className="flex justify-center gap-3 pt-1 xl:col-span-2">
            <button
              onClick={handleCancelClick}
              className="h-9 min-w-[90px] rounded-md border border-[#CBD2E1] bg-white px-6 text-[12px] font-semibold text-[#111827] transition hover:bg-[#F8F8FB]"
              type="button"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="flex h-9 min-w-[98px] items-center justify-center gap-2 rounded-md bg-[#6D28D9] px-6 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#5B21B6] disabled:opacity-60"
              type="submit"
              disabled={saving}
            >
              <icons.save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default InventoryItemForm;