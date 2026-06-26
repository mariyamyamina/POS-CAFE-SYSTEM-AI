import React from 'react';
import { icons } from '../../constants/icons';

const headers = ['Item Name', 'Sold Quantity', 'Total Price'];

const SalesReportTable = ({ reports }) => {
  return (
    <div className="overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left">
          <thead>
            <tr className="h-[46px] bg-[#F9FAFC]">
              {headers.map((header) => (
                <th key={header} className="whitespace-nowrap px-5 text-[12px] font-bold text-black">
                  <span className="inline-flex items-center gap-1">
                    {header}
                    <span className="flex flex-col text-[#7C3AED]">
                      <icons.chevronDown className="h-2.5 w-2.5 rotate-180" />
                      <icons.chevronDown className="-mt-1.5 h-2.5 w-2.5" />
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
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
