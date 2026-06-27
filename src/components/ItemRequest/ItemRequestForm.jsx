import React, { useState } from 'react';
import { icons } from '../../constants/icons';
import { FieldError, fieldBorderClass } from '../../hooks/useFormValidation';

/* ─── Validation rules (run live during render) ─────────────────────── */
const headerValidate = {
  subject:          (v) => v.trim() ? '' : 'Subject is required.',
  requestedBy:      (v) => v.trim() ? '' : 'Requester name is required.',
  requestedDate:    (v) => v.trim() ? '' : 'Requested date is required.',
  expectedDelivery: (v) => v.trim() ? '' : 'Expected delivery date is required.',
};
const itemValidate = {
  itemName: (v) => v           ? '' : 'Please select an item.',
  quantity: (v) => Number(v) > 0 ? '' : 'Quantity must be at least 1.',
  itemDate: (v) => v.trim()   ? '' : 'Date is required.',
};

/* ─── Base classes ──────────────────────────────────────────────────── */
const BASE = 'h-[36px] w-full rounded-md border bg-white px-3 text-[12px] font-medium text-[#10112B] outline-none transition placeholder:text-[#9AA1B4]';
const BASE_SEL = `${BASE} appearance-none pr-9 text-[#7C3AED]`;

const normalizeDate = (v) => {
  if (!v) return '';
  if (v.includes('June')) return `${v.slice(0, 2)}-06-2026`;
  return v;
};

/* ─── Styling helpers ───────────────────────────────────────────────── */
const inputCls  = (hasErr) => `${BASE} ${fieldBorderClass(hasErr)}`;
const selectCls = (hasErr) => `${BASE_SEL} ${fieldBorderClass(hasErr)}`;

/* ─── Sub-components ────────────────────────────────────────────────── */
const Err = ({ msg }) => <FieldError message={msg} />;

const Field = ({ label, errMsg, children }) => (
  <div className="flex min-w-0 flex-col gap-1">
    <span className="mb-0.5 text-[12px] font-bold text-[#050A24]">{label}</span>
    {children}
    <Err msg={errMsg} />
  </div>
);

const SelectInput = ({ value, onChange, onBlur, hasErr, children }) => (
  <div className="relative">
    <select className={selectCls(hasErr)} value={value} onChange={onChange} onBlur={onBlur}>
      {children}
    </select>
    <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9AA1B4]" />
  </div>
);

const DateInput = ({ value, onChange, onBlur, hasErr }) => (
  <div className="relative">
    <input
      className={`${inputCls(hasErr)} pr-9 text-[#7C3AED]`}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder="dd-mm-yyyy"
    />
    <icons.calendar className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#17213D]" />
  </div>
);

