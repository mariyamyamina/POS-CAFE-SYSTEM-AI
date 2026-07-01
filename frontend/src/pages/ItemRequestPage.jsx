import React, { useEffect, useMemo, useState, useCallback } from 'react';
import AppLayout from '../layout/AppLayout';
import PageNavbar from '../components/common/PageNavbar';
import Pagination from '../components/common/Pagination';
import ItemRequestFilterBar from '../components/ItemRequest/ItemRequestFilterBar';
import ItemRequestTable from '../components/ItemRequest/ItemRequestTable';
import ItemRequestForm from '../components/ItemRequest/ItemRequestForm';
import Toast from '../components/common/Toast';
import { icons } from '../constants/icons';
import { itemRequestApi } from '../api';
import { exportToExcel } from '../utils/exportToExcel';

const formatDate = (isoDate) => {
  if (!isoDate) return '—';
  try {
    return new Date(isoDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return isoDate;
  }
};

const formatDateTime = (isoDateTime) => {
  if (!isoDateTime) return '—';
  try {
    return new Date(isoDateTime).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
    });
  } catch {
    return isoDateTime;
  }
};

const applyFilters = (requests, filters) => {
  if (!filters) return requests;
  return requests.filter((r) => {
    if (filters.requestId && String(r.request_no ?? r.id) !== filters.requestId) return false;
    if (filters.subject && !String(r.subject || '').toLowerCase().includes(filters.subject.toLowerCase())) return false;
    if (filters.requestedBy && r.requested_by_name !== filters.requestedBy) return false;
    if (filters.dateFrom && r.requested_date < filters.dateFrom) return false;
    if (filters.dateTo && r.requested_date > filters.dateTo) return false;
    return true;
  });
};

const ItemRequestPage = ({ onToggleSidebar, onLogout, onNavigate, user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [formMode, setFormMode] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // null = no filter applied (show everything). Set by the filter bar,
  // re-applied automatically whenever `requests` refetches.
  const [filters, setFilters] = useState(null);

  const filteredRequests = useMemo(
    () => applyFilters(requests, filters),
    [requests, filters]
  );

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await itemRequestApi.getRequests();
      setRequests(data || []);
    } catch (err) {
      console.error('Failed to load item requests:', err);
      setError(err.message || 'Failed to load item requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleFilter = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters(null);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));

  // Maps backend ItemRequestResponse shape -> the display shape ItemRequestTable expects
  const visibleRequests = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize).map((r) => ({
      id: r.id,
      requestId: r.request_no ?? r.id,
      subject: r.subject,
      requestedBy: r.requested_by_name || `User #${r.requested_by}`,
      requestedDate: formatDateTime(r.created_at),
      expectingDelivery: formatDate(r.expected_delivery),
      status: r.status,
    }));
  }, [filteredRequests, page, pageSize]);

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  const handleNewRequest = () => {
    setSelectedRequest(null);
    setFormMode('add');
  };

  const handleEditRequest = (displayItem) => {
    // ItemRequestTable only has the flattened display row — find the full
    // raw request object (with items, requested_date, etc.) by id for the form
    const fullRequest = requests.find((r) => r.id === displayItem.id);
    setSelectedRequest(fullRequest || null);
    setFormMode('edit');
  };

  const handleCloseForm = () => {
    setSelectedRequest(null);
    setFormMode(null);
  };

  const handleFormSaved = () => {
    handleCloseForm();
    fetchRequests();
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredRequests.map((request) => ({
      'Request ID': request.request_no ?? request.id,
      'Subject': request.subject,
      'Requested By': request.requested_by_name || `User #${request.requested_by}`,
      'Requested Date': formatDateTime(request.created_at),
      'Expected Delivery': formatDate(request.expected_delivery),
      'Status': request.status,
      'Items Count': request.items?.length || 0,
    }));

    const success = exportToExcel(dataToExport, 'item_requests', 'Item Requests');
    if (!success) {
      setToastMessage('No data to export');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const emptyStateMessage = requests.length === 0
    ? 'No item requests yet. Click "New Item Request" to create one.'
    : 'No item requests match the current filters.';

  return (
    <AppLayout activePage="itemRequest" onLogout={onLogout} onNavigate={onNavigate} user={user}>
      <PageNavbar title="Item Request" onToggleSidebar={onToggleSidebar} />

      {formMode ? (
        <ItemRequestForm
          mode={formMode}
          request={selectedRequest}
          onCancel={handleCloseForm}
          onSave={handleFormSaved}
          user={user}
        />
      ) : (
        <main className="flex-1 overflow-y-auto px-3 pb-4 lg:px-5">
          <div className="flex min-h-full flex-col gap-4">
            <ItemRequestFilterBar requests={requests} onFilter={handleFilter} onReset={handleReset} />

            <section className="rounded-lg border border-[#EAECF3] bg-white p-5 pb-0 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
              <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-[20px] font-bold text-[#050A24]">Item Request List</h2>
                  <p className="mt-1 text-[12px] font-semibold text-[#6D28D9]">
                    {loading ? 'Loading…' : `Total ${requests.length} request${requests.length === 1 ? '' : 's'}`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleNewRequest}
                    className="flex h-9 items-center gap-2 rounded-md bg-[#6D31F6] px-5 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#5B21D9]"
                    type="button"
                  >
                    <icons.plus className="h-4 w-4" />
                    New Item Request
                  </button>
                  <button onClick={handleExportToExcel} className="flex h-9 items-center gap-2 rounded-md border border-[#6D31F6] bg-white px-5 text-[12px] font-semibold text-[#6D28D9] transition hover:bg-[#F8F5FF]" type="button">
                    <icons.fileText className="h-4 w-4" />
                    Export to Excel
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">
                  {error}
                  <button onClick={fetchRequests} className="ml-2 font-semibold underline" type="button">Retry</button>
                </div>
              )}

              {loading ? (
                <div className="py-10 text-center text-[12px] font-medium text-[#6D28D9]">Loading item requests…</div>
              ) : filteredRequests.length === 0 && !error ? (
                <div className="py-10 text-center text-[12px] font-medium text-[#6D28D9]">
                  {emptyStateMessage}
                </div>
              ) : (
                <>
                  <ItemRequestTable items={visibleRequests} onEditRequest={handleEditRequest} />

                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredRequests.length}
                    pageSizeOptions={[5, 10, 25]}
                    onPageChange={setPage}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </>
              )}
            </section>
          </div>
        </main>
      )}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </AppLayout>
  );
};

export default ItemRequestPage;