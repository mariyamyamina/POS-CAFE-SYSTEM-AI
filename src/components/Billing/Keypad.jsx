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

  const handleClearLast = () => {
    const activeVal = activeField === "table" ? tableNumber
      : activeField === "covers" ? covers : itemNumber;
    const updateFn = activeField === "table" ? onTableNumberChange
      : activeField === "covers" ? onCoversChange : onItemNumberChange;
    if (updateFn) updateFn(activeVal.slice(0, -1));
  };

  const inputCls = (field) =>
    `h-8 w-full rounded-md border px-3 text-[10px] font-medium outline-none transition-all placeholder:text-text-400 ${
      activeField === field ? 'border-primary' : 'border-text-200'
    } bg-white`;

  const numBtn = "flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-text-800 transition-colors hover:bg-[#ECEEF5]";
  const actionBtn = "flex h-8 w-full items-center justify-center rounded-md bg-primary text-[11px] font-bold text-white transition-colors hover:bg-primary-700";

  return (
    <div className="rounded-md bg-white px-3 py-3">
      {/*
        Layout breakdown (matches image exactly):
        - Col 1 [1fr]:   labels + inputs (Item Number, Table No, No of Cover)
        - Col 2 [130px]: Quantity label + (-, qty, +) + numpad rows (7-9, 4-6, 1-3, 0-.-⌫)
        - Col 3 [62px]:  Add, AC, Clear buttons
      */}
      <div className="grid grid-cols-[1fr_130px_62px] gap-x-3">

        {/* ── Col 1: Inputs ── */}
        <div className="flex flex-col">
          {/* Item Number — aligns with Quantity label + qty row */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-text-700">Item Number</label>
            <div className="relative">
              <input
                ref={itemRef}
                type="text"
                placeholder="Scan / Enter item number"
                value={itemNumber}
                onFocus={() => onActiveFieldChange && onActiveFieldChange("item")}
                onChange={(e) => onItemNumberChange && onItemNumberChange(e.target.value)}
                className="h-8 w-full rounded-md border border-text-200 bg-white pl-3 pr-8 text-[10px] font-medium text-text-900 outline-none transition-all placeholder:text-text-400 focus:border-primary"
              />
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-text-500">
                <icons.barcode className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Table No — aligns with 7-8-9 row */}
          <div className="mt-[15px]">
            <label className="mb-1 block text-[11px] font-semibold text-text-700">Table No</label>
            <input
              ref={tableRef}
              type="text"
              placeholder="Enter table no"
              value={tableNumber}
              onFocus={() => onActiveFieldChange && onActiveFieldChange("table")}
              onChange={(e) => onTableNumberChange && onTableNumberChange(e.target.value)}
              className={inputCls("table")}
            />
          </div>

          {/* No of Cover — aligns with 4-5-6 row */}
          <div className="mt-[15px]">
            <label className="mb-1 block text-[11px] font-semibold text-text-700">No of Cover</label>
            <input
              ref={coversRef}
              type="text"
              placeholder="Enter no of cover"
              value={covers}
              onFocus={() => onActiveFieldChange && onActiveFieldChange("covers")}
              onChange={(e) => onCoversChange && onCoversChange(e.target.value)}
              className={inputCls("covers")}
            />
          </div>
        </div>

        {/* ── Col 2: Quantity + Numpad ── */}
        <div className="flex flex-col gap-[5px]">
          {/* Quantity label + -/qty/+ row */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-text-700">Quantity</label>
            <div className="grid h-8 grid-cols-3 gap-1">
              <button
                onClick={() => onQuantityChange && onQuantityChange(Math.max(1, quantity - 1))}
                className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-sm font-bold text-text-900 transition-colors hover:bg-[#ECEEF5]"
                type="button"
              >−</button>
              <div className="flex h-8 items-center justify-center rounded-md border border-text-200 bg-white text-xs font-bold text-text-900">
                {quantity}
              </div>
              <button
                onClick={() => onQuantityChange && onQuantityChange(quantity + 1)}
                className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-sm font-bold text-text-900 transition-colors hover:bg-[#ECEEF5]"
                type="button"
              >+</button>
            </div>
          </div>

          {/* 7 8 9 */}
          <div className="grid grid-cols-3 gap-1">
            <button onClick={() => handleKeyPress('7')} type="button" className={numBtn}>7</button>
            <button onClick={() => handleKeyPress('8')} type="button" className={numBtn}>8</button>
            <button onClick={() => handleKeyPress('9')} type="button" className={numBtn}>9</button>
          </div>

          {/* 4 5 6 */}
          <div className="grid grid-cols-3 gap-1">
            <button onClick={() => handleKeyPress('4')} type="button" className={numBtn}>4</button>
            <button onClick={() => handleKeyPress('5')} type="button" className={numBtn}>5</button>
            <button onClick={() => handleKeyPress('6')} type="button" className={numBtn}>6</button>
          </div>

          {/* 1 2 3 */}
          <div className="grid grid-cols-3 gap-1">
            <button onClick={() => handleKeyPress('1')} type="button" className={numBtn}>1</button>
            <button onClick={() => handleKeyPress('2')} type="button" className={numBtn}>2</button>
            <button onClick={() => handleKeyPress('3')} type="button" className={numBtn}>3</button>
          </div>

          {/* 0 . ⌫ */}
          <div className="grid grid-cols-3 gap-1">
            <button onClick={() => handleKeyPress('0')} type="button" className={numBtn}>0</button>
            <button onClick={() => handleKeyPress('.')} type="button" className={numBtn}>.</button>
            <button onClick={() => handleKeyPress('backspace')} type="button" className={numBtn}>
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Col 3: Add / AC / Clear ── */}
        {/* mt pushes buttons down to align: Add→qty row, AC→7-8-9, Clear→4-5-6 */}
        <div className="flex flex-col gap-[5px] mt-[19px]">
          <button onClick={onAdd} type="button" className={actionBtn}>Add</button>
          <button onClick={handleAC} type="button" className={actionBtn}>AC</button>
          <button onClick={handleClearLast} type="button" className={actionBtn}>Clear</button>
        </div>

      </div>
    </div>
  );
};

export default Keypad;
