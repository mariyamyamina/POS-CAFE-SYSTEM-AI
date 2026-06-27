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
    <header className="flex h-14 w-full items-center justify-between bg-text-50 px-3 lg:px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-md text-text-600 transition-colors hover:bg-text-100"
          aria-label="Toggle sidebar"
          type="button"
        >
          <icons.menu className="h-5 w-5" />
        </button>
        <h2 className="text-[17px] font-bold tracking-tight text-text-900">{title}</h2>
      </div>

      <div className="ml-auto mr-3 hidden min-w-[130px] flex-col items-start sm:flex">
        <span className="text-[9px] font-semibold tracking-[0.08em] text-text-600">Total Amount</span>
        <span className="text-[22px] font-extrabold leading-none text-primary">₹{totalAmount.toFixed(2)}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden w-64 sm:block md:w-[400px]">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-primary">
            <icons.search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="h-9 w-full rounded-md border border-transparent bg-white pl-10 pr-4 text-xs font-medium text-text-900 outline-none transition-all placeholder:text-primary-400 focus:border-primary/30"
          />
        </div>

        <button
          onClick={() => onViewModeChange && onViewModeChange("grid")}
          className={`flex h-9 w-9 items-center justify-center rounded-md transition-all ${
            viewMode === "grid"
              ? "bg-primary text-white shadow-sm"
              : "border border-text-200 bg-white text-text-400 hover:text-text-900"
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
              ? "bg-primary text-white shadow-sm"
              : "border border-text-200 bg-white text-text-400 hover:text-text-900"
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
