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

function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["home-products"],
    queryFn: () => getProducts(100),
  });

  const products = data?.products ?? EMPTY_PRODUCTS;

  return (
    <main className="min-h-screen bg-[#FFF7ED] text-stone-900">
      <Navbar />

      {/* Hero Section */}
      <section className="lux-hero relative overflow-hidden">
        <div className="lux-hero-glow lux-glow-one"></div>
        <div className="lux-hero-glow lux-glow-two"></div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
          {/* LEFT CONTENT */}
          <div className="lux-hero-content text-center lg:text-left">
            <span className="lux-hero-badge">
              ✦ Personalized Shopping, Powered by Intelligence
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl xl:text-7xl">
              Shopping that
              <span className="lux-gradient-text block">understands you.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg lg:mx-0">
              Discover products you'll love with intelligent recommendations
              tailored to your style, interests, and budget. Enjoy a smarter,
              simpler, and more personalized shopping experience.
            </p>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 lg:mx-0">
              Explore trending collections, compare your favourite products,
              save items to your wishlist, and find the perfect product without
              endless searching.
            </p>

            {/* ACTION BUTTONS */}
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link to="/products" className="lux-primary-btn">
                Explore Products
              </Link>

              <Link to="/products" className="lux-secondary-btn">
                Discover Collections
              </Link>
            </div>

            {/* BENEFITS */}
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="lux-benefit">
                <span className="lux-benefit-icon">✦</span>
                <div>
                  <h4>Smart Picks</h4>
                  <p>Personalized for you</p>
                </div>
              </div>

              <div className="lux-benefit">
                <span className="lux-benefit-icon">♡</span>
                <div>
                  <h4>Easy Wishlist</h4>
                  <p>Save what you love</p>
                </div>
              </div>

              <div className="lux-benefit">
                <span className="lux-benefit-icon">✓</span>
                <div>
                  <h4>Smart Compare</h4>
                  <p>Choose with confidence</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT AUTO SCROLL IMAGE GRID */}
          <div className="lux-gallery-wrapper">
            <div className="lux-gallery-label">
              <span className="lux-live-dot"></span>
              Discover your next favourite
            </div>

            <div className="lux-gallery-grid">
              {/* FIRST SCROLL COLUMN */}
              <div className="lux-image-column lux-scroll-up">
                {[1, 2].map((set) => (
                  <React.Fragment key={set}>
                    <div className="lux-image-card lux-image-tall">
                      <img
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=85"
                        alt="Premium red sneakers"
                      />
                      <span className="lux-image-caption">
                        Trending Sneakers
                      </span>
                    </div>

                    <div className="lux-image-card lux-image-small">
                      <img
                        src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&auto=format&fit=crop&q=85"
                        alt="Fashion handbag"
                      />
                      <span className="lux-image-caption">
                        Style Essentials
                      </span>
                    </div>

                    <div className="lux-image-card lux-image-medium">
                      <img
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=85"
                        alt="Minimal wrist watch"
                      />
                      <span className="lux-image-caption">
                        Modern Accessories
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* SECOND SCROLL COLUMN */}
              <div className="lux-image-column lux-scroll-down">
                {[1, 2].map((set) => (
                  <React.Fragment key={set}>
                    <div className="lux-image-card lux-image-medium">
                      <img
                        src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&auto=format&fit=crop&q=85"
                        alt="Modern fashion collection"
                      />
                      <span className="lux-image-caption">New Collection</span>
                    </div>

                    <div className="lux-image-card lux-image-tall">
                      <img
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=85"
                        alt="Fashion inspiration"
                      />
                      <span className="lux-image-caption">
                        Everyday Fashion
                      </span>
                    </div>

                    <div className="lux-image-card lux-image-small">
                      <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=85"
                        alt="Premium headphones"
                      />
                      <span className="lux-image-caption">
                        Tech & Lifestyle
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* FLOATING GLASS CARD */}
            <div className="lux-floating-card">
              <span className="lux-floating-icon">âœ§</span>
              <div>
                <p>AI SHOPPING ASSISTANT</p>
                <h4>Find your perfect match</h4>
              </div>
            </div>
          </div>
        </div>
        {/* FLOATING AI ASSISTANT BUTTON */}
        <Link
          to="/assistant"
          title="Ask AI Assistant"
          aria-label="Open AI Shopping Assistant"
          className="lux-ai-floating-btn"
        >
          <Bot size={28} />
          <span className="lux-ai-tooltip">Ask AI Assistant</span>
        </Link>
      </section>

      {/* Recommendation Section */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        {isLoading && (
          <p className="py-10 text-center text-slate-400">
            Loading personalized products...
          </p>
        )}

        {isError && (
          <p className="py-10 text-center text-red-400">
            Unable to load products. Please try again.
          </p>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <RecommendationRail
            products={products}
            title="Recommended For You"
            strategy="personalized"
            limit={8}
          />
        )}
        <RecommendationRail
          products={products}
          strategy="category"
          title="Based on Your Interests"
          description="Discover more products from categories you interact with."
          limit={8}
        />
        <RecommendationRail
          products={products}
          strategy="price"
          title="Within Your Price Range"
          description="Products selected based on your typical spending range."
          limit={8}
        />

        <RecommendationRail
          products={products}
          strategy="wishlist"
          title="Because of Your Wishlist"
          description="Discover products related to the items you saved."
          limit={8}
        />
        <RecommendationRail
          products={products}
          strategy="personalized"
          title="Recommended For You"
          description="Discover products selected based on your shopping activity."
          limit={8}
        />
        <RecommendationRail
          products={products}
          strategy="trending"
          title="Trending Products"
          description="Discover popular products based on purchase activity and ratings."
          limit={8}
        />

        <RecentlyViewedRail />
      </div>
    </main>
  );
}

export default Home;
