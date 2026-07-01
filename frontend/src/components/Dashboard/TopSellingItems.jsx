import { icons } from '../../constants/icons'

const FILTERS = ['This Week', 'Last Week', 'This Month']

const TopSellingItems = ({ data = [], loading = false, onViewAll, selectedFilter = 'This Week', onFilterChange }) => {
  // Map API data to component format
  const items = (data || []).map(item => ({
    name: item.item_name,
    qty: item.total_sold,
    revenue: item.total_revenue,
    image: item.image_url
  }))

  return (
    <div className="flex flex-col rounded-xl border border-text-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-text-900">Top Selling Items</h3>
        <div className="relative">
          <select
            value={selectedFilter}
            onChange={(e) => onFilterChange?.(e.target.value)}
            className="appearance-none rounded-md border border-text-100 bg-white pl-2.5 pr-7 py-1.5 text-[11px] font-medium text-text-600 outline-none cursor-pointer hover:bg-text-50"
          >
            {FILTERS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          <icons.chevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-text-400" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[1.4fr_0.6fr_0.7fr] text-[11px] font-semibold text-text-400">
        <span>Items</span>
        <span className="text-center">Qty Sold</span>
        <span className="text-right">Revenue</span>
      </div>

      <div className="mt-1 flex-1 divide-y divide-text-100">
        {loading ? (
          <div className="text-center text-text-400 py-4">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-text-400 py-4">No sales data yet</div>
        ) : (
          items.map((item, i) => (
            <div key={item.name} className="grid grid-cols-[1.4fr_0.6fr_0.7fr] items-center gap-2 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <span className="w-3 text-[12px] font-medium text-text-400">{i + 1}.</span>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#F4F5F9]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-7 w-7 object-contain"
                      onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <icons.logo className="h-5 w-5 text-primary" style={{ display: item.image ? 'none' : 'flex' }} />
                </div>
                <span className="truncate text-[10px] font-medium text-text-800">{item.name}</span>
              </div>
              <span className="text-center text-[10px] font-semibold text-text-700">{item.qty}</span>
              <span className="text-right text-[10px] font-semibold text-text-900">{Number(item.revenue ?? 0).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        className="mt-2 flex items-center justify-center gap-1 text-[12px] font-semibold text-primary hover:text-primary-700"
        onClick={onViewAll}
      >
        View All Products
        <icons.chevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default TopSellingItems