import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { orderAPI } from '../services/api'

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.createOrder(orderData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order')
    }
  }
)

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrders()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
    }
  }
)

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order')
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderAPI.cancelOrder(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order')
    }
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    selectedOrder: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null
    },
    clearOrderError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders.unshift(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedOrder = action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.orders.findIndex(order => order.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearSelectedOrder, clearOrderError } = orderSlice.actions
export default orderSlice.reducer