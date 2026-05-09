import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productAPI } from '../services/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productAPI.getAllProducts(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getCategories()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories')
    }
  }
)

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await productAPI.searchProducts(query)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed')
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    categories: [],
    selectedProduct: null,
    searchResults: [],
    isLoading: false,
    error: null,
    pagination: {
      page: 0,
      size: 10,
      total: 0,
    },
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.content || action.payload
        state.pagination = {
          page: action.payload.pageable?.pageNumber || 0,
          size: action.payload.pageable?.pageSize || 10,
          total: action.payload.totalElements || action.payload.length,
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.searchResults = action.payload
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearSelectedProduct, clearSearchResults } = productSlice.actions
export default productSlice.reducer