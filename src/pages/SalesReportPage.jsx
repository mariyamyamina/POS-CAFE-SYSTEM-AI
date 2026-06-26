import React, { useMemo, useState } from 'react';
import AppLayout from '../layout/AppLayout';
import PageNavbar from '../components/common/PageNavbar';
import Pagination from '../components/common/Pagination';
import SalesReportFilterBar from '../components/SalesReport/SalesReportFilterBar';
import SalesReportTable from '../components/SalesReport/SalesReportTable';
import { icons } from '../constants/icons';

const SALES_REPORTS = [
  { id: 1, itemName: 'Almond Milk', soldQuantity: 1, totalPrice: 100 },
  { id: 2, itemName: 'Black Tea', soldQuantity: 1, totalPrice: 25 },
  { id: 3, itemName: 'Lemon Juice', soldQuantity: 1, totalPrice: 20 },
  { id: 4, itemName: 'Veg Noodles', soldQuantity: 3, totalPrice: 360 },
  { id: 5, itemName: 'Lemon Juice', soldQuantity: 2, totalPrice: 40 },
  { id: 6, itemName: 'Ginger Tea', soldQuantity: 1, totalPrice: 35 },
  { id: 7, itemName: 'Elaichi Tea', soldQuantity: 1, totalPrice: 35 },
  { id: 8, itemName: 'Elaichi Tea', soldQuantity: 2, totalPrice: 70 },
  { id: 9, itemName: 'Masala Tea', soldQuantity: 3, totalPrice: 90 },
  { id: 10, itemName: 'Cold Coffee', soldQuantity: 2, totalPrice: 160 },
  { id: 11, itemName: 'Paneer Momos', soldQuantity: 1, totalPrice: 120 },
  { id: 12, itemName: 'Orange Juice', soldQuantity: 2, totalPrice: 120 },
  { id: 13, itemName: 'Chocolate Shake', soldQuantity: 1, totalPrice: 140 },
  { id: 14, itemName: 'Green Tea', soldQuantity: 1, totalPrice: 30 },
];

const SalesReportPage = ({ onToggleSidebar, onLogout, onNavigate }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const totalPages = Math.ceil(SALES_REPORTS.length / pageSize);
  const visibleReports = useMemo(() => {
    const start = (page - 1) * pageSize;
    return SALES_REPORTS.slice(start, start + pageSize);
  }, [page, pageSize]);

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  return (
    <AppLayout activePage="salesReport" onLogout={onLogout} onNavigate={onNavigate}>
      <PageNavbar
        title="Sales Report"
        dateLabel="08 June 2026"
        dayLabel="Monday"
        timeLabel="02:40 PM"
        onToggleSidebar={onToggleSidebar}
      />

      <main className="flex-1 overflow-y-auto px-3 pb-5 lg:px-5">
        <div className="flex min-h-full flex-col gap-4">
          <SalesReportFilterBar />

          <section className="rounded-lg border border-[#EAECF3] bg-white p-5 pb-0 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-[17px] font-bold text-[#050A24]">Sales Reports</h2>
                <p className="mt-1 text-[12px] font-semibold text-[#6D28D9]">Total 14 reports</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="flex h-9 items-center gap-2 rounded-md border border-[#DDE1EC] bg-white px-4 text-[12px] font-semibold text-[#6D28D9] transition hover:bg-[#F8F5FF]" type="button">
                  Item Wise
                  <icons.chevronDown className="h-4 w-4 text-[#98A0B3]" />
                </button>
                <button className="flex h-9 items-center gap-2 rounded-md border border-[#6D31F6] bg-white px-5 text-[12px] font-semibold text-[#6D28D9] transition hover:bg-[#F8F5FF]" type="button">
                  <icons.fileText className="h-4 w-4" />
                  Export to Excel
                </button>
              </div>
            </div>

            <SalesReportTable reports={visibleReports} />

            <Pagination
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={SALES_REPORTS.length}
              pageSizeOptions={[8, 10, 25]}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </section>
        </div>
      </main>
    </AppLayout>
  );
};

export default SalesReportPage;
