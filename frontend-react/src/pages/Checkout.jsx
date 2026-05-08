import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchCart } from '../features/cartSlice'
import { createOrder } from '../features/orderSlice'
import './Checkout.css'

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { items, loading, error } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    paymentMethod: 'COD',
    note: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (token) {
      dispatch(fetchCart())
    } else {
      navigate('/login', { state: { from: location.pathname } })
    }
  }, [dispatch, token, navigate, location.pathname])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const orderItems = items.map((item) => ({
      productId: item.product_id || item.productId || item.id,
      quantity: item.quantity || 1,
    }))

    const orderPayload = {
      items: orderItems,
      shippingAddress: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
      },
      paymentMethod: form.paymentMethod,
      note: form.note,
    }

    try {
      setSubmitting(true)
      await dispatch(createOrder(orderPayload)).unwrap()
      navigate('/orders')
    } catch (submitError) {
      console.error(submitError)
    } finally {
      setSubmitting(false)
    }
  }

  const orderTotal = items.reduce((sum, item) => {
    const price = Number(item.price || item.product_price || item.unit_price || 0)
    return sum + price * (item.quantity || 1)
  }, 0)

  return (
    <div className="checkout-page container-wide">
      <div className="checkout-grid">
        <div className="checkout-form-card glow-card">
          <h1>Checkout</h1>
          <p>Nhập thông tin giao hàng và chọn phương thức thanh toán.</p>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="checkout-input"
              />
            </label>
            <label>
              Phone
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="checkout-input"
              />
            </label>
            <label>
              Address
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="checkout-textarea"
              />
            </label>
            <label>
              Payment Method
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="checkout-input"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="VNPAY">VNPAY</option>
                <option value="MOMO">MOMO</option>
                <option value="PAYPAL">PayPal</option>
              </select>
            </label>
            <label>
              Order note
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                className="checkout-textarea"
              />
            </label>
            {error && <div className="page-error">{error}</div>}
            <button type="submit" disabled={submitting} className="checkout-submit">
              {submitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="checkout-summary-card glow-card">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items</span>
            <span>{items.length}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>$5.00</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <strong>${(orderTotal + 5).toFixed(2)}</strong>
          </div>
          <div className="checkout-note">
            <p>Thông tin order sẽ được gửi tới Notification Service và cập nhật trạng thái realtime.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
