
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('shop-cart') || '[]'),
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      const existing = state.items.find(item => item.id === product.id)

      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...product, quantity: 1 })
      }

      localStorage.setItem('shop-cart', JSON.stringify(state.items))
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      localStorage.setItem('shop-cart', JSON.stringify(state.items))
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)

      if (item && quantity > 0 && quantity <= item.stock) {
        item.quantity = quantity
      }

      localStorage.setItem('shop-cart', JSON.stringify(state.items))
    },

    clearCart: state => {
      state.items = []
      localStorage.removeItem('shop-cart')
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions

export default cartSlice.reducer
