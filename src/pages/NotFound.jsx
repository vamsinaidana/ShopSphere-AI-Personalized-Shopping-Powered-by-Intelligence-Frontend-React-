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

function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF7ED] p-10 text-stone-900">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <Link to="/" className="mt-5 inline-block text-orange-400">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
