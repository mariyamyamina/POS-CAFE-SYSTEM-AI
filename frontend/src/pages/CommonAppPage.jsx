import React from 'react';
import AppLayout from '../layout/AppLayout';
import PageNavbar from '../components/common/PageNavbar';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  itemRequest: 'Item Request',
  salesReport: 'Sales Report',
  users: 'Users',
  settings: 'Settings',
};

const CommonAppPage = ({ page, onToggleSidebar, onLogout, onNavigate, user }) => {
  const title = PAGE_TITLES[page] || 'Page';

  return (
    <AppLayout activePage={page} onLogout={onLogout} onNavigate={onNavigate} user={user}>
      {page !== 'dashboard' && <PageNavbar title={title} onToggleSidebar={onToggleSidebar} />}
      <main className="flex-1 overflow-y-auto px-3 pb-4 lg:px-4">
        <section className="rounded-lg border border-[#EAECF3] bg-white p-6 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
          <h2 className="text-[16px] font-bold text-[#10112B]">{title}</h2>
          <p className="mt-2 text-[12px] font-medium text-[#68708A]">
            Shared page navbar is ready here for the upcoming {title.toLowerCase()} table and controls.
          </p>
        </section>
      </main>
    </AppLayout>
  );
};

export default CommonAppPage;
