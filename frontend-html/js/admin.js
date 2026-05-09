// Admin Dashboard
document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isLoggedIn() || !auth.isAdmin()) {
    alert('Bạn không có quyền truy cập trang này')
    window.location.href = '/'
    return
  }

  try {
    // Lấy dữ liệu
    const ordersResp = await orderAPI.getOrders()
    const productsResp = await productAPI.getAll(1, 1000)

    const orders = ordersResp.data || ordersResp.items || ordersResp || []
    const products = productsResp.data || productsResp.items || productsResp || []

    // Tính toán thống kê
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.final_amount || o.total_amount || 0), 0)
    const completedCount = orders.filter(o => ['COMPLETED', 'DELIVERED', 'SUCCESS'].includes((o.status || '').toUpperCase())).length
    const failedCount = orders.filter(o => (o.status || '').toUpperCase() === 'FAILED').length

    // Cập nhật dashboard
    document.getElementById('total-orders').textContent = orders.length
    document.getElementById('completed-orders').textContent = completedCount
    document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue)
    document.getElementById('total-products').textContent = products.length
    document.getElementById('failed-orders').textContent = failedCount

    // Hiển thị đơn hàng gần đây
    const recentContainer = $('#recent-orders')
    const recentOrders = orders.slice(0, 10)

    recentContainer.innerHTML = recentOrders.map(order => `
      <div class="recent-item">
        <div class="item-header">
          <span class="order-id">#${order.order_code || order.id}</span>
          <span class="status-badge status-${(order.status || '').toLowerCase()}">
            ${order.status || 'PENDING'}
          </span>
        </div>
        <div class="item-info">
          <span>${order.items?.length ?? 0} sản phẩm</span>
          <span>${formatCurrency(order.final_amount || order.total_amount || 0)}</span>
        </div>
      </div>
    `).join('')
  } catch (error) {
    console.error('Dashboard error:', error)
    alert('Lỗi tải dữ liệu: ' + error.message)
  }
})
