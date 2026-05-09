import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchCart } from '../features/cartSlice'
import { createOrder } from '../features/orderSlice'
import { formatCurrencyVND } from '../utils/currency'

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)
  const { isLoading: orderLoading } = useSelector(state => state.orders)
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')

  useEffect(() => {
    if (user) {
      dispatch(fetchCart())
    }
  }, [dispatch, user])

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const orderData = {
      userId: user.userId,
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    }

    try {
      await dispatch(createOrder(orderData)).unwrap()
      navigate('/orders')
    } catch (error) {
      console.error('Order creation failed:', error)
    }
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout</h1>
        <p className="text-gray-600 mb-6">Your cart is empty</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  const tax = total * 0.1
  const shipping = total > 50 ? 0 : 10
  const finalTotal = total + tax + shipping

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10001"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleShippingChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CREDIT_CARD"
                  checked={paymentMethod === 'CREDIT_CARD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">Credit Card</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PAYPAL"
                  checked={paymentMethod === 'PAYPAL'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">PayPal</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">Bank Transfer</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      {item.product?.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.product?.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatCurrencyVND(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatCurrencyVND(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatCurrencyVND(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">{formatCurrencyVND(shipping)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrencyVND(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={orderLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {orderLoading ? 'Processing Order...' : `Place Order - ${formatCurrencyVND(finalTotal)}`}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Checkout