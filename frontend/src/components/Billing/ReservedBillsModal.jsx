import React, { useEffect, useState } from 'react';
import { icons } from '../../constants/icons';
import { reservedBillApi } from '../../api';

const ReservedBillsModal = ({ open, onClose, onRestore }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);

  useEffect(() => {
    if (open) loadBills();
  }, [open]);

  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await reservedBillApi.getReservedBills();
      setBills(data.filter((b) => !b.restored));
    } catch (error) {
      console.error('Failed to load reserved bills:', error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (bill) => {
    try {
      setRestoringId(bill.id);
      await reservedBillApi.restoreBill(bill.id);
      // Remove it from this list immediately
      setBills((prev) => prev.filter((b) => b.id !== bill.id));
      // Hand the items up to the parent so it can populate BillTable
      onRestore && onRestore(bill);
    } catch (error) {
      console.error('Failed to restore bill:', error);
    } finally {
      setRestoringId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h2 className="text-[17px] font-bold text-primary">Reserved Bills</h2>

        <div className="mt-3 max-h-[360px] overflow-y-auto divide-y divide-text-100 scrollbar-thin">
          {loading ? (
            <div className="py-8 text-center text-text-400 text-[12px]">Loading...</div>
          ) : bills.length === 0 ? (
            <div className="py-8 text-center text-text-400 text-[12px]">No reserved bills</div>
          ) : (
            bills.map((bill) => (
              <button
                key={bill.id}
                type="button"
                disabled={restoringId === bill.id}
                onClick={() => handleRestore(bill)}
                className="flex w-full items-center justify-between py-3 text-left hover:bg-text-50 disabled:opacity-50"
              >
                <div>
                  <p className="text-[13px] font-semibold text-text-900">BILL ID : {bill.id}</p>
                  <p className="text-[11px] text-text-400">
                    {restoringId === bill.id ? 'Restoring…' : 'Tap to restore'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-bold text-primary">₹{Number(bill.total).toFixed(2)}</span>
                  <icons.close className="h-4 w-4 text-red-500" />
                </div>
              </button>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-md bg-text-100 py-3 text-[14px] font-semibold text-text-700 hover:bg-text-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReservedBillsModal;