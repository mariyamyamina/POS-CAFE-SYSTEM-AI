import React, { useRef } from 'react';
import { icons } from '../../constants/icons';

const Keypad = ({
  tableNumber = "",
  onTableNumberChange,
  covers = "",
  onCoversChange,
  itemNumber = "",
  onItemNumberChange,
  quantity = 1,
  onQuantityChange,
  onAdd,
  activeField = "item",
  onActiveFieldChange,
}) => {
  const tableRef = useRef(null);
  const coversRef = useRef(null);
  const itemRef = useRef(null);

  const handleKeyPress = (key) => {
    let activeVal, updateFn;
    if (activeField === "table") {
      activeVal = tableNumber;
      updateFn = onTableNumberChange;
    } else if (activeField === "covers") {
      activeVal = covers;
      updateFn = onCoversChange;
    } else {
      activeVal = itemNumber;
      updateFn = onItemNumberChange;
    }

    if (!updateFn) return;
    if (key === 'backspace') {
      updateFn(activeVal.slice(0, -1));
      return;
    }
    if (activeVal.length < 8) updateFn(activeVal + key);
  };

  const handleAC = () => {
    let updateFn;
    if (activeField === "table") {
      updateFn = onTableNumberChange;
    } else if (activeField === "covers") {
      updateFn = onCoversChange;
    } else {
      updateFn = onItemNumberChange;
    }
    if (updateFn) updateFn("");
  };

  const handleClearLast = () => {
    let activeVal, updateFn;
    if (activeField === "table") {
      activeVal = tableNumber;
      updateFn = onTableNumberChange;
    } else if (activeField === "covers") {
      activeVal = covers;
      updateFn = onCoversChange;
    } else {
      activeVal = itemNumber;
      updateFn = onItemNumberChange;
    }
    if (updateFn) updateFn(activeVal.slice(0, -1));
  };

  const inputClass = (field) => `h-8 w-full rounded-md border px-3 text-[10px] font-medium outline-none transition-all placeholder:text-[#7A55F4] ${
    activeField === field ? 'border-[#7C3AED] bg-white' : 'border-[#DEE2EC] bg-white'
  }`;

  return (
    <div className="rounded-md bg-white px-2 pb-2">
      <div className="grid grid-cols-[1fr_122px_68px] gap-2">
        <div className="flex flex-col gap-2 mt-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#2F3470]">Item Number</label>
            <div className="relative">
              <input
                ref={itemRef}
                type="text"
                placeholder="Scan / Enter item number"
                value={itemNumber}
                onFocus={() => onActiveFieldChange && onActiveFieldChange("item")}
                onChange={(e) => onItemNumberChange && onItemNumberChange(e.target.value)}
                className="h-8 w-full rounded-md border border-[#DEE2EC] bg-white pl-3 pr-9 text-[10px] font-medium text-[#10112B] outline-none transition-all placeholder:text-[#7A55F4] focus:border-[#7C3AED]"
              />
              <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[#10112B]">
                <icons.barcode className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className='mt-3'>
            <label className="mb-1 block text-[11px] font-semibold text-[#2F3470]">Table No</label>
            <input
              ref={tableRef}
              type="text"
              placeholder="Enter table no"
              value={tableNumber}
              onFocus={() => onActiveFieldChange && onActiveFieldChange("table")}
              onChange={(e) => onTableNumberChange && onTableNumberChange(e.target.value)}
              className={inputClass("table")}
            />
          </div>

          <div className='mt-3'>
            <label className="mb-1 block text-[11px] font-semibold text-[#2F3470]">No of Cover</label>
            <input
              ref={coversRef}
              type="text"
              placeholder="Enter no of cover"
              value={covers}
              onFocus={() => onActiveFieldChange && onActiveFieldChange("covers")}
              onChange={(e) => onCoversChange && onCoversChange(e.target.value)}
              className={inputClass("covers")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#2F3470]">Quantity</label>
            <div className="grid h-8 grid-cols-3 gap-1">
              <button
                onClick={() => onQuantityChange && onQuantityChange(Math.max(1, quantity - 1))}
                className="rounded-md bg-[#F4F5F9] text-xs font-bold text-[#111333] transition-colors hover:bg-[#ECEEF5]"
                type="button"
              >
                -
              </button>
              <div className="flex items-center justify-center rounded-md border border-[#DEE2EC] bg-white text-xs font-bold text-[#111333]">
                {quantity}
              </div>
              <button
                onClick={() => onQuantityChange && onQuantityChange(quantity + 1)}
                className="rounded-md bg-[#F4F5F9] text-xs font-bold text-[#111333] transition-colors hover:bg-[#ECEEF5]"
                type="button"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => handleKeyPress('7')}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-[#151746] transition-colors hover:bg-[#ECEEF5]"
            >
              7
            </button>
            <button
              onClick={() => handleKeyPress('8')}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-[#151746] transition-colors hover:bg-[#ECEEF5]"
            >
              8
            </button>
            <button
              onClick={() => handleKeyPress('9')}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-[#151746] transition-colors hover:bg-[#ECEEF5]"
            >
              9
            </button>
            <button
              onClick={() => handleKeyPress('4')}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-[#151746] transition-colors hover:bg-[#ECEEF5]"
            >
              4
            </button>
            <button
              onClick={() => handleKeyPress('5')}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-[#151746] transition-colors hover:bg-[#ECEEF5]"
            >
              5
            </button>
            <button
              onClick={() => handleKeyPress('6')}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-[#151746] transition-colors hover:bg-[#ECEEF5]"
            >
              6
            </button>
            <button
              onClick={() => handleKeyPress('1')}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-[#151746] transition-colors hover:bg-[#ECEEF5]"
            >
              1
            </button>
            <button
              onClick={() => handleKeyPress('2')}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-[#151746] transition-colors hover:bg-[#ECEEF5]"
            >
              2
            </button>
            <button
              onClick={() => handleKeyPress('3')}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-[#151746] transition-colors hover:bg-[#ECEEF5]"
            >
              3
            </button>
            <button
              onClick={() => handleKeyPress('0')}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-[#151746] transition-colors hover:bg-[#ECEEF5]"
            >
              0
            </button>
            <button
              onClick={() => handleKeyPress('.')}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-[#151746] transition-colors hover:bg-[#ECEEF5]"
            >
              .
            </button>
            <button
              onClick={() => handleKeyPress('backspace')}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] transition-colors hover:bg-[#ECEEF5]"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-5 mt-3">
           <button
            onClick={onAdd}
            type="button"
            className="h-8 rounded-md bg-[#6230EA] text-[11px] font-bold text-white transition-colors hover:bg-[#5528D4]"
          >
            Add
          </button>
          <button
            onClick={handleAC}
            type="button"
            className="h-8 rounded-md bg-[#6230EA] text-xs font-bold text-white transition-colors hover:bg-[#5528D4]"
          >
            AC
          </button>
          <button
            onClick={handleClearLast}
            type="button"
            className="h-8 rounded-md bg-[#6230EA] text-[11px] font-bold text-white transition-colors hover:bg-[#5528D4]"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default Keypad;
