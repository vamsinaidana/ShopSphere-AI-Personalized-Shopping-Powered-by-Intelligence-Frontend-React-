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

function ScrollAnimations() {
  useEffect(() => {
    const selector =
      "main > section, main > div, main article, main table, main form, .lux-hero-content, .lux-gallery-wrapper, .lux-benefit, .lux-floating-card";
    let observer;

    const scan = () => {
      document.querySelectorAll(selector).forEach((element, index) => {
        if (element.dataset.ssReveal) return;
        element.dataset.ssReveal = "true";
        element.classList.add("ss-scroll-reveal");
        element.style.setProperty("--ss-delay", `${(index % 5) * 65}ms`);
        observer.observe(element);
      });
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ss-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}

export default ScrollAnimations;
