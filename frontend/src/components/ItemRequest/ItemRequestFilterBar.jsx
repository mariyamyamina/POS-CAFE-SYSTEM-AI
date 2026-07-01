import React, { useMemo, useState } from 'react';
import { icons } from '../../constants/icons';

const selectClass = 'h-10 w-full appearance-none rounded-md border border-[#DDE1EC] bg-white px-3 pr-9 text-[12px] font-medium text-[#6D28D9] outline-none transition placeholder:text-[#6D28D9] focus:border-[#7C3AED]/50';
const inputClass = 'h-10 w-full rounded-md border border-[#DDE1EC] bg-white px-3 pr-9 text-[12px] font-medium text-[#10112B] outline-none transition placeholder:text-[#6D28D9] focus:border-[#7C3AED]/50';

// Hides the browser's own calendar icon (only reachable via this pseudo-element)
// and stretches it invisibly across the whole field so the input is still
// clickable anywhere — the icons.calendar glyph rendered on top is purely visual.
const dateInputClass = `${inputClass} [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`;

const Field = ({ label, children }) => (
  <label className="flex min-w-0 flex-1 flex-col gap-1.5">
    <span className="text-[12px] font-semibold text-[#2B2C67]">{label}</span>
    {children}
  </label>
);

const EMPTY_FILTERS = {
  requestId: '',
  subject: '',
  requestedBy: '',
  dateFrom: '',
  dateTo: '',
};

/**
 * requests: full list of item requests the parent page has already loaded —
 *   used only to derive the Request ID / Requested By dropdown options.
 * onFilter(filters): called with the current filter values when Filter is clicked.
 * onReset(): called when Reset is clicked (defaults to onFilter with empty filters
 *   if not provided).
 */
const ItemRequestFilterBar = ({ requests = [], onFilter, onReset }) => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const requestIdOptions = useMemo(() => {
    const ids = requests.map((r) => String(r.request_no ?? r.id)).filter(Boolean);
    return [...new Set(ids)].sort();
  }, [requests]);

  const requestedByOptions = useMemo(() => {
    const names = requests.map((r) => r.requested_by_name).filter(Boolean);
    return [...new Set(names)].sort();
  }, [requests]);

  const setField = (field) => (ev) => setFilters((p) => ({ ...p, [field]: ev.target.value }));

  const handleFilterClick = () => {
    onFilter?.(filters);
  };

  const handleResetClick = () => {
    setFilters(EMPTY_FILTERS);
    if (onReset) onReset();
    else onFilter?.(EMPTY_FILTERS);
  };

  return (
    <section className="rounded-lg border border-[#EAECF3] bg-white p-5 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto_auto] xl:items-end">
        <Field label="Request ID">
          <div className="relative">
            <select className={selectClass} value={filters.requestId} onChange={setField('requestId')}>
              <option value="">All requests</option>
              {requestIdOptions.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A0B3]" />
          </div>
        </Field>

        <Field label="Subject">
          <input
            className={inputClass}
            placeholder="Enter subject"
            value={filters.subject}
            onChange={setField('subject')}
          />
        </Field>

        <Field label="Requested By">
          <div className="relative">
            <select className={selectClass} value={filters.requestedBy} onChange={setField('requestedBy')}>
              <option value="">All requesters</option>
              {requestedByOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A0B3]" />
          </div>
        </Field>

        <Field label="Date From">
          <div className="relative">
            <input
              className={dateInputClass}
              type="date"
              value={filters.dateFrom}
              onChange={setField('dateFrom')}
            />
            <icons.calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
          </div>
        </Field>

        <Field label="Date To">
          <div className="relative">
            <input
              className={dateInputClass}
              type="date"
              value={filters.dateTo}
              onChange={setField('dateTo')}
            />
            <icons.calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17213D]" />
          </div>
        </Field>

        <button
          onClick={handleFilterClick}
          className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#6D31F6] px-5 text-[12px] font-bold text-white shadow-sm shadow-[#6D31F6]/20 transition hover:bg-[#5B21D9]"
          type="button"
        >
          <icons.filter className="h-4 w-4" />
          Filter
        </button>
        <button
          onClick={handleResetClick}
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#DDE1EC] bg-white px-5 text-[12px] font-semibold text-[#343B58] transition hover:bg-[#F8F8FB]"
          type="button"
        >
          <icons.refresh className="h-4 w-4" />
          Reset
        </button>
      </div>
    </section>
  );
};

export default ItemRequestFilterBar;