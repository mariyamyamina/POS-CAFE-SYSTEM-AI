import React from 'react';
import { icons } from '../../constants/icons';

const BottomActions = ({
  onNewBill,
  onPriceAmendment,
  onQuickAdd,
  onGiftVoucher,
  onOpenCashBox,
  onGoodsReturn,
  onCancelItem,
  onAddItem,
  onTerminateTransaction,
  onPrint,
  onReservedTransaction,
  onDeleteAllTransaction,
  onRestore,
  onMainMenu,
}) => {
  const teal   = 'flex flex-col items-center justify-center gap-0.5 bg-[#36AFA6] text-white transition-colors hover:bg-[#2E9990]';
  const orange = 'flex flex-row items-center justify-center gap-1.5 bg-[#FF973E] text-white transition-colors hover:bg-[#F08530]';

  return (
    <div className="w-full shrink-0 select-none">

      {/* ══════════════════════════════════
          MOBILE layout  (< lg)
          Stacked sections, fully visible
         ══════════════════════════════════ */}
      <div className="lg:hidden">

        {/* ── Purple section ── */}
        <div className="m-2">
          {/* Row 1: New Bill | Price Amendment */}
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={onNewBill}
              className={`${purple} min-h-[60px] border-r border-b border-white/20`}
            >
              <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
                <icons.plus className="h-4 w-4" />
              </span>
              <span className="text-[11px] font-semibold">New Bill</span>
            </button>

            <button
              type="button"
              onClick={onPriceAmendment}
              className={`${purple} min-h-[60px] border-b border-white/20`}
            >
              <icons.fileText className="mb-1 h-5 w-5" />
              <span className="text-center text-[10px] font-semibold leading-tight">Price<br />Amendment</span>
            </button>
          </div>

          {/* Row 2: ₹2 | ₹5 | ₹10 */}
          <div className="grid grid-cols-3">
            {[{ label: '₹2', value: 2 }, { label: '₹5', value: 5 }, { label: '₹10', value: 10 }].map((q, i) => (
              <button
                key={q.value}
                type="button"
                onClick={() => onQuickAdd && onQuickAdd(q.value)}
                className={`${purple} min-h-[48px] text-[14px] font-bold border-b border-white/20 ${i < 2 ? 'border-r border-white/20' : ''}`}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Row 3: ₹20 | ₹50 | Gift Voucher */}
          <div className="grid grid-cols-3">
            {[{ label: '₹20', value: 20 }, { label: '₹50', value: 50 }].map((q, i) => (
              <button
                key={q.value}
                type="button"
                onClick={() => onQuickAdd && onQuickAdd(q.value)}
                className={`${purple} min-h-[48px] text-[14px] font-bold border-r border-white/20`}
              >
                {q.label}
              </button>
            ))}
            <button
              type="button"
              onClick={onGiftVoucher}
              className={`${purple} min-h-[48px]`}
            >
              <icons.gift className="mb-0.5 h-4 w-4" />
              <span className="text-[10px] font-semibold leading-tight">Gift<br />Voucher</span>
            </button>
          </div>
        </div>

        {/* ── Teal section ── */}
        <div className="m-2">
          {/* Row 1: Open Cash Box | Goods Return */}
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={onOpenCashBox}
              className={`${teal} min-h-[56px] border-r border-b border-white/20`}
            >
              <icons.fileText className="mb-0.5 h-5 w-5" />
              <span className="text-center text-[10px] font-semibold leading-tight">Open Cash<br />Box</span>
            </button>
            <button
              type="button"
              onClick={onGoodsReturn}
              className={`${teal} min-h-[56px] border-b border-white/20`}
            >
              <icons.rotateCcw className="mb-0.5 h-5 w-5" />
              <span className="text-center text-[10px] font-semibold leading-tight">Goods<br />Return</span>
            </button>
          </div>

          {/* Row 2: Cancel Item | Add Item */}
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={onCancelItem}
              className={`${teal} min-h-[52px] border-r border-white/20`}
            >
              <icons.close className="mb-0.5 h-5 w-5" />
              <span className="text-center text-[10px] font-semibold leading-tight">Cancel<br />Item</span>
            </button>
            <button
              type="button"
              onClick={onAddItem}
              className={`${teal} min-h-[52px]`}
            >
              <icons.plus className="mb-0.5 h-5 w-5" />
              <span className="text-center text-[10px] font-semibold leading-tight">Add<br />Item</span>
            </button>
          </div>
        </div>

        {/* ── Orange section ── */}
        <div className="m-2">
          {/* Row 1: Terminate | Print | Reserved | Delete All */}
          <div className="grid grid-cols-4">
            <button
              type="button"
              onClick={onTerminateTransaction}
              className={`${orange} min-h-[52px] flex-col border-r border-b border-white/20`}
            >
              <icons.close className="h-4 w-4 shrink-0" />
              <span className="text-center text-[9px] font-semibold leading-tight">Terminate<br />Transaction</span>
            </button>
            <button
              type="button"
              onClick={onPrint}
              className={`${orange} min-h-[52px] flex-col border-r border-b border-white/20`}
            >
              <icons.printer className="h-4 w-4 shrink-0" />
              <span className="text-[9px] font-semibold">Print</span>
            </button>
            <button
              type="button"
              onClick={onReservedTransaction}
              className={`${orange} min-h-[52px] flex-col border-r border-b border-white/20`}
            >
              <icons.itemRequest className="h-4 w-4 shrink-0" />
              <span className="text-center text-[9px] font-semibold leading-tight">Reserved<br />Transaction</span>
            </button>
            <button
              type="button"
              onClick={onDeleteAllTransaction}
              className={`${orange} min-h-[52px] flex-col border-b border-white/20`}
            >
              <icons.trash className="h-4 w-4 shrink-0" />
              <span className="text-center text-[9px] font-semibold leading-tight">Delete All<br />Transaction</span>
            </button>
          </div>

          {/* Row 2: Restore | Main Menu */}
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={onRestore}
              className={`${orange} min-h-[48px] border-r border-white/20`}
            >
              <icons.rotateCcw className="h-4 w-4 shrink-0" />
              <span className="text-[10px] font-semibold">Restore</span>
            </button>
            <button
              type="button"
              onClick={onMainMenu}
              className={`${orange} min-h-[48px]`}
            >
              <icons.home className="h-4 w-4 shrink-0" />
              <span className="text-[10px] font-semibold">Main Menu</span>
            </button>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════
          DESKTOP layout  (lg+)
          Original horizontal bar layout
         ══════════════════════════════════ */}
      <div className="hidden lg:block px-4 pb-3 bg-[#F8F8FB]">
        <div className="grid grid-cols-12 gap-3">

          {/* Purple block */}
          <div className="col-span-5 grid overflow-hidden rounded-md grid-cols-[76px_92px_1fr] ">
            <button onClick={onNewBill} type="button" className={`${purple} flex-col min-h-[43px] border-r border-white/15`}>
              <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
                <icons.plus className="h-5 w-5" />
              </span>
              <span className="text-[11px] font-semibold">New Bill</span>
            </button>
            <button onClick={onPriceAmendment} type="button" className={`${purple} flex-col min-h-[43px] border-r border-white/15`}>
              <icons.fileText className="mb-1 h-5 w-5" />
              <span className="text-center text-[10px] font-semibold leading-tight">Price<br />Amendment</span>
            </button>
            <div className="grid grid-cols-3 grid-rows-2">
              {[{ label: '₹2', value: 2 }, { label: '₹5', value: 5 }, { label: '₹10', value: 10 }, { label: '₹20', value: 20 }, { label: '₹50', value: 50 }].map((q) => (
                <button key={q.value} type="button" onClick={() => onQuickAdd && onQuickAdd(q.value)}
                  className={`${purple} border-r border-t border-white/15 text-sm font-bold`}>{q.label}</button>
              ))}
              <button type="button" onClick={onGiftVoucher} className={`${purple} flex-col border-t border-white/15 px-1`}>
                <icons.gift className="mb-0.5 h-4 w-4" />
                <span className="text-[9px] font-semibold leading-tight">Gift Voucher</span>
              </button>
            </div>
          </div>

          {/* Teal block */}
          <div className="col-span-2 grid overflow-hidden rounded-md grid-cols-2">
            <button type="button" onClick={onOpenCashBox} className={`${teal} flex-col min-h-[43px] border-r border-b border-white/15`}>
              <icons.fileText className="mb-1 h-4 w-4" />
              <span className="text-[9px] font-semibold leading-tight">Open Cash<br />Box</span>
            </button>
            <button type="button" onClick={onGoodsReturn} className={`${teal} flex-col min-h-[43px] border-b border-white/15`}>
              <icons.rotateCcw className="mb-1 h-4 w-4" />
              <span className="text-[9px] font-semibold leading-tight">Goods<br />Return</span>
            </button>
            <button type="button" onClick={onCancelItem} className={`${teal} flex-col border-r border-white/15`}>
              <icons.close className="mb-1 h-4 w-4" />
              <span className="text-[9px] font-semibold leading-tight">Cancel<br />Item</span>
            </button>
            <button type="button" onClick={onAddItem} className={`${teal} flex-col`}>
              <icons.plus className="mb-1 h-4 w-4" />
              <span className="text-[9px] font-semibold leading-tight">Add<br />Item</span>
            </button>
          </div>

          {/* Orange block */}
          <div className="col-span-5 grid overflow-hidden rounded-md grid-rows-2">
            <div className="grid grid-cols-4">
              <button type="button" onClick={onTerminateTransaction} className={`${orange} min-h-[43px] border-r border-white/20`}>
                <icons.close className="h-4 w-4 shrink-0" />
                <span className="text-[9px] font-semibold leading-tight">Terminate<br />Transaction</span>
              </button>
              <button type="button" onClick={onPrint} className={`${orange} min-h-[43px] border-r border-white/20`}>
                <icons.printer className="h-4 w-4 shrink-0" />
                <span className="text-[9px] font-semibold">Print</span>
              </button>
              <button type="button" onClick={onReservedTransaction} className={`${orange} min-h-[43px] border-r border-white/20`}>
                <icons.itemRequest className="h-4 w-4 shrink-0" />
                <span className="text-[9px] font-semibold leading-tight">Reserved<br />Transaction</span>
              </button>
              <button type="button" onClick={onDeleteAllTransaction} className={`${orange} min-h-[43px]`}>
                <icons.trash className="h-4 w-4 shrink-0" />
                <span className="text-[9px] font-semibold leading-tight">Delete All<br />Transaction</span>
              </button>
            </div>
            <div className="grid grid-cols-2 border-t border-white/20">
              <button type="button" onClick={onRestore} className={`${orange} border-r border-white/20`}>
                <icons.rotateCcw className="h-4 w-4 shrink-0" />
                <span className="text-[9px] font-semibold">Restore</span>
              </button>
              <button type="button" onClick={onMainMenu} className={orange}>
                <icons.home className="h-4 w-4 shrink-0" />
                <span className="text-[9px] font-semibold">Main Menu</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default BottomActions;