import React from 'react';
import { icons } from '../../constants/icons';

const ItemEntry = ({
  itemNumber = "",
  onItemNumberChange,
  quantity = 1,
  onQuantityChange,
  onAdd
}) => {
  return (
    <div className="rounded-md bg-white p-2">
      <div className="grid grid-cols-[1fr_122px_68px] gap-2">
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#2F3470]">Item Number</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Scan / Enter item number"
              value={itemNumber}
              onChange={(e) => onItemNumberChange && onItemNumberChange(e.target.value)}
              className="h-8 w-full rounded-md border border-[#DEE2EC] bg-white pl-3 pr-9 text-[10px] font-medium text-[#10112B] outline-none transition-all placeholder:text-[#7A55F4] focus:border-[#7C3AED]"
            />
            <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[#10112B]">
              <icons.barcode className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#2F3470]">Quantity</label>
          <div className="grid h-8 grid-cols-3 gap-1">
            <button
              onClick={() => quantity > 1 && onQuantityChange(quantity - 1)}
              className="rounded-md bg-[#F4F5F9] text-xs font-bold text-[#111333] transition-colors hover:bg-[#ECEEF5]"
              type="button"
            >
              -
            </button>
            <div className="flex items-center justify-center rounded-md border border-[#DEE2EC] bg-white text-xs font-bold text-[#111333]">
              {quantity}
            </div>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="rounded-md bg-[#F4F5F9] text-xs font-bold text-[#111333] transition-colors hover:bg-[#ECEEF5]"
              type="button"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={onAdd}
            className="h-8 w-full rounded-md bg-[#6230EA] text-[11px] font-bold text-white transition-colors hover:bg-[#5528D4]"
            type="button"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemEntry;
