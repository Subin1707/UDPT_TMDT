// Quản lý giỏ hàng
class Cart {
  constructor() {
    this.items = this.loadCart()
  }

  loadCart() {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items))
  }

  addItem(product, quantity = 1) {
    const existItem = this.items.find(item => item.id === product.id)
    if (existItem) {
      existItem.quantity += quantity
    } else {
      this.items.push({
        ...product,
        quantity,
      })
    }
    this.saveCart()
    this.updateBadge()
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId)
    this.saveCart()
    this.updateBadge()
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId)
      } else {
        item.quantity = quantity
      }
    }
    this.saveCart()
    this.updateBadge()
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  clear() {
    this.items = []
    this.saveCart()
    this.updateBadge()
  }

  updateBadge() {
    const badge = document.querySelector('.cart-count')
    if (badge) {
      badge.textContent = this.items.length
      badge.style.display = this.items.length > 0 ? 'inline' : 'none'
    }
  }
}

// Tạo instance toàn cục
const cart = new Cart()

// Cập nhật badge khi load
document.addEventListener('DOMContentLoaded', () => {
  cart.updateBadge()
})
