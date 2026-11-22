import { createSlice } from "@reduxjs/toolkit";

const CART_KEY = "shop-cart";

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

    if (!Array.isArray(saved)) return [];

    return saved
      .filter((item) => item && item.id != null)
      .map((item) => ({
        ...item,
        quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
      }));
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Unable to save cart:", error);
  }
};

const hasValidStock = (item) =>
  Number.isFinite(Number(item.stock)) &&
  item.stock !== null &&
  item.stock !== "";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      if (!product || product.id == null) return;

      const stockAvailable = hasValidStock(product)
        ? Math.max(0, Number(product.stock))
        : Infinity;

      if (stockAvailable <= 0) return;

      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        const currentQuantity = Math.max(1, Number(existing.quantity) || 1);

        if (currentQuantity < stockAvailable) {
          existing.quantity = currentQuantity + 1;
        }
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }

      saveCart(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCart(state.items);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      const nextQuantity = Math.floor(Number(quantity));

      if (!item || !Number.isFinite(nextQuantity) || nextQuantity < 1) return;

      const stockAvailable = hasValidStock(item)
        ? Number(item.stock)
        : Infinity;

      if (nextQuantity <= stockAvailable) {
        item.quantity = nextQuantity;
        saveCart(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];

      try {
        localStorage.removeItem(CART_KEY);
      } catch (error) {
        console.error("Unable to clear cart:", error);
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
