import React, { useEffect, useState } from 'react';
import AuthPage from './pages/AuthPage';
import BillingPage from './pages/BillingPage';
import InventoryPage from './pages/InventoryPage';
import ItemRequestPage from './pages/ItemRequestPage';
import SalesReportPage from './pages/SalesReportPage';
import CommonAppPage from './pages/CommonAppPage';
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

  const logout = () => navigateToPage('login');

  if (page === 'billing') {
    return <BillingPage onLogout={logout} onNavigate={navigateToPage} />;
  }

  if (page === 'inventory') {
    return <InventoryPage onLogout={logout} onNavigate={navigateToPage} />;
  }

  if (page === 'itemRequest') {
    return <ItemRequestPage onLogout={logout} onNavigate={navigateToPage} />;
  }

  if (page === 'salesReport') {
    return <SalesReportPage onLogout={logout} onNavigate={navigateToPage} />;
  }

  if (isAppPage(page)) {
    return <CommonAppPage page={page} onLogout={logout} onNavigate={navigateToPage} />;
  }

  return (
    <AuthPage
      mode={page}
      onShowLogin={() => navigateToPage('login')}
      onShowRegister={() => setPage('register')}
      onLogin={() => navigateToPage('billing')}
    />
  );
}

export default App;
