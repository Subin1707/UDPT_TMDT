import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '../features/orderSlice'
import { fetchProducts } from '../features/productSlice'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { orders, loading: ordersLoading, error: ordersError } = useSelector((state) => state.orders)
  const { items: products, loading: productsLoading, error: productsError } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchOrders())
    dispatch(fetchProducts({ page: 1, limit: 20 }))
  }, [dispatch])

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.final_amount || order.total_amount || 0), 0)
  const completedOrders = orders.filter((order) => ['COMPLETED', 'DELIVERED', 'SUCCESS'].includes((order.status || '').toUpperCase())).length

  if (ordersLoading || productsLoading) {
    return <div className="page-loader">Loading dashboard...</div>
  }

  return (
    <div className="admin-page container-wide">
      <div className="admin-hero glow-card">
        <div>
          <p className="admin-subtitle">Admin Dashboard</p>
          <h1>Quản lý cửa hàng</h1>
          <p>Giám sát doanh thu, đơn hàng và trạng thái sản phẩm trong hệ thống thương mại điện tử phân tán.</p>
        </div>
      </div>

      <div className="admin-grid">
        <div className="dashboard-card glow-card">
          <h2>Orders</h2>
          <p>{orders.length} đơn hàng</p>
          <span className="dashboard-tag">Completed: {completedOrders}</span>
        </div>
        <div className="dashboard-card glow-card">
          <h2>Revenue</h2>
          <p>${totalRevenue.toFixed(2)}</p>
          <span className="dashboard-tag">Realtime estimate</span>
        </div>
        <div className="dashboard-card glow-card">
          <h2>Products</h2>
          <p>{products.length} mặt hàng</p>
          <span className="dashboard-tag">Catalog size</span>
        </div>
        <div className="dashboard-card glow-card">
          <h2>Alerts</h2>
          <p>{orders.filter((order) => order.status === 'FAILED').length} failed payments</p>
          <span className="dashboard-tag">Needs review</span>
        </div>
      </div>

      <section className="recent-section">
        <h2>Recent orders</h2>
        <div className="recent-list">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="recent-item glow-card">
              <div className="recent-header">
                <span>Order #{order.order_code || order.id}</span>
                <span className="status-pill">{order.status || 'PENDING'}</span>
              </div>
              <div className="recent-meta">
                <span>{order.items?.length ?? order.item_count ?? 0} items</span>
                <span>${Number(order.final_amount || order.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {(ordersError || productsError) && <div className="page-error">{ordersError || productsError}</div>}
    </div>
  )
}

export default AdminDashboard
