import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../features/cartSlice'
import { formatCurrencyVND } from '../utils/currency'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items, total, isLoading, error } = useSelector(
    (state) => state.cart
  )

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      dispatch(fetchCart())
    }
  }, [dispatch, user])

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return

    dispatch(
      updateCartItem({
        id: productId,
        quantity: newQuantity,
      })
    )
  }

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId))
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart())
    }
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Shopping Cart
        </h1>

        <p className="text-gray-600 mb-6">
          Please login to view your cart
        </p>

        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          Error loading cart: {error}
        </p>

        <button
          onClick={() => dispatch(fetchCart())}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your cart is empty
          </h2>

          <p className="text-gray-600 mb-6">
            Add some products to get started
          </p>

          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items ({items.length})
                  </h2>

                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-6 flex items-center"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.name}
                      </h3>

                      <p className="text-gray-600">
                        {formatCurrencyVND(item.price)} each
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        >
                          -
                        </button>

                        <span className="px-3 py-1 border-l border-r border-gray-300">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[120px]">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrencyVND(
                            item.price * item.quantity
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleRemoveItem(item.productId)
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>

                  <span className="text-gray-900">
                    {formatCurrencyVND(total)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>

                  <span className="text-gray-900">Free</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>

                  <span className="text-gray-900">
                    {formatCurrencyVND(total * 0.1)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>

                    <span>
                      {formatCurrencyVND(total * 1.1)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center mt-4 text-blue-600 hover:text-blue-800"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart