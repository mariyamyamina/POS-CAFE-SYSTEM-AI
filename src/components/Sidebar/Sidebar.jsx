import React from 'react';
import { colors } from '../../constants/colors';
import { icons } from '../../constants/icons';

const Sidebar = ({ activePage = 'billing', isOpen, onClose }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
    { id: 'billing', label: 'Billing', icon: icons.billing },
    { id: 'inventory', label: 'Inventory', icon: icons.inventory },
    { id: 'itemRequest', label: 'Item Request', icon: icons.itemRequest },
    { id: 'salesReport', label: 'Sales Report', icon: icons.salesReport },
    { id: 'users', label: 'Users', icon: icons.users },
    { id: 'settings', label: 'Settings', icon: icons.settings },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[191px] flex-col bg-[#100B2D] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center px-5 pb-8 pt-5">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7C3AED] shadow-lg shadow-[#7C3AED]/25">
              <icons.coffee className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">POS Cafe</h1>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-none">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <li key={item.id}>
                  <button
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[12px] font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-white shadow-md shadow-[#6D28D9]/30'
                        : 'text-white hover:bg-white/5'
                    }`}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`
                        : 'transparent'
                    }}
                    type="button"
                  >
                    <Icon className="h-4 w-4 text-white" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[12px] font-semibold text-white transition-colors hover:bg-white/5"
            type="button"
          >
            <icons.logout className="h-5 w-5" />
            <span>Logout</span>
          </button>

          <div className="mt-3 flex items-center gap-3 border-t border-white/10 px-2 pt-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7C3AED] text-sm font-bold uppercase text-white shadow-sm">
              A
            </div>
            <div className="flex min-w-0 flex-col text-left">
              <span className="truncate text-sm font-semibold text-white">admin</span>
              <span className="truncate text-xs text-white/55">@admin</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
