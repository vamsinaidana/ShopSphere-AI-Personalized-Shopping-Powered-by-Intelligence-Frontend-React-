import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
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
import OrderSuccess from "./features/checkout/OrderSuccess";
import OrderTracking from "./features/checkout/OrderTracking";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import Profile from "./features/auth/Profile";
import RecentlyViewedRail from "./features/recommendations/components/RecentlyViewedRail";
import RecommendationRail from "./features/recommendations/components/RecommendationRail";
import AssistantPage from "./pages/AssistantPage";
import AdminDashboard from "./features/admin/AdminDashboard";

import { getProducts } from "./services/productService";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from "./store/slices/cartSlice";
import { toggleWishlist } from "./store/slices/wishlistSlice";
import {
  addToCompare,
  removeFromCompare,
  clearCompare,
} from "./store/slices/compareSlice";
import ProductDetails from "./features/products/ProductDetails";
import Checkout from "./features/checkout/Checkout";
import { logout } from "./store/slices/authSlice";
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
        <div className="flex flex-col gap-2 border-t border-white/10 pt-3 sm:border-0 sm:pt-0">
          <span className="text-slate-400">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-left hover:text-red-400"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:border-0 sm:pt-0">
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
    <nav className="relative z-30 border-b border-white/10 px-4 py-4 text-white sm:px-6 md:px-12">
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
        <div className="mt-4 flex max-h-[75vh] flex-col gap-4 overflow-y-auto rounded-xl border border-white/10 bg-slate-900 p-5 text-sm text-slate-200 shadow-2xl xl:hidden">
          {navLinks}
        </div>
      )}
    </nav>
  );
}

function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["home-products"],
    queryFn: () => getProducts(100),
  });

  const products = data?.products || [];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-32 text-center">
        <span className="rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm text-orange-300">
          Personalized Shopping, Powered by Intelligence
        </span>

        <h1 className="mt-7 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Shopping that
          <span className="text-orange-400"> understands you.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Discover amazing products and experience smarter, personalized
          shopping.
        </p>

        <Link
          to="/products"
          className="mt-10 rounded-xl bg-orange-600 px-8 py-4 font-semibold hover:bg-orange-500"
        >
          Explore Products →
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

  const products = data?.products || [];

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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <LoaderCircle className="animate-spin" size={36} />
        <span className="ml-3">Loading products...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-950 p-10 text-center text-red-400">
        {error.message}
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 md:px-12 md:py-12">
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

      {/* Search and Advanced Filters */}
      <section className="mb-10 rounded-2xl border border-white/10 bg-slate-900 p-5 md:p-6">
        <div className="mb-5 flex items-center gap-2">
          <SlidersHorizontal className="text-orange-400" size={20} />
          <h2 className="text-lg font-semibold">Search & Advanced Filters</h2>
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
            className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-orange-500"
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
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-orange-500"
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
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-orange-500"
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
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Minimum Rating
            </label>
            <select
              value={minimumRating}
              onChange={(event) => setMinimumRating(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-orange-500"
            >
              <option value="all">Any Rating</option>
              <option value="4">4★ & above</option>
              <option value="3">3★ & above</option>
              <option value="2">2★ & above</option>
              <option value="1">1★ & above</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">Sort By</label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-orange-500"
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
            <span className="font-semibold text-white">{products.length}</span>{" "}
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

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900 px-6 py-16 text-center">
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
                className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition hover:-translate-y-1 hover:border-orange-400/50"
              >
                <div className="relative flex h-56 items-center justify-center bg-white p-5">
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
                    onClick={() => dispatch(toggleWishlist(product))}
                    aria-label="Toggle wishlist"
                    className="absolute right-4 top-4 rounded-full bg-slate-100 p-3 text-slate-900 hover:text-red-500"
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
                    <span className="text-xl font-bold">${product.price}</span>
                    <span className="text-sm text-yellow-400">
                      ★ {product.rating}
                    </span>
                  </div>

                  <button
                    onClick={() => dispatch(addToCompare(product))}
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
                    onClick={() => dispatch(addToCart(product))}
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
    </main>
  );
}

function Wishlist() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 md:px-12 md:py-12">
      <Navbar />

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
              className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900"
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

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  // Fetch products for cart recommendations
  const { data } = useQuery({
    queryKey: ["cart-recommendation-products"],
    queryFn: () => getProducts(100),
  });

  const products = data?.products || [];

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-10">
      <Navbar />

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
              className="flex flex-col gap-4 rounded-xl bg-slate-900 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-24 w-full rounded-lg bg-white object-contain sm:h-20 sm:w-20"
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

          <div className="flex flex-wrap justify-between gap-2 border-t border-white/10 pt-6 text-lg font-bold sm:text-xl">
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
    <main className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 md:px-12 md:py-10">
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
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-slate-900/60 px-6 py-16 text-center">
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
            <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-slate-900">
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
              <section className="mt-8 rounded-2xl border border-orange-400/20 bg-orange-500/5 p-6">
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
                  <div className="rounded-xl bg-slate-900 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Lowest price
                    </p>
                    <p className="mt-2 font-semibold">{cheapest.title}</p>
                    <p className="mt-1 text-orange-300">
                      ${Number(cheapest.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Highest rating
                    </p>
                    <p className="mt-2 font-semibold">{highestRated.title}</p>
                    <p className="mt-1 text-orange-300">
                      ★ {highestRated.rating ?? "N/A"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Best rating-to-price
                    </p>
                    <p className="mt-2 font-semibold">{bestValue.title}</p>
                    <p className="mt-1 text-orange-300">
                      Based on rating ÷ price
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

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 p-10 text-white">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <Link to="/" className="mt-5 inline-block text-orange-400">
        Go Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/track-orders" element={<OrderTracking />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/admin"
        element={
          <>
            <Navbar />
            <AdminDashboard />
          </>
        }
      />
      <Route
        path="/assistant"
        element={
          <>
            <Navbar />
            <AssistantPage />
          </>
        }
      />
    </Routes>
  );
}
