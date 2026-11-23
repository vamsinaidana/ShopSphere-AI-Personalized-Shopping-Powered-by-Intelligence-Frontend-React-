import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  LoaderCircle,
  GitCompareArrows,
  Trash2,
  X,
  Sparkles,
  Search,
  SlidersHorizontal,
  Menu,
} from "lucide-react";
import OrderSuccess from "../features/checkout/OrderSuccess";
import OrderTracking from "../features/checkout/OrderTracking";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import Profile from "../features/auth/Profile";
import RecentlyViewedRail from "../features/recommendations/components/RecentlyViewedRail";
import RecommendationRail from "../features/recommendations/components/RecommendationRail";
import AssistantPage from "../pages/AssistantPage";
import AdminDashboard from "../features/admin/AdminDashboard";
import { Bot } from "lucide-react";
import { getProducts } from "../services/productService";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import {
  addToCompare,
  removeFromCompare,
  clearCompare,
} from "../store/slices/compareSlice";
import ProductDetails from "../features/products/ProductDetails";
import Checkout from "../features/checkout/Checkout";
import { logout } from "../store/slices/authSlice";
import { LogOut } from "lucide-react";

import Navbar from "../components/app/Navbar";
import { EMPTY_PRODUCTS } from "../constants/productConstants";

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  // Fetch products for cart recommendations
  const { data } = useQuery({
    queryKey: ["cart-recommendation-products"],
    queryFn: () => getProducts(100),
  });

  const products = data?.products ?? EMPTY_PRODUCTS;

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FFF7ED] px-4 py-6 text-stone-900 sm:px-6 sm:py-10">
 
      <h1 className="mb-8 mt-8 text-3xl font-bold sm:text-4xl">Your Cart</h1>

      {items.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-slate-400">Your cart is empty.</p>

          <Link
            to="/"
            className="mt-5 inline-block rounded-xl bg-orange-600 px-6 py-3 font-semibold hover:bg-orange-500"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-3xl space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-xl bg-white p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-24 w-full rounded-lg bg-white object-contain sm:h-20 sm:w-20"
              />

              <div className="flex-1">
                <h2 className="font-semibold">{item.title}</h2>

                <p className="mt-2 text-orange-400">
                  ${item.price} - {item.quantity}
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
                  >-</button>

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
                    disabled={
                      Number.isFinite(Number(item.stock)) &&
                      item.stock !== null &&
                      item.stock !== "" &&
                      item.quantity >= Number(item.stock)
                    }
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

          <div className="flex flex-wrap justify-between gap-2 border-t border-white/10 pt-6 text-lg font-bold sm:text-xl">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block rounded-xl bg-orange-600 py-4 text-center font-semibold hover:bg-orange-500"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}

      {/* Cart-Based Recommendations */}
      {items.length > 0 && products.length > 0 && (
        <div className="mt-12">
          <RecommendationRail
            products={products}
            strategy="cart"
            title="Complete Your Shopping"
            description="Recommended add-ons based on products in your cart."
            excludeIds={items.map((item) => item.id)}
            limit={4}
          />
        </div>
      )}
    </main>
  );
}

export default Cart;
