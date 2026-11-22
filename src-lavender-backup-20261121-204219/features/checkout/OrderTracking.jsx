
import { Link } from 'react-router-dom'
import { Package, CheckCircle, Clock, ArrowLeft } from 'lucide-react'

export default function OrderTracking() {
  const orders = JSON.parse(
    localStorage.getItem('shopsphere_orders') || '[]'
  )

  return (
    <main className="min-h-screen bg-[#FFF7ED] px-6 py-12 text-stone-900">
      <div className="mx-auto max-w-3xl">

        <Link to="/products" className="flex items-center gap-2 text-orange-400">
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>

        <h1 className="mb-3 mt-10 text-4xl font-bold">
          Track Your Orders
        </h1>

        <p className="mb-10 text-slate-400">
          Check your recent shopping orders.
        </p>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <Package size={45} className="mx-auto mb-4 text-slate-500" />
            <h2 className="text-xl font-semibold">No Orders Found</h2>
            <p className="mt-3 text-slate-400">
              Your orders will appear here after checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map(order => (
              <div
                key={order.id}
                className="rounded-2xl border border-white/10 bg-white p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Order ID</p>
                    <h2 className="mt-1 font-bold">{order.id}</h2>
                  </div>

                  <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400">
                    {order.status}
                  </span>
                </div>

                <div className="my-6 grid grid-cols-2 gap-4 border-y border-white/10 py-5">
                  <div>
                    <p className="text-sm text-slate-400">Total Amount</p>
                    <p className="mt-1 text-xl font-bold">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">Items</p>
                    <p className="mt-1 text-xl font-bold">
                      {order.items.length}
                    </p>
                  </div>
                </div>

                <h3 className="mb-4 font-semibold">Order Progress</h3>

                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" />
                  <span className="text-green-400">Order Placed</span>
                </div>

                <div className="ml-2 my-2 h-6 border-l border-dashed border-slate-600" />

                <div className="flex items-center gap-3">
                  <Clock className="text-slate-500" />
                  <span className="text-slate-400">Processing - Upcoming</span>
                </div>

                <div className="ml-2 my-2 h-6 border-l border-dashed border-slate-600" />

                <div className="flex items-center gap-3">
                  <Package className="text-slate-500" />
                  <span className="text-slate-400">Delivered - Upcoming</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
