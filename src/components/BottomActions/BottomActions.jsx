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
  const purpleButton = "flex min-h-[43px] items-center justify-center bg-[#7C35EA] text-white transition-colors hover:bg-[#6D28D9]";
  const tealButton = "flex min-h-[43px] flex-col items-center justify-center bg-[#36AFA6] px-1 text-center text-white transition-colors hover:bg-[#299C94]";
  const orangeButton = "flex min-h-[43px] items-center justify-center gap-2 bg-[#FF973E] px-2 text-white transition-colors hover:bg-[#ED842F]";

  return (
    <div className="w-full shrink-0 bg-[#F8F8FB] px-3 pb-3 text-white select-none lg:px-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="grid overflow-hidden rounded-md md:col-span-5 md:grid-cols-[76px_92px_1fr]">
          <button onClick={onNewBill} type="button" className={`${purpleButton} flex-col border-r border-white/15`}>
            <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
              <icons.plus className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-semibold">New Bill</span>
          </button>

          <button type="button" className={`${purpleButton} flex-col border-r border-white/15`}>
            <icons.fileText className="mb-1 h-5 w-5" />
            <span className="text-center text-[10px] font-semibold leading-tight">Price<br />Amendment</span>
          </button>

          <div className="grid grid-cols-3 grid-rows-2">
            {[
              { label: '₹2', value: 2 },
              { label: '₹5', value: 5 },
              { label: '₹10', value: 10 },
              { label: '₹20', value: 20 },
              { label: '₹50', value: 50 },
            ].map((q) => (
              <button
                key={q.value}
                type="button"
                className={`${purpleButton} border-r border-t border-white/15 text-sm font-bold`}
              >
                {q.label}
              </button>
            ))}
            <button
              type="button"
              className={`${purpleButton} flex-col border-t border-white/15 px-1`}
            >
              <icons.gift className="mb-0.5 h-4 w-4" />
              <span className="text-[9px] font-semibold leading-tight">Gift Voucher</span>
            </button>
          </div>
        </div>

        <div className="grid overflow-hidden rounded-md md:col-span-2 md:grid-cols-2">
          <button type="button" className={`${tealButton} border-r border-b border-white/15`}>
            <icons.fileText className="mb-1 h-4 w-4" />
            <span className="text-[9px] font-semibold leading-tight">Open Cash<br />Box</span>
          </button>
          <button type="button" className={`${tealButton} border-b border-white/15`}>
            <icons.rotateCcw className="mb-1 h-4 w-4" />
            <span className="text-[9px] font-semibold leading-tight">Goods<br />Return</span>
          </button>
          <button type="button" className={`${tealButton} border-r border-white/15`}>
            <icons.close className="mb-1 h-4 w-4" />
            <span className="text-[9px] font-semibold leading-tight">Cancel<br />Item</span>
          </button>
          <button type="button" className={tealButton}>
            <icons.plus className="mb-1 h-4 w-4" />
            <span className="text-[9px] font-semibold leading-tight">Add<br />Item</span>
          </button>
        </div>

        <div className="grid overflow-hidden rounded-md md:col-span-5 md:grid-rows-2">
          <div className="grid grid-cols-4">
            <button type="button" className={`${orangeButton} border-r border-white/20`}>
              <icons.close className="h-4 w-4 shrink-0" />
              <span className="text-[9px] font-semibold leading-tight">Terminate<br />Transaction</span>
            </button>
            <button type="button" className={`${orangeButton} border-r border-white/20`}>
              <icons.printer className="h-4 w-4 shrink-0" />
              <span className="text-[9px] font-semibold">Print</span>
            </button>
            <button type="button" className={`${orangeButton} border-r border-white/20`}>
              <icons.itemRequest className="h-4 w-4 shrink-0" />
              <span className="text-[9px] font-semibold leading-tight">Reserved<br />Transaction</span>
            </button>
            <button type="button" className={orangeButton}>
              <icons.trash className="h-4 w-4 shrink-0" />
              <span className="text-[9px] font-semibold leading-tight">Delete All<br />Transaction</span>
            </button>
          </div>
          <div className="grid grid-cols-2 border-t border-white/20">
            <button type="button" className={`${orangeButton} border-r border-white/20`}>
              <icons.rotateCcw className="h-4 w-4 shrink-0" />
              <span className="text-[9px] font-semibold">Restore</span>
            </button>
            <button type="button" className={orangeButton}>
              <icons.home className="h-4 w-4 shrink-0" />
              <span className="text-[9px] font-semibold">Main Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomActions;
