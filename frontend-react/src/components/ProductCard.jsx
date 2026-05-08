import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Star, ShoppingCart } from 'lucide-react'
import { addToCart } from '../features/cartSlice'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = useSelector((state) => state.auth)

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    await dispatch(addToCart({ productId: product.id, quantity: 1 }))
  }

  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        <img
          src={product.thumbnail_url || '/placeholder.jpg'}
          alt={product.name}
          className="product-image"
        />
      </div>
      <div className="product-content">
        <h3 className="product-name">
          <Link to={`/products/${product.id}`} className="product-link">
            {product.name}
          </Link>
        </h3>
        <div className="product-meta">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{product.average_rating || 0}</span>
          </div>
          <span className="text-sm text-slate-500">Sold: {product.sold_count || 0}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="product-price">${product.price}</span>
          <button className="product-action" onClick={handleAddToCart}>
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard