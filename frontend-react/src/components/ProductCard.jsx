import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../features/cartSlice'
import { formatCurrencyVND } from '../utils/currency'

const ProductCard = ({ product }) => {

  // Redux dispatch
  const dispatch = useDispatch()

  // Điều hướng trang
  const navigate = useNavigate()

  // Lấy user từ Redux auth state
  const { user } = useSelector(state => state.auth)

const handleAddToCart = async (e) => {
  e.preventDefault()

  // Nếu chưa đăng nhập
  if (!user) {
    navigate('/login')
    return
  }

  try {

    // DEBUG PRODUCT
    console.log('FULL PRODUCT:', product)

    // Lấy id an toàn
    const productId = product.id || product.productId

    console.log('PRODUCT ID:', productId)

    // Nếu không có id -> dừng
    if (!productId) {

      console.error('Product ID is invalid')

      alert('Product ID không tồn tại')

      return
    }

    // Gọi API
    await dispatch(addToCart({
      productId: productId,
      quantity: 1,
    })).unwrap()

    console.log('Add to cart success')

  } catch (error) {

    console.error('Add to cart failed:', error)

    alert(
      error?.message ||
      error ||
      'Không thể thêm sản phẩm vào giỏ hàng'
    )
  }
}
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">

      {/* Image */}
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

              <svg
                className="w-16 h-16 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>

              <p>No Image</p>

            </div>

          )}

        </div>
      </Link>

      {/* Content */}
      <div className="p-4">

        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>

        {/* Price + Stock */}
        <div className="flex justify-between items-center mb-3">

          <span className="text-xl font-bold text-green-600">
            {formatCurrencyVND(product.price)}
          </span>

          {product.stock > 0 ? (
            <span className="text-sm text-green-600">
              In Stock ({product.stock})
            </span>
          ) : (
            <span className="text-sm text-red-600">
              Out of Stock
            </span>
          )}

        </div>

        {/* Add To Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            product.stock > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.stock > 0
            ? 'Add to Cart'
            : 'Out of Stock'}
        </button>

      </div>
    </div>
  )
}

export default ProductCard