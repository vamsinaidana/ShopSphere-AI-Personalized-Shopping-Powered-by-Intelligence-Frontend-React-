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

function Wishlist() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FFF7ED] px-4 py-8 text-stone-900 sm:px-6 md:px-12 md:py-12">
 
      <div className="mb-10 mt-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
          Your favourites
        </p>
        <h1 className="mt-3 text-4xl font-bold">My Wishlist</h1>
        <p className="mt-3 text-slate-400">
          Products you love, all in one place.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="py-20 text-center">
          <Heart size={45} className="mx-auto mb-5 text-slate-600" />
          <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-3 text-slate-400">
            Explore products and add your favourites.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 font-semibold hover:bg-orange-500"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white"
            >
              <Link
                to={`/products/${product.id}`}
                className="flex h-56 items-center justify-center bg-white p-5"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-full w-full object-contain"
                />
              </Link>

              <div className="p-5">
                <h2 className="font-semibold">{product.title}</h2>

                <p className="mt-3 text-xl font-bold">${product.price}</p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => dispatch(addToCart(product))}
                    className="flex-1 rounded-lg bg-orange-600 py-3 font-semibold hover:bg-orange-500"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => dispatch(toggleWishlist(product))}
                    className="rounded-lg border border-white/20 px-4 text-red-400 hover:bg-white/10"
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={20} fill="currentColor" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;