/* ─── Main form ─────────────────────────────────────────────────────── */
const ItemRequestForm = ({ mode = 'add', request, onCancel, onSave }) => {
  const isEdit = mode === 'edit';

  /* Header fields */
  const [fields, setFields] = useState({
    subject:          isEdit ? request.subject.replace(/\n/g, ' ')     : '',
    requestedBy:      isEdit ? request.requestedBy.replace(/\n/g, ' ') : '',
    requestedDate:    isEdit ? normalizeDate(request.requestedDate)     : '05-06-2026',
    expectedDelivery: isEdit ? normalizeDate(request.expectingDelivery) : '',
    status:           isEdit ? request.status                          : 'Pending',
  });

  /* Items row */
  const [item, setItem] = useState({
    itemName: isEdit ? 'Orange Juice' : '',
    quantity: '1',
    itemDate: isEdit ? normalizeDate(request?.expectingDelivery) || '05-06-2026' : '05-06-2026',
  });

  const [hTouched, setHTouched] = useState({});
  const [iTouched, setITouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  /* Live error helpers — computed from current values at render time */
  const he = (field) => {
    if (!submitted && !hTouched[field]) return '';
    return headerValidate[field]?.(fields[field]) ?? '';
  };
  const ie = (field) => {
    if (!submitted && !iTouched[field]) return '';
    return itemValidate[field]?.(item[field]) ?? '';
  };

  const setF = (f) => (ev) => setFields((p) => ({ ...p, [f]: ev.target.value }));
  const setI = (f) => (ev) => setItem((p)   => ({ ...p, [f]: ev.target.value }));
  const touchH = (f) => () => setHTouched((p) => ({ ...p, [f]: true }));
  const touchI = (f) => () => setITouched((p) => ({ ...p, [f]: true }));

  const handleSave = () => {
    setSubmitted(true); // triggers re-render → he/ie now show ALL errors
    const hErrs = Object.keys(headerValidate).some((f) => headerValidate[f](fields[f]));
    const iErrs = Object.keys(itemValidate).some((f)   => itemValidate[f](item[f]));
    if (!hErrs && !iErrs) onSave?.();
  };

  const anyError = submitted && (
    Object.keys(headerValidate).some((f) => headerValidate[f](fields[f])) ||
    Object.keys(itemValidate).some((f)   => itemValidate[f](item[f]))
  );

  const requestId = isEdit ? `REQ-1413${request.id}` : 'REQ-14133';

  return (
    <main className="flex-1 overflow-y-auto px-3 pb-5 lg:px-5">
      {/* Breadcrumb */}
      <div className="mb-5 flex items-center gap-2 text-[12px] font-medium">
        <button onClick={onCancel} className="text-[#6D28D9]" type="button">Item Request</button>
        <span className="text-[#9CA3B8]">&gt;</span>
        <span className="text-[#26305F]">{isEdit ? 'Edit Request' : 'Add Request'}</span>
      </div>

      <div className="flex flex-col gap-5">
        {/* ── Request Information ── */}
        <section className="rounded-lg border border-[#EAECF3] bg-white p-6 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
          <h2 className="text-[17px] font-bold text-[#050A24]">Request Information</h2>

          {anyError && (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Please fix all required fields marked in red before submitting.
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-7 lg:grid-cols-3">
            {/* Request ID */}
            <Field label="Request ID">
              <input className={`${BASE} border-[#DDE1EC] bg-[#F9FAFC] text-[#7C3AED]`} defaultValue={requestId} readOnly />
            </Field>

            {/* Subject */}
            <Field label="Subject" errMsg={he('subject')}>
              <input
                className={inputCls(Boolean(he('subject')))}
                value={fields.subject}
                onChange={setF('subject')}
                onBlur={touchH('subject')}
                placeholder="Enter Subject"
              />
            </Field>

            {/* Requested By */}
            <Field label="Requested By" errMsg={he('requestedBy')}>
              <input
                className={inputCls(Boolean(he('requestedBy')))}
                value={fields.requestedBy}
                onChange={setF('requestedBy')}
                onBlur={touchH('requestedBy')}
                placeholder="Enter name"
              />
            </Field>

            {/* Requested Date */}
            <Field label="Requested Date" errMsg={he('requestedDate')}>
              <DateInput
                value={fields.requestedDate}
                onChange={setF('requestedDate')}
                onBlur={touchH('requestedDate')}
                hasErr={Boolean(he('requestedDate'))}
              />
            </Field>

            {/* Expected Delivery */}
            <Field label="Expected Delivery" errMsg={he('expectedDelivery')}>
              <DateInput
                value={fields.expectedDelivery}
                onChange={setF('expectedDelivery')}
                onBlur={touchH('expectedDelivery')}
                hasErr={Boolean(he('expectedDelivery'))}
              />
            </Field>

            {/* Status */}
            <Field label="Status">
              <SelectInput value={fields.status} onChange={setF('status')} onBlur={() => {}}>
                <option value="Pending">Pending</option>
                <option value="On the way">On the way</option>
                <option value="Cancelled">Cancelled</option>
              </SelectInput>
            </Field>
          </div>
        </section>

        {/* ── Items ── */}
        <section className="rounded-lg border border-[#EAECF3] bg-white shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-[17px] font-bold text-[#050A24]">Items</h2>
            <button className="flex h-9 items-center gap-2 rounded-md bg-[#7C3AED] px-5 text-[12px] font-bold text-white transition hover:bg-[#6D28D9]" type="button">
              <icons.plus className="h-4 w-4" /> Add Item
            </button>
          </div>

          <div className="px-6 pb-5">
            <div className="overflow-x-auto border border-[#DDE1EC]">
              <table className="min-w-[920px] w-full border-collapse text-left">
                <thead>
                  <tr className="h-10 bg-white">
                    <th className="border-b border-[#DDE1EC] px-4 text-[12px] font-bold text-[#7C3AED]">Item Name</th>
                    <th className="border-b border-[#DDE1EC] px-4 text-[12px] font-bold text-[#7C3AED]">Quantity</th>
                    <th className="border-b border-[#DDE1EC] px-4 text-[12px] font-bold text-[#7C3AED]">Expected Date</th>
                    <th className="border-b border-[#DDE1EC] px-4 text-[12px] font-bold text-[#7C3AED]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-top">
                    <td className="px-4 py-3">
                      <SelectInput value={item.itemName} onChange={setI('itemName')} onBlur={touchI('itemName')} hasErr={Boolean(ie('itemName'))}>
                        <option value="" disabled>Select Item</option>
                        <option value="Orange Juice">Orange Juice</option>
                        <option value="Strawberry Milkshake">Strawberry Milkshake</option>
                        <option value="Lemon Juice">Lemon Juice</option>
                      </SelectInput>
                      <Err msg={ie('itemName')} />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        className={inputCls(Boolean(ie('quantity')))}
                        value={item.quantity}
                        onChange={setI('quantity')}
                        onBlur={touchI('quantity')}
                        type="number"
                        min="1"
                      />
                      <Err msg={ie('quantity')} />
                    </td>
                    <td className="px-4 py-3">
                      <DateInput value={item.itemDate} onChange={setI('itemDate')} onBlur={touchI('itemDate')} hasErr={Boolean(ie('itemDate'))} />
                      <FieldError message={ie('itemDate')} />
                    </td>
                    <td className="px-4 py-3">
                      <button className="flex h-9 w-9 items-center justify-center rounded-md text-red-400 transition hover:bg-red-50" type="button">
                        <icons.trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 border-t border-[#EAECF3] px-6 py-5">
            <button onClick={onCancel} className="h-10 min-w-[90px] rounded-md border border-[#CBD2E1] bg-white px-6 text-[13px] font-semibold text-[#111827] transition hover:bg-[#F8F8FB]" type="button">
              Cancel
            </button>
            <button onClick={handleSave} className="flex h-10 min-w-[104px] items-center justify-center gap-2 rounded-md bg-[#7C3AED] px-6 text-[13px] font-bold text-white transition hover:bg-[#6D28D9]" type="button">
              <icons.save className="h-4 w-4" /> Save
            </button>
            <button onClick={handleSave} className="flex h-10 min-w-[178px] items-center justify-center gap-2 rounded-md bg-[#16A34A] px-6 text-[13px] font-bold text-white transition hover:bg-[#15803D]" type="button">
              <icons.send className="h-4 w-4" /> Submit Request
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ItemRequestForm;
