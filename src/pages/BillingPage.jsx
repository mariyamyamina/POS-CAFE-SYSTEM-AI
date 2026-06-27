import React, { useState } from 'react';
import AppLayout from '../layout/AppLayout';
import Header from '../components/Header/Header';
import BillTable from '../components/Billing/BillTable';
import Keypad from '../components/Billing/Keypad';
import CategoryList from '../components/Menu/CategoryList';
import ProductGrid from '../components/Menu/ProductGrid';
import BottomActions from '../components/Billing/BottomActions';
import PriceAmendment from '../components/Billing/PriceAmendment';

// Detailed mock menu items matching reference image and food categories
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
  // Billing panel states
  const [billItems, setBillItems] = useState([]);
  const [itemNumberInput, setItemNumberInput] = useState('');
  const [quantityInput, setQuantityInput] = useState(1);

  // Table info and Keypad states
  const [tableNumber, setTableNumber] = useState('');
  const [covers, setCovers] = useState('');
  const [activeField, setActiveField] = useState('table');

  // Menu and Header states
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Price Amendment panel toggle
  const [showPriceAmendment, setShowPriceAmendment] = useState(false);

  // Calculate bill total amount
  const totalAmount = billItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  // Add selected item to current bill
  const handleAddItemToBill = (item, qty = 1) => {
    const existingIndex = billItems.findIndex((bi) => bi.id === item.id);
    if (existingIndex !== -1) {
      const updated = [...billItems];
      updated[existingIndex].quantity += qty;
      setBillItems(updated);
    } else {
      setBillItems([
        ...billItems,
        {
          id: item.id,
          name: item.name,
          quantity: qty,
          unitPrice: item.price,
          image: item.image,
        },
      ]);
    }
  };

  // Handle addition via manual Item Number input
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

  // Handle removing an item
  const handleRemoveItem = (id) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  // Handle changing quantity in the list directly
  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setBillItems(
      billItems.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Handle Bottom Group Action Clicks
  const handleNewBill = () => {
    setBillItems([]);
    setTableNumber('');
    setCovers('');
    setItemNumberInput('');
    setQuantityInput(1);
    setShowPriceAmendment(false);
  };

  const handlePriceAmendment = () => {
    setShowPriceAmendment(true);
  };

  const handleQuickAdd = (amount) => {
    setBillItems([
      ...billItems,
      {
        id: 999 + Math.floor(Math.random() * 100),
        name: `Quick Charge ₹${amount}`,
        quantity: 1,
        unitPrice: amount,
      }
    ]);
  };

  const handleGiftVoucher = () => {};
  const handleOpenCashBox = () => {};
  const handleGoodsReturn = () => {};

  const handleCancelItem = () => {
    if (billItems.length > 0) {
      const lastItem = billItems[billItems.length - 1];
      handleRemoveItem(lastItem.id);
    }
  };

  const handleAddItem = () => {};

  const handleTerminateTransaction = () => {
    if (billItems.length === 0) return;
    setBillItems([]);
  };

  const handlePrint = () => {};
  const handleReservedTransaction = () => {};

  const handleDeleteAllTransaction = () => {
    if (billItems.length > 0) {
      setBillItems([]);
    }
  };

  const handleRestore = () => {};
  const handleMainMenu = () => {};

  return (
    <AppLayout activePage="billing" onLogout={onLogout} onNavigate={onNavigate}>
      {/* Header component */}
      <Header
        title="Current Bill"
        totalAmount={totalAmount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleSidebar={onToggleSidebar}
      />

      {/* Main Content Area: 3-column layout */}
      <div className="flex-1 overflow-hidden bg-[#F8F8FB]">
        <div className="grid h-full grid-cols-1 gap-3 px-3 pb-2 lg:grid-cols-[450px_174px_minmax(420px,1fr)] lg:px-4">

          {/* ==========================================
              LEFT PANEL (Billing / Cart Panel) — 40%
             ========================================== */}
          <div className="flex min-h-0 flex-col gap-2">
            {/* Cart Bill Table or Price Amendment */}
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

            {/* Keypad Section */}
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

          {/* ==========================================
              MIDDLE PANEL (Category Panel) — 20%
             ========================================== */}
          <div className="min-h-0 overflow-y-auto rounded-md border border-[#EEF0F6] bg-white p-3 scrollbar-thin">
            <CategoryList
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* ==========================================
              RIGHT PANEL (Product Grid) — 40%
             ========================================== */}
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

      {/* Bottom Action Bar */}
      <BottomActions
        onNewBill={handleNewBill}
        onPriceAmendment={handlePriceAmendment}
        onQuickAdd={handleQuickAdd}
        onGiftVoucher={handleGiftVoucher}
        onOpenCashBox={handleOpenCashBox}
        onGoodsReturn={handleGoodsReturn}
        onCancelItem={handleCancelItem}
        onAddItem={handleAddItem}
        onTerminateTransaction={handleTerminateTransaction}
        onPrint={handlePrint}
        onReservedTransaction={handleReservedTransaction}
        onDeleteAllTransaction={handleDeleteAllTransaction}
        onRestore={handleRestore}
        onMainMenu={handleMainMenu}
      />
    </AppLayout>
  );
};

export default BillingPage;
