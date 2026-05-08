import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '../features/orderSlice'
import './Orders.css'

const Orders = () => {
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  if (loading) {
    return <div className="page-loader">Loading orders...</div>
  }

  return (
    <div className="orders-page container-wide">
      <div className="orders-header">
        <h1>Order History</h1>
        <p>Giữ track lịch sử đơn hàng và trạng thái realtime.</p>
      </div>

      {error && <div className="page-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-state glow-card">
          <h2>Không có đơn hàng</h2>
          <p>Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm ngay.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div className="order-card glow-card" key={order.id}>
              <div className="order-card-header">
                <span>Order #{order.order_code || order.id}</span>
                <span className="order-status">{order.status}</span>
              </div>
              <div className="order-details">
                <p>Total: <strong>${order.final_amount || order.total_amount || 0}</strong></p>
                <p>Items: {order.items?.length ?? order.item_count ?? 'N/A'}</p>
                <p>Created: {new Date(order.created_at || order.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
