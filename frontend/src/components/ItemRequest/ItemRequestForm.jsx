import React, { useState, useEffect } from 'react';
import { icons } from '../../constants/icons';
import { FieldError, fieldBorderClass } from '../../hooks/useFormValidation';
import { inventoryApi, itemRequestApi } from '../../api';

/* ─── Validation rules ──────────────────────────────────────────────── */
const headerValidate = {
  subject:          (v) => v.trim() ? '' : 'Subject is required.',
  requestedDate:    (v) => v        ? '' : 'Requested date is required.',
  expectedDelivery: (v) => v        ? '' : 'Expected delivery date is required.',
};
const lineValidate = {
  itemId:   (v) => v             ? '' : 'Please select an item.',
  quantity: (v) => Number(v) > 0 ? '' : 'Quantity must be at least 1.',
  itemDate: (v) => v             ? '' : 'Date is required.',
};

/* ─── Base classes ──────────────────────────────────────────────────── */
const BASE = 'h-[36px] w-full rounded-md border bg-white px-3 text-[12px] font-medium text-[#10112B] outline-none transition placeholder:text-[#9AA1B4]';
const BASE_SEL = `${BASE} appearance-none pr-9 text-[#7C3AED]`;

const inputCls  = (hasErr) => `${BASE} ${fieldBorderClass(hasErr)}`;
const selectCls = (hasErr) => `${BASE_SEL} ${fieldBorderClass(hasErr)}`;

const todayISO = () => new Date().toISOString().slice(0, 10);

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
  <input
    type="date"
    className={`${inputCls(hasErr)} text-[#7C3AED]`}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
  />
);

let _nextTempId = -1; // negative temp ids for new, not-yet-saved line rows in this form session
const makeEmptyLine = () => ({
  tempId: _nextTempId--,
  id: null,            // real DB id once loaded from an existing request
  itemId: '',
  quantity: '1',
  itemDate: todayISO(),
});

/* ─── Main form ─────────────────────────────────────────────────────── */
const ItemRequestForm = ({ mode = 'add', request, onCancel, onSave }) => {
  const isEdit = mode === 'edit';

  const [fields, setFields] = useState({
    subject:          isEdit ? request.subject          : '',
    requestedDate:    isEdit ? request.requested_date    : todayISO(),
    expectedDelivery: isEdit ? request.expected_delivery || '' : '',
    status:           isEdit ? request.status            : 'Pending',
  });

  const [lines, setLines] = useState(() => {
    if (isEdit && request.items?.length) {
      return request.items.map((line) => ({
        tempId: _nextTempId--,
        id: line.id,
        itemId: String(line.item_id),
        quantity: String(line.quantity),
        itemDate: line.item_date || todayISO(),
      }));
    }
    return [makeEmptyLine()];
  });

  const [hTouched, setHTouched] = useState({});
  const [lTouched, setLTouched] = useState({}); // keyed by `${tempId}.${field}`
  const [submitted, setSubmitted] = useState(false);

  const [inventoryItems, setInventoryItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let isMounted = true;
    inventoryApi.getItems()
      .then((data) => { if (isMounted) setInventoryItems(data || []); })
      .catch((err) => console.error('Failed to load inventory items:', err))
      .finally(() => { if (isMounted) setItemsLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const he = (field) => {
    if (!submitted && !hTouched[field]) return '';
    return headerValidate[field]?.(fields[field]) ?? '';
  };
  const le = (tempId, field, value) => {
    const key = `${tempId}.${field}`;
    if (!submitted && !lTouched[key]) return '';
    return lineValidate[field]?.(value) ?? '';
  };

  const setF = (f) => (ev) => setFields((p) => ({ ...p, [f]: ev.target.value }));
  const touchH = (f) => () => setHTouched((p) => ({ ...p, [f]: true }));
  const touchL = (tempId, f) => () => setLTouched((p) => ({ ...p, [`${tempId}.${f}`]: true }));

  const updateLine = (tempId, field, value) => {
    setLines((prev) => prev.map((l) => (l.tempId === tempId ? { ...l, [field]: value } : l)));
  };

  const handleAddLine = () => setLines((prev) => [...prev, makeEmptyLine()]);
  const handleRemoveLine = (tempId) => {
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.tempId !== tempId) : prev));
  };

  const validateAll = () => {
    const hErrs = Object.keys(headerValidate).some((f) => headerValidate[f](fields[f]));
    const lErrs = lines.some((l) =>
      lineValidate.itemId(l.itemId) || lineValidate.quantity(l.quantity) || lineValidate.itemDate(l.itemDate)
    );
    return !hErrs && !lErrs;
  };

  const buildPayload = () => ({
    subject: fields.subject,
    requested_date: fields.requestedDate,
    expected_delivery: fields.expectedDelivery || null,
    items: lines.map((l) => {
      const invItem = inventoryItems.find((i) => i.id === Number(l.itemId));
      return {
        ...(isEdit && l.id ? { id: l.id } : {}),
        item_id: Number(l.itemId),
        item_name: invItem?.name || '',
        quantity: Number(l.quantity),
        item_date: l.itemDate || null,
      };
    }),
  });

  const handleSubmitForm = async (action) => {
    setSubmitted(true);
    if (!validateAll()) return;

    setSaving(true);
    setSaveError('');

    try {
      const payload = buildPayload();

      if (isEdit) {
        // Editing always goes through the update endpoint — status is taken
        // from the form's Status dropdown, not re-derived from Save/Submit
        await itemRequestApi.updateRequest(request.id, { ...payload, status: fields.status });
      } else if (action === 'submit') {
        await itemRequestApi.submitRequest(payload);
      } else {
        await itemRequestApi.saveRequest(payload);
      }

      onSave?.();
    } catch (error) {
      setSaveError(error.message || 'Failed to save request. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const anyError = (submitted && !validateAll()) || Boolean(saveError);

  const requestNo = isEdit ? request.request_no : 'Auto-generated on save';

  return (
    <main className="flex-1 overflow-y-auto px-3 pb-5 lg:px-5">
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
              {saveError || 'Please fix all required fields marked in red before submitting.'}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-7 lg:grid-cols-3">
            <Field label="Request ID">
              <input className={`${BASE} border-[#DDE1EC] bg-[#F9FAFC] text-[#7C3AED]`} value={requestNo} readOnly />
            </Field>

            <Field label="Subject" errMsg={he('subject')}>
              <input
                className={inputCls(Boolean(he('subject')))}
                value={fields.subject}
                onChange={setF('subject')}
                onBlur={touchH('subject')}
                placeholder="Enter Subject"
              />
            </Field>

            <Field label="Requested Date" errMsg={he('requestedDate')}>
              <DateInput
                value={fields.requestedDate}
                onChange={setF('requestedDate')}
                onBlur={touchH('requestedDate')}
                hasErr={Boolean(he('requestedDate'))}
              />
            </Field>

            <Field label="Expected Delivery" errMsg={he('expectedDelivery')}>
              <DateInput
                value={fields.expectedDelivery}
                onChange={setF('expectedDelivery')}
                onBlur={touchH('expectedDelivery')}
                hasErr={Boolean(he('expectedDelivery'))}
              />
            </Field>

            {/* Status — only meaningful/editable when editing an existing request */}
            {isEdit && (
              <Field label="Status">
                <SelectInput value={fields.status} onChange={setF('status')} onBlur={() => {}}>
                  <option value="Pending">Pending</option>
                  <option value="On the way">On the way</option>
                  <option value="Cancelled">Cancelled</option>
                </SelectInput>
              </Field>
            )}
          </div>
        </section>

        {/* ── Items ── */}
        <section className="rounded-lg border border-[#EAECF3] bg-white shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-[17px] font-bold text-[#050A24]">Items</h2>
            <button
              onClick={handleAddLine}
              className="flex h-9 items-center gap-2 rounded-md bg-[#7C3AED] px-5 text-[12px] font-bold text-white transition hover:bg-[#6D28D9]"
              type="button"
            >
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
                  {lines.map((line) => (
                    <tr key={line.tempId} className="align-top">
                      <td className="px-4 py-3">
                        <SelectInput
                          value={line.itemId}
                          onChange={(e) => updateLine(line.tempId, 'itemId', e.target.value)}
                          onBlur={touchL(line.tempId, 'itemId')}
                          hasErr={Boolean(le(line.tempId, 'itemId', line.itemId))}
                        >
                          <option value="" disabled>{itemsLoading ? 'Loading items…' : 'Select Item'}</option>
                          {inventoryItems.map((inv) => (
                            <option key={inv.id} value={inv.id}>{inv.name}</option>
                          ))}
                        </SelectInput>
                        <Err msg={le(line.tempId, 'itemId', line.itemId)} />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          className={inputCls(Boolean(le(line.tempId, 'quantity', line.quantity)))}
                          value={line.quantity}
                          onChange={(e) => updateLine(line.tempId, 'quantity', e.target.value)}
                          onBlur={touchL(line.tempId, 'quantity')}
                          type="number"
                          min="1"
                        />
                        <Err msg={le(line.tempId, 'quantity', line.quantity)} />
                      </td>
                      <td className="px-4 py-3">
                        <DateInput
                          value={line.itemDate}
                          onChange={(e) => updateLine(line.tempId, 'itemDate', e.target.value)}
                          onBlur={touchL(line.tempId, 'itemDate')}
                          hasErr={Boolean(le(line.tempId, 'itemDate', line.itemDate))}
                        />
                        <Err msg={le(line.tempId, 'itemDate', line.itemDate)} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleRemoveLine(line.tempId)}
                          disabled={lines.length === 1}
                          className="flex h-9 w-9 items-center justify-center rounded-md text-red-400 transition hover:bg-red-50 disabled:opacity-30"
                          type="button"
                          aria-label="Remove item row"
                        >
                          <icons.trash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 border-t border-[#EAECF3] px-6 py-5">
            <button onClick={onCancel} disabled={saving} className="h-10 min-w-[90px] rounded-md border border-[#CBD2E1] bg-white px-6 text-[13px] font-semibold text-[#111827] transition hover:bg-[#F8F8FB] disabled:opacity-60" type="button">
              Cancel
            </button>

            {/* Save / Submit only meaningfully differ on create — editing always just saves via PUT */}
            <button
              onClick={() => handleSubmitForm('save')}
              disabled={saving}
              className="flex h-10 min-w-[104px] items-center justify-center gap-2 rounded-md bg-[#7C3AED] px-6 text-[13px] font-bold text-white transition hover:bg-[#6D28D9] disabled:opacity-60"
              type="button"
            >
              <icons.save className="h-4 w-4" /> {saving ? 'Saving…' : isEdit ? 'Save' : 'Save (Pending)'}
            </button>

            {!isEdit && (
              <button
                onClick={() => handleSubmitForm('submit')}
                disabled={saving}
                className="flex h-10 min-w-[178px] items-center justify-center gap-2 rounded-md bg-[#16A34A] px-6 text-[13px] font-bold text-white transition hover:bg-[#15803D] disabled:opacity-60"
                type="button"
              >
                <icons.send className="h-4 w-4" /> {saving ? 'Submitting…' : 'Submit Request'}
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ItemRequestForm;