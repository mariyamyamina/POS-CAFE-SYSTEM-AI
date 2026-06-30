// printBill.js — builds the printable bill HTML and opens it in a new window.
//
// ⚠️ Your Settings model (cafe_name, time_format, logo, low_stock_threshold)
// has no address/phone fields, but the screenshot shows "Tirunelveli" and
// "Ph: 9876543210". These are hardcoded below as placeholders — either add
// address/phone columns to Settings and pass them in, or edit the constants
// directly here.

const CAFE_ADDRESS_FALLBACK = 'Tirunelveli';
const CAFE_PHONE_FALLBACK = 'Ph: 9876543210';

const formatBillDate = (date) =>
  date.toLocaleString('en-GB', {
    day: 'numeric', month: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
  }).replace(',', ',');

/**
 * @param {object} sale - the SaleResponse object returned from salesApi.createSale()
 * @param {object} settings - { cafe_name } from settingsApi.getSettings(), or null
 */
export const printBill = (sale, settings) => {
  const cafeName = settings?.cafe_name || 'POS Cafe';
  const billDate = formatBillDate(new Date(sale.created_at));

  const itemRows = sale.items.map((item) => `
    <tr>
      <td style="padding:6px 0;">${item.item_name}</td>
      <td style="padding:6px 0; text-align:center;">${item.qty}</td>
      <td style="padding:6px 0; text-align:right;">₹${item.unit_price.toFixed(2)}</td>
      <td style="padding:6px 0; text-align:right;">₹${item.total}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${sale.bill_no}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #1a1a1a;
            max-width: 420px;
            margin: 0 auto;
            padding: 32px 24px;
          }
          .logo-circle {
            width: 56px; height: 56px; border-radius: 50%;
            background: #7C3AED;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 12px;
          }
          .cafe-name { text-align: center; font-size: 22px; font-weight: 700; margin: 0; }
          .cafe-meta { text-align: center; font-size: 12px; color: #555; margin: 2px 0; }
          .divider { border-top: 1px solid #ddd; margin: 16px 0; }
          .bill-meta { font-size: 12px; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          thead th { text-align: left; font-size: 12px; font-weight: 700; padding-bottom: 8px; border-bottom: 1px solid #ddd; }
          thead th:nth-child(2) { text-align: center; }
          thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
          tbody tr td { border-bottom: none; }
          .totals-table { margin-top: 8px; }
          .totals-table td { padding: 4px 0; font-size: 13px; }
          .totals-table td:last-child { text-align: right; }
          .payable-row td { font-weight: 700; font-size: 14px; }
          .footer { text-align: center; margin-top: 24px; }
          .footer .thanks { font-weight: 700; font-size: 13px; margin-bottom: 2px; }
          .footer .visit { font-size: 12px; color: #555; }
          @media print {
            body { padding: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="logo-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M3 8h13a3 3 0 0 1 0 6h-1" />
            <path d="M3 8v7a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3V8" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
        </div>
        <p class="cafe-name">${cafeName}</p>
        <p class="cafe-meta">${CAFE_ADDRESS_FALLBACK}</p>
        <p class="cafe-meta">${CAFE_PHONE_FALLBACK}</p>

        <div class="divider"></div>

        <p class="bill-meta"><strong>Bill No : ${sale.bill_no}</strong></p>
        <p class="bill-meta">${billDate}</p>

        <div class="divider"></div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amt</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <div class="divider"></div>

        <table class="totals-table">
          <tr><td>Total</td><td>₹${sale.total_amt.toFixed(2)}</td></tr>
          <tr><td>GST (7%)</td><td>₹${sale.gst.toFixed(2)}</td></tr>
          <tr class="payable-row"><td>Payable</td><td>₹${sale.payable.toFixed(2)}</td></tr>
          <tr><td>Tender</td><td>₹${sale.tender.toFixed(2)}</td></tr>
          <tr><td>Change</td><td>₹${sale.change_amt.toFixed(2)}</td></tr>
        </table>

        <div class="footer">
          <p class="thanks">Thanks For Visiting</p>
          <p class="visit">Please Visit Again</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=480,height=720');
  if (!printWindow) {
    // Popup blocked — caller should toast this
    throw new Error('Unable to open print window. Please allow popups for this site.');
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};