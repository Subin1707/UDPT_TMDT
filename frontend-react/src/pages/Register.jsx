import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../features/authSlice'
import './Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      await dispatch(register({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })).unwrap()
      navigate('/')
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div>
          <h2 className="auth-title">Tạo tài khoản mới</h2>
          <p className="auth-description">Tham gia hệ thống thương mại điện tử phân tán và bắt đầu quản lý đơn hàng ngay hôm nay.</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            className="auth-field"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
          />
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
            id="phone"
            name="phone"
            type="tel"
            className="auth-field"
            placeholder="Phone (optional)"
            value={formData.phone}
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
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="auth-field"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </button>
        </form>
        <div className="auth-footer">
          <Link to="/login" className="auth-link">
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register