import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to unwrap API wrapper and handle errors
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data !== undefined) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
}

export const productAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/categories'),
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
}

export const cartAPI = {
  getCart: () => api.get('/cart/items'),
  addToCart: (item) => api.post('/cart/items', item),
  updateCartItem: (id, quantity) => api.put(`/cart/items/${id}`, { quantity }),
  removeFromCart: (id) => api.delete(`/cart/items/${id}`),
  clearCart: () => api.delete('/cart/items'),
}

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
}

export const paymentAPI = {
  processPayment: (paymentData) => api.post('/payments', paymentData),
  getPaymentStatus: (id) => api.get(`/payments/${id}/status`),
}

export default api