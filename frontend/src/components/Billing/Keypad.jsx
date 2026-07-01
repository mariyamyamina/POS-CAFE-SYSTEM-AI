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
    if (key === 'backspace') { updateFn(activeVal.slice(0, -1)); return; }
    if (activeVal.length < 8) updateFn(activeVal + key);
  };

  const handleAC = () => {
    const updateFn = activeField === "table" ? onTableNumberChange
      : activeField === "covers" ? onCoversChange : onItemNumberChange;
    if (updateFn) updateFn("");
  };

  const handleClearAll = () => {
    if (onTableNumberChange) onTableNumberChange("");
    if (onCoversChange) onCoversChange("");
    if (onItemNumberChange) onItemNumberChange("");
    if (onQuantityChange) onQuantityChange(1);
  };

 
  return (
    <div className="flex-shrink-0 pt-1.5 sm:pt-2 pl-2 sm:pl-3 pr-2 overflow-hidden" style={{ background: '#F9FAFB' }}>
      <div className="bg-white rounded-md p-1.5 sm:p-2 pt-2 sm:pt-3 flex flex-col gap-1.5 sm:gap-2 overflow-hidden">

        <div className="grid grid-cols-12 gap-1.5 sm:gap-2">

          {/* LEFT CONTENT */}
          <div className="col-span-10 flex flex-col gap-1.5 sm:gap-2">

            {/* Row 1: Item number + Qty */}
            <div className="grid grid-cols-12 gap-1.5 sm:gap-2">

              {/* Item Number */}
              <div className="col-span-7">
                <label className="block text-[9px] sm:text-[10px] font-semibold text-text mb-0.5 sm:mb-1">
                  Item Number
                </label>
                <div className="relative">
                  <input
                    ref={itemRef}
                    type="text"
                    placeholder="Scan / Enter item number"
                    value={itemNumber}
                    onFocus={() => onActiveFieldChange && onActiveFieldChange("item")}
                    onChange={(e) => onItemNumberChange && onItemNumberChange(e.target.value)}
                    className="w-full h-7 sm:h-8 rounded-md border border-gray-200 bg-white px-2 pr-7 text-[9px] sm:text-[10px] focus:outline-none placeholder:text-primary"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <icons.barcode />
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="col-span-5">
                <label className="block text-[9px] sm:text-[10px] font-semibold text-text mb-0.5 sm:mb-1">
                  Quantity
                </label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => onQuantityChange && onQuantityChange(Math.max(1, quantity - 1))}
                    type="button"
                    className="h-7 sm:h-8 rounded-md bg-gray-50 hover:bg-gray-100 text-[10px] font-bold"
                  >
                    −
                  </button>
                  <div
                    onClick={() => onActiveFieldChange && onActiveFieldChange("quantity")}
                    className={`h-7 sm:h-8 rounded-md border flex items-center justify-center text-[9px] sm:text-[10px] font-semibold cursor-pointer
                      ${activeField === 'quantity' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}
                  >
                    {quantity}
                  </div>
                  <button
                    onClick={() => onQuantityChange && onQuantityChange(quantity + 1)}
                    type="button"
                    className="h-7 sm:h-8 rounded-md bg-gray-50 hover:bg-gray-100 text-[10px] font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Table/Cover inputs + Numpad */}
            <div className="grid grid-cols-12 gap-1.5 sm:gap-2">

              {/* Inputs */}
              <div className="col-span-6 flex flex-col gap-1 sm:gap-2">
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-semibold text-text mb-0.5 sm:mb-1 mt-1 sm:mt-2">
                    Table No
                  </label>
                  <input
                    ref={tableRef}
                    type="text"
                    placeholder="Enter table no"
                    value={tableNumber}
                    onFocus={() => onActiveFieldChange && onActiveFieldChange("table")}
                    onChange={(e) => onTableNumberChange && onTableNumberChange(e.target.value)}
                    className="w-full h-7 sm:h-8 rounded-md border border-gray-200 bg-white px-2 text-[9px] sm:text-[10px] focus:outline-none placeholder:text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-semibold text-text mb-0.5 sm:mb-1 mt-1 sm:mt-2">
                    No of Cover
                  </label>
                  <input
                    ref={coversRef}
                    type="text"
                    placeholder="Enter no of cover"
                    value={covers}
                    onFocus={() => onActiveFieldChange && onActiveFieldChange("covers")}
                    onChange={(e) => onCoversChange && onCoversChange(e.target.value)}
                    className="w-full h-7 sm:h-8 rounded-md border border-gray-200 bg-white px-2 text-[9px] sm:text-[10px] focus:outline-none placeholder:text-primary"
                  />
                </div>
              </div>

              {/* Numpad grid */}
              <div className="col-span-6">
                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                  <button onClick={() => handleKeyPress('7')} type="button" className="w-full h-6 sm:h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-[9px] sm:text-[10px] font-bold text-text">7</button>
                  <button onClick={() => handleKeyPress('8')} type="button" className="w-full h-6 sm:h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-[9px] sm:text-[10px] font-bold text-text">8</button>
                  <button onClick={() => handleKeyPress('9')} type="button" className="w-full h-6 sm:h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-[9px] sm:text-[10px] font-bold text-text">9</button>

                  <button onClick={() => handleKeyPress('4')} type="button" className="w-full h-6 sm:h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-[9px] sm:text-[10px] font-bold text-text">4</button>
                  <button onClick={() => handleKeyPress('5')} type="button" className="w-full h-6 sm:h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-[9px] sm:text-[10px] font-bold text-text">5</button>
                  <button onClick={() => handleKeyPress('6')} type="button" className="w-full h-6 sm:h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-[9px] sm:text-[10px] font-bold text-text">6</button>

                  <button onClick={() => handleKeyPress('1')} type="button" className="w-full h-6 sm:h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-[9px] sm:text-[10px] font-bold text-text">1</button>
                  <button onClick={() => handleKeyPress('2')} type="button" className="w-full h-6 sm:h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-[9px] sm:text-[10px] font-bold text-text">2</button>
                  <button onClick={() => handleKeyPress('3')} type="button" className="w-full h-6 sm:h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-[9px] sm:text-[10px] font-bold text-text">3</button>

                  <button onClick={() => handleKeyPress('0')} type="button" className="w-full h-6 sm:h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-[9px] sm:text-[10px] font-bold text-text">0</button>
                  <button onClick={() => handleKeyPress('.')} type="button" className="w-full h-6 sm:h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-[9px] sm:text-[10px] font-bold text-text">.</button>
                  <button onClick={() => handleKeyPress('backspace')} type="button" className="w-full h-6 sm:h-7 rounded-md bg-gray-50 hover:bg-gray-100 text-[9px] sm:text-[10px] font-bold text-text">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                      <line x1="18" y1="9" x2="12" y2="15" />
                      <line x1="12" y1="9" x2="18" y2="15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Add / AC / Clear */}
          <div className="col-span-2 flex flex-col gap-1.5 sm:gap-2 pt-4 sm:pt-5">
            <button onClick={onAdd} type="button" className="w-full h-7 sm:h-8 rounded-md text-white text-[9px] sm:text-[10px] font-semibold" style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
              Add
            </button>
            <button onClick={handleAC} type="button" className="w-full h-7 sm:h-8 rounded-md text-white text-[9px] sm:text-[10px] font-semibold" style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
              AC
            </button>
            <button onClick={handleClearAll} type="button" className="w-full h-7 sm:h-8 rounded-md text-white text-[9px] sm:text-[10px] font-semibold" style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
              Clear
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Keypad;