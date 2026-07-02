import React, { useEffect, useMemo, useState, useCallback } from 'react';
import AppLayout from '../layout/AppLayout';
import PageNavbar from '../components/common/PageNavbar';
import Pagination from '../components/common/Pagination';
import InventoryFilterBar from '../components/Inventory/InventoryFilterBar';
import InventoryTable from '../components/Inventory/InventoryTable';
import InventoryItemForm from '../components/Inventory/InventoryItemForm';
import Toast from '../components/common/Toast';
import { icons } from '../constants/icons';
import { inventoryApi } from '../api';
import { exportToExcel } from '../utils/exportToExcel';
import UnauthorizedAccess from '../components/common/UnauthorizedAccess';

const DEFAULT_FILTERS = {
  categoryId: 'all',
  itemId: 'all',
  status: 'all',
  dateFrom: '',
  dateTo: '',
};

const InventoryPage = ({ onToggleSidebar, onLogout, onNavigate, user }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formMode, setFormMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await inventoryApi.getItems();
      setItems(data || []);
    } catch (err) {
      if (err.status === 403) {
        setIsUnauthorized(true);
        return;
      }

      console.error("Failed to load inventory:", err);
      setError(err.message || "Failed to load inventory items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aTime = new Date(a.created_at || a.updated_at || 0).getTime();
      const bTime = new Date(b.created_at || b.updated_at || 0).getTime();

      if (aTime !== bTime) return bTime - aTime;
      return Number(b.id ?? 0) - Number(a.id ?? 0);
    });
  }, [items]);

  // ── Client-side filtering ─────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    let result = [...sortedItems];

    if (filters.categoryId !== 'all') {
      result = result.filter((item) => String(item.category_id) === filters.categoryId);
    }

    if (filters.itemId !== 'all') {
      result = result.filter((item) => String(item.id) === filters.itemId);
    }

    if (filters.status !== 'all') {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      result = result.filter((item) => new Date(item.updated_at) >= from);
    }

    if (filters.dateTo) {
      // Include the full day by setting time to end-of-day
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((item) => new Date(item.updated_at) <= to);
    }

    return result;
  }, [sortedItems, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));

  const visibleItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1); // reset to page 1 on every filter change
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setFormMode('add');
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setFormMode('edit');
  };

  const handleCloseForm = () => {
    setSelectedItem(null);
    setFormMode(null);
  };

  // Called by InventoryItemForm's onSave — refetches the full list so the
  // new/edited item (and its server-computed status) shows up immediately.
  const handleFormSaved = () => {
    handleCloseForm();
    fetchItems();
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredItems.map((item) => ({
      'Item ID': item.id,
      'Item Name': item.name,
      'Category': item.category_name || 'Unknown',
      'Price': item.price,
      'Unit': item.unit,
      'In Stock': item.in_stock,
      'Sold': item.sold,
      'Purchased': item.purchased,
      'Supplier': item.supplier || 'N/A',
      'Status': item.status,
      'Created At': item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
      'Updated At': item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A',
    }));

    const success = exportToExcel(dataToExport, 'inventory', 'Inventory Items');
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
    <AppLayout activePage="inventory" onLogout={onLogout} onNavigate={onNavigate} user={user}>
      <PageNavbar title="Inventory" onToggleSidebar={onToggleSidebar} />

      {formMode ? (
        <InventoryItemForm
          mode={formMode}
          item={selectedItem}
          onCancel={handleCloseForm}
          onSave={handleFormSaved}
        />
      ) : (
        <main className="flex-1 overflow-y-auto px-3 pb-4 lg:px-4">
          <div className="flex min-h-full flex-col gap-3">
            <InventoryFilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />

            <section className="rounded-lg border border-[#EAECF3] bg-white p-4 pb-0 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-[15px] font-bold text-black">Inventory List</h2>
                  <p className="mt-1 text-[11px] font-semibold text-[#6D28D9]">
                    {loading
                      ? 'Loading…'
                      : `Showing ${filteredItems.length} of ${items.length} item${items.length === 1 ? '' : 's'}`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleAddItem}
                    className="flex h-9 items-center gap-2 rounded-md border border-[#EAECF3] bg-white px-4 text-[12px] font-semibold text-[#6D28D9] shadow-sm transition hover:bg-[#F8F5FF]"
                    type="button"
                  >
                    <icons.plus className="h-4 w-4" />
                    Add Item
                  </button>
                  <button onClick={() => onNavigate && onNavigate('itemRequest')} className="flex h-9 items-center gap-2 rounded-md bg-[#6D28D9] px-4 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#5B21B6]" type="button">
                    <icons.download className="h-4 w-4" />
                    Request Item
                  </button>
                  <button onClick={handleExportToExcel} className="flex h-9 items-center gap-2 rounded-md border border-[#DDE1EC] bg-white px-4 text-[12px] font-semibold text-[#343B58] transition hover:bg-[#F8F8FB]" type="button">
                    <icons.fileText className="h-4 w-4" />
                    Export to Excel
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">
                  {error}
                  <button onClick={fetchItems} className="ml-2 font-semibold underline" type="button">Retry</button>
                </div>
              )}

              {loading ? (
                <div className="py-10 text-center text-[12px] font-medium text-[#6D28D9]">Loading inventory…</div>
              ) : filteredItems.length === 0 && !error ? (
                <div className="py-10 text-center text-[12px] font-medium text-[#6D28D9]">
                  {items.length === 0
                    ? 'No inventory items yet. Click "Add Item" to create your first one.'
                    : 'No items match the current filters.'}
                </div>
              ) : (
                <>
                  <InventoryTable items={visibleItems} onEditItem={handleEditItem} />

                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredItems.length}
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

export default InventoryPage;