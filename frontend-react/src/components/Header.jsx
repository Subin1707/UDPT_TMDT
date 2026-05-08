import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { logout } from '../features/authSlice'
import './Header.css'

const Header = () => {
  const { user } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN' || user?.isAdmin

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className="header-bar">
      <div className="header-inner">
        <Link to="/" className="brand-link">
          <span>E-Commerce</span>
          <small className="brand-tagline">Marketplace phân tán, trải nghiệm mượt mà</small>
        </Link>

        <nav className="nav-links">
          <Link to="/products" className="nav-link">
            Products
          </Link>

          {user ? (
            <>
              <Link to="/cart" className="nav-link cart-badge">
                <ShoppingCart size={24} />
                {items.length > 0 && (
                  <span className="cart-count">{items.length}</span>
                )}
              </Link>

              <Link to="/orders" className="nav-link">
                Orders
              </Link>

              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
              )}

              <div className="user-badge">
                <User size={20} />
                <span>{user.full_name}</span>
                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="cta-button">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header