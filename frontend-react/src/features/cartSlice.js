import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cartAPI } from '../services/api'

// =========================================================
// NORMALIZE CART ITEM
// =========================================================
const normalizeCartItem = (item) => ({
  productId: item.productId,
  name: item.name || item.product?.name || 'Product',
  quantity: item.quantity || 0,
  price: item.unitPrice ?? item.price ?? item.product?.price ?? 0,
  product: item.product || null,
})

// =========================================================
// NORMALIZE ITEMS
// =========================================================
const normalizeItems = (items) =>
  Array.isArray(items)
    ? items.map(normalizeCartItem)
    : []

// =========================================================
// CALCULATE TOTAL
// =========================================================
const calculateTotal = (items) =>
  items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

// =========================================================
// FETCH CART
// =========================================================
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart()
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch cart'
      )
    }
  }
)

// =========================================================
// ADD TO CART
// =========================================================
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(item)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to add item to cart'
      )
    }
  }
)

// =========================================================
// UPDATE CART ITEM
// =========================================================
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(
        productId,
        quantity
      )

      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to update cart item'
      )
    }
  }
)

// =========================================================
// REMOVE FROM CART
// =========================================================
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeFromCart(productId)

      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to remove item from cart'
      )
    }
  }
)

// =========================================================
// CLEAR CART
// =========================================================
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart()
      return []
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to clear cart'
      )
    }
  }
)

// =========================================================
// SLICE
// =========================================================
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

    // =====================================================
    // FETCH CART
    // =====================================================
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
        state.total = calculateTotal(items)
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // =====================================================
    // ADD TO CART
    // =====================================================
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false

        const newItem = normalizeCartItem(action.payload)

        const existingIndex = state.items.findIndex(
          (item) => item.productId === newItem.productId
        )

        if (existingIndex !== -1) {
          state.items[existingIndex] = newItem
        } else {
          state.items.push(newItem)
        }

        state.total = calculateTotal(state.items)
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // =====================================================
    // UPDATE CART ITEM
    // =====================================================
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false

        const updatedItem = normalizeCartItem(action.payload)

        const existingIndex = state.items.findIndex(
          (item) => item.productId === updatedItem.productId
        )

        if (existingIndex !== -1) {
          state.items[existingIndex] = updatedItem
        } else {
          state.items.push(updatedItem)
        }

        state.total = calculateTotal(state.items)
      })

      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // =====================================================
    // REMOVE ITEM
    // =====================================================
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false

        const items = normalizeItems(action.payload)

        state.items = items
        state.total = calculateTotal(items)
      })

      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // =====================================================
    // CLEAR CART
    // =====================================================
    builder
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })

      .addCase(clearCart.fulfilled, (state) => {
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
