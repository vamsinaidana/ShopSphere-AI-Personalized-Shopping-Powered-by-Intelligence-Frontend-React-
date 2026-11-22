 import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart3, Package, ShoppingBag, Users, Plus, Trash2, Search, X, LayoutDashboard } from 'lucide-react'
import { getProducts } from '../../services/productService'
import SalesAnalytics from './SalesAnalytics'

const readOrders = () => {
  try {
    return JSON.parse(localStorage.getItem('shopsphere_orders') || '[]')
  } catch {
    return []
  }
}

const money = value => `$${Number(value || 0).toFixed(2)}`

function StatCard({ title, value, icon: Icon, detail }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className="rounded-xl bg-violet-500/10 p-3 text-violet-300"><Icon size={20} /></div>
      </div>
      <p className="mt-4 text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getProducts(100),
  })
  const [extraProducts, setExtraProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopsphere_admin_products') || '[]') }
    catch { return [] }
  })
  const [deletedIds, setDeletedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopsphere_admin_deleted_products') || '[]') }
    catch { return [] }
  })
  const [orders, setOrders] = useState(readOrders)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', price: '', category: '', thumbnail: '' })
  const apiProducts = data?.products || []
  const products = useMemo(() => [
    ...extraProducts,
    ...apiProducts.filter(product => !deletedIds.includes(product.id)),
  ], [extraProducts, apiProducts, deletedIds])

  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const customers = new Set(orders.map(order => order.customer?.email).filter(Boolean)).size
  const filteredProducts = products.filter(product =>
    `${product.title} ${product.category}`.toLowerCase().includes(search.toLowerCase())
  )

  const saveExtraProducts = next => {
    setExtraProducts(next)
    localStorage.setItem('shopsphere_admin_products', JSON.stringify(next))
  }

  const handleAddProduct = event => {
    event.preventDefault()
    if (!form.title.trim() || Number(form.price) <= 0) return
    const product = {
      id: `admin-${Date.now()}`,
      title: form.title.trim(),
      price: Number(form.price),
      category: form.category.trim() || 'general',
      thumbnail: form.thumbnail.trim() || 'https://placehold.co/400x300?text=ShopSphere+Product',
      rating: 0,
      description: 'Product added from the ShopSphere AI demo admin dashboard.',
    }
    saveExtraProducts([product, ...extraProducts])
    setForm({ title: '', price: '', category: '', thumbnail: '' })
    setShowForm(false)
  }

  const handleDeleteProduct = id => {
    if (String(id).startsWith('admin-')) {
      saveExtraProducts(extraProducts.filter(product => product.id !== id))
    } else {
      const next = [...deletedIds, id]
      setDeletedIds(next)
      localStorage.setItem('shopsphere_admin_deleted_products', JSON.stringify(next))
    }
  }

  const updateOrderStatus = (orderId, status) => {
    const next = orders.map(order => order.id === orderId ? { ...order, status } : order)
    setOrders(next)
    localStorage.setItem('shopsphere_orders', JSON.stringify(next))
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-violet-300"><LayoutDashboard size={18} /><span className="text-sm font-medium">SHOPSPHERE AI / ADMIN</span></div>
            <h1 className="text-3xl font-bold md:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 text-slate-400">Manage demo products and customer orders.</p>
          </div>
          <a href="/" className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Back to Store</a>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Products" value={isLoading ? '...' : products.length} icon={Package} detail="Available in the demo catalog" />
          <StatCard title="Total Orders" value={orders.length} icon={ShoppingBag} detail="Orders saved in this browser" />
          <StatCard title="Total Revenue" value={money(revenue)} icon={BarChart3} detail="Based on simulated orders" />
          <StatCard title="Customers" value={customers} icon={Users} detail="Unique customer email addresses" />
          <SalesAnalytics orders={orders} />
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-xl font-semibold">Product Management</h2><p className="mt-1 text-sm text-slate-400">Add or remove products in this browser demo.</p></div>
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold hover:bg-violet-500">{showForm ? <X size={17} /> : <Plus size={17} />}{showForm ? 'Close' : 'Add Product'}</button>
          </div>

          {showForm && (
            <form onSubmit={handleAddProduct} className="mb-6 grid gap-3 rounded-xl border border-slate-700 bg-slate-950 p-4 md:grid-cols-2">
              <input required placeholder="Product name" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 outline-none focus:border-violet-500" />
              <input required min="0.01" type="number" step="0.01" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 outline-none focus:border-violet-500" />
              <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 outline-none focus:border-violet-500" />
              <input placeholder="Image URL (optional)" value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 outline-none focus:border-violet-500" />
              <button className="rounded-lg bg-violet-600 px-4 py-3 font-semibold hover:bg-violet-500 md:col-span-2">Save Product</button>
            </form>
          )}

          <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3"><Search size={18} className="text-slate-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full bg-transparent py-3 text-sm outline-none" /></div>
          {isLoading ? <p className="py-8 text-center text-slate-400">Loading products...</p> : isError ? <p className="py-8 text-center text-red-400">Unable to load products. Please refresh.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="text-xs uppercase text-slate-500"><tr><th className="py-3">Product</th><th>Category</th><th>Price</th><th>Rating</th><th className="text-right">Action</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredProducts.map(product => <tr key={product.id}>
                    <td className="py-3"><div className="flex items-center gap-3"><img src={product.thumbnail} alt="" className="h-11 w-11 rounded-lg bg-white object-contain" /><span className="max-w-xs truncate font-medium">{product.title}</span></div></td>
                    <td className="capitalize text-slate-400">{product.category}</td><td>{money(product.price)}</td><td className="text-amber-300">★ {product.rating ?? '—'}</td>
                    <td className="text-right"><button onClick={() => handleDeleteProduct(product.id)} title="Remove product" className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"><Trash2 size={17} /></button></td>
                  </tr>)}
                </tbody>
              </table>
              {filteredProducts.length === 0 && <p className="py-8 text-center text-slate-400">No products found.</p>}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5"><h2 className="text-xl font-semibold">Customer Orders</h2><p className="mt-1 text-sm text-slate-400">Review orders and update their demo status.</p></div>
          {orders.length === 0 ? <div className="rounded-xl border border-dashed border-slate-700 py-12 text-center"><ShoppingBag className="mx-auto mb-3 text-slate-600" size={30} /><p className="font-medium">No orders yet</p><p className="mt-1 text-sm text-slate-500">Place a test order from the storefront to see it here.</p></div> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500"><tr><th className="py-3">Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
              <tbody className="divide-y divide-slate-800">{orders.map(order => <tr key={order.id}>
                <td className="py-4 font-medium text-violet-300">{order.id}</td><td><p>{order.customer?.name || 'Guest'}</p><p className="text-xs text-slate-500">{order.customer?.email || 'No email'}</p></td><td className="text-slate-400">{order.date ? new Date(order.date).toLocaleDateString() : '—'}</td><td>{money(order.total)}</td>
                <td><select value={order.status || 'Order Placed'} onChange={e => updateOrderStatus(order.id, e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-xs outline-none"><option>Order Placed</option><option>Processing</option><option>Shipped</option><option>Out for Delivery</option><option>Delivered</option><option>Cancelled</option></select></td>
              </tr>)}</tbody>
            </table></div>
          )}
        </section>
        <p className="mt-6 text-center text-xs text-slate-600">Demo admin panel · Data is stored locally in your browser · Not connected to a production backend</p>
      </div>
    </main>
  )
}
