import React from 'react';
import { icons } from '../../constants/icons';

const statusStyles = {
  'On the way': 'border-[#93C5FD] bg-[#DBEAFE] text-[#1155CC]',
  Pending: 'border-[#FACC15] bg-[#FEF3C7] text-[#B77900]',
  Cancelled: 'border-[#FCA5A5] bg-[#FEE2E2] text-[#DC2626]',
};

const headers = ['Request ID', 'Subject', 'Requested By', 'Requested Date', 'Expecting Delivery', 'Status', 'Action'];

const ItemRequestTable = ({ items, onEditRequest }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-[#EAECF3] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full border-collapse text-left">
          <thead>
            <tr className="h-[46px] bg-white">
              {headers.map((header) => (
                <th key={header} className="whitespace-nowrap border-b border-[#EAECF3] px-4 text-[12px] font-bold text-[#2A2B6E]">
                  <span className="inline-flex items-center gap-1">
                    {header}
                    {header !== 'Action' && (
                      <span className="flex flex-col text-[#7C3AED]">
                        <icons.chevronDown className="h-2.5 w-2.5 rotate-180" />
                        <icons.chevronDown className="-mt-1.5 h-2.5 w-2.5" />
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="h-[65px] border-b border-[#F1F2F7] text-[12px] font-medium text-[#050A24] last:border-b-0">
                <td className="px-4 font-semibold text-[#6D28D9]">{item.id}</td>
                <td className="max-w-[290px] whitespace-pre-line px-4 leading-5">{item.subject}</td>
                <td className="whitespace-pre-line px-4 leading-5">{item.requestedBy}</td>
                <td className="whitespace-pre-line px-4 leading-5">{item.requestedDate}</td>
                <td className="px-4">{item.expectingDelivery}</td>
                <td className="px-4">
                  <span className={`inline-flex min-w-[74px] justify-center rounded-md border px-3 py-1.5 text-[12px] font-bold ${statusStyles[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4">
                  <div className="flex items-center gap-7 text-[#7C3AED]">
                    <button className="transition hover:text-[#5B21B6]" type="button" aria-label={`View request ${item.id}`}>
                      <icons.eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEditRequest?.(item)}
                      className="transition hover:text-[#5B21B6]"
                      type="button"
                      aria-label={`Edit request ${item.id}`}
                    >
                      <icons.edit className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemRequestTable;
