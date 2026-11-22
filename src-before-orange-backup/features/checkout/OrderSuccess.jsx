
import { Link } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

export default function OrderSuccess() {
  const orders = JSON.parse(
    localStorage.getItem('shopsphere_orders') || '[]'
  )

  const order = orders[0]

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-8 text-center">

        <CheckCircle
          size={75}
          className="mx-auto mb-6 text-green-400"
        />

        <h1 className="text-3xl font-bold">
          Order Placed Successfully!
        </h1>

        <p className="mt-4 text-slate-400">
          Thank you for shopping with ShopSphere AI.
          Your order has been placed successfully.
        </p>

        {order && (
          <div className="mt-8 rounded-xl bg-slate-800 p-5 text-left">
            <div className="flex items-center gap-3">
              <Package className="text-violet-400" />
              <span className="font-semibold">Order Details</span>
            </div>

            <p className="mt-4 text-sm text-slate-400">
              Order ID
            </p>
            <p className="font-semibold">{order.id}</p>

            <p className="mt-4 text-sm text-slate-400">
              Total Amount
            </p>
            <p className="text-xl font-bold text-violet-400">
              ${order.total.toFixed(2)}
            </p>

            <p className="mt-4 text-sm text-slate-400">
              Status
            </p>
            <p className="font-semibold text-green-400">
              {order.status}
            </p>
          </div>
        )}

        <Link
          to="/products"
          className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-semibold hover:bg-violet-500"
        >
          Continue Shopping
          <ArrowRight size={18} />
        </Link>

      </div>
    </main>
  )
}
