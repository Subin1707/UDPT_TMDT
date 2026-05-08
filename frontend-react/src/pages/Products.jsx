import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../features/productSlice'
import ProductCard from '../components/ProductCard'
import './Products.css'

const Products = () => {
  const dispatch = useDispatch()
  const { items: products, loading, error } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 20 }))
  }, [dispatch])

  return (
    <div className="products-page container-wide">
      <div className="products-hero glow-card">
        <div>
          <p className="products-subtitle">Danh sách sản phẩm</p>
          <h1>Khám phá mọi mặt hàng</h1>
          <p>Chọn lựa từ bộ sưu tập sản phẩm phong phú, được cập nhật realtime từ nền tảng microservices.</p>
        </div>
        <div className="products-hero-actions">
          <span>20+ categories</span>
          <span>Trusted microservices</span>
        </div>
      </div>

      {error && <div className="page-error">{error}</div>}

      {loading ? (
        <div className="page-loader">Loading products...</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
