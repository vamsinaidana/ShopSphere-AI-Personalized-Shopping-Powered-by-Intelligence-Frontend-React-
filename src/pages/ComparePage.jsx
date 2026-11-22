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

function ComparePage() {
  const dispatch = useDispatch();
  const compareItems = useSelector((state) => state.compare.items);

  const cheapest = compareItems.length
    ? compareItems.reduce((best, item) =>
        item.price < best.price ? item : best,
      )
    : null;
  const highestRated = compareItems.length
    ? compareItems.reduce((best, item) =>
        item.rating > best.rating ? item : best,
      )
    : null;
  const bestValue = compareItems.length
    ? compareItems.reduce((best, item) => {
        const score = item.rating / item.price;
        const bestScore = best.rating / best.price;
        return score > bestScore ? item : best;
      })
    : null;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FFF7ED] px-4 py-8 text-stone-900 sm:px-6 md:px-12 md:py-10">
      <Navbar />
      <div className="mx-auto mt-10 max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
              Make a smarter choice
            </p>
            <h1 className="mt-3 text-4xl font-bold">Product Comparison</h1>
            <p className="mt-3 text-slate-400">
              Compare up to four products side by side.
            </p>
          </div>
          {compareItems.length > 0 && (
            <button
              onClick={() => dispatch(clearCompare())}
              className="flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              <Trash2 size={16} /> Clear all
            </button>
          )}
        </div>

        {compareItems.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-white/60 px-6 py-16 text-center">
            <GitCompareArrows size={48} className="mx-auto text-orange-400" />
            <h2 className="mt-5 text-2xl font-semibold">
              No products to compare yet
            </h2>
            <p className="mt-2 text-slate-400">
              Visit the products page and select products using Compare Product.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 font-semibold hover:bg-orange-500"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-white">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="w-44 p-5 text-sm text-slate-400">
                      Product details
                    </th>
                    {compareItems.map((product) => (
                      <th key={product.id} className="min-w-52 p-5 align-top">
                        <div className="flex justify-end">
                          <button
                            onClick={() =>
                              dispatch(removeFromCompare(product.id))
                            }
                            aria-label={`Remove ${product.title}`}
                            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-red-400"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <Link to={`/products/${product.id}`}>
                          <div className="flex h-40 items-center justify-center rounded-xl bg-white p-3">
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <h2 className="mt-4 line-clamp-2 font-semibold text-white hover:text-orange-300">
                            {product.title}
                          </h2>
                        </Link>
                      </th>
                    ))}
                    {compareItems.length < 4 && (
                      <th className="min-w-44 p-5 text-center">
                        <Link
                          to="/products"
                          className="inline-flex flex-col items-center gap-2 rounded-xl border border-dashed border-orange-400/40 p-5 text-orange-300 hover:bg-orange-500/10"
                        >
                          <GitCompareArrows size={24} />
                          Add product
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Price",
                      (product) => `$${Number(product.price).toFixed(2)}`,
                    ],
                    ["Rating", (product) => `★ ${product.rating ?? "N/A"} / 5`],
                    ["Category", (product) => product.category || "N/A"],
                    ["Brand", (product) => product.brand || "Not specified"],
                    [
                      "Availability",
                      (product) =>
                        product.stock > 0
                          ? `In stock (${product.stock})`
                          : "Out of stock",
                    ],
                    [
                      "Discount",
                      (product) =>
                        product.discountPercentage != null
                          ? `${product.discountPercentage}%`
                          : "N/A",
                    ],
                    [
                      "Shipping",
                      (product) =>
                        product.shippingInformation || "See product details",
                    ],
                    [
                      "Warranty",
                      (product) =>
                        product.warrantyInformation || "Not specified",
                    ],
                  ].map(([label, getValue]) => (
                    <tr key={label} className="border-t border-white/10">
                      <th className="p-5 text-sm font-medium text-slate-400">
                        {label}
                      </th>
                      {compareItems.map((product) => (
                        <td
                          key={product.id}
                          className="p-5 text-sm capitalize text-slate-200"
                        >
                          {getValue(product)}
                        </td>
                      ))}
                      {compareItems.length < 4 && (
                        <td className="p-5 text-slate-600">—</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {compareItems.length >= 2 && (
              <section className="comparison-insights mt-8 rounded-2xl border p-6">
                <div className="flex items-center gap-2 text-orange-300">
                  <Sparkles size={20} />
                  <h2 className="text-xl font-semibold">
                    Smart Comparison Insights
                  </h2>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Rule-based insights calculated from the selected products.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Lowest price
                    </p>
                    <p className="mt-2 font-semibold">{cheapest.title}</p>
                    <p className="mt-1 text-orange-300">
                      ${Number(cheapest.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Highest rating
                    </p>
                    <p className="mt-2 font-semibold">{highestRated.title}</p>
                    <p className="mt-1 text-orange-300">
                      ★ {highestRated.rating ?? "N/A"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Best rating-to-price
                    </p>
                    <p className="mt-2 font-semibold">{bestValue.title}</p>
                    <p className="mt-1 text-orange-300">
                      Based on rating Ã· price
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-300">
                  {cheapest.title} is the most affordable option.{" "}
                  {highestRated.title} has the highest customer rating.{" "}
                  {bestValue.title} offers the strongest rating-to-price ratio
                  among the selected products. Choose based on your budget and
                  priorities.
                </p>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default ComparePage;
