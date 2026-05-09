import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/authSlice'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useSelector(state => state.auth)
  const { items } = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Ecommerce
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            <Link to="/products" className="hover:text-blue-200">Products</Link>
            {user && <Link to="/orders" className="hover:text-blue-200">Orders</Link>}
            {user?.role === 'ADMIN' && <Link to="/admin" className="hover:text-blue-200">Admin</Link>}
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 hover:text-blue-200"
                >
                  <span>{user.name || user.email}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="hover:text-blue-200">Register</Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-500">
            <nav className="flex flex-col space-y-2 mt-4">
              <Link to="/" className="hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/products" className="hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Products</Link>
              {user && <Link to="/orders" className="hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Orders</Link>}
              {user?.role === 'ADMIN' && <Link to="/admin" className="hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Admin</Link>}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header