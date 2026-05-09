import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cartAPI } from '../services/api'

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
        state.items = action.payload.items || []
        state.total = action.payload.total || 0
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
        // Update cart items and total from response
        if (action.payload.items) {
          state.items = action.payload.items
          state.total = action.payload.total
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
        if (action.payload.items) {
          state.items = action.payload.items
          state.total = action.payload.total
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
        state.items = state.items.filter(item => item.id !== action.payload)
        // Recalculate total
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
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