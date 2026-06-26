import React from 'react';
import { icons } from '../../constants/icons';

const selectClass = 'h-10 w-full appearance-none rounded-md border border-[#DDE1EC] bg-white px-3 pr-9 text-[12px] font-medium text-[#6D28D9] outline-none transition placeholder:text-[#6D28D9] focus:border-[#7C3AED]/50';
const inputClass = 'h-10 w-full rounded-md border border-[#DDE1EC] bg-white px-3 pr-9 text-[12px] font-medium text-[#10112B] outline-none transition placeholder:text-[#6D28D9] focus:border-[#7C3AED]/50';

const Field = ({ label, children }) => (
  <label className="flex min-w-0 flex-1 flex-col gap-1.5">
    <span className="text-[12px] font-semibold text-[#2B2C67]">{label}</span>
    {children}
  </label>
);

const ItemRequestFilterBar = () => {
  return (
    <section className="rounded-lg border border-[#EAECF3] bg-white p-5 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto_auto] xl:items-end">
        <Field label="Request ID">
          <div className="relative">
            <select className={selectClass} defaultValue="">
              <option value="" disabled>Select request ID</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A0B3]" />
          </div>
        </Field>

        <Field label="Subject">
          <input className={inputClass} placeholder="Enter subject" />
        </Field>

        <Field label="Requested By">
          <div className="relative">
            <select className={selectClass} defaultValue="">
              <option value="" disabled>Select requested by</option>
              <option value="mariyam">Mariyam Yamina M</option>
              <option value="admin">Administrator Admin</option>
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A0B3]" />
          </div>
        </Field>

        <Field label="Date From">
          <div className="relative">
            <input className={inputClass} placeholder="dd-mm-yyyy" />
            <icons.calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
          </div>
        </Field>

        <Field label="Date To">
          <div className="relative">
            <input className={inputClass} placeholder="dd-mm-yyyy" />
            <icons.calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
          </div>
        </Field>

        <button className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#6D31F6] px-5 text-[12px] font-bold text-white shadow-sm shadow-[#6D31F6]/20 transition hover:bg-[#5B21D9]" type="button">
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

export default ItemRequestFilterBar;
