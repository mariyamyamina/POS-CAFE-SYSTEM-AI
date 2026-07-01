import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { icons } from '../../constants/icons'

const FILTERS = ['Daily', 'Weekly', 'Monthly']
const MAX_POINTS = 7

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-primary">
          Sales: ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

/* ─── Date bucketing helpers ─────────────────────────────────────────── */

// Monday-start week
const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay() // 0 (Sun) .. 6 (Sat)
  const diff = day === 0 ? 6 : day - 1 // days since Monday
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const getMonthStart = (date) => {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

const formatLabel = (date, granularity) =>
  granularity === 'monthly'
    ? date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    : date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })

/**
 * Turns raw daily {date, total} rows into chart-ready points, aggregated
 * by the selected filter and capped to the last MAX_POINTS buckets.
 */
const buildChartData = (rawData, filter) => {
  const parsed = (rawData || [])
    .map((item) => {
      const date = new Date(item.date)
      return { date, total: Number(item.total) || 0 }
    })
    .filter((item) => !Number.isNaN(item.date.getTime()))
    .sort((a, b) => a.date - b.date)

  if (filter === 'Daily') {
    return parsed.slice(-MAX_POINTS).map((item) => ({
      date: formatLabel(item.date, 'daily'),
      sales: item.total,
    }))
  }

  const granularity = filter === 'Monthly' ? 'monthly' : 'weekly'
  const bucketStart = granularity === 'monthly' ? getMonthStart : getWeekStart

  const buckets = new Map()
  parsed.forEach((item) => {
    const start = bucketStart(item.date)
    const key = start.getTime()
    const existing = buckets.get(key)
    if (existing) {
      existing.total += item.total
    } else {
      buckets.set(key, { date: start, total: item.total })
    }
  })

  return [...buckets.values()]
    .sort((a, b) => a.date - b.date)
    .slice(-MAX_POINTS)
    .map((bucket) => ({
      date: formatLabel(bucket.date, granularity),
      sales: bucket.total,
    }))
}

export const SalesOverviewChart = ({ data = [] }) => {
  const [filter, setFilter] = useState('Daily')

  const chartData = useMemo(() => buildChartData(data, filter), [data, filter])
  const totalSales = chartData.reduce((sum, item) => sum + Number(item.sales), 0)

  return (
    <div className="h-full bg-white rounded-lg border border-gray-100 shadow-sm p-3">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900">
          Sales Overview
        </h3>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-[0.7rem] font-semibold text-gray-600 pl-3 pr-7 py-1.5 rounded-xl focus:outline-none cursor-pointer"
          >
            {FILTERS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <icons.chevronDown className="h-3.5 w-3.5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-0.5 bg-violet-600 rounded" />
        <span className="text-xs text-gray-500">
          Sales (₹)
        </span>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 15, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id="salesGrad"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#7C3AED"
                stopOpacity={0.15}
              />
              <stop
                offset="95%"
                stopColor="#7C3AED"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#F3F4F6"
          />

          <XAxis
            dataKey="date"
            interval={0}
            padding={{ left: 12, right: 12 }}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="sales"
            stroke="#7C3AED"
            strokeWidth={2.5}
            fill="url(#salesGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#7C3AED' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 bg-violet-100 rounded-lg p-3">
        <div>
          <p className="text-[0.6rem] text-gray-500">
            Total Sales
          </p>
          <p className="text-base font-extrabold text-gray-900">
            ₹{totalSales.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[0.6rem] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
            Sales Trend
          </span>
        </div>
      </div>
    </div>
  )
}

export default SalesOverviewChart