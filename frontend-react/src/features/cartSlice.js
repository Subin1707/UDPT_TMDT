import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = '/api'

const getItemPrice = (item) => Number(item.price || item.product_price || item.unit_price || item.unitPrice || 0)

const calculateTotal = (items) => items.reduce((sum, item) => {
  return sum + getItemPrice(item) * (item.quantity || 1)
}, 0)

const upsertCartItem = (items, item) => {
  const productId = item.productId || item.product_id || item.id
  const existingIndex = items.findIndex((cartItem) => {
    const cartProductId = cartItem.productId || cartItem.product_id || cartItem.id
    return String(cartProductId) === String(productId)
  })

  if (existingIndex >= 0) {
    items[existingIndex] = item
    return items
  }

  items.push(item)
  return items
}

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState }) => {
    const token = getState().auth.token
    const response = await axios.get(`${API_BASE_URL}/cart/items`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { getState }) => {
    const token = getState().auth.token
    const response = await axios.post(`${API_BASE_URL}/cart/items`, { productId, quantity }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { getState }) => {
    const token = getState().auth.token
    const response = await axios.post(`${API_BASE_URL}/cart/items`, { productId, quantity, action: 'UPDATE' }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (productId, { getState }) => {
    const token = getState().auth.token
    const response = await axios.post(`${API_BASE_URL}/cart/items`, { productId, action: 'REMOVE' }, {
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
        state.error = null
        const cartData = action.payload.data || []
        state.items = Array.isArray(cartData) ? cartData : cartData.items || []
        state.total = cartData.total || calculateTotal(state.items)
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
        state.error = null
        const cartData = action.payload.data || {}
        if (Array.isArray(cartData)) {
          state.items = cartData
        } else if (Array.isArray(cartData.items)) {
          state.items = cartData.items
        } else if (cartData.productId || cartData.product_id || cartData.id) {
          upsertCartItem(state.items, cartData)
        }
        state.total = cartData.total || calculateTotal(state.items)
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateCartItem.pending, (state) => {
        state.error = null
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        const cartData = action.payload.data || {}
        if (cartData.productId || cartData.product_id || cartData.id) {
          upsertCartItem(state.items, cartData)
        }
        state.total = calculateTotal(state.items)
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(removeCartItem.pending, (state) => {
        state.error = null
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        const cartData = action.payload.data || []
        state.items = Array.isArray(cartData) ? cartData : cartData.items || []
        state.total = calculateTotal(state.items)
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer
