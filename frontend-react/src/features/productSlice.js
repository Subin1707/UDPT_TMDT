import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productAPI } from '../services/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productAPI.getAllProducts(params)
      
      // Ensure response data is an array or paginated object
      if (Array.isArray(response.data)) {
        return response.data
      } else if (response.data && typeof response.data === 'object') {
        return response.data
      } else {
        return rejectWithValue('Invalid products response format: ' + typeof response.data)
      }
    } catch (error) {
      console.error('fetchProducts error:', error)
      const message = error.response?.data?.message || error.message || 'Failed to fetch products'
      return rejectWithValue(message)
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
      
      // Categories should be an array of strings or objects
      if (Array.isArray(response.data)) {
        return response.data
      } else {
        return rejectWithValue('Invalid categories response format: ' + typeof response.data)
      }
    } catch (error) {
      console.error('fetchCategories error:', error)
      const message = error.response?.data?.message || error.message || 'Failed to fetch categories'
      return rejectWithValue(message)
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
      .addCase(fetchCategories.rejected, (state, action) => {
        console.error('Failed to fetch categories:', action.payload)
        state.categories = []
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