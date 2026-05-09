import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8084/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// =========================================================
// REQUEST INTERCEPTOR
// =========================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (
      token &&
      token !== 'undefined' &&
      token !== 'null'
    ) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================
api.interceptors.response.use(
  (response) => {

    /*
      Backend response:
      {
        success: true,
        message: "...",
        data: ...
      }
    */

    if (
      response.data &&
      Object.prototype.hasOwnProperty.call(
        response.data,
        'data'
      )
    ) {
      response.data = response.data.data
    }

    return response
  },
  (error) => {

    console.error(
      'API ERROR:',
      error.response?.status,
      error.response?.data
    )

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// =========================================================
// AUTH API
// =========================================================
export const authAPI = {
  login: (credentials) =>
    api.post('/auth/login', credentials),

  register: (userData) =>
    api.post('/auth/register', userData),

  getProfile: () =>
    api.get('/auth/profile'),
}

// =========================================================
// PRODUCT API
// =========================================================
export const productAPI = {
  getAllProducts: (params) =>
    api.get('/products', { params }),

  getProductById: (id) =>
    api.get(`/products/${id}`),

  getCategories: () =>
    api.get('/categories'),

  searchProducts: (query) =>
    api.get('/products/search', {
      params: { q: query },
    }),
}

// =========================================================
// CART API
// =========================================================
export const cartAPI = {

  // GET CART
  getCart: () =>
    api.get('/cart/items'),

  // ADD ITEM
  addToCart: (item) =>
    api.post('/cart/items', {
      productId: item.productId,
      quantity: item.quantity || 1,
    }),

  // UPDATE QUANTITY
  updateCartItem: (id, quantity) =>
    api.put(`/cart/items/${id}`, {
      productId: id,
      quantity,
    }),

  // REMOVE ITEM
  removeFromCart: (id) =>
    api.delete(`/cart/items/${id}`),

  // CLEAR CART
  clearCart: () =>
    api.delete('/cart/items'),
}

// =========================================================
// ORDER API
// =========================================================
export const orderAPI = {
  createOrder: (orderData) =>
    api.post('/orders', orderData),

  getOrders: () =>
    api.get('/orders'),

  getOrderById: (id) =>
    api.get(`/orders/${id}`),

  cancelOrder: (id) =>
    api.put(`/orders/${id}/cancel`),
}

// =========================================================
// PAYMENT API
// =========================================================
export const paymentAPI = {
  processPayment: (paymentData) =>
    api.post('/payments', paymentData),

  getPaymentStatus: (id) =>
    api.get(`/payments/${id}/status`),
}

export default api