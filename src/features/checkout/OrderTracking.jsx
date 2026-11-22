import { Link } from "react-router-dom";
import { Package, CheckCircle, Clock, ArrowLeft } from "lucide-react";

export default function OrderTracking() {
  const orders = JSON.parse(localStorage.getItem("shopsphere_orders") || "[]");

  const steps = [
    { title: "Order Placed", icon: CheckCircle },
    { title: "Processing", icon: Clock },
    { title: "Delivered", icon: Package },
  ];

  return (
    <main className="min-h-screen bg-[#FFF7ED] px-6 py-12 text-stone-900">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/products"
          className="flex items-center gap-2 text-[#FC7311] transition hover:text-[#C45408]"
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>

        <h1 className="mb-3 mt-10 text-4xl font-bold">Track Your Orders</h1>

        <p className="mb-10 text-slate-500">
          Check your recent shopping orders.
        </p>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <Package size={45} className="mx-auto mb-4 text-slate-500" />
            <h2 className="text-xl font-semibold">No Orders Found</h2>
            <p className="mt-3 text-slate-400">
              Your orders will appear here after checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const status = (order.status || "Order Placed").toLowerCase();

              const statusIndex =
                status === "delivered"
                  ? 2
                  : status === "processing" || status === "shipped"
                    ? 1
                    : 0;

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Order ID</p>
                      <h2 className="mt-1 font-bold">{order.id}</h2>
                    </div>

                    <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold capitalize text-green-600">
                      {order.status}
                    </span>
                  </div>

                  <div className="my-6 grid grid-cols-2 gap-4 border-y border-slate-100 py-5">
                    <div>
                      <p className="text-sm text-slate-400">Total Amount</p>
                      <p className="mt-1 text-xl font-bold">
                        ${Number(order.total || 0).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Items</p>
                      <p className="mt-1 text-xl font-bold">
                        {order.items?.length || 0}
                      </p>
                    </div>
                  </div>

                  <h3 className="mb-6 font-semibold">Order Progress</h3>

                  <div className="space-y-0">
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const completed = index <= statusIndex;

                      return (
                        <div key={step.title}>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                                completed
                                  ? "bg-[#FC7311] text-white"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              <Icon size={19} />
                            </div>

                            <span
                              className={`font-medium ${
                                completed ? "text-[#FC7311]" : "text-slate-400"
                              }`}
                            >
                              {step.title}
                              {!completed && " - Upcoming"}
                            </span>
                          </div>

                          {index !== steps.length - 1 && (
                            <div
                              className={`ml-[17px] my-2 h-7 border-l-2 ${
                                index < statusIndex
                                  ? "border-[#FC7311]"
                                  : "border-dashed border-slate-200"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
