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
import OrderSuccess from "../../features/checkout/OrderSuccess";
import OrderTracking from "../../features/checkout/OrderTracking";
import Login from "../../features/auth/Login";
import Signup from "../../features/auth/Signup";
import Profile from "../../features/auth/Profile";
import RecentlyViewedRail from "../../features/recommendations/components/RecentlyViewedRail";
import RecommendationRail from "../../features/recommendations/components/RecommendationRail";
import AssistantPage from "../../pages/AssistantPage";
import AdminDashboard from "../../features/admin/AdminDashboard";
import { Bot } from "lucide-react";
import { getProducts } from "../../services/productService";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from "../../store/slices/cartSlice";
import { toggleWishlist } from "../../store/slices/wishlistSlice";
import {
  addToCompare,
  removeFromCompare,
  clearCompare,
} from "../../store/slices/compareSlice";
import ProductDetails from "../../features/products/ProductDetails";
import Checkout from "../../features/checkout/Checkout";
import { logout } from "../../store/slices/authSlice";
import { LogOut } from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const compareItems = useSelector((state) => state.compare.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
  };

  const navLinks = (
    <>
      <Link onClick={() => setMobileMenuOpen(false)} to="/">
        Home
      </Link>
      <Link onClick={() => setMobileMenuOpen(false)} to="/products">
        Products
      </Link>
      <Link
        onClick={() => setMobileMenuOpen(false)}
        to="/compare"
        className="flex items-center gap-2 hover:text-orange-400"
      >
        <GitCompareArrows size={18} /> Compare ({compareItems.length})
      </Link>
      <Link
        onClick={() => setMobileMenuOpen(false)}
        to="/assistant"
        className="hover:text-orange-400"
      >
        AI Assistant
      </Link>
      <Link
        onClick={() => setMobileMenuOpen(false)}
        to="/cart"
        className="flex items-center gap-2"
      >
        <ShoppingCart size={18} /> Cart ({cartCount})
      </Link>
      <Link onClick={() => setMobileMenuOpen(false)} to="/track-orders">
        Track Orders
      </Link>
      <Link
        onClick={() => setMobileMenuOpen(false)}
        to="/wishlist"
        className="flex items-center gap-2 hover:text-orange-400"
      >
        <Heart size={18} /> Wishlist ({wishlistItems.length})
      </Link>
      <Link
        onClick={() => setMobileMenuOpen(false)}
        to="/profile"
        className="hover:text-orange-400"
      >
        My Profile
      </Link>
      <Link
        onClick={() => setMobileMenuOpen(false)}
        to="/admin"
        className="hover:text-orange-400"
      >
        Admin
      </Link>
      {user ? (
        <div className="flex flex-col gap-2 border-t border-orange-200 pt-3 sm:border-0 sm:pt-0">
          <span className="text-stone-500">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-left hover:text-red-400"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 border-t border-orange-200 pt-3 sm:flex-row sm:items-center sm:border-0 sm:pt-0">
          <Link
            onClick={() => setMobileMenuOpen(false)}
            to="/login"
            className="hover:text-orange-400"
          >
            Login
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            to="/signup"
            className="rounded-lg bg-orange-600 px-4 py-2 text-center text-white hover:bg-orange-700"
          >
            Sign Up
          </Link>
        </div>
      )}
    </>
  );

  return (
    <nav className="relative z-30 border-b border-orange-200 px-4 py-4 text-white sm:px-6 md:px-12">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="text-xl font-bold sm:text-2xl"
        >
          ShopSphere<span className="text-orange-400"> AI.</span>
        </Link>
        <div className="hidden items-center gap-4 text-sm text-slate-300 xl:flex 2xl:gap-5">
          {navLinks}
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          className="rounded-lg border border-white/15 p-2 text-slate-200 hover:bg-white/10 xl:hidden"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="mt-4 flex max-h-[75vh] flex-col gap-4 overflow-y-auto rounded-xl border border-orange-200 bg-[#FFF7ED] p-5 text-sm text-[#1D2429] shadow-xl xl:hidden">
          {navLinks}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
