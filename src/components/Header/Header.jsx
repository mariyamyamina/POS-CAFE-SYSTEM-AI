import React from 'react';
import { icons } from '../../constants/icons';

const Header = ({
  title = "Current Bill",
  totalAmount = 0,
  searchQuery = "",
  onSearchChange,
  viewMode = "grid",
  onViewModeChange,
  onToggleSidebar
}) => {
  return (
    <header className="flex h-14 w-full items-center justify-between bg-[#F8F8FB] px-3 lg:px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-[#445083] transition-colors hover:bg-[#F0F1F7]"
          aria-label="Toggle sidebar"
          type="button"
        >
          <icons.menu className="h-5 w-5" />
        </button>
        <h2 className="text-[17px] font-bold tracking-tight text-[#10112B]">{title}</h2>
      </div>

      <div className="ml-auto mr-3 hidden min-w-[130px] flex-col items-start sm:flex">
        <span className="text-[9px] font-semibold tracking-[0.08em] text-[#4D45A4]">Total Amount</span>
        <span className="text-[22px] font-extrabold leading-none text-[#7C3AED]">₹{totalAmount.toFixed(2)}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden w-64 sm:block md:w-[400px]">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#7C3AED]">
            <icons.search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="h-9 w-full rounded-md border border-transparent bg-white pl-10 pr-4 text-xs font-medium text-[#10112B] outline-none transition-all placeholder:text-[#7A55F4] focus:border-[#7C3AED]/30"
          />
        </div>

        <button
          onClick={() => onViewModeChange && onViewModeChange("grid")}
          className={`flex h-9 w-9 items-center justify-center rounded-md transition-all ${
            viewMode === "grid"
              ? "bg-[#7C3AED] text-white shadow-sm"
              : "border border-[#D8DCE9] bg-white text-[#505A83] hover:text-[#10112B]"
          }`}
          aria-label="Grid view"
          type="button"
        >
          <icons.gridOn className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewModeChange && onViewModeChange("list")}
          className={`flex h-9 w-9 items-center justify-center rounded-md transition-all ${
            viewMode === "list"
              ? "bg-[#7C3AED] text-white shadow-sm"
              : "border border-[#D8DCE9] bg-white text-[#505A83] hover:text-[#10112B]"
          }`}
          aria-label="List view"
          type="button"
        >
          <icons.list className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
