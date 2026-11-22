import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../../store/slices/cartSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const order = {
      id: `ORD-${Date.now()}`,
      customer: form,
      items,
      total,
      status: "Order Placed",
      date: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(
      localStorage.getItem("shopsphere_orders") || "[]",
    );

    localStorage.setItem(
      "shopsphere_orders",
      JSON.stringify([order, ...existingOrders]),
    );

    dispatch(clearCart());
    navigate("/order-success");
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-center text-white">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <Link to="/products" className="mt-6 inline-block text-violet-400">
          Explore Products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link to="/cart" className="text-violet-400">
          ← Back to Cart
        </Link>

        <h1 className="mb-8 mt-6 text-4xl font-bold">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-white/10 bg-slate-900 p-6"
          >
            <h2 className="text-xl font-semibold">Shipping Information</h2>

            {[
              { name: "name", label: "Full Name", type: "text" },
              { name: "email", label: "Email Address", type: "email" },
              { name: "phone", label: "Phone Number", type: "tel" },
              { name: "address", label: "Full Address", type: "text" },
              { name: "city", label: "City", type: "text" },
              { name: "pincode", label: "PIN Code", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-2 block text-sm text-slate-300">
                  {field.label}
                </label>

                <input
                  required
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-3 outline-none focus:border-violet-500"
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3 font-semibold hover:bg-violet-500"
            >
              Place Order
            </button>
          </form>

          <div className="h-fit rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="mb-6 text-xl font-semibold">Order Summary</h2>

            {items.map((item) => (
              <div key={item.id} className="mb-4 flex justify-between gap-4">
                <span className="text-slate-300">
                  {item.title} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="mt-6 flex justify-between border-t border-white/10 pt-5 text-xl font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Demo checkout only. No real payment will be processed.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
