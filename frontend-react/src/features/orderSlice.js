import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = '/api'

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { getState }) => {
    const token = getState().auth.token
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { getState }) => {
    const token = getState().auth.token
    const response = await axios.get(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload.data || action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.data || []
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default orderSlice.reducer