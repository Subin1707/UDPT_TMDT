import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../features/productSlice'
import ProductCard from '../components/ProductCard'
import './Home.css'

const Home = () => {
  const dispatch = useDispatch()
  const { items: products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts({}))
  }, [dispatch])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="home-page">
      <div className="container container-wide">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="hero-badge">Microservices Marketplace</span>
            <h1 className="hero-title">Hệ thống thương mại điện tử phân tán</h1>
            <p className="hero-text">
              Khám phá sản phẩm, đặt hàng và nhận thông báo realtime trong một nền tảng được xây dựng theo kiến trúc microservices.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="primary-button">
                Khám phá sản phẩm
              </Link>
              <Link to="/login" className="secondary-button">
                Đăng nhập ngay
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <h2>Điểm nổi bật</h2>
            <ul>
              <li>Kiến trúc phân tán, dễ mở rộng.</li>
              <li>Realtime notification qua WebSocket.</li>
              <li>Quản lý đơn hàng và thanh toán mô phỏng.</li>
              <li>Dashboard admin và báo cáo.</li>
            </ul>
          </div>
        </section>

        <section className="products-section">
          <div className="flex items-center justify-between mb-6 gap-4">
            <h2 className="text-3xl font-bold section-title">Sản phẩm nổi bật</h2>
            <span className="text-sm text-slate-500">Cập nhật từ hệ thống</span>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home