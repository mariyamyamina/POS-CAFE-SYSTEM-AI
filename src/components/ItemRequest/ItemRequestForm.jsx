import React from 'react';
import { icons } from '../../constants/icons';

const inputClass = 'h-[36px] w-full rounded-md border border-[#DDE1EC] bg-white px-3 text-[12px] font-medium text-[#10112B] outline-none transition placeholder:text-[#7C3AED] focus:border-[#7C3AED]/50';
const selectClass = `${inputClass} appearance-none pr-9 text-[#7C3AED]`;

const Field = ({ label, children }) => (
  <label className="flex min-w-0 flex-col gap-2">
    <span className="text-[12px] font-bold text-[#050A24]">{label}</span>
    {children}
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

const DateInput = ({ defaultValue, placeholder = 'dd-mm-yyyy' }) => (
  <div className="relative">
    <input className={`${inputClass} pr-9 text-[#7C3AED]`} defaultValue={defaultValue} placeholder={placeholder} />
    <icons.calendar className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#17213D]" />
  </div>
);

const normalizeDate = (value) => {
  if (!value) {
    return '';
  }

  if (value.includes('June')) {
    const day = value.slice(0, 2);
    return `${day}-06-2026`;
  }

  return value;
};

const ItemRequestForm = ({ mode = 'add', request, onCancel, onSave }) => {
  const isEdit = mode === 'edit';
  const requestId = isEdit ? `REQ-1413${request.id}` : 'REQ-14133';
  const subject = isEdit ? request.subject.replace(/\n/g, ' ') : '';
  const requestedBy = isEdit ? request.requestedBy.replace(/\n/g, ' ') : '';
  const requestedDate = isEdit ? normalizeDate(request.requestedDate) : '05-06-2026';
  const expectedDelivery = isEdit ? normalizeDate(request.expectingDelivery) : '';
  const status = isEdit ? request.status : 'Pending';

  return (
    <main className="flex-1 overflow-y-auto px-3 pb-5 lg:px-5">
      <div className="mb-5 flex items-center gap-2 text-[12px] font-medium">
        <button onClick={onCancel} className="text-[#6D28D9]" type="button">Inventory</button>
        <span className="text-[#9CA3B8]">&gt;</span>
        <span className="text-[#26305F]">Add Inventory</span>
      </div>

      <div className="flex flex-col gap-5">
        <section className="rounded-lg border border-[#EAECF3] bg-white p-6 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
          <h2 className="text-[17px] font-bold text-[#050A24]">Request Information</h2>

          <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-7 lg:grid-cols-3">
            <Field label="Request ID">
              <input className={`${inputClass} text-[#7C3AED]`} defaultValue={requestId} readOnly />
            </Field>

            <Field label="Subject">
              <input className={inputClass} defaultValue={subject} placeholder="Enter Subject" />
            </Field>

            <Field label="Requested By">
              <input className={inputClass} defaultValue={requestedBy} />
            </Field>

            <Field label="Requested Date">
              <DateInput defaultValue={requestedDate} />
            </Field>

            <Field label="Expected Delivery">
              <DateInput defaultValue={expectedDelivery} />
            </Field>

            <Field label="Status">
              <SelectField defaultValue={status}>
                <option value="Pending">Pending</option>
                <option value="On the way">On the way</option>
                <option value="Cancelled">Cancelled</option>
              </SelectField>
            </Field>
          </div>
        </section>

        <section className="rounded-lg border border-[#EAECF3] bg-white shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-[17px] font-bold text-[#050A24]">Items</h2>
            <button className="flex h-9 items-center gap-2 rounded-md bg-[#7C3AED] px-5 text-[12px] font-bold text-white transition hover:bg-[#6D28D9]" type="button">
              <icons.plus className="h-4 w-4" />
              Add Item
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
                  <tr className="h-[61px]">
                    <td className="px-4">
                      <SelectField defaultValue={isEdit ? 'Orange Juice' : ''}>
                        <option value="" disabled>Select Item</option>
                        <option value="Orange Juice">Orange Juice</option>
                        <option value="Strawberry Milkshake">Strawberry Milkshake</option>
                        <option value="Lemon Juice">Lemon Juice</option>
                      </SelectField>
                    </td>
                    <td className="px-4">
                      <input className={inputClass} defaultValue="1" />
                    </td>
                    <td className="px-4">
                      <DateInput defaultValue={isEdit ? expectedDelivery : '05-06-2026'} />
                    </td>
                    <td className="px-4">
                      <button className="flex h-9 w-9 items-center justify-center rounded-md text-[#EF4444] transition hover:bg-[#FFF1F1]" type="button" aria-label="Remove item">
                        <icons.trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 border-t border-[#EAECF3] px-6 py-5">
            <button
              onClick={onCancel}
              className="h-10 min-w-[90px] rounded-md border border-[#CBD2E1] bg-white px-6 text-[13px] font-semibold text-[#111827] transition hover:bg-[#F8F8FB]"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="flex h-10 min-w-[104px] items-center justify-center gap-2 rounded-md bg-[#7C3AED] px-6 text-[13px] font-bold text-white transition hover:bg-[#6D28D9]"
              type="button"
            >
              <icons.save className="h-4 w-4" />
              Save
            </button>
            <button
              onClick={onSave}
              className="flex h-10 min-w-[178px] items-center justify-center gap-2 rounded-md bg-[#16A34A] px-6 text-[13px] font-bold text-white transition hover:bg-[#15803D]"
              type="button"
            >
              <icons.send className="h-4 w-4" />
              Submit Request
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ItemRequestForm;
