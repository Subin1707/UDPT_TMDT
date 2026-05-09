// Trang đơn hàng
document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isLoggedIn()) {
    window.location.href = '/pages/login.html'
    return
  }

  const container = $('#orders-container')

  try {
    showLoading(container)
    const response = await orderAPI.getOrders()
    const orders = response.data || response.items || response

    if (!orders || orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h2>Chưa có đơn hàng</h2>
          <p>Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
          <a href="/pages/products.html" class="btn">Mua sắm ngay</a>
        </div>
      `
      return
    }

    container.innerHTML = orders.map(order => `
      <div class="order-card">
        <div class="order-header">
          <h3>Đơn hàng #${order.order_code || order.id}</h3>
          <span class="status-badge status-${(order.status || '').toLowerCase()}">
            ${order.status || 'PENDING'}
          </span>
        </div>
        <div class="order-details">
          <p><strong>Tổng tiền:</strong> ${formatCurrency(order.final_amount || order.total_amount || 0)}</p>
          <p><strong>Số sản phẩm:</strong> ${order.items?.length ?? order.item_count ?? 0}</p>
          <p><strong>Ngày đặt:</strong> ${formatDate(order.created_at || order.createdAt)}</p>
          <p><strong>Địa chỉ:</strong> ${order.shipping_address || 'N/A'}</p>
        </div>
      </div>
    `).join('')
  } catch (error) {
    showError(container, 'Lỗi tải đơn hàng: ' + error.message)
  }
})
