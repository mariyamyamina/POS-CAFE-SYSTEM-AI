import React, { useState, useEffect } from 'react';
import AppLayout from '../layout/AppLayout';
import Header from '../components/Header/Header';
import BillTable from '../components/Cart/BillTable';
import ItemEntry from '../components/Billing/ItemEntry';
import Keypad from '../components/Keypad/Keypad';
import CategoryList from '../components/Menu/CategoryList';
import ProductGrid from '../components/Menu/ProductGrid';
import BottomActions from '../components/BottomActions/BottomActions';

// Detailed mock menu items matching reference image and food categories
const MENU_ITEMS = [
  { id: 101, name: 'Chocolate Milkshake', price: 100.00, category: 'Beverage', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&auto=format&fit=crop&q=60' },
  { id: 102, name: 'Hot Chocolate', price: 70.00, category: 'Beverage', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&auto=format&fit=crop&q=60' },
  { id: 103, name: 'Cream Roll', price: 40.00, category: 'Bake', image: 'https://images.unsplash.com/photo-1621303837876-254c6802e707?w=300&auto=format&fit=crop&q=60' },
  { id: 104, name: 'Smoothie', price: 70.00, category: 'Beverage', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&auto=format&fit=crop&q=60' },
  { id: 105, name: 'Mocktail', price: 40.00, category: 'Beverage', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=60' },
  { id: 106, name: 'Mojito', price: 30.00, category: 'Beverage', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=60' },
  { id: 107, name: 'Green Tea', price: 14.86, category: 'Beverage', image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=300&auto=format&fit=crop&q=60' },
  { id: 108, name: 'Black Tea', price: 20.00, category: 'Beverage', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=60' },
  { id: 109, name: 'Masala Tea', price: 40.00, category: 'Beverage', image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=300&auto=format&fit=crop&q=60' },
  { id: 110, name: 'Apple Juice', price: 60.00, category: 'Fresh Juice', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&auto=format&fit=crop&q=60' },
  { id: 111, name: 'elaichi tea', price: 29.91, category: 'Beverage', image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=300&auto=format&fit=crop&q=60' },
  { id: 112, name: 'Orange Juice', price: 69.99, category: 'Fresh Juice', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&auto=format&fit=crop&q=60' },
  { id: 113, name: 'Cappuccino', price: 200.00, category: 'Beverage', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&auto=format&fit=crop&q=60' },
  { id: 114, name: 'Almond Milk', price: 80.00, category: 'Beverage', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=60' },
  { id: 115, name: 'Ginger Tea', price: 20.00, category: 'Beverage', image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=300&auto=format&fit=crop&q=60' },
  { id: 116, name: 'Rice Porridge', price: 50.00, category: 'Porridge', image: 'https://images.unsplash.com/photo-1614088921876-0bf176b6de3d?w=300&auto=format&fit=crop&q=60' },
  { id: 117, name: 'Wonton Noodle', price: 30.00, category: 'Noodle/Dumplings', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&auto=format&fit=crop&q=60' },
  { id: 118, name: 'Veg Momos', price: 79.94, category: 'Noodle/Dumplings', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&auto=format&fit=crop&q=60' },
  { id: 119, name: 'Chicken Momos', price: 119.87, category: 'Noodle/Dumplings', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&auto=format&fit=crop&q=60' },
  { id: 120, name: 'Paneer Momos', price: 99.87, category: 'Noodle/Dumplings', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&auto=format&fit=crop&q=60' },
  
  // Category-specific fallbacks to populate other categories
  { id: 201, name: 'Steamed Pork Bun', price: 45.00, category: 'Steamed Bun', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=60' },
  { id: 202, name: 'Steamed Chicken Bun', price: 40.00, category: 'Steamed Bun', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=60' },
  { id: 301, name: 'Shrimp Dumpling', price: 60.00, category: 'Streamed Timsum', image: 'https://images.unsplash.com/photo-1496116211227-00741f409b5d?w=300&auto=format&fit=crop&q=60' },
  { id: 302, name: 'Pork Dumpling', price: 55.00, category: 'Streamed Timsum', image: 'https://images.unsplash.com/photo-1496116211227-00741f409b5d?w=300&auto=format&fit=crop&q=60' },
  { id: 401, name: 'Spring Roll', price: 35.00, category: 'Deep Fry Timsum', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=60' },
  { id: 402, name: 'Fried Wonton', price: 40.00, category: 'Deep Fry Timsum', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=60' },
  { id: 501, name: 'Egg Tart', price: 30.00, category: 'Bake', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=60' },
  { id: 502, name: 'Pineapple Bun', price: 25.00, category: 'Bake', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=60' },
  { id: 601, name: 'Seafood Porridge', price: 75.00, category: 'Porridge', image: 'https://images.unsplash.com/photo-1614088921876-0bf176b6de3d?w=300&auto=format&fit=crop&q=60' },
  { id: 701, name: 'Watermelon Juice', price: 55.00, category: 'Fresh Juice', image: 'https://images.unsplash.com/photo-1589733901241-5e3412566718?w=300&auto=format&fit=crop&q=60' },
];

const BillingPage = ({ onToggleSidebar }) => {
  // Billing panel states
  const [billItems, setBillItems] = useState([]);
  const [itemNumberInput, setItemNumberInput] = useState('');
  const [quantityInput, setQuantityInput] = useState(1);
  
  // Table info and Keypad states
  const [tableNumber, setTableNumber] = useState('');
  const [covers, setCovers] = useState('');
  const [activeField, setActiveField] = useState('table'); // 'table' or 'covers'
  
  // Menu and Header states
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // Feedback toast message state
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Show a popup toast
  const triggerToast = (message, type = 'info') => {
    setToast({ message, type });
  };

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
      triggerToast(`Increased quantity of ${item.name}`);
    } else {
      setBillItems([
        ...billItems,
        {
          id: item.id,
          name: item.name,
          quantity: qty,
          unitPrice: item.price,
        },
      ]);
      triggerToast(`Added ${item.name} to bill`);
    }
  };

  // Handle addition via manual Item Number input
  const handleManualAdd = () => {
    if (!itemNumberInput.trim()) {
      triggerToast("Please scan or enter an item number", "error");
      return;
    }

    const itemCode = parseInt(itemNumberInput.trim(), 10);
    const matched = MENU_ITEMS.find((item) => item.id === itemCode);

    if (matched) {
      handleAddItemToBill(matched, quantityInput);
      setItemNumberInput('');
      setQuantityInput(1);
    } else {
      triggerToast(`Item code #${itemNumberInput} not found in menu`, "error");
    }
  };

  // Handle removing an item
  const handleRemoveItem = (id) => {
    const matched = billItems.find((item) => item.id === id);
    setBillItems(billItems.filter((item) => item.id !== id));
    if (matched) {
      triggerToast(`Removed ${matched.name} from bill`, "warning");
    }
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
    triggerToast("Cleared and started a New Bill", "success");
  };

  const handlePriceAmendment = () => {
    triggerToast("Mock Action: Price Amendment activated");
  };

  const handleQuickAdd = (amount) => {
    // Quick adds a dummy cash item or adjusts amount
    setBillItems([
      ...billItems,
      {
        id: 999 + Math.floor(Math.random() * 100),
        name: `Quick Charge ₹${amount}`,
        quantity: 1,
        unitPrice: amount,
      }
    ]);
    triggerToast(`Added Quick Charge ₹${amount} to bill`);
  };

  const handleGiftVoucher = () => {
    triggerToast("Mock Action: Applied Gift Voucher");
  };

  const handleOpenCashBox = () => {
    triggerToast("Mock Action: Cash Drawer Box Opened", "success");
  };

  const handleGoodsReturn = () => {
    triggerToast("Mock Action: Goods Return transaction registered");
  };

  const handleCancelItem = () => {
    if (billItems.length > 0) {
      const lastItem = billItems[billItems.length - 1];
      handleRemoveItem(lastItem.id);
    } else {
      triggerToast("No items to cancel", "warning");
    }
  };

  const handleAddItem = () => {
    triggerToast("Mock Action: Custom item adding panel");
  };

  const handleTerminateTransaction = () => {
    if (billItems.length === 0) {
      triggerToast("Cart is empty. Nothing to terminate.", "warning");
      return;
    }
    triggerToast(`Transaction terminated. Total Settled: ₹${totalAmount.toFixed(2)}`, "success");
    setBillItems([]);
  };

  const handlePrint = () => {
    if (billItems.length === 0) {
      triggerToast("Bill is empty. Add items to print receipt.", "warning");
      return;
    }
    triggerToast("Mock Action: Printing receipt invoice...", "success");
  };

  const handleReservedTransaction = () => {
    triggerToast("Mock Action: Transaction placed on Hold / Reserved");
  };

  const handleDeleteAllTransaction = () => {
    if (billItems.length > 0) {
      setBillItems([]);
      triggerToast("Deleted all items in current transaction", "error");
    } else {
      triggerToast("Nothing to delete", "warning");
    }
  };

  const handleRestore = () => {
    triggerToast("Mock Action: Restoring last transaction state");
  };

  const handleMainMenu = () => {
    triggerToast("Mock Action: Redirecting to POS Main Menu");
  };

  return (
    <AppLayout activePage="billing">
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

      {/* Toast Banner Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl px-5 py-3 shadow-lg text-white font-semibold transition-all duration-300 transform animate-bounce text-sm bg-slate-900 border border-white/10">
          {toast.type === 'success' && <span className="text-emerald-400">✓</span>}
          {toast.type === 'error' && <span className="text-rose-400">✗</span>}
          {toast.type === 'warning' && <span className="text-amber-400">!</span>}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Content Area: 3-column layout */}
      <div className="flex-1 overflow-hidden bg-[#F8F8FB]">
        <div className="grid h-full grid-cols-1 gap-3 px-3 pb-2 lg:grid-cols-[450px_174px_minmax(420px,1fr)] lg:px-4">
          
          {/* ==========================================
              LEFT PANEL (Billing / Cart Panel) — 40%
             ========================================== */}
          <div className="flex min-h-0 flex-col gap-2">
            {/* Cart Bill Table */}
            <BillTable
              items={billItems}
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
            />

            {/* Item Entry Section */}
            <ItemEntry
              itemNumber={itemNumberInput}
              onItemNumberChange={setItemNumberInput}
              quantity={quantityInput}
              onQuantityChange={setQuantityInput}
              onAdd={handleManualAdd}
            />

            {/* Keypad Section */}
            <Keypad
              tableNumber={tableNumber}
              onTableNumberChange={setTableNumber}
              covers={covers}
              onCoversChange={setCovers}
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
