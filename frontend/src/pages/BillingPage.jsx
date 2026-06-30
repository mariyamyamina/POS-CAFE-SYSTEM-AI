import React, { useState } from 'react';
import AppLayout from '../layout/AppLayout';
import Header from '../components/Header/Header';
import BillTable from '../components/Billing/BillTable';
import Keypad from '../components/Billing/Keypad';
import CategoryList from '../components/Menu/CategoryList';
import ProductGrid from '../components/Menu/ProductGrid';
import BottomActions from '../components/Billing/BottomActions';
import PriceAmendment from '../components/Billing/PriceAmendment';
import Toast from '../components/common/Toast';

import { inventoryApi, categoriesApi } from '../api';

const BillingPage = ({ onToggleSidebar, onLogout, onNavigate, user }) => {
  const [billItems, setBillItems]           = useState([]);
  const [itemNumberInput, setItemNumberInput] = useState('');
  const [quantityInput, setQuantityInput]   = useState(1);
  const [tableNumber, setTableNumber]       = useState('');
  const [covers, setCovers]                 = useState('');
  const [activeField, setActiveField]       = useState('table');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery]       = useState('');
  const [viewMode, setViewMode]             = useState('grid');
  const [showPriceAmendment, setShowPriceAmendment] = useState(false);
  const [menuItems, setMenuItems]           = useState([]);
  const [mobileTab, setMobileTab]           = useState('menu');

  // ── New state for the bill-row selection, tender input, and toast ──
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [tender, setTender]                 = useState('');
  const [toastMessage, setToastMessage]     = useState(null);

  React.useEffect(() => {
    Promise.all([inventoryApi.getItems(), categoriesApi.getCategories()])
      .then(([itemsData, catsData]) => {
        const catMap = catsData.reduce((acc, cat) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {});
        
        // Filter out inactive items if needed, or show all
        const mappedItems = itemsData
          .filter(item => item.is_active)
          .map(item => ({
            ...item,
            category: catMap[item.category_id] || 'Unknown',
            image: item.image_url
          }));
        setMenuItems(mappedItems);
      })
      .catch(err => console.error('Failed to load menu items', err));
  }, []);

  const totalAmount = billItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const showToast = (msg) => setToastMessage(msg);

  const handleAddItemToBill = (item, qty = 1) => {
    const idx = billItems.findIndex((bi) => bi.id === item.id);
    if (idx !== -1) {
      const updated = [...billItems];
      updated[idx].quantity += qty;
      setBillItems(updated);
    } else {
      setBillItems([...billItems, { id: item.id, name: item.name, quantity: qty, unitPrice: item.price, image: item.image }]);
    }
  };

  const handleManualAdd = () => {
    if (!itemNumberInput.trim()) return;
    const matched = menuItems.find((item) => item.id === parseInt(itemNumberInput.trim(), 10));
    if (matched) { handleAddItemToBill(matched, quantityInput); setItemNumberInput(''); setQuantityInput(1); }
  };

  const handleRemoveItem = (id) => {
    setBillItems(billItems.filter((item) => item.id !== id));
    setSelectedItemId((current) => (current === id ? null : current));
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) { handleRemoveItem(id); return; }
    setBillItems(billItems.map((item) => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleNewBill = () => {
    setBillItems([]); setTableNumber(''); setCovers(''); setItemNumberInput(''); setQuantityInput(1);
    setShowPriceAmendment(false); setSelectedItemId(null); setTender('');
  };

  const handlePriceAmendment = () => {
    if (totalAmount === 0) {
      showToast('Add items to the bill before price amendment');
      return;
    }
    setShowPriceAmendment(true);
  };

  // ₹ quick-add buttons: only allowed inside Price Amendment, adds to tender
  const handleQuickAdd = (amount) => {
    if (!showPriceAmendment) {
      showToast('Quick add buttons only work in Price Amendment');
      return;
    }
    setTender((prev) => String((parseFloat(prev) || 0) + amount));
  };

  const handleGiftVoucher = () => {};
  const handleOpenCashBox = () => {};
  const handleGoodsReturn = () => {};

  // Cancel Item: decrease qty of the selected bill row
  const handleCancelItem = () => {
    if (!selectedItemId) {
      showToast('Select an item in the bill first');
      return;
    }
    const target = billItems.find((i) => i.id === selectedItemId);
    if (!target) return;
    handleUpdateQuantity(selectedItemId, target.quantity - 1);
  };

  // Add Item: increase qty of the selected bill row
  const handleAddItem = () => {
    if (!selectedItemId) {
      showToast('Select an item in the bill first');
      return;
    }
    const target = billItems.find((i) => i.id === selectedItemId);
    if (!target) return;
    handleUpdateQuantity(selectedItemId, target.quantity + 1);
  };

  // Terminate: only works inside Price Amendment, takes you back to Bill Table
  const handleTerminateTransaction = () => {
    if (!showPriceAmendment) {
      showToast('Terminate can only happen in Price Amendment');
      return;
    }
    setShowPriceAmendment(false);
    setTender('');
  };

  const handlePrint                = () => {};
  const handleReservedTransaction  = () => {};
  const handleDeleteAllTransaction = () => { if (billItems.length > 0) setBillItems([]); setSelectedItemId(null); };
  const handleRestore              = () => {};

  // Main Menu: navigate to dashboard via your existing router prop
  const handleMainMenu = () => { onNavigate && onNavigate('dashboard'); };

  const bottomActionProps = {
    onNewBill: handleNewBill, onPriceAmendment: handlePriceAmendment,
    onQuickAdd: handleQuickAdd, onGiftVoucher: handleGiftVoucher,
    onOpenCashBox: handleOpenCashBox, onGoodsReturn: handleGoodsReturn,
    onCancelItem: handleCancelItem, onAddItem: handleAddItem,
    onTerminateTransaction: handleTerminateTransaction, onPrint: handlePrint,
    onReservedTransaction: handleReservedTransaction, onDeleteAllTransaction: handleDeleteAllTransaction,
    onRestore: handleRestore, onMainMenu: handleMainMenu,
  };

  const keypadBlock = (
    <Keypad
      tableNumber={tableNumber} onTableNumberChange={setTableNumber}
      covers={covers} onCoversChange={setCovers}
      itemNumber={itemNumberInput} onItemNumberChange={setItemNumberInput}
      quantity={quantityInput} onQuantityChange={setQuantityInput}
      onAdd={handleManualAdd}
      activeField={activeField} onActiveFieldChange={setActiveField}
    />
  );

  const billOrAmendmentBlock = showPriceAmendment ? (
    <PriceAmendment
      totalAmount={totalAmount}
      tender={tender}
      onTenderChange={setTender}
    />
  ) : (
    <BillTable
      items={billItems}
      onRemoveItem={handleRemoveItem}
      onUpdateQuantity={handleUpdateQuantity}
      selectedItemId={selectedItemId}
      onSelectItem={setSelectedItemId}
    />
  );

  return (
    <AppLayout activePage="billing" onLogout={onLogout} onNavigate={onNavigate} user={user}>

      <Header
        title="Current Bill"
        totalAmount={totalAmount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleSidebar={onToggleSidebar}
      />

      {/* ══════════════════════════════════════════════════════
          MOBILE  (< lg)
         ══════════════════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">

        <div className="sticky top-0 z-10 flex shrink-0 bg-white shadow-sm">
          <button
            onClick={() => setMobileTab('bill')}
            className={`flex-1 py-3 text-[13px] font-semibold transition-colors ${
              mobileTab === 'bill'
                ? 'border-b-2 border-[#6C63FF] text-[#6C63FF]'
                : 'border-b border-[#EEF0F6] text-gray-400'
            }`}
          >
            Bill
            {billItems.length > 0 && (
              <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#6C63FF] text-[10px] font-bold text-white">
                {billItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileTab('menu')}
            className={`flex-1 py-3 text-[13px] font-semibold transition-colors ${
              mobileTab === 'menu'
                ? 'border-b-2 border-[#6C63FF] text-[#6C63FF]'
                : 'border-b border-[#EEF0F6] text-gray-400'
            }`}
          >
            Menu
          </button>
        </div>

        {mobileTab === 'menu' && (
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="sticky top-0 z-10 overflow-x-auto border-b border-[#EEF0F6] bg-white"
                 style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
              <CategoryList
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                horizontal={true}
              />
            </div>

            <ProductGrid
              items={menuItems}
              billItems={billItems}
              onAddItem={(item) => handleAddItemToBill(item, 1)}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              viewMode={viewMode}
            />

            <BottomActions {...bottomActionProps} />
          </div>
        )}

        {mobileTab === 'bill' && (
          <div className="flex-1 overflow-y-auto bg-[#F8F8FB]">
            <div className="p-3">
              {billOrAmendmentBlock}
            </div>

            {keypadBlock}

            <BottomActions {...bottomActionProps} />
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP  (lg+)
         ══════════════════════════════════════════════════════ */}
      <div className="hidden flex-1 flex-col overflow-hidden lg:flex">
        <div className="flex-1 overflow-hidden">
          <div className="grid h-full grid-cols-[450px_174px_minmax(420px,1fr)] gap-3 px-4 pt-3 pb-2">

            <div className="flex min-h-0 flex-col gap-2">
              {billOrAmendmentBlock}
              {keypadBlock}
            </div>

            <div className="min-h-0 overflow-y-auto rounded-md border border-[#EEF0F6] bg-white p-3 scrollbar-thin">
              <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden rounded-md border border-[#EEF0F6] bg-white">
              <ProductGrid
                items={menuItems} billItems={billItems}
                onAddItem={(item) => handleAddItemToBill(item, 1)}
                selectedCategory={selectedCategory} searchQuery={searchQuery} viewMode={viewMode}
              />
            </div>

          </div>
        </div>
        <BottomActions {...bottomActionProps} />
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

    </AppLayout>
  );
};

export default BillingPage;