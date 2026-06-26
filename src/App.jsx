import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';
import BillingPage from './pages/BillingPage';

function App() {
  const [page, setPage] = useState('login');

  if (page === 'billing') {
    return <BillingPage onLogout={() => setPage('login')} />;
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
