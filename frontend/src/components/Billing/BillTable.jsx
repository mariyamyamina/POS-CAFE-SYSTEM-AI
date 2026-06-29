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
            {items.map((item) => {
              const imageUrl = item.image;

              return (
                <div
                  key={item.id}
                  className="group grid grid-cols-[2fr_0.75fr_1fr_1fr] items-center gap-2 px-4 py-1 transition-colors hover:bg-text-50"
                >
                  <div className="flex min-w-0 items-center gap-3 pr-2">
                    {imageUrl && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#F4F5F9] overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={item.name} 
                          className="h-8 w-8 object-contain object-center"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="block truncate text-[11px] font-semibold text-text-900 pt-1">{item.name}</span>
                      <span className="text-[10px] font-medium text-text-400">{item.id % 100}</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex h-7 w-8 items-center justify-center rounded-md border border-text-200 text-xs font-bold text-text-900">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="text-right text-[11px] font-semibold text-text-600">₹{item.unitPrice.toFixed(2)}</div>
                  <div className="relative pr-6 text-right text-[11px] font-bold text-text-900">
                    ₹{(item.quantity * item.unitPrice).toFixed(2)}
                    <button
                      onClick={() => onRemoveItem && onRemoveItem(item.id)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-text-400 transition-colors hover:text-[#EF4444]"
                      type="button"
                      aria-label={`Remove ${item.name}`}
                    >
                      <icons.trash className="h-[13px] w-[13px]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="mx-3 mb-3 mt-1 flex shrink-0 items-start gap-2 rounded-lg border border-[#E0DAFA] bg-[#F5F3FF] px-3 py-2.5">
          <icons.info className="mt-[1px] h-4 w-4 shrink-0 text-primary" />
          <p className="text-[9px] leading-[1.5] text-primary">
            Click item to create billing entry. If item already exists, quantity will increase. Cancel
            removes last item. <span className="font-bold">Delete All</span> clears data. Main menu redirects to home screen.
          </p>
        </div>
      )}
    </div>
  );
};

export default BillTable;
