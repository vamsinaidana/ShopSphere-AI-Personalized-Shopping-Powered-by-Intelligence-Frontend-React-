import { Routes, Route } from "react-router-dom";

import Navbar from "./components/app/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import ComparePage from "./pages/ComparePage";
import NotFound from "./pages/NotFound";

import ProductDetails from "./features/products/ProductDetails";
import Checkout from "./features/checkout/Checkout";
import OrderSuccess from "./features/checkout/OrderSuccess";
import OrderTracking from "./features/checkout/OrderTracking";

import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import Profile from "./features/auth/Profile";

import AdminDashboard from "./features/admin/AdminDashboard";
import AssistantPage from "./pages/AssistantPage";
import Footer from "./pages/Footer";
import ScrollToTop from "./components/app/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/products"
          element={
            <>
              <Navbar />
              <Products />
            </>
          }
        />
        <Route
          path="/products"
          element={
            <>
              <Navbar />
              <Products />
            </>
          }
        />

        <Route
          path="/products/:id"
          element={
            <>
              <Navbar />
              <ProductDetails />
            </>
          }
        />

        <Route
          path="/wishlist"
          element={
            <>
              <Navbar />
              <Wishlist />
            </>
          }
        />

        <Route
          path="/compare"
          element={
            <>
              <Navbar />
              <ComparePage />
            </>
          }
        />

        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
            </>
          }
        />

        <Route
          path="/checkout"
          element={
            <>
              <Navbar />
              <Checkout />
            </>
          }
        />

        <Route
          path="/track-orders"
          element={
            <>
              <Navbar />
              <OrderTracking />
            </>
          }
        />

        <Route
          path="/order-success"
          element={
            <>
              <Navbar />
              <OrderSuccess />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
            </>
          }
        />
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
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}
