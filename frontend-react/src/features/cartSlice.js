import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cartAPI } from '../services/api'

const normalizeCartItem = (item) => ({
  productId: item.productId,
  name: item.name || item.product?.name || 'Product',
  quantity: item.quantity || 0,
  price: item.unitPrice ?? item.price ?? item.product?.price ?? 0,
  product: item.product || null,
})

const normalizeItems = (items) => Array.isArray(items) ? items.map(normalizeCartItem) : []

const calculateTotal = (items) => normalizeItems(items).reduce((sum, item) => sum + item.price * item.quantity, 0)

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(item)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(id, quantity)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, { rejectWithValue }) => {
    try {
      await cartAPI.removeFromCart(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart()
      return []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCartError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false
        const items = Array.isArray(action.payload)
          ? normalizeItems(action.payload)
          : normalizeItems(action.payload?.items)
        state.items = items
        state.total = action.payload?.total ?? calculateTotal(items)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false
        if (Array.isArray(action.payload)) {
          state.items = normalizeItems(action.payload)
          state.total = calculateTotal(state.items)
        } else if (action.payload?.productId) {
          const newItem = normalizeCartItem(action.payload)
          const existingIndex = state.items.findIndex((item) => item.productId === newItem.productId)
          if (existingIndex !== -1) {
            state.items[existingIndex] = newItem
          } else {
            state.items.push(newItem)
          }
          state.total = calculateTotal(state.items)
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false
        if (Array.isArray(action.payload)) {
          state.items = normalizeItems(action.payload)
          state.total = calculateTotal(state.items)
        } else if (action.payload?.productId) {
          const updatedItem = normalizeCartItem(action.payload)
          const existingIndex = state.items.findIndex((item) => item.productId === updatedItem.productId)
          if (existingIndex !== -1) {
            state.items[existingIndex] = updatedItem
          } else {
            state.items.push(updatedItem)
          }
          state.total = calculateTotal(state.items)
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter(item => item.productId !== action.payload)
        state.total = calculateTotal(state.items)
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = []
        state.total = 0
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearCartError } = cartSlice.actions
export default cartSlice.reducer