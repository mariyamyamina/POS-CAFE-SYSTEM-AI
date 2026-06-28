import React, { useState } from 'react';
import AppLayout from '../layout/AppLayout';
import Header from '../components/Header/Header';
import BillTable from '../components/Billing/BillTable';
import Keypad from '../components/Billing/Keypad';
import CategoryList from '../components/Menu/CategoryList';
import ProductGrid from '../components/Menu/ProductGrid';
import BottomActions from '../components/Billing/BottomActions';
import PriceAmendment from '../components/Billing/PriceAmendment';

const MENU_ITEMS = [
  { id: 101, name: 'Chocolate Milkshake', price: 100.00, category: 'Beverage', image: 'images/chocolate-milkshake.png' },
  { id: 102, name: 'Hot Chocolate', price: 70.00, category: 'Beverage', image: 'images/hot-chocolate.png' },
  { id: 103, name: 'Cream Roll', price: 40.00, category: 'Bake', image: 'images/cream-roll.png' },
  { id: 104, name: 'Smoothie', price: 70.00, category: 'Beverage', image: 'images/smoothie.png' },
  { id: 105, name: 'Mocktail', price: 40.00, category: 'Beverage', image: 'images/mocktail.png' },
  { id: 106, name: 'Mojito', price: 30.00, category: 'Beverage', image: 'images/mojito.png' },
  { id: 107, name: 'Green Tea', price: 14.86, category: 'Beverage', image: 'images/green-tea.png' },
  { id: 108, name: 'Black Tea', price: 20.00, category: 'Beverage', image: '/images/black-tea.png' },
  { id: 109, name: 'Masala Tea', price: 40.00, category: 'Beverage', image: '/images/masala-tea.png' },
  { id: 111, name: 'elaichi tea', price: 29.91, category: 'Beverage', image: 'images/elaichi-tea.png' },
  { id: 113, name: 'Cappuccino', price: 200.00, category: 'Beverage', image: 'images/Cappuccino.png' },
  { id: 114, name: 'Almond Milk', price: 80.00, category: 'Beverage', image: 'images/almond-milk.png' },
  { id: 115, name: 'Ginger Tea', price: 20.00, category: 'Beverage', image: 'images/ginger-tea.png' },
  { id: 116, name: 'Rice Porridge', price: 50.00, category: 'Porridge', image: 'images/rice-porridge.png' },
  { id: 117, name: 'Wonton Noodle', price: 30.00, category: 'Noodle/Dumplings', image: 'images/wonton-noodle.png' },
  { id: 118, name: 'Veg Momos', price: 79.94, category: 'Noodle/Dumplings', image: 'images/veg-momos.png' },
  { id: 119, name: 'Chicken Momos', price: 119.87, category: 'Noodle/Dumplings', image: 'images/chicken-momos.png' },
  { id: 120, name: 'Paneer Momos', price: 99.87, category: 'Noodle/Dumplings', image: 'images/paneer-momos.png' },
  { id: 121, name: 'Chicken Bun', price: 120, category: 'Bake', image: 'images/chicken-bun.png' },
  { id: 122, name: 'Paneer Bun', price: 70.87, category: 'Bake', image: 'images/paneer-bun.png' },
  { id: 123, name: 'Veg Bun', price: 50, category: 'Bake', image: 'images/veg-bun.png' },
  { id: 124, name: 'Veg Puff', price: 20, category: 'Steamed Bun', image: 'images/veg-puff.png' },
  { id: 125, name: 'egg puff', price: 30, category: 'Steamed Bun', image: 'images/egg-puff.png' },
];

