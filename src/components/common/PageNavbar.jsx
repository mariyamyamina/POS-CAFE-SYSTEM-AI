import React from 'react';
import { icons } from '../../constants/icons';
import useCurrentDateTime from '../../hooks/useCurrentDateTime';

const PageNavbar = ({
  title,
  onToggleSidebar,
  dateLabel,
  dayLabel,
  timeLabel,
}) => {
  const currentDateTime = useCurrentDateTime();

  return (
    <header className="flex h-[64px] shrink-0 items-center justify-between bg-[#F8F8FB] px-3 lg:px-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-md text-[#363A76] transition-colors hover:bg-white"
          aria-label="Toggle sidebar"
          type="button"
        >
          <icons.menu className="h-[18px] w-[18px]" />
        </button>
        <h1 className="text-[18px] font-bold tracking-tight text-[#080A1F]">{title}</h1>
      </div>

      <div className="hidden h-[50px] items-center rounded-md border border-[#EEEFF6] bg-white px-4 shadow-[0_6px_18px_rgba(20,18,56,0.05)] sm:flex">
        <div className="flex items-center gap-2 pr-5">
          <icons.calendar className="h-4 w-4 text-[#6D28D9]" />
          <div className="leading-none">
            <p className="text-[11px] font-bold text-[#171733]">{dateLabel ?? currentDateTime.dateLabel}</p>
            <p className="mt-1 text-[8px] font-medium text-[#686B91]">{dayLabel ?? currentDateTime.dayLabel}</p>
          </div>
        </div>
        <div className="h-7 w-px bg-[#E5E7F0]" />
        <div className="flex items-center gap-2 pl-5">
          <icons.clock className="h-4 w-4 text-[#6D28D9]" />
          <p className="text-[11px] font-bold text-[#171733]">{timeLabel ?? currentDateTime.timeLabel}</p>
        </div>
      </div>
    </header>
  );
};

export default PageNavbar;
