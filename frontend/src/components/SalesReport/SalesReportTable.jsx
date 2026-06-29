import React, { useMemo, useState } from 'react';
import { icons } from '../../constants/icons';
import Sorting from '../common/Sorting';

const headers = [
  { key: 'itemName', label: 'Item Name', sortable: true },
  { key: 'soldQuantity', label: 'Sold Quantity', sortable: true },
  { key: 'totalPrice', label: 'Total Price', sortable: true },
];

const SalesReportTable = ({ reports }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const sortedReports = useMemo(() => {
    const source = [...(reports || [])];
    const { key, direction } = sortConfig;

    if (!key) {
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
  }, [reports, sortConfig]);

  return (
    <div className="overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left">
          <thead>
            <tr className="h-[46px] bg-[#F9FAFC]">
              <Sorting columns={headers} sortConfig={sortConfig} onSortChange={setSortConfig} />
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
};

export default SalesReportTable;