const BillingPage = ({ onToggleSidebar, onLogout, onNavigate }) => {
  const [billItems, setBillItems] = useState([]);
  const [itemNumberInput, setItemNumberInput] = useState('');
  const [quantityInput, setQuantityInput] = useState(1);
  const [tableNumber, setTableNumber] = useState('');
  const [covers, setCovers] = useState('');
  const [activeField, setActiveField] = useState('table');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showPriceAmendment, setShowPriceAmendment] = useState(false);
  const [mobileTab, setMobileTab] = useState('menu');

  const totalAmount = billItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleAddItemToBill = (item, qty = 1) => {
    const existingIndex = billItems.findIndex((bi) => bi.id === item.id);
    if (existingIndex !== -1) {
      const updated = [...billItems];
      updated[existingIndex].quantity += qty;
      setBillItems(updated);
    } else {
      setBillItems([
        ...billItems,
        { id: item.id, name: item.name, quantity: qty, unitPrice: item.price, image: item.image },
      ]);
    }
  };

  const handleManualAdd = () => {
    if (!itemNumberInput.trim()) return;
    const itemCode = parseInt(itemNumberInput.trim(), 10);
    const matched = MENU_ITEMS.find((item) => item.id === itemCode);
    if (matched) {
      handleAddItemToBill(matched, quantityInput);
      setItemNumberInput('');
      setQuantityInput(1);
    }
  };

  const handleRemoveItem = (id) => setBillItems(billItems.filter((item) => item.id !== id));

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) { handleRemoveItem(id); return; }
    setBillItems(billItems.map((item) => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleNewBill = () => {
    setBillItems([]);
    setTableNumber('');
    setCovers('');
    setItemNumberInput('');
    setQuantityInput(1);
    setShowPriceAmendment(false);
  };

  const handlePriceAmendment = () => setShowPriceAmendment(true);

  const handleQuickAdd = (amount) => {
    setBillItems([
      ...billItems,
      { id: 999 + Math.floor(Math.random() * 100), name: `Quick Charge ₹${amount}`, quantity: 1, unitPrice: amount },
    ]);
  };

  const handleGiftVoucher = () => {};
  const handleOpenCashBox = () => {};
  const handleGoodsReturn = () => {};
  const handleCancelItem = () => {
    if (billItems.length > 0) handleRemoveItem(billItems[billItems.length - 1].id);
  };
  const handleAddItem = () => {};
  const handleTerminateTransaction = () => { if (billItems.length > 0) setBillItems([]); };
  const handlePrint = () => {};
  const handleReservedTransaction = () => {};
  const handleDeleteAllTransaction = () => { if (billItems.length > 0) setBillItems([]); };
  const handleRestore = () => {};
  const handleMainMenu = () => {};

  const bottomActionProps = {
    onNewBill: handleNewBill,
    onPriceAmendment: handlePriceAmendment,
    onQuickAdd: handleQuickAdd,
    onGiftVoucher: handleGiftVoucher,
    onOpenCashBox: handleOpenCashBox,
    onGoodsReturn: handleGoodsReturn,
    onCancelItem: handleCancelItem,
    onAddItem: handleAddItem,
    onTerminateTransaction: handleTerminateTransaction,
    onPrint: handlePrint,
    onReservedTransaction: handleReservedTransaction,
    onDeleteAllTransaction: handleDeleteAllTransaction,
    onRestore: handleRestore,
    onMainMenu: handleMainMenu,
  };

  return (
    <AppLayout activePage="billing" onLogout={onLogout} onNavigate={onNavigate}>

      {/* Header */}
      <Header
        title="Current Bill"
        totalAmount={totalAmount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleSidebar={onToggleSidebar}
      />

      {/* ═══════════════════════════════════════════
          MOBILE  (below lg) — tabs + full scroll
         ═══════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">

        {/* Tab bar */}
        <div className="flex shrink-0 border-b border-[#EEF0F6] bg-white">
          <button
            onClick={() => setMobileTab('bill')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              mobileTab === 'bill'
                ? 'border-b-2 border-[#6C63FF] text-[#6C63FF]'
                : 'text-gray-400'
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
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              mobileTab === 'menu'
                ? 'border-b-2 border-[#6C63FF] text-[#6C63FF]'
                : 'text-gray-400'
            }`}
          >
            Menu
          </button>
        </div>

        {/* BILL TAB — everything scrolls freely */}
        {mobileTab === 'bill' && (
          <div className="flex-1 overflow-y-auto bg-[#F8F8FB]">

            {/* Keypad / item input */}
            <div className="bg-white px-3 pt-3 pb-2">
              <Keypad
                tableNumber={tableNumber}
                onTableNumberChange={setTableNumber}
                covers={covers}
                onCoversChange={setCovers}
                itemNumber={itemNumberInput}
                onItemNumberChange={setItemNumberInput}
                quantity={quantityInput}
                onQuantityChange={setQuantityInput}
                onAdd={handleManualAdd}
                activeField={activeField}
                onActiveFieldChange={setActiveField}
              />
            </div>

            {/* Bill table — only when items exist */}
            {billItems.length > 0 && !showPriceAmendment && (
              <div className="mx-3 mt-2 rounded-md bg-white">
                <BillTable
                  items={billItems}
                  onRemoveItem={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              </div>
            )}

            {/* Price Amendment */}
            {showPriceAmendment && (
              <div className="mx-3 mt-2 rounded-md bg-white">
                <PriceAmendment
                  totalAmount={totalAmount}
                  onClose={() => setShowPriceAmendment(false)}
                />
              </div>
            )}

            {/* Action buttons — inline, not fixed */}
            <div className="mt-2">
              <BottomActions {...bottomActionProps} />
            </div>

          </div>
        )}

        {/* MENU TAB — category strip + scrollable product grid */}
        {mobileTab === 'menu' && (
          <div className="flex flex-1 flex-col overflow-hidden bg-white">
            <div className="shrink-0 overflow-x-auto border-b border-[#EEF0F6]">
              <div className="flex min-w-max">
                <CategoryList
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  horizontal={true}
                />
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ProductGrid
                items={MENU_ITEMS}
                billItems={billItems}
                onAddItem={(item) => handleAddItemToBill(item, 1)}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                viewMode={viewMode}
              />
            </div>
          </div>
        )}

      </div>

      {/* ═══════════════════════════════════════════
          DESKTOP  (lg+) — original 3-column layout
         ═══════════════════════════════════════════ */}
      <div className="hidden flex-1 flex-col overflow-hidden lg:flex">
        <div className="flex-1 overflow-hidden">
          <div className="grid h-full grid-cols-[450px_174px_minmax(420px,1fr)] gap-3 px-4 pt-3 pb-2">

            {/* LEFT — Bill + Keypad */}
            <div className="flex min-h-0 flex-col gap-2">
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
              <Keypad
                tableNumber={tableNumber}
                onTableNumberChange={setTableNumber}
                covers={covers}
                onCoversChange={setCovers}
                itemNumber={itemNumberInput}
                onItemNumberChange={setItemNumberInput}
                quantity={quantityInput}
                onQuantityChange={setQuantityInput}
                onAdd={handleManualAdd}
                activeField={activeField}
                onActiveFieldChange={setActiveField}
              />
            </div>

            {/* MIDDLE — Categories */}
            <div className="min-h-0 overflow-y-auto rounded-md border border-[#EEF0F6] bg-white p-3 scrollbar-thin">
              <CategoryList
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* RIGHT — Product grid */}
            <div className="flex min-h-0 flex-col overflow-hidden rounded-md border border-[#EEF0F6] bg-white">
              <ProductGrid
                items={MENU_ITEMS}
                billItems={billItems}
                onAddItem={(item) => handleAddItemToBill(item, 1)}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                viewMode={viewMode}
              />
            </div>

          </div>
        </div>

        {/* Desktop bottom action bar */}
        <BottomActions {...bottomActionProps} />
      </div>

    </AppLayout>
  );
};

export default BillingPage;