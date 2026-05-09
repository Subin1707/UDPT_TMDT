// API Helper - Gọi API backend
const API_BASE = 'http://localhost:8080/api' // Thay đổi theo backend của bạn

// Helper fetch with error handling
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  // Thêm token vào header nếu có
  const token = localStorage.getItem('authToken')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API Error')
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Sản phẩm
const productAPI = {
  getAll: async (page = 1, limit = 20) => {
    return apiCall(`/products?page=${page}&limit=${limit}`)
  },
  
  getById: async (id) => {
    return apiCall(`/products/${id}`)
  },
}

// Xác thực
const authAPI = {
  login: async (email, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  },

  register: async (fullName, email, phone, password) => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, phone, password }),
    })
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  },

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
  },
}

// Giỏ hàng
const cartAPI = {
  getCart: async () => {
    return apiCall('/cart')
  },

  addToCart: async (productId, quantity) => {
    return apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    })
  },

  updateCart: async (productId, quantity) => {
    return apiCall('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    })
  },

  removeFromCart: async (productId) => {
    return apiCall(`/cart/remove/${productId}`, { method: 'DELETE' })
  },
}

// Đơn hàng
const orderAPI = {
  getOrders: async () => {
    return apiCall('/orders')
  },

  createOrder: async (orderData) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  },

  getOrderById: async (id) => {
    return apiCall(`/orders/${id}`)
  },
}

// Xuất các function để sử dụng
window.apiCall = apiCall
window.productAPI = productAPI
window.authAPI = authAPI
window.cartAPI = cartAPI
window.orderAPI = orderAPI
