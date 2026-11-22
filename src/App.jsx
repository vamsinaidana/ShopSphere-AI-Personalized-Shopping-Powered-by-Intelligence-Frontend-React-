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

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}
