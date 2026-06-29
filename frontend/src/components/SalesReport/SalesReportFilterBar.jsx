import React, { useState } from 'react';
import { icons } from '../../constants/icons';

const reportRanges = ['Today', 'Yesterday', 'This Week', 'This Month', 'Custom'];

const SalesReportFilterBar = () => {
  const [activeRange, setActiveRange] = useState('Today');

  return (
    <section className="rounded-lg border border-[#EAECF3] bg-white p-5 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr_auto_auto] xl:items-end">
        <label className="flex min-w-0 flex-col gap-2">
          <span className="text-[11px] font-bold text-[#050A24]">Item</span>
          <div className="relative">
            <select
              className="h-10 w-full appearance-none rounded-md border border-[#DDE1EC] bg-white px-3 pr-9 text-[12px] font-semibold text-[#6D28D9] outline-none transition focus:border-[#7C3AED]/50"
              defaultValue=""
            >
              <option value="" disabled>Select item</option>
              <option value="almond-milk">Almond Milk</option>
              <option value="black-tea">Black Tea</option>
              <option value="lemon-juice">Lemon Juice</option>
              <option value="veg-noodles">Veg Noodles</option>
            </select>
            <icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A0B3]" />
          </div>
        </label>

        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-[11px] font-bold text-[#050A24]">Reported Date</span>
          <div className="grid grid-cols-2 overflow-hidden rounded-md border border-[#DDE1EC] sm:grid-cols-5">
            {reportRanges.map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`h-10 border-r border-[#DDE1EC] px-4 text-[12px] font-semibold transition last:border-r-0 ${
                  activeRange === range
                    ? 'bg-[#7C3AED] text-white'
                    : 'bg-white text-[#6D28D9] hover:bg-[#F8F5FF]'
                }`}
                type="button"
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <button className="flex h-10 items-center justify-center rounded-md bg-[#7C3AED] px-9 text-[12px] font-bold text-white shadow-sm shadow-[#7C3AED]/20 transition hover:bg-[#6D28D9]" type="button">
          Filter
        </button>

        <button className="flex h-10 items-center justify-center rounded-md border border-[#7C3AED] bg-white px-9 text-[12px] font-semibold text-[#6D28D9] transition hover:bg-[#F8F5FF]" type="button">
          Reset
        </button>
      </div>
    </section>
  );
};

export default SalesReportFilterBar;
