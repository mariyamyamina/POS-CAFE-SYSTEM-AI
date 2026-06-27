import React from 'react';
import { icons } from '../../constants/icons';

const BillTable = ({ items = [], onRemoveItem, onUpdateQuantity }) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-text-100 bg-white">
      <div className="grid grid-cols-[2fr_0.75fr_1fr_1fr] border-b border-text-100 px-4 py-3 text-[12px] font-bold text-text-700">
        <div>Item</div>
        <div className="text-center">Qty</div>
        <div className="text-right">Unit Price</div>
        <div className="text-right">Total</div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#F2F1F6] text-primary">
              <icons.itemRequest className="h-6 w-6" />
            </div>
            <h3 className="text-[17px] font-bold text-text-700">No items added yet</h3>
            <p className="mt-2 text-[12px] font-medium text-text-500">
              Select items from the menu to add to the bill
            </p>
          </div>
        ) : (
          <div className="divide-y divide-text-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="group grid grid-cols-[2fr_0.75fr_1fr_1fr] items-center px-4 py-3 transition-colors hover:bg-text-50"
              >
                <div className="min-w-0 pr-2">
                  <span className="block truncate text-sm font-semibold text-text-900">{item.name}</span>
                  <span className="text-[10px] text-text-400">Code #{item.id}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.quantity - 1)}
                    className="flex h-5 w-5 items-center justify-center rounded bg-[#F2F3F8] text-xs font-bold"
                    type="button"
                  >
                    -
                  </button>
                  <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.quantity + 1)}
                    className="flex h-5 w-5 items-center justify-center rounded bg-[#F2F3F8] text-xs font-bold"
                    type="button"
                  >
                    +
                  </button>
                </div>
                <div className="text-right text-xs font-medium text-text-400">₹{item.unitPrice.toFixed(2)}</div>
                <div className="relative pr-5 text-right text-sm font-bold text-text-900">
                  ₹{(item.quantity * item.unitPrice).toFixed(2)}
                  <button
                    onClick={() => onRemoveItem && onRemoveItem(item.id)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#EF4444] opacity-0 transition-opacity group-hover:opacity-100"
                    type="button"
                    aria-label={`Remove ${item.name}`}
                  >
                    <icons.trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillTable;
