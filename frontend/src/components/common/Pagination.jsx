import React from 'react';
import { icons } from '../../constants/icons';

const Pagination = ({
  page = 1,
  totalPages = 2,
  pageSize = 10,
  totalItems = 13,
  pageSizeOptions = [5,8,10, 25, 50],
  onPageChange,
  onPageSizeChange,
}) => {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const changePage = (nextPage) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      onPageChange?.(nextPage);
    }
  };

  return (
    <div className="flex flex-col gap-3 px-4 py-4 text-[12px] text-[#5D647B] md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
          className="h-9 rounded-md border border-[#DDE1EC] bg-white px-3 text-[12px] font-medium text-[#5D647B] outline-none"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <span>entries</span>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button className="pagination-icon" onClick={() => changePage(1)} disabled={page === 1} type="button" aria-label="First page">
          <icons.chevronsLeft className="h-3.5 w-3.5" />
        </button>
        <button className="pagination-icon" onClick={() => changePage(page - 1)} disabled={page === 1} type="button" aria-label="Previous page">
          <icons.chevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => changePage(pageNumber)}
            className={`h-8 min-w-8 rounded-lg px-3 text-[13px] font-semibold transition ${
              pageNumber === page
                ? 'bg-[#7C3AED] text-white shadow-sm'
                : 'text-[#222646] hover:bg-[#F0EDFF]'
            }`}
            type="button"
          >
            {pageNumber}
          </button>
        ))}
        <button className="pagination-icon" onClick={() => changePage(page + 1)} disabled={page === totalPages} type="button" aria-label="Next page">
          <icons.chevronRight className="h-4 w-4" />
        </button>
        <button className="pagination-icon" onClick={() => changePage(totalPages)} disabled={page === totalPages} type="button" aria-label="Last page">
          <icons.chevronsRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="text-right">Showing {start} to {end} of {totalItems} entries</p>
    </div>
  );
};

export default Pagination;
