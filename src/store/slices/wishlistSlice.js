import { createSlice } from "@reduxjs/toolkit";

const WISHLIST_KEY = "shop-wishlist";

const loadWishlist = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");

    if (!Array.isArray(saved)) return [];

    return saved.filter(
      (item, index, items) =>
        item &&
        item.id != null &&
        items.findIndex((product) => product?.id === item.id) === index,
    );
  } catch {
    return [];
  }
};

const saveWishlist = (items) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Unable to save wishlist:", error);
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: loadWishlist(),
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;

      if (!product || product.id == null) return;

      const exists = state.items.some((item) => item.id === product.id);

      if (exists) {
        state.items = state.items.filter((item) => item.id !== product.id);
      } else {
        state.items.push(product);
      }

      saveWishlist(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];

      try {
        localStorage.removeItem(WISHLIST_KEY);
      } catch (error) {
        console.error("Unable to clear wishlist:", error);
      }
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
