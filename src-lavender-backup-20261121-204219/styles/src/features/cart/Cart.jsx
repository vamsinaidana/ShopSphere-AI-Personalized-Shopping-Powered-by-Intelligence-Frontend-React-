import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Navbar from "../../components/layout/Navbar";
import { updateQuantity, removeFromCart } from "../../store/slices/cartSlice";

import { getProducts } from "../../services/productService";
import RecommendationRail from "../recommendations/components/RecommendationRail";

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart-recommendation-products"],
    queryFn: () => getProducts(100),
  });

  const products = data?.products || [];

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 mt-10 text-4xl font-bold">Your Cart</h1>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-slate-900 p-10 text-center">
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>

            <p className="mt-3 text-slate-400">
              Add products to your cart to see them here.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 font-semibold hover:bg-orange-500"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="max-w-3xl space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-5 rounded-xl bg-slate-900 p-5"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-20 w-20 rounded-lg bg-white object-contain"
                />

                <div className="flex-1">
                  <h2 className="font-semibold">{item.title}</h2>

                  <p className="mt-2 text-orange-400">
                    ${item.price} × {item.quantity}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: item.quantity - 1,
                          }),
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="rounded bg-slate-700 px-3 py-1 disabled:opacity-40"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: item.quantity + 1,
                          }),
                        )
                      }
                      disabled={item.quantity >= item.stock}
                      className="rounded bg-slate-700 px-3 py-1 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex justify-between border-t border-white/10 pt-6 text-xl font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              className="mt-6 block rounded-xl bg-orange-600 py-4 text-center font-semibold hover:bg-orange-500"
            >
              Proceed to Checkout →
            </Link>
          </div>
        )}

        {/* Cart-Based Recommendations */}
        {items.length > 0 && (
          <div className="mt-12">
            {isLoading && (
              <p className="text-slate-400">Loading recommended products...</p>
            )}

            {!isLoading && !isError && (
              <RecommendationRail
                products={products}
                strategy="cart"
                title="Complete Your Shopping"
                description="Recommended add-ons based on products in your cart."
                limit={4}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;
