import React, { useMemo, useState } from 'react';
import { icons } from '../../constants/icons';
import Sorting from '../common/Sorting';
import { salesApi } from '../../api';
import { printBill } from '../../utils/printBill';

const itemWiseHeaders = [
  { key: 'itemName', label: 'Item Name', sortable: true },
  { key: 'soldQuantity', label: 'Sold Quantity', sortable: true },
  { key: 'totalPrice', label: 'Total Price', sortable: true },
];

/**
 * @param {array} reports - flattened item-level rows from the sales report API,
 *   each carrying { id, sale_id, bill_no, itemName, soldQuantity, totalPrice }
 * @param {string} groupBy - 'item' | 'bill'
 * @param {object} settings - cafe settings, passed through to printBill (best-effort, can be null)
 */
const SalesReportTable = ({ reports, groupBy = 'item', settings }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [printingBillId, setPrintingBillId] = useState(null);

  const sortedReports = useMemo(() => {
    const source = [...(reports || [])];
    const { key, direction } = sortConfig;

    if (!key || groupBy !== 'item') {
      return source;
    }

    source.sort((a, b) => {
      const left = a[key];
      const right = b[key];

      if (typeof left === 'number' && typeof right === 'number') {
        return direction === 'asc' ? left - right : right - left;
      }

      const leftValue = String(left ?? '').toLowerCase();
      const rightValue = String(right ?? '').toLowerCase();
      if (leftValue < rightValue) return direction === 'asc' ? -1 : 1;
      if (leftValue > rightValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return source;
  }, [reports, sortConfig, groupBy]);

  // Groups flat item rows by sale_id, computing each bill's GST-inclusive
  // payable total from its line items (sum of totalPrice * 1.07).
  // ⚠️ GST_RATE here must stay in sync with PriceAmendment.jsx / handlePrint.
  const GST_RATE = 0.07;
  const billGroups = useMemo(() => {
    if (groupBy !== 'bill') return [];

    const groups = {};
    sortedReports.forEach((row) => {
      if (!groups[row.sale_id]) {
        groups[row.sale_id] = {
          saleId: row.sale_id,
          billNo: row.bill_no || `BILL-${row.sale_id}`,
          items: [],
          subtotal: 0,
        };
      }
      groups[row.sale_id].items.push(row);
      groups[row.sale_id].subtotal += Number(row.totalPrice);
    });

    return Object.values(groups)
      .map((g) => ({ ...g, payable: g.subtotal * (1 + GST_RATE) }))
      .sort((a, b) => b.saleId - a.saleId); // newest bill first
  }, [sortedReports, groupBy]);

  const handlePrintBill = async (saleId) => {
    setPrintingBillId(saleId);
    try {
      const sale = await salesApi.getSale(saleId);
      printBill(sale, settings);
    } catch (err) {
      console.error('Failed to print bill:', err);
    } finally {
      setPrintingBillId(null);
    }
  };

  // ── ITEM WISE (flat, sortable) ──────────────────────────────────────
  if (groupBy === 'item') {
    return (
      <div className="overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse text-left">
            <thead>
              <tr className="h-[46px] bg-[#F9FAFC]">
                <Sorting columns={itemWiseHeaders} sortConfig={sortConfig} onSortChange={setSortConfig} />
              </tr>
            </thead>
            <tbody>
              {sortedReports.map((report) => (
                <tr key={report.id} className="h-[44px] border-b border-[#EEF0F5] text-[12px] font-medium text-[#6D28D9] last:border-b-0">
                  <td className="px-5">{report.itemName}</td>
                  <td className="px-5">{report.soldQuantity}</td>
                  <td className="px-5">&#8377;{report.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── BILL WISE (grouped, not sortable, print icon per bill) ─────────
  return (
    <div className="overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left">
          <thead>
            <tr className="h-[46px] bg-[#F9FAFC]">
              <th className="px-5 text-xs font-bold text-[#050A24]">Bill ID</th>
              <th className="px-5 text-xs font-bold text-[#050A24]">Items</th>
              <th className="px-5 text-xs font-bold text-[#050A24]">Bill Amount</th>
            </tr>
          </thead>
          <tbody>
            {billGroups.map((bill) => (
              <React.Fragment key={bill.saleId}>
                {/* Group header row */}
                <tr className="h-[44px] border-b border-[#EEF0F5] bg-[#F9FAFC] text-[12px] font-semibold text-primary-700">
                  <td className="px-5" colSpan={2}>Bill ID: {bill.saleId}</td>
                  <td className="px-5">
                    <div className="flex items-center justify-end gap-2">
                      <span>Bill Amount: &#8377;{bill.payable.toFixed(2)}</span>
                      <button
                        onClick={() => handlePrintBill(bill.saleId)}
                        disabled={printingBillId === bill.saleId}
                        className="flex h-6 w-6 items-center justify-center rounded text-[#6D28D9] transition hover:bg-[#F3ECFF] disabled:opacity-50"
                        type="button"
                        aria-label={`Print ${bill.billNo}`}
                      >
                        {/* ⚠️ Using inline SVG since icons.print doesn't exist in constants/icons.js.
                            Swap back to <icons.YOUR_KEY /> once you confirm the right key. */}
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 6 2 18 2 18 9" />
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                          <rect x="6" y="14" width="12" height="8" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Item rows for this bill */}
                {bill.items.map((item) => (
                  <tr key={item.id} className="h-[44px] border-b border-[#EEF0F5] text-[12px] font-medium text-[#6D28D9] last:border-b-0">
                    <td className="px-5">{item.itemName}</td>
                    <td className="px-5">{item.soldQuantity}</td>
                    <td className="px-5">&#8377;{item.totalPrice}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReportTable;