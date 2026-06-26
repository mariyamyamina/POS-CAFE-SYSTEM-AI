import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';
import BillingPage from './pages/BillingPage';
import AppLayout from './layout/AppLayout';
// FilterBar removed as requested
import { isAppPage } from './routes/routes';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  inventory: 'Inventory',
  itemRequest: 'Item Request',
  salesReport: 'Sales Report',
  users: 'Users',
  settings: 'Settings',
};

const PlaceholderPage = ({ page, onLogout, onNavigate }) => {
  const title = PAGE_TITLES[page] || page;

  return (
    <AppLayout activePage={page} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="flex-1 overflow-hidden p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#10112B]">{title}</h1>
              <p className="text-sm text-[#5F5B9B]">Common navbar and quick filters for {title}</p>
            </div>
          </div>

          {/* FilterBar removed */}

          <div className="rounded-md bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">
              {title} content placeholder. Use this area for page-specific data and controls.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

function App() {
  const [page, setPage] = useState('login');

  if (page === 'billing') {
    return <BillingPage onLogout={() => setPage('login')} onNavigate={setPage} />;
  }

  if (isAppPage(page)) {
    return <PlaceholderPage page={page} onLogout={() => setPage('login')} onNavigate={setPage} />;
  }

  return (
    <AuthPage
      mode={page}
      onShowLogin={() => setPage('login')}
      onShowRegister={() => setPage('register')}
      onLogin={() => setPage('billing')}
    />
  );
}

export default App;
