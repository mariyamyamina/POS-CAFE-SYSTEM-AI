import { icons } from '../../constants/icons'

const RecentTransactions = ({ data = [], onViewAll }) => {
  // Map API data to component format
  const transactions = data.map(tx => {
    try {
      const date = new Date(tx.created_at);
      return {
        bill: tx.bill_no,
        date: date.toLocaleString('en-US', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        amount: tx.total_amount,
        status: 'Completed'
      };
    } catch (e) {
      console.error('Error parsing date:', e);
      return {
        bill: tx.bill_no,
        date: 'Invalid date',
        amount: tx.total_amount,
        status: 'Completed'
      };
    }
  })

  return (
    <div className="flex flex-col rounded-xl border border-text-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-text-900">Recent Transactions</h3>
        <button
          type="button"
          className="text-[12px] font-semibold text-primary hover:text-primary-700"
          onClick={onViewAll}
        >
          View All
        </button>
      </div>

      <div className="mt-2 flex-1 divide-y divide-text-100">
        {transactions.length === 0 ? (
          <div className="text-center text-text-400 py-4">No transactions yet</div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.bill} className="flex items-center gap-3 py-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F3FF] text-primary">
                <icons.sales className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-text-900">{tx.bill}</p>
                <p className="truncate text-[10px] text-text-400">{tx.date}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-text-900">
                  ₹{tx.amount.toFixed(2)}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  {tx.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        className="mt-2 flex items-center justify-center gap-1 text-[12px] font-semibold text-primary hover:text-primary-700"
        onClick={onViewAll}
      >
        View All Transactions
        <icons.chevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default RecentTransactions