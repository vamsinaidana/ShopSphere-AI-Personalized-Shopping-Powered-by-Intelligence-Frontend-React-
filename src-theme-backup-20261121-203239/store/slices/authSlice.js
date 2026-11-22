
import { createSlice } from '@reduxjs/toolkit'

const savedUser = JSON.parse(localStorage.getItem('shopsphere_user') || 'null')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    isAuthenticated: !!savedUser,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem('shopsphere_user', JSON.stringify(action.payload))
    },
    logout: state => {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('shopsphere_user')
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('shopsphere_user', JSON.stringify(state.user))
    },
  },
})

export const { login, logout, updateProfile } = authSlice.actions
export default authSlice.reducer
