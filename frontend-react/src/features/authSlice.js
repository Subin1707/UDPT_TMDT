import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = '/api'

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password })
    return response.data
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData)
    return response.data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        const authData = action.payload.data
        state.user = {
          email: authData.email,
          role: authData.role,
        }
        state.token = authData.accessToken
        localStorage.setItem('token', authData.accessToken)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(register.pending, (state) => {
        state.loading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        const authData = action.payload.data
        state.user = {
          email: authData.email,
          role: authData.role,
        }
        state.token = authData.accessToken
        localStorage.setItem('token', authData.accessToken)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer