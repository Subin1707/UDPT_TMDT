// Trang danh sách sản phẩm
document.addEventListener('DOMContentLoaded', async () => {
  const productsGrid = $('#products-grid')
  
  try {
    showLoading(productsGrid)
    const response = await productAPI.getAll(1, 20)
    const products = response.data || response.items || response

    renderList(productsGrid, products, (product) => `
      <div class="product-card">
        <div class="product-image-wrap">
          <img src="${product.thumbnail_url || '/placeholder.jpg'}" alt="${product.name}">
        </div>
        <div class="product-content">
          <h3>
            <a href="/pages/product-detail.html?id=${product.id}" class="product-link">
              ${product.name}
            </a>
          </h3>
          <div class="product-meta">
            <div class="rating">
              <span>⭐</span>
              <span>${product.average_rating || 0}</span>
            </div>
            <span class="sold">Bán: ${product.sold_count || 0}</span>
          </div>
          <div class="product-footer">
            <span class="product-price">${formatCurrency(product.price)}</span>
            <button onclick="addProduct(${product.id}, '${product.name}', ${product.price})" class="btn-add-cart">
              🛒 Thêm
            </button>
          </div>
        </div>
      </div>
    `)
  } catch (error) {
    showError(productsGrid, 'Lỗi tải sản phẩm: ' + error.message)
  }
})

function addProduct(productId, productName, price) {
  if (!auth.isLoggedIn()) {
    if (confirm('Vui lòng đăng nhập trước. Bạn có muốn đăng nhập không?')) {
      window.location.href = '/pages/login.html'
    }
    return
  }

  const product = {
    id: productId,
    name: productName,
    price: price,
    thumbnail_url: '/placeholder.jpg',
  }

  cart.addItem(product, 1)
  showToast(`Đã thêm "${productName}" vào giỏ hàng`, 'success')
}
