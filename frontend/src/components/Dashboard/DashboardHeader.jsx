import React from 'react';
import { icons } from '../../constants/icons';

const DashboardHeader = ({ onToggleSidebar, user }) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-text-100 bg-white px-4 py-3 lg:px-6">
      <button
        className="mr-1 flex h-9 w-9 items-center justify-center rounded-md text-text-600 hover:bg-text-50 lg:hidden"
        onClick={onToggleSidebar}
        type="button"
        aria-label="Toggle sidebar"
      >
        <icons.menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <icons.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-400" />
        <input
          type="text"
          placeholder="Search anything..."
          className="h-9 w-full rounded-lg border border-text-100 bg-text-50 pl-9 pr-14 text-[13px] text-text-700 placeholder:text-text-400 outline-none focus:border-primary-300 focus:bg-white"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-text-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-text-400">
          Ctrl + K
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Date picker */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-text-100 bg-white px-3 py-2 text-[12px] font-medium text-text-700 hover:bg-text-50"
        >
          <icons.calendar className="h-4 w-4 text-text-400" />
          <span className="hidden sm:inline">{formattedDate}</span>
          <icons.chevronDown className="h-3.5 w-3.5 text-text-400" />
        </button>

        {/* Notification bell */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-text-100 bg-white text-text-500 hover:bg-text-50"
          aria-label="Notifications"
        >
          <icons.bell className="h-4 w-4" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 rounded-lg border border-text-100 bg-white px-2 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[12px] font-bold uppercase text-white">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-[12px] font-semibold text-text-900">{user?.username || 'User'}</span>
            <span className="text-[10px] text-text-400">{user?.role || 'Cashier'}</span>
          </div>
          <icons.chevronDown className="h-3.5 w-3.5 text-text-400" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;