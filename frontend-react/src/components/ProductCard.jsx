import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cartSlice'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({
      productId: product.id,
      quantity: 1,
      price: product.price
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`}>
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No Image</p>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-green-600">
            ${product.price?.toFixed(2)}
          </span>
          {product.stock > 0 ? (
            <span className="text-sm text-green-600">In Stock ({product.stock})</span>
          ) : (
            <span className="text-sm text-red-600">Out of Stock</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            product.stock > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard