import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, fetchCategories, searchProducts } from '../features/productSlice'
import ProductCard from '../components/ProductCard'

const Products = () => {
  const dispatch = useDispatch()
  const { items: products, categories, isLoading, error, pagination } = useSelector(state => state.products)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts({ page: currentPage, size: 12 }))
  }, [dispatch, currentPage])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      dispatch(searchProducts(searchQuery))
    } else {
      dispatch(fetchProducts({ page: 0, size: 12, category: selectedCategory }))
      setCurrentPage(0)
    }
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage(0)
    dispatch(fetchProducts({ page: 0, size: 12, category: categoryId }))
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setCurrentPage(0)
    dispatch(fetchProducts({ page: 0, size: 12 }))
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedCategory === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Categories
          </button>
          {categories && Array.isArray(categories) && categories.map((category, index) => {
            // Handle both string categories and object categories
            const categoryId = typeof category === 'string' ? category : category.id
            const categoryName = typeof category === 'string' ? category : category.name
            
            return (
              <button
                key={categoryId || index}
                onClick={() => handleCategoryChange(categoryId)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedCategory === categoryId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {categoryName}
              </button>
            )
          })}
        </div>

        {(searchQuery || selectedCategory) && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          Error loading products: {error}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No products found</p>
          {(searchQuery || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > pagination.size && (
            <div className="flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: Math.ceil(pagination.total / pagination.size) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 rounded-md border ${
                      i === currentPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(pagination.total / pagination.size) - 1}
                  className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Products