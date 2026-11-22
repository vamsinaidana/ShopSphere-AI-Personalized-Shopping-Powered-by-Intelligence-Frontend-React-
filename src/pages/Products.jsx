import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
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
import toast from "react-hot-toast";
import ProductSkeleton from "../components/common/ProductSkeleton";

function Products() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const compareItems = useSelector((state) => state.compare.items);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minimumRating, setMinimumRating] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(100),
  });

  const products = data?.products ?? EMPTY_PRODUCTS;

  const categories = useMemo(
    () =>
      [
        ...new Set(products.map((product) => product.category).filter(Boolean)),
      ].sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter((product) =>
        [product.title, product.description, product.category, product.brand]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch)),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory,
      );
    }

    if (minPrice !== "") {
      result = result.filter((product) => product.price >= Number(minPrice));
    }

    if (maxPrice !== "") {
      result = result.filter((product) => product.price <= Number(maxPrice));
    }

    if (minimumRating !== "all") {
      result = result.filter(
        (product) => (product.rating || 0) >= Number(minimumRating),
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating-high":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating-low":
        result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "name-az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [
    products,
    searchTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    minimumRating,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setMinimumRating("all");
    setSortBy("default");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FFF7ED] px-4 py-8 text-stone-900 sm:px-6 md:px-12">
        <Navbar />

        <div className="mx-auto mt-10 max-w-7xl">
          <div className="mb-8">
            <div className="h-4 w-48 animate-pulse rounded bg-orange-100" />
            <div className="mt-4 h-9 w-64 animate-pulse rounded bg-orange-100" />
            <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-orange-100" />
          </div>

          <ProductSkeleton />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] p-10 text-center text-red-400">
        {error.message}
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FFF7ED] px-4 py-8 text-stone-900 sm:px-6 md:px-12 md:py-12">
      <Navbar />

      <div className="mb-8 mt-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
          Discover your favourites
        </p>
        <h1 className="mt-3 text-4xl font-bold">Explore Products</h1>
        <p className="mt-3 text-slate-400">
          Search, filter and sort products to find exactly what you need.
        </p>
      </div>

      <div className="products-layout">
        <aside className="products-sidebar">
          {/* Search and Advanced Filters */}
          <section className="mb-10 rounded-2xl border border-white/10 bg-white p-5 md:p-6">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal className="text-orange-400" size={20} />
              <h2 className="text-lg font-semibold">
                Search & Advanced Filters
              </h2>
            </div>

            <div className="relative mb-5">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by product name, brand, category or description..."
                className="w-full rounded-xl border border-white/10 bg-[#FFF7ED] py-3 pl-12 pr-4 text-stone-900 outline-none transition focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#FFF7ED] px-3 py-3 text-sm text-stone-900 outline-none focus:border-orange-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.replaceAll("-", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Minimum Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="Min price"
                  className="w-full rounded-xl border border-white/10 bg-[#FFF7ED] px-3 py-3 text-sm text-stone-900 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Maximum Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="Max price"
                  className="w-full rounded-xl border border-white/10 bg-[#FFF7ED] px-3 py-3 text-sm text-stone-900 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Minimum Rating
                </label>
                <select
                  value={minimumRating}
                  onChange={(event) => setMinimumRating(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#FFF7ED] px-3 py-3 text-sm text-stone-900 outline-none focus:border-orange-500"
                >
                  <option value="all">Any Rating</option>
                  <option value="4">4★ & above</option>
                  <option value="3">3★ & above</option>
                  <option value="2">2★ & above</option>
                  <option value="1">1★ & above</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#FFF7ED] px-3 py-3 text-sm text-stone-900 outline-none focus:border-orange-500"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating-high">Rating: High to Low</option>
                  <option value="rating-low">Rating: Low to High</option>
                  <option value="name-az">Name: A to Z</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-400">
                Showing{" "}
                <span className="font-semibold text-white">
                  {filteredProducts.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-white">
                  {products.length}
                </span>{" "}
                products
              </p>
              <button
                onClick={clearFilters}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-orange-400 hover:text-white"
              >
                Clear Filters
              </button>
            </div>
          </section>
        </aside>

        <div className="products-results">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white px-6 py-16 text-center">
              <Search size={38} className="mx-auto mb-4 text-slate-500" />
              <h2 className="text-xl font-semibold">No products found</h2>
              <p className="mt-2 text-slate-400">
                Try changing your search term or filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-orange-600 px-5 py-3 font-semibold hover:bg-orange-500"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistItems.some(
                  (item) => item.id === product.id,
                );
                const isCompared = compareItems.some(
                  (item) => item.id === product.id,
                );
                const isCompareFull = compareItems.length >= 4;

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white transition hover:-translate-y-1 hover:border-orange-400/50"
                  >
                    <div className="relative flex h-56 items-center justify-center bg-[#F5F5F5] p-5">
                      <Link
                        to={`/products/${product.id}`}
                        className="block h-full w-full"
                      >
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-full w-full object-contain"
                        />
                      </Link>

                      <button
                        onClick={() => {
                          dispatch(toggleWishlist(product));
                          toast[isWishlisted ? "success" : "success"](
                            isWishlisted
                              ? "Removed from Wishlist"
                              : "Added to Wishlist",
                          );
                        }}
                        aria-label="Toggle wishlist"
                        className="absolute right-4 top-4 rounded-full bg-slate-100 p-3 text-stone-900 hover:text-red-500"
                      >
                        <Heart
                          size={19}
                          fill={isWishlisted ? "currentColor" : "none"}
                          className={isWishlisted ? "text-red-500" : ""}
                        />
                      </button>
                    </div>

                    <div className="p-5">
                      <p className="text-xs capitalize text-orange-400">
                        {product.category}
                      </p>

                      <Link
                        to={`/products/${product.id}`}
                        className="mt-2 block min-h-12 font-semibold hover:text-orange-400"
                      >
                        {product.title}
                      </Link>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-bold">
                          ${product.price}
                        </span>
                        <span className="text-sm text-yellow-400">
                          ★ {product.rating}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          dispatch(addToCompare(product));
                          toast.success("Product added to Compare!");
                        }}
                        disabled={isCompared || isCompareFull}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-400/40 py-3 font-semibold text-orange-300 transition hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <GitCompareArrows size={18} />
                        {isCompared
                          ? "Added to Compare"
                          : isCompareFull
                            ? "Compare Limit Reached"
                            : "Compare Product"}
                      </button>

                      <button
                        onClick={() => {
                          dispatch(addToCart(product));
                          toast.success("Product added to Cart!");
                        }}
                        className="mt-3 w-full rounded-xl bg-orange-600 py-3 font-semibold hover:bg-orange-500"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Products;
