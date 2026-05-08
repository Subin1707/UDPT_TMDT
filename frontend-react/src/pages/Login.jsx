import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../features/authSlice'
import './Login.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(login(formData)).unwrap()
      navigate('/')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div>
          <h2 className="auth-title">Chào mừng trở lại</h2>
          <p className="auth-description">Đăng nhập để tiếp tục quản lý đơn hàng và trải nghiệm hệ thống thương mại điện tử phân tán.</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="auth-field"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            id="password"
            name="password"
            type="password"
            required
            className="auth-field"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="auth-footer">
          <Link to="/register" className="auth-link">
            Chưa có tài khoản? Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login