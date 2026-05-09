// Trang checkout
document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isLoggedIn()) {
    window.location.href = '/pages/login.html'
    return
  }

  if (cart.items.length === 0) {
    alert('Giỏ hàng trống. Vui lòng thêm sản phẩm trước.')
    window.location.href = '/pages/products.html'
    return
  }

  // Hiển thị tóm tắt đơn hàng
  const itemsContainer = $('#order-items')
  itemsContainer.innerHTML = cart.items.map(item => `
    <div class="order-item">
      <span>${item.name} x${item.quantity}</span>
      <span>${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `).join('')

  const total = cart.getTotal() + 5
  $('#total-price').textContent = formatCurrency(total)

  // Điền thông tin user nếu có
  if (auth.user) {
    document.getElementById('fullName').value = auth.user.full_name || ''
    document.getElementById('phone').value = auth.user.phone || ''
  }

  // Xử lý form
  document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const errorDiv = document.getElementById('error-msg')
    const submitBtn = e.target.querySelector('button[type="submit"]')
    submitBtn.disabled = true

    try {
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: document.getElementById('fullName').value,
          phone: document.getElementById('phone').value,
          address: document.getElementById('address').value,
        },
        paymentMethod: document.getElementById('payment').value,
        note: document.getElementById('note').value,
      }

      const result = await orderAPI.createOrder(orderData)
      showToast('Đặt hàng thành công!', 'success')
      cart.clear()

      setTimeout(() => {
        window.location.href = '/pages/orders.html'
      }, 1000)
    } catch (error) {
      errorDiv.textContent = 'Lỗi: ' + (error.message || 'Đặt hàng thất bại')
      errorDiv.style.display = 'block'
      submitBtn.disabled = false
    }
  })
})
