import React, { useMemo, useState } from 'react';
import AppLayout from '../layout/AppLayout';
import PageNavbar from '../components/common/PageNavbar';
import Pagination from '../components/common/Pagination';
import ItemRequestFilterBar from '../components/ItemRequest/ItemRequestFilterBar';
import ItemRequestTable from '../components/ItemRequest/ItemRequestTable';
import ItemRequestForm from '../components/ItemRequest/ItemRequestForm';
import { icons } from '../constants/icons';

const REQUESTS = [
  {
    id: 4,
    subject: 'Request for Orange Juice',
    requestedBy: 'Mariyam Yamina M',
    requestedDate: '20 June 2026\n10:54 PM',
    expectingDelivery: '23 June 2026',
    status: 'On the way',
  },
  {
    id: 3,
    subject: 'Request for Strawberry Milkshake',
    requestedBy: 'Mariyam Yamina M',
    requestedDate: '20 June 2026\n10:53 PM',
    expectingDelivery: '22 June 2026',
    status: 'Pending',
  },
  {
    id: 2,
    subject: 'Request for strawberry Milkshake and\nOrange juice',
    requestedBy: 'Administrator\nAdmin',
    requestedDate: '20 June 2026\n10:07 PM',
    expectingDelivery: '21 June 2026',
    status: 'Cancelled',
  },
];

const ItemRequestPage = ({ onToggleSidebar, onLogout, onNavigate }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [formMode, setFormMode] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const totalPages = Math.ceil(REQUESTS.length / pageSize);
  const visibleRequests = useMemo(() => {
    const start = (page - 1) * pageSize;
    return REQUESTS.slice(start, start + pageSize);
  }, [page, pageSize]);

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  const handleNewRequest = () => {
    setSelectedRequest(null);
    setFormMode('add');
  };

  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setFormMode('edit');
  };

  const handleCloseForm = () => {
    setSelectedRequest(null);
    setFormMode(null);
  };

  return (
    <AppLayout activePage="itemRequest" onLogout={onLogout} onNavigate={onNavigate}>
      <PageNavbar title="Item Request" onToggleSidebar={onToggleSidebar} />

      {formMode ? (
        <ItemRequestForm
          mode={formMode}
          request={selectedRequest}
          onCancel={handleCloseForm}
          onSave={handleCloseForm}
        />
      ) : (
        <main className="flex-1 overflow-y-auto px-3 pb-4 lg:px-5">
          <div className="flex min-h-full flex-col gap-4">
            <ItemRequestFilterBar />

            <section className="rounded-lg border border-[#EAECF3] bg-white p-5 pb-0 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
              <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-[20px] font-bold text-[#050A24]">Item Request List</h2>
                  <p className="mt-1 text-[12px] font-semibold text-[#6D28D9]">Total 3 requests</p>
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
                  <button className="flex h-9 items-center gap-2 rounded-md border border-[#6D31F6] bg-white px-5 text-[12px] font-semibold text-[#6D28D9] transition hover:bg-[#F8F5FF]" type="button">
                    <icons.fileText className="h-4 w-4" />
                    Export to Excel
                  </button>
                </div>
              </div>

              <ItemRequestTable items={visibleRequests} onEditRequest={handleEditRequest} />

              <Pagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={REQUESTS.length}
                pageSizeOptions={[5, 10, 25]}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </section>
          </div>
        </main>
      )}
    </AppLayout>
  );
};

export default ItemRequestPage;
