import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = '/api'

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState }) => {
    const token = getState().auth.token
    const response = await axios.get(`${API_BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { getState }) => {
    const token = getState().auth.token
    const response = await axios.post(`${API_BASE_URL}/cart`, { productId, quantity }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = []
      state.total = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        const cartData = action.payload.data || {}
        state.items = cartData.items || []
        state.total = cartData.total || 0
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false
        const cartData = action.payload.data || {}
        state.items = cartData.items || []
        state.total = cartData.total || 0
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer