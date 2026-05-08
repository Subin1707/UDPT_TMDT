import React from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={product.thumbnail_url || '/placeholder.jpg'}
        alt={product.name}
        className="product-image"
      />
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
          <button className="product-action">
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard