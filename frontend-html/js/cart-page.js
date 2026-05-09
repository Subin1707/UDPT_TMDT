// Trang giỏ hàng
document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isLoggedIn()) {
    window.location.href = '/pages/login.html'
    return
  }

  renderCart()
})

function renderCart() {
  const container = $('#cart-content')
  const items = cart.items

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h2>Giỏ hàng trống</h2>
        <p>Bạn chưa thêm sản phẩm nào vào giỏ.</p>
        <a href="/pages/products.html" class="btn">Tiếp tục mua sắm</a>
      </div>
    `
    return
  }

  const cartHTML = `
    <div class="cart-grid">
      <div class="cart-items">
        ${items.map((item, idx) => `
          <div class="cart-item">
            <img src="${item.thumbnail_url || '/placeholder.jpg'}" alt="${item.name}">
            <div class="item-details">
              <h3>${item.name}</h3>
              <p>${formatCurrency(item.price)} x ${item.quantity} = ${formatCurrency(item.price * item.quantity)}</p>
            </div>
            <div class="item-actions">
              <div class="qty-control">
                <button onclick="updateQty(${idx}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQty(${idx}, 1)">+</button>
              </div>
              <button onclick="removeItem(${idx})" class="btn-remove">Xóa</button>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="cart-summary">
        <h2>Tóm tắt đơn hàng</h2>
        <div class="summary-row">
          <span>Tạm tính:</span>
          <strong>${formatCurrency(cart.getTotal())}</strong>
        </div>
        <div class="summary-row">
          <span>Vận chuyển:</span>
          <span>$5.00</span>
        </div>
        <div class="summary-row total">
          <span>Tổng cộng:</span>
          <strong>${formatCurrency(cart.getTotal() + 5)}</strong>
        </div>
        <a href="/pages/checkout.html" class="btn">Tiến hành thanh toán</a>
        <a href="/pages/products.html" class="btn btn-secondary">Tiếp tục mua sắm</a>
      </div>
    </div>
  `

  container.innerHTML = cartHTML
}

function updateQty(idx, delta) {
  const item = cart.items[idx]
  const newQty = item.quantity + delta

  if (newQty <= 0) {
    cart.removeItem(item.id)
  } else {
    cart.updateQuantity(item.id, newQty)
  }

  renderCart()
}

function removeItem(idx) {
  const item = cart.items[idx]
  if (confirm(`Xóa "${item.name}" khỏi giỏ hàng?`)) {
    cart.removeItem(item.id)
    renderCart()
    showToast('Đã xóa khỏi giỏ hàng', 'info')
  }
}
