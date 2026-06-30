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
import { inventoryApi, categoriesApi, salesApi, settingsApi } from '../api';
import { printBill } from '../utils/printBill';

const BillingPage = ({ onToggleSidebar, onLogout, onNavigate, user }) => {
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
  const [menuItems, setMenuItems] = useState([]);
  const [mobileTab, setMobileTab] = useState('menu');

  // ── New state for the bill-row selection, tender input, and toast ──
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [tender, setTender] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  React.useEffect(() => {
    Promise.all([inventoryApi.getItems(), categoriesApi.getCategories()])
      .then(([itemsData, catsData]) => {
        const catMap = catsData.reduce((acc, cat) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {});

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
    const currentQtyInBill = idx !== -1 ? billItems[idx].quantity : 0;
    const totalRequestedQty = currentQtyInBill + qty;
    
    // Check if sufficient stock is available
    if (totalRequestedQty > item.in_stock) {
      showToast(`Only ${item.in_stock} ${item.name} available in stock`);
      return;
    }
    
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
    
    // Check if sufficient stock is available
    const item = billItems.find((i) => i.id === id);
    const menuItem = menuItems.find((m) => m.id === id);
    if (item && menuItem && newQty > menuItem.in_stock) {
      showToast(`Only ${menuItem.in_stock} ${menuItem.name} available in stock`);
      return;
    }
    
    setBillItems(billItems.map((item) => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleNewBill = () => {
    setBillItems([]); setTableNumber(''); setCovers(''); setItemNumberInput(''); setQuantityInput(1);
    setShowPriceAmendment(false); setSelectedItemId(null); setTender('');
  };

  const GST_RATE = 0.07;

const handlePrint = async () => {
      if (!showPriceAmendment) {
        showToast('Print is only available in Price Amendment');
        return;
      }
 
      if (billItems.length === 0) {
        showToast('Add items to the bill before printing');
        return;
      }
 
      const gstAmount = totalAmount * GST_RATE;
      const payable = totalAmount + gstAmount;
      const tenderNum = parseFloat(tender) || 0;
 
      if (tenderNum < payable) {
        showToast('Tender amount must be greater than or equal to payable amount');
        return;
      }
 
      try {
        const payload = {
          table_no: tableNumber || undefined,
          cover_no: covers ? parseInt(covers, 10) : undefined,
          total_amt: totalAmount,
          gst: gstAmount,
          payable: payable,
          tender: tenderNum,
          change_amt: tenderNum - payable,
          items: billItems.map((item) => ({
            item_id: item.id,
            item_name: item.name,
            qty: item.quantity,
            unit_price: item.unitPrice,
          })),
        };
 
        // createSale returns the full SaleResponse (id, bill_no, items, etc.)
        // — this is what printBill needs, not a separately-built paymentData object
        const sale = await salesApi.createSale(payload);
 
        // Best-effort: bill still prints with a fallback cafe name if this fails
        let settings = null;
        try {
          settings = await settingsApi.getSettings();
        } catch (err) {
          console.error('Failed to load settings for print:', err);
        }
 
        printBill(sale, settings);
        handleNewBill();
      } catch (error) {
        console.error('Failed to create sale:', error);
        showToast(error.message || 'Failed to save sale. Please try again.');
      }
    };

  const handlePriceAmendment = () => {
    if (totalAmount === 0) {
      showToast('Add items to the bill before price amendment');
      return;
    }
    setShowPriceAmendment(true);
  };

  const handleQuickAdd = (amount) => {
    if (!showPriceAmendment) {
      showToast('Quick add buttons only work in Price Amendment');
      return;
    }
    setTender((prev) => String((parseFloat(prev) || 0) + amount));
  };

  const handleGiftVoucher = () => { };
  const handleOpenCashBox = () => { };
  const handleGoodsReturn = () => { };

  const handleCancelItem = () => {
    if (!selectedItemId) {
      showToast('Select an item in the bill first');
      return;
    }
    const target = billItems.find((i) => i.id === selectedItemId);
    if (!target) return;
    handleUpdateQuantity(selectedItemId, target.quantity - 1);
  };

  const handleAddItem = () => {
    if (!selectedItemId) {
      showToast('Select an item in the bill first');
      return;
    }
    const target = billItems.find((i) => i.id === selectedItemId);
    if (!target) return;
    
    // Check if sufficient stock is available before adding
    const menuItem = menuItems.find((m) => m.id === selectedItemId);
    if (menuItem && target.quantity + 1 > menuItem.in_stock) {
      showToast(`Only ${menuItem.in_stock} ${menuItem.name} available in stock`);
      return;
    }
    
    handleUpdateQuantity(selectedItemId, target.quantity + 1);
  };

  const handleTerminateTransaction = () => {
    if (!showPriceAmendment) {
      showToast('Terminate can only happen in Price Amendment');
      return;
    }
    setShowPriceAmendment(false);
    setTender('');
  };

  const handleReservedTransaction = () => { };
  const handleDeleteAllTransaction = () => { if (billItems.length > 0) setBillItems([]); setSelectedItemId(null); };
  const handleRestore = () => { };
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

      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
        <div className="sticky top-0 z-10 flex shrink-0 bg-white shadow-sm">
          <button
            onClick={() => setMobileTab('bill')}
            className={`flex-1 py-3 text-[13px] font-semibold transition-colors ${mobileTab === 'bill'
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
            className={`flex-1 py-3 text-[13px] font-semibold transition-colors ${mobileTab === 'menu'
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