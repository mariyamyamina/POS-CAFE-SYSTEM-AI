import React, { useEffect, useState } from 'react';
import AuthPage from './pages/AuthPage';
import { clearSession, getStoredToken, getStoredUser , getStoredRefreshToken , startTokenRefreshTimer , stopTokenRefreshTimer } from './api';
import BillingPage from './pages/BillingPage';
import InventoryPage from './pages/InventoryPage';
import ItemRequestPage from './pages/ItemRequestPage';
import SalesReportPage from './pages/SalesReportPage';
import UsersPage from './pages/UsersPage';
import CommonAppPage from './pages/CommonAppPage';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
import { isAppPage } from './routes/routes';

const PATH_TO_PAGE = {
  '/dashboard': 'dashboard',
  '/billing': 'billing',
  '/inventory': 'inventory',
  '/item_request': 'itemRequest',
  '/sales_report': 'salesReport',
  '/users': 'users',
  '/settings': 'settings',
};

const PAGE_TO_PATH = {
  dashboard: '/dashboard',
  billing: '/billing',
  inventory: '/inventory',
  itemRequest: '/item_request',
  salesReport: '/sales_report',
  users: '/users',
  settings: '/settings',
};

const getInitialPage = () => {
  if (typeof window === 'undefined') {
    return 'login';
  }

  return PATH_TO_PAGE[window.location.pathname] || 'login';
};

function App() {
  const [page, setPage] = useState(getInitialPage);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (getStoredToken()) {
      startTokenRefreshTimer();
      if (window.location.pathname === '/' || window.location.pathname === '/login') {
        setPage('dashboard');
        window.history.replaceState({}, '', '/dashboard');
      }
    }
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPage(PATH_TO_PAGE[window.location.pathname] || 'login');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPage = (nextPage) => {
    setPage(nextPage);

    if (typeof window === 'undefined') {
      return;
    }

    const nextPath = PAGE_TO_PATH[nextPage] || '/';
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
  };

  const logout = () => {
    stopTokenRefreshTimer();
    clearSession();
    setUser(null);
    navigateToPage('login');
  };

  const renderProtectedPage = (pageName, Component) => {
    // If there is no user data, session might be invalid
    if (!user) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Session Expired</h2>
          <p className="text-gray-500">Please log in again.</p>
          <button
            type="button"
            onClick={logout}
            className="rounded-md bg-[#7C3AED] px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-[#6D28D9]"
          >
            Go to Login
          </button>
        </div>
      );
    }

    return <Component onLogout={logout} onNavigate={navigateToPage} user={user} />;
  };

  if (page === 'dashboard') return renderProtectedPage('dashboard', DashboardPage);
  if (page === 'billing') return renderProtectedPage('billing', BillingPage);
  if (page === 'inventory') return renderProtectedPage('inventory', InventoryPage);
  if (page === 'itemRequest') return renderProtectedPage('itemRequest', ItemRequestPage);
  if (page === 'salesReport') return renderProtectedPage('salesReport', SalesReportPage);
  if (page === 'users') return renderProtectedPage('users', UsersPage);
  if (page === 'settings') return renderProtectedPage('settings', SettingsPage);

  if (isAppPage(page)) {
    return <CommonAppPage page={page} onLogout={logout} onNavigate={navigateToPage} user={user} />;
  }

  return (
    <AuthPage
      mode={page}
      onShowLogin={() => navigateToPage('login')}
      onShowRegister={() => setPage('register')}
      onLogin={() => {
        setUser(getStoredUser());
        navigateToPage('dashboard');
      }}
    />
  );
}

export default App;
