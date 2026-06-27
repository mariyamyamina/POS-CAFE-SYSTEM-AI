import React, { useMemo, useState } from 'react';
import AppLayout from '../layout/AppLayout';
import PageNavbar from '../components/common/PageNavbar';
import Pagination from '../components/common/Pagination';
import InventoryFilterBar from '../components/Inventory/InventoryFilterBar';
import InventoryTable from '../components/Inventory/InventoryTable';
import InventoryItemForm from '../components/Inventory/InventoryItemForm';
import { icons } from '../constants/icons';

const INVENTORY_ITEMS = [
  { id: 1, icon: '☕', name: 'Coffee Black', category: 'Beverage', price: 3.00, unit: 'Cup', purchased: 150, sold: 98, inStock: 52, status: 'In Stock', lastUpdated: '28 May 2026, 10:40 AM' },
  { id: 2, icon: '🍵', name: 'Tea C', category: 'Beverage', price: 4.70, unit: 'Cup', purchased: 200, sold: 150, inStock: 50, status: 'In Stock', lastUpdated: '28 May 2026, 10:55 AM' },
  { id: 3, icon: '🥟', name: 'Steamed Dimsum', category: 'Steamed Timsum', price: 7.30, unit: 'Pcs', purchased: 120, sold: 80, inStock: 40, status: 'In Stock', lastUpdated: '28 May 2026, 10:10 AM' },
  { id: 4, icon: '🥣', name: 'Porridge', category: 'Porridge', price: 11.20, unit: 'Bowl', purchased: 100, sold: 90, inStock: 10, status: 'Low Stock', lastUpdated: '28 May 2026, 10:30 AM' },
  { id: 5, icon: '🥤', name: 'Iced Tea', category: 'Beverage', price: 11.70, unit: 'Glass', purchased: 180, sold: 170, inStock: 10, status: 'Low Stock', lastUpdated: '28 May 2026, 10:15 AM' },
  { id: 6, icon: '🥟', name: 'Dumplings', category: 'Noodle/Dumplings', price: 16.10, unit: 'Pcs', purchased: 80, sold: 70, inStock: 10, status: 'Low Stock', lastUpdated: '29 May 2026, 10:05 AM' },
  { id: 7, icon: '☕', name: 'Iced Coffee', category: 'Beverage', price: 13.50, unit: 'Glass', purchased: 160, sold: 160, inStock: 0, status: 'Out of Stock', lastUpdated: '29 May 2026, 10:00 AM' },
  { id: 8, icon: '☕', name: 'Coffee C', category: 'Beverage', price: 16.50, unit: 'Cup', purchased: 140, sold: 140, inStock: 0, status: 'Out of Stock', lastUpdated: '29 May 2026, 09:45 AM' },
  { id: 9, icon: '🥛', name: 'Milo', category: 'Beverage', price: 15.00, unit: 'Cup', purchased: 60, sold: 45, inStock: 15, status: 'In Stock', lastUpdated: '29 May 2026, 09:50 AM' },
  { id: 10, icon: '🍵', name: 'Chinese Tea', category: 'Beverage', price: 4.20, unit: 'Cup', purchased: 90, sold: 60, inStock: 30, status: 'In Stock', lastUpdated: '30 May 2026, 09:25 AM' },
  { id: 11, icon: '🍹', name: 'Lemon Tea', category: 'Beverage', price: 5.10, unit: 'Glass', purchased: 70, sold: 58, inStock: 12, status: 'In Stock', lastUpdated: '30 May 2026, 09:35 AM' },
  { id: 12, icon: '🥢', name: 'Wonton Noodle', category: 'Noodle/Dumplings', price: 12.40, unit: 'Bowl', purchased: 95, sold: 88, inStock: 7, status: 'Low Stock', lastUpdated: '30 May 2026, 09:55 AM' },
  { id: 13, icon: '🍮', name: 'Egg Tart', category: 'Bake', price: 6.80, unit: 'Pcs', purchased: 110, sold: 99, inStock: 11, status: 'In Stock', lastUpdated: '30 May 2026, 10:05 AM' },
];

const InventoryPage = ({ onToggleSidebar, onLogout, onNavigate }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formMode, setFormMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const totalPages = Math.ceil(INVENTORY_ITEMS.length / pageSize);
  const visibleItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return INVENTORY_ITEMS.slice(start, start + pageSize);
  }, [page, pageSize]);

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

  return (
    <AppLayout activePage="inventory" onLogout={onLogout} onNavigate={onNavigate}>
      <PageNavbar title="Inventory" onToggleSidebar={onToggleSidebar} />

      {formMode ? (
        <InventoryItemForm
          mode={formMode}
          item={selectedItem}
          onCancel={handleCloseForm}
          onSave={handleCloseForm}
        />
      ) : (
        <main className="flex-1 overflow-y-auto px-3 pb-4 lg:px-4">
          <div className="flex min-h-full flex-col gap-3">
            <InventoryFilterBar />

            <section className="rounded-lg border border-[#EAECF3] bg-white p-4 pb-0 shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-[15px] font-bold text-black">Inventory List</h2>
                  <p className="mt-1 text-[11px] font-semibold text-[#6D28D9]">Total 13 items found</p>
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
                  <button className="flex h-9 items-center gap-2 rounded-md bg-[#6D28D9] px-4 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#5B21B6]" type="button">
                    <icons.download className="h-4 w-4" />
                    Request Item
                  </button>
                  <button className="flex h-9 items-center gap-2 rounded-md border border-[#DDE1EC] bg-white px-4 text-[12px] font-semibold text-[#343B58] transition hover:bg-[#F8F8FB]" type="button">
                    <icons.fileText className="h-4 w-4" />
                    Export to Excel
                  </button>
                </div>
              </div>

              <InventoryTable items={visibleItems} onEditItem={handleEditItem} />

              <Pagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={INVENTORY_ITEMS.length}
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

export default InventoryPage;
