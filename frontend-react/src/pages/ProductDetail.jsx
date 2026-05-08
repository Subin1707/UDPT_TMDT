import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { fetchProductById } from '../features/productSlice'
import { addToCart } from '../features/cartSlice'
import './ProductDetail.css'

const ProductDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const { currentProduct, loading, error } = useSelector((state) => state.products)
  const { token } = useSelector((state) => state.auth)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }
  }, [dispatch, id])

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    await dispatch(addToCart({ productId: id, quantity }))
    navigate('/cart')
  }

  if (loading) {
    return <div className="page-loader">Loading product...</div>
  }

  if (error) {
    return <div className="page-error">{error}</div>
  }

  if (!currentProduct) {
    return <div className="page-error">Product not found.</div>
  }

  return (
    <div className="product-detail-page container-wide">
      <div className="product-detail-card glow-card">
        <div className="product-detail-grid">
          <div className="product-detail-visual">
            <img
              src={currentProduct.thumbnail_url || '/placeholder.jpg'}
              alt={currentProduct.name}
              className="product-detail-image"
            />
          </div>
          <div className="product-detail-summary">
            <p className="product-category">{currentProduct.category_name || currentProduct.category || 'Category'}</p>
            <h1>{currentProduct.name}</h1>
            <p className="product-description">{currentProduct.description || 'No additional description available.'}</p>
            <div className="product-detail-meta">
              <span className="price">${currentProduct.price}</span>
              <span className="badge">{currentProduct.status || 'ACTIVE'}</span>
            </div>
            <div className="product-detail-info">
              <div>
                <p className="info-label">Rating</p>
                <p>{currentProduct.average_rating ?? 0} / 5</p>
              </div>
              <div>
                <p className="info-label">Sold</p>
                <p>{currentProduct.sold_count ?? 0}</p>
              </div>
            </div>
            <div className="product-detail-action">
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                  type="button"
                >-</button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((qty) => qty + 1)}
                  type="button"
                >+</button>
              </div>
              <button className="add-cart-button" onClick={handleAddToCart}>
                Add to cart
              </button>
            </div>
            <div className="product-detail-footer">
              <p>Fast shipping and realtime order tracking in the distributed commerce platform.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
