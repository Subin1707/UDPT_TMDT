import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, clearSelectedProduct } from '../features/productSlice'
import { addToCart } from '../features/cartSlice'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedProduct, isLoading, error } = useSelector(state => state.products)
  const { user } = useSelector(state => state.auth)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }
    return () => {
      dispatch(clearSelectedProduct())
    }
  }, [dispatch, id])

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login')
      return
    }
    dispatch(addToCart({
      productId: selectedProduct.id,
      quantity: quantity,
      price: selectedProduct.price
    }))
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= selectedProduct.stock) {
      setQuantity(newQuantity)
    }
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
        <p className="text-red-600 mb-4">Error loading product: {error}</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    )
  }

  if (!selectedProduct) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Product not found</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              {selectedProduct.imageUrl ? (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">No Image Available</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedProduct.name}
              </h1>
              <p className="text-gray-600 text-lg">
                Category: {selectedProduct.category?.name || 'Uncategorized'}
              </p>
            </div>

            <div className="text-4xl font-bold text-green-600">
              ${selectedProduct.price?.toFixed(2)}
            </div>

            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedProduct.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock})` : 'Out of Stock'}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedProduct.description || 'No description available.'}
              </p>
            </div>

            {selectedProduct.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="text-gray-700 font-medium">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={selectedProduct.stock}
                      className="w-16 text-center border-l border-r border-gray-300 py-2 focus:outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      disabled={quantity >= selectedProduct.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 font-medium text-lg"
                >
                  Add to Cart - ${(selectedProduct.price * quantity)?.toFixed(2)}
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate('/products')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail