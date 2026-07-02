import React from 'react';
import { icons } from '../../constants/icons';

const UnauthorizedAccess = ({ onReturnToDashboard, onLogout }) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-gray-50 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <icons.lock className="h-10 w-10 text-red-500" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Unauthorized Access</h2>
        <p className="mt-2 text-gray-500">
          You don't have permission to access this page.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onReturnToDashboard}
          className="rounded-md border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Return to Dashboard
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-md bg-[#7C3AED] px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-[#6D28D9]"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
