import React, { useRef } from 'react';

const Keypad = ({
  tableNumber = "",
  onTableNumberChange,
  covers = "",
  onCoversChange,
  activeField = "table",
  onActiveFieldChange,
}) => {
  const tableRef = useRef(null);
  const coversRef = useRef(null);
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', 'backspace'];

  const handleKeyPress = (key) => {
    const activeVal = activeField === "table" ? tableNumber : covers;
    const updateFn = activeField === "table" ? onTableNumberChange : onCoversChange;

    if (!updateFn) return;
    if (key === 'backspace') {
      updateFn(activeVal.slice(0, -1));
      return;
    }
    if (activeVal.length < 8) updateFn(activeVal + key);
  };

  const handleAC = () => {
    const updateFn = activeField === "table" ? onTableNumberChange : onCoversChange;
    if (updateFn) updateFn("");
  };

  const handleClearLast = () => {
    const activeVal = activeField === "table" ? tableNumber : covers;
    const updateFn = activeField === "table" ? onTableNumberChange : onCoversChange;
    if (updateFn) updateFn(activeVal.slice(0, -1));
  };

  const inputClass = (field) => `h-8 w-full rounded-md border px-3 text-[10px] font-medium outline-none transition-all placeholder:text-[#7A55F4] ${
    activeField === field ? 'border-[#7C3AED] bg-white' : 'border-[#DEE2EC] bg-white'
  }`;

  return (
    <div className="rounded-md bg-white px-2 pb-2">
      <div className="grid grid-cols-[1fr_176px_68px] gap-2">
        <div className="flex flex-col justify-between gap-2">
          <div>
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

          <div>
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

        <div className="grid grid-cols-3 gap-2">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              type="button"
              className="flex h-8 items-center justify-center rounded-md bg-[#F4F5F9] text-xs font-bold text-[#151746] transition-colors hover:bg-[#ECEEF5]"
            >
              {key === 'backspace' ? (
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              ) : key}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-5">
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
