import { useMemo } from 'react'
import { BarChart3, TrendingUp, Award, Users, PackageCheck } from 'lucide-react'

const money = value => `$${Number(value || 0).toFixed(2)}`

const getOrderItems = order => Array.isArray(order.items) ? order.items : []

function SalesAnalytics({ orders = [] }) {
  const analytics = useMemo(() => {
    const now = new Date()
    const monthlySales = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const total = orders.reduce((sum, order) => {
        const orderDate = order.date ? new Date(order.date) : null
        if (!orderDate || Number.isNaN(orderDate.getTime())) return sum
        return `${orderDate.getFullYear()}-${orderDate.getMonth()}` === key
          ? sum + Number(order.total || 0)
          : sum
      }, 0)
      return {
        label: date.toLocaleDateString('en-US', { month: 'short' }),
        total,
      }
    })

    const productSales = {}
    orders.forEach(order => {
      getOrderItems(order).forEach(item => {
        const id = item.id ?? item.title
        if (!id) return
        if (!productSales[id]) {
          productSales[id] = { title: item.title || 'Unnamed product', quantity: 0, revenue: 0 }
        }
        const quantity = Number(item.quantity || 1)
        productSales[id].quantity += quantity
        productSales[id].revenue += Number(item.price || 0) * quantity
      })
    })

    const statuses = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
    const statusCounts = statuses.map(status => ({
      status,
      count: orders.filter(order => (order.status || 'Order Placed') === status).length,
    }))

    const emailCounts = {}
    orders.forEach(order => {
      const email = order.customer?.email?.trim().toLowerCase()
      if (email) emailCounts[email] = (emailCounts[email] || 0) + 1
    })

    return {
      monthlySales,
      bestSellers: Object.values(productSales).sort((a, b) => b.quantity - a.quantity).slice(0, 5),
      statusCounts,
      averageOrderValue: orders.length
        ? orders.reduce((sum, order) => sum + Number(order.total || 0), 0) / orders.length
        : 0,
      repeatCustomers: Object.values(emailCounts).filter(count => count > 1).length,
      maxMonthlySales: Math.max(...monthlySales.map(month => month.total), 1),
    }
  }, [orders])

  const totalSales = analytics.monthlySales.reduce((sum, month) => sum + month.total, 0)
  const maxStatusCount = Math.max(...analytics.statusCounts.map(item => item.count), 1)

  return (
    <section className="mt-8 space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-2 text-orange-300">
          <BarChart3 size={19} />
          <span className="text-sm font-semibold uppercase tracking-wide">Business Insights</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Sales Analytics & Customer Statistics</h2>
        <p className="mt-1 text-sm text-slate-400">Insights calculated from orders saved in this browser.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-sm">Sales in Last 6 Months</span>
            <TrendingUp className="text-emerald-300" size={20} />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{money(totalSales)}</p>
          <p className="mt-1 text-xs text-slate-500">Based on order dates</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-sm">Average Order Value</span>
            <PackageCheck className="text-orange-300" size={20} />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{money(analytics.averageOrderValue)}</p>
          <p className="mt-1 text-xs text-slate-500">Average total per order</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-sm">Repeat Customers</span>
            <Users className="text-amber-300" size={20} />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{analytics.repeatCustomers}</p>
          <p className="mt-1 text-xs text-slate-500">Customers with more than one order</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold text-white">Monthly Sales</h3>
          <p className="mb-6 mt-1 text-sm text-slate-400">Revenue for the latest six calendar months</p>
          <div className="flex h-52 items-end gap-3 border-b border-slate-700 pb-2">
            {analytics.monthlySales.map(month => (
              <div key={month.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[10px] text-slate-400">{month.total ? money(month.total) : '$0'}</span>
                <div
                  className="w-full max-w-12 rounded-t-lg bg-orange-500 transition-all"
                  style={{ height: `${Math.max((month.total / analytics.maxMonthlySales) * 100, month.total ? 5 : 0)}%` }}
                  title={`${month.label}: ${money(month.total)}`}
                />
                <span className="text-xs text-slate-400">{month.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold text-white">Order Status Statistics</h3>
          <p className="mb-5 mt-1 text-sm text-slate-400">Current distribution of demo orders</p>
          <div className="space-y-4">
            {analytics.statusCounts.map(item => (
              <div key={item.status}>
                <div className="mb-1 flex justify-between gap-3 text-sm">
                  <span className="text-slate-300">{item.status}</span>
                  <span className="font-semibold text-white">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${(item.count / maxStatusCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Award className="text-amber-300" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-white">Best-Selling Products</h3>
            <p className="text-sm text-slate-400">Ranked by quantity in simulated orders</p>
          </div>
        </div>
        {analytics.bestSellers.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-700 py-8 text-center text-sm text-slate-400">
            No product sales yet. Place an order containing products to see your best sellers.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[440px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr><th className="py-3">Product</th><th>Units Sold</th><th className="text-right">Sales</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {analytics.bestSellers.map((product, index) => (
                  <tr key={product.title}>
                    <td className="py-3"><span className="mr-3 text-orange-300">#{index + 1}</span><span className="text-slate-200">{product.title}</span></td>
                    <td className="text-slate-300">{product.quantity}</td>
                    <td className="text-right font-medium text-white">{money(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default SalesAnalytics
