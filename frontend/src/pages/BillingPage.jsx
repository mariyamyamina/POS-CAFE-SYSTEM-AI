import React, { useState } from 'react';
import AppLayout from '../layout/AppLayout';
import Header from '../components/Header/Header';
import BillTable from '../components/Billing/BillTable';
import Keypad from '../components/Billing/Keypad';
import CategoryList from '../components/Menu/CategoryList';
import ProductGrid from '../components/Menu/ProductGrid';
import BottomActions from '../components/Billing/BottomActions';
import PriceAmendment from '../components/Billing/PriceAmendment';

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

  const handleRemoveItem     = (id) => setBillItems(billItems.filter((item) => item.id !== id));
  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) { handleRemoveItem(id); return; }
    setBillItems(billItems.map((item) => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleNewBill = () => { setBillItems([]); setTableNumber(''); setCovers(''); setItemNumberInput(''); setQuantityInput(1); setShowPriceAmendment(false); };
  const handlePriceAmendment       = () => setShowPriceAmendment(true);
  const handleQuickAdd             = (amount) => setBillItems([...billItems, { id: 999 + Math.floor(Math.random() * 100), name: `Quick Charge ₹${amount}`, quantity: 1, unitPrice: amount }]);
  const handleGiftVoucher          = () => {};
  const handleOpenCashBox          = () => {};
  const handleGoodsReturn          = () => {};
  const handleCancelItem           = () => { if (billItems.length > 0) handleRemoveItem(billItems[billItems.length - 1].id); };
  const handleAddItem              = () => {};
  const handleTerminateTransaction = () => { if (billItems.length > 0) setBillItems([]); };
  const handlePrint                = () => {};
  const handleReservedTransaction  = () => {};
  const handleDeleteAllTransaction = () => { if (billItems.length > 0) setBillItems([]); };
  const handleRestore              = () => {};
  const handleMainMenu             = () => {};

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
          - Tab bar is sticky at top
          - Tab content is ONE long scroll — nothing pinned
          - Menu tab: category strip → product grid → BottomActions
          - Bill tab:  BillTable → Keypad → BottomActions
         ══════════════════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">

        {/* Sticky tab bar */}
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

        {/* ── MENU TAB — full page scroll ── */}
        {mobileTab === 'menu' && (
          <div className="flex-1 overflow-y-auto bg-white">

            {/* Horizontal category strip — sticky below tab bar */}
            <div className="sticky top-0 z-10 overflow-x-auto border-b border-[#EEF0F6] bg-white"
                 style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
              <CategoryList
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                horizontal={true}
              />
            </div>

            {/* Product grid — natural height, scrolls with page */}
            <ProductGrid
              items={menuItems}
              billItems={billItems}
              onAddItem={(item) => handleAddItemToBill(item, 1)}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              viewMode={viewMode}
            />

            {/* BottomActions — scrolls into view at bottom of page */}
            <BottomActions {...bottomActionProps} />

          </div>
        )}

        {/* ── BILL TAB — full page scroll ── */}
        {mobileTab === 'bill' && (
          <div className="flex-1 overflow-y-auto bg-[#F8F8FB]">

            {/* BillTable */}
            <div className="p-3">
              {showPriceAmendment ? (
                <PriceAmendment
                  totalAmount={totalAmount}
                  onClose={() => setShowPriceAmendment(false)}
                />
              ) : (
                <BillTable
                  items={billItems}
                  onRemoveItem={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              )}
            </div>

            {/* Keypad */}
            {keypadBlock}

            {/* BottomActions — scrolls into view */}
            <BottomActions {...bottomActionProps} />

          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP  (lg+) — original 3-column + fixed footer
         ══════════════════════════════════════════════════════ */}
      <div className="hidden flex-1 flex-col overflow-hidden lg:flex">
        <div className="flex-1 overflow-hidden">
          <div className="grid h-full grid-cols-[450px_174px_minmax(420px,1fr)] gap-3 px-4 pt-3 pb-2">

            <div className="flex min-h-0 flex-col gap-2">
              {showPriceAmendment ? (
                <PriceAmendment totalAmount={totalAmount} onClose={() => setShowPriceAmendment(false)} />
              ) : (
                <BillTable items={billItems} onRemoveItem={handleRemoveItem} onUpdateQuantity={handleUpdateQuantity} />
              )}
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

    </AppLayout>
  );
};

export default BillingPage;