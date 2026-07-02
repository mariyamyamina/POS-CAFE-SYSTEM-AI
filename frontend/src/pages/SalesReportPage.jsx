import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import AppLayout from '../layout/AppLayout';
import PageNavbar from '../components/common/PageNavbar';
import Pagination from '../components/common/Pagination';
import SalesReportFilterBar from '../components/SalesReport/SalesReportFilterBar';
import SalesReportTable from '../components/SalesReport/SalesReportTable';
import Toast from '../components/common/Toast';
import { icons } from '../constants/icons';
import { salesApi, settingsApi } from '../api';
import { exportToExcel } from '../utils/exportToExcel';
import UnauthorizedAccess from '../components/common/UnauthorizedAccess';

const rangeToDates = (range) => {
  const today = new Date();
  const toISODate = (d) => d.toISOString().slice(0, 10);

  if (range === 'Today') {
    return { date_from: toISODate(today), date_to: toISODate(today) };
  }
  if (range === 'Yesterday') {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    return { date_from: toISODate(y), date_to: toISODate(y) };
  }
  if (range === 'This Week') {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay());
    return { date_from: toISODate(start), date_to: toISODate(today) };
  }
  if (range === 'This Month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { date_from: toISODate(start), date_to: toISODate(today) };
  }
  return {};
};

const GROUP_BY_OPTIONS = [
  { value: 'item', label: 'Item Wise' },
  { value: 'bill', label: 'Bill Wise' },
];

const SalesReportPage = ({ onToggleSidebar, onLogout, onNavigate, user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [itemFilter, setItemFilter] = useState('');
  const [rangeFilter, setRangeFilter] = useState('Today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const [groupBy, setGroupBy] = useState('item');
  const [groupByOpen, setGroupByOpen] = useState(false);
  const groupByRef = useRef(null);

  const [settings, setSettings] = useState(null);
    const [isUnauthorized, setIsUnauthorized] = useState(false);

  // Close the Item Wise / Bill Wise dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (groupByRef.current && !groupByRef.current.contains(e.target)) {
        setGroupByOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Settings fetched once — passed to SalesReportTable for per-bill printing
  useEffect(() => {
    settingsApi.getSettings().then(setSettings).catch((err) => {
      console.error('Failed to load settings:', err);
    });
  }, []);

  const fetchReports = useCallback(async (overrides = {}) => {
    // overrides lets Reset pass fresh values directly instead of relying on
    // state that hasn't flushed yet on the same tick as setItemFilter(''), etc.
    const effectiveItemFilter = overrides.itemFilter ?? itemFilter;
    const effectiveRangeFilter = overrides.rangeFilter ?? rangeFilter;
    const effectiveCustomFrom = overrides.customFrom ?? customFrom;
    const effectiveCustomTo = overrides.customTo ?? customTo;

    setLoading(true);
    setError('');
    try {
      const dates = effectiveRangeFilter === 'Custom'
        ? { date_from: effectiveCustomFrom || undefined, date_to: effectiveCustomTo || undefined }
        : rangeToDates(effectiveRangeFilter);

      const data = await salesApi.getSalesReport({
        ...dates,
        item_name: effectiveItemFilter || undefined,
      });
      // Map snake_case API fields to the camelCase shape SalesReportTable expects
      const mapped = (data || []).map((r) => ({
        id: r.id,
        sale_id: r.sale_id,
        bill_no: r.bill_no,
        itemName: r.item_name,
        soldQuantity: r.sold_quantity,
        totalPrice: r.total_price,
      }));
      setReports(mapped);
      setPage(1);
    } catch (err) {
      if (err.status === 403) {
        setIsUnauthorized(true);
        return;
      }

      console.error("Failed to load inventory:", err);
      setError(err.message || "Failed to load inventory items.");
    }finally {
      setLoading(false);
    }
  }, [rangeFilter, customFrom, customTo, itemFilter]);

  // Fetch once on mount only — NOT on every filter-field change (typing in
  // Item, clicking a date range button, etc. just updates local state).
  // The Filter button (onFilter={fetchReports}) and Reset button are the
  // only things that trigger a refetch after that.
  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setItemFilter('');
    setRangeFilter('Today');
    setCustomFrom('');
    setCustomTo('');
    fetchReports({ itemFilter: '', rangeFilter: 'Today', customFrom: '', customTo: '' });
  };

  const totalPages = Math.max(1, Math.ceil(reports.length / pageSize));
  const visibleReports = useMemo(() => {
    // Bill Wise groups its own pagination differently (by bill, not by row),
    // so pagination is only sliced in Item Wise mode. Bill Wise shows all
    // matching bills from the current filter on one page.
    if (groupBy === 'bill') return reports;
    const start = (page - 1) * pageSize;
    return reports.slice(start, start + pageSize);
  }, [reports, page, pageSize, groupBy]);

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  const activeGroupByLabel = GROUP_BY_OPTIONS.find((o) => o.value === groupBy)?.label;

  const handleExportToExcel = () => {
    const dataToExport = reports.map((report) => ({
      'Sale ID': report.sale_id,
      'Bill No': report.bill_no,
      'Item Name': report.itemName,
      'Sold Quantity': report.soldQuantity,
      'Total Price': report.totalPrice,
    }));

    const success = exportToExcel(dataToExport, 'sales_report', 'Sales Report');
    if (!success) {
      setToastMessage('No data to export');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

   if (isUnauthorized) {
    return (
      <UnauthorizedAccess
        onReturnToDashboard={() => onNavigate("dashboard")}
        onLogout={onLogout}
      />
    );
  }

  
  return (
    <AppLayout activePage="salesReport" onLogout={onLogout} onNavigate={onNavigate} user={user}>
      <PageNavbar title="Sales Report" onToggleSidebar={onToggleSidebar} />

      <main className="flex-1 overflow-y-auto px-3 pb-5 lg:px-5">
        <div className="flex min-h-full flex-col gap-4">
          <SalesReportFilterBar
            itemFilter={itemFilter}
            onItemFilterChange={setItemFilter}
            rangeFilter={rangeFilter}
            onRangeFilterChange={setRangeFilter}
            customFrom={customFrom}
            onCustomFromChange={setCustomFrom}
            customTo={customTo}
            onCustomToChange={setCustomTo}
            onFilter={() => fetchReports()}
            onReset={handleReset}
          />

          <section className="rounded-lg border border-[#EAECF3] bg-white p-5 pb-0 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-[17px] font-bold text-[#050A24]">Sales Reports</h2>
                <p className="mt-1 text-[12px] font-semibold text-[#6D28D9]">
                  {loading ? 'Loading…' : `Total ${reports.length} report${reports.length === 1 ? '' : 's'}`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative" ref={groupByRef}>
                  <button
                    onClick={() => setGroupByOpen((o) => !o)}
                    className="flex h-9 items-center gap-2 rounded-md border border-[#DDE1EC] bg-white px-4 text-[12px] font-semibold text-[#6D28D9] transition hover:bg-[#F8F5FF]"
                    type="button"
                  >
                    {activeGroupByLabel}
                    <icons.chevronDown className="h-4 w-4 text-[#98A0B3]" />
                  </button>

                  {groupByOpen && (
                    <div className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-md border border-[#EAECF3] bg-white shadow-lg">
                      {GROUP_BY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setGroupBy(opt.value); setGroupByOpen(false); setPage(1); }}
                          className={`block w-full px-4 py-2 text-left text-[12px] font-semibold transition ${
                            groupBy === opt.value ? 'bg-[#F3ECFF] text-[#6D28D9]' : 'text-[#343B58] hover:bg-[#F8F8FB]'
                          }`}
                          type="button"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={handleExportToExcel} className="flex h-9 items-center gap-2 rounded-md border border-[#6D31F6] bg-white px-5 text-[12px] font-semibold text-[#6D28D9] transition hover:bg-[#F8F5FF]" type="button">
                  <icons.fileText className="h-4 w-4" />
                  Export to Excel
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">
                {error}
                <button onClick={() => fetchReports()} className="ml-2 font-semibold underline" type="button">Retry</button>
              </div>
            )}

            {loading ? (
              <div className="py-10 text-center text-[12px] font-medium text-[#6D28D9]">Loading sales report…</div>
            ) : reports.length === 0 && !error ? (
              <div className="py-10 text-center text-[12px] font-medium text-[#6D28D9]">
                No sales found for the selected filters.
              </div>
            ) : (
              <>
                <SalesReportTable reports={visibleReports} groupBy={groupBy} settings={settings} />

                {groupBy === 'item' && (
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={reports.length}
                    pageSizeOptions={[8, 10, 25]}
                    onPageChange={setPage}
                    onPageSizeChange={handlePageSizeChange}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </main>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </AppLayout>
  );
};

export default SalesReportPage;