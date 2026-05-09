// Quản lý xác thực
class Auth {
  constructor() {
    this.user = this.getUser()
    this.token = localStorage.getItem('authToken')
  }

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  isLoggedIn() {
    return !!this.token && !!this.user
  }

  isAdmin() {
    return this.user?.role === 'ADMIN' || this.user?.isAdmin
  }

  async login(email, password) {
    try {
      const data = await authAPI.login(email, password)
      this.user = data.user
      this.token = data.token
      this.updateUI()
      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async register(fullName, email, phone, password) {
    try {
      const data = await authAPI.register(fullName, email, phone, password)
      this.user = data.user
      this.token = data.token
      this.updateUI()
      return data
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  logout() {
    authAPI.logout()
    this.user = null
    this.token = null
    this.updateUI()
  }

  // Cập nhật UI khi login/logout
  updateUI() {
    const authNav = document.querySelector('.auth-nav')
    if (!authNav) return

    if (this.isLoggedIn()) {
      authNav.innerHTML = `
        <a href="/pages/cart.html" class="nav-link">
          <i class="icon">🛒</i> Giỏ hàng
        </a>
        <a href="/pages/orders.html" class="nav-link">Đơn hàng</a>
        ${this.isAdmin() ? '<a href="/pages/admin-dashboard.html" class="nav-link">Admin</a>' : ''}
        <div class="user-badge">
          <span>${this.user.full_name || this.user.email}</span>
          <button onclick="auth.logout(); location.href='/';" class="btn-logout">Đăng xuất</button>
        </div>
      `
    } else {
      authNav.innerHTML = `
        <a href="/pages/login.html" class="nav-link">Đăng nhập</a>
        <a href="/pages/register.html" class="btn">Đăng ký</a>
      `
    }
  }
}

// Tạo instance toàn cục
const auth = new Auth()

// Gọi updateUI khi load page
document.addEventListener('DOMContentLoaded', () => {
  auth.updateUI()
})

// Helper để kiểm tra login rồi mới thực hiện
function requireLogin(callback) {
  if (auth.isLoggedIn()) {
    callback()
  } else {
    alert('Vui lòng đăng nhập trước')
    window.location.href = '/pages/login.html?redirect=' + window.location.pathname
  }
}
