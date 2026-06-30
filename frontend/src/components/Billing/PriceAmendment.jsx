import React from 'react';
import { icons } from '../../constants/icons';

const GST_RATE = 0.07;

const PriceAmendment = ({ totalAmount = 0, tender, onTenderChange }) => {
  const gstAmount = totalAmount * GST_RATE;
  const payable = totalAmount + gstAmount;
  const tenderNum = parseFloat(tender) || 0;
  const change = tenderNum - payable;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-text-100 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-text-100 px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <icons.fileText className="h-4 w-4" />
        </div>
        <span className="text-[14px] font-bold text-text-900">Price Amendment</span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-0 overflow-y-auto px-4 py-4">
        {/* Total Amount Row */}
        <div className="flex items-center justify-between py-3 border-b border-text-100">
          <span className="text-[13px] text-text-500">Total Amount</span>
          <span className="text-[13px] font-semibold text-text-800">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>

        {/* GST Row */}
        <div className="flex items-center justify-between py-3 border-b border-text-100">
          <span className="text-[13px] text-text-500">GST Amount (7%)</span>
          <span className="text-[13px] font-semibold text-text-800">
            ₹{gstAmount.toFixed(2)}
          </span>
        </div>

        {/* Payable Row */}
        <div className="flex items-center justify-between py-4">
          <span className="text-[15px] font-bold text-text-900">Payable</span>
          <span className="text-[18px] font-bold text-primary">
            ₹{payable.toFixed(2)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-text-100 mb-4" />

        {/* Tender Input */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <label className="text-[13px] font-medium text-text-600 shrink-0">Tender</label>
          <div className="flex items-center gap-0 rounded-md border border-text-200 overflow-hidden">
            <span className="flex h-10 items-center justify-center bg-[#F8F9FB] px-3 text-[13px] font-semibold text-text-600 border-r border-text-200">
              ₹
            </span>
            <input
              type="number"
              min="0"
              placeholder="0.00"
              value={tender}
              onChange={(e) => onTenderChange(e.target.value)}
              className="h-10 w-28 bg-white px-3 text-[13px] font-semibold text-text-900 outline-none placeholder:text-text-300"
            />
          </div>
        </div>

        {/* Change / Balance Row */}
        <div className="flex items-center justify-between rounded-lg bg-[#F5F3FF] px-4 py-3">
          <span className="text-[13px] font-semibold text-text-700">Change(Balance)</span>
          <span className={`text-[16px] font-bold ${change < 0 ? 'text-red-500' : 'text-primary'}`}>
            ₹{(change < 0 ? 0 : change).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceAmendment;