import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { fetchCart, removeCartItem, updateCartItem } from '../features/cartSlice'
import './Cart.css'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { items, total, loading, error } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(fetchCart())
    } else {
      navigate('/login', { state: { from: location.pathname } })
    }
  }, [dispatch, token, navigate, location.pathname])

  const orderTotal = items.reduce((sum, item) => {
    const price = Number(item.price || item.product_price || item.unit_price || item.unitPrice || 0)
    return sum + price * (item.quantity || 1)
  }, 0)

  const getProductId = (item) => item.productId || item.product_id || item.id

  const handleQuantityChange = (item, nextQuantity) => {
    const productId = getProductId(item)
    if (!productId) {
      return
    }

    if (nextQuantity <= 0) {
      dispatch(removeCartItem(productId))
      return
    }

    dispatch(updateCartItem({ productId, quantity: nextQuantity }))
  }

  if (loading) {
    return <div className="page-loader">Loading cart...</div>
  }

  return (
    <div className="cart-page container-wide">
      <div className="cart-header">
        <div>
          <h1>Giỏ hàng của bạn</h1>
          <p>{items.length} sản phẩm trong giỏ hàng</p>
        </div>
      </div>

      {error && <div className="page-error">{error}</div>}

      {items.length === 0 ? (
        <div className="empty-cart-card glow-card">
          <h2>Giỏ hàng trống</h2>
          <p>Thêm sản phẩm vào giỏ để tiến hành checkout.</p>
          <Link to="/" className="secondary-button">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items-card glow-card">
            {items.map((item) => (
              <div className="cart-item" key={item.id || item.product_id || item.productId}>
                <img
                  src={item.thumbnail_url || item.image_url || '/placeholder.jpg'}
                  alt={item.name || item.product_name}
                  className="cart-item-image"
                />
                <div className="cart-item-content">
                  <h3>{item.name || item.product_name || 'Product'}</h3>
                  <p>{item.description || item.product_description || 'No description available.'}</p>
                  <div className="cart-item-meta">
                    <span>${Number(item.price || item.product_price || item.unit_price || item.unitPrice || 0).toFixed(2)}</span>
                    <div className="cart-quantity-control">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                        aria-label="Decrease quantity"
                        disabled={loading}
                      >
                        -
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                        aria-label="Increase quantity"
                        disabled={loading}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-remove-button"
                      onClick={() => dispatch(removeCartItem(getProductId(item)))}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-card glow-card">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${orderTotal.toFixed(2)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>${(orderTotal + 5).toFixed(2)}</strong>
            </div>
            <button className="checkout-button" onClick={() => navigate('/checkout')}>
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
