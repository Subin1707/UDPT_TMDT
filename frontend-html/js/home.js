// Trang chủ
document.addEventListener('DOMContentLoaded', async () => {
  const productsGrid = $('#products-grid')
  
  // Cập nhật CTA button dựa theo login status
  if (auth.isLoggedIn()) {
    $('#cta-button').href = '/pages/orders.html'
    $('#cta-button').textContent = 'Xem đơn hàng'
  }

  try {
    showLoading(productsGrid)
    const response = await productAPI.getAll(1, 6) // Lấy 6 sản phẩm
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
              <span class="star">⭐</span>
              <span>${product.average_rating || 0}</span>
            </div>
            <span class="sold">Bán: ${product.sold_count || 0}</span>
          </div>
          <div class="product-footer">
            <span class="product-price">${formatCurrency(product.price)}</span>
            <button onclick="addToCartHome(${product.id}, '${product.name}', ${product.price})" class="btn-add-cart">
              🛒 Thêm
            </button>
          </div>
        </div>
      </div>
    `)
  } catch (error) {
    showError(productsGrid, 'Không thể tải sản phẩm: ' + error.message)
  }
})

// Thêm vào giỏ hàng từ trang chủ
function addToCartHome(productId, productName, price) {
  if (!auth.isLoggedIn()) {
    alert('Vui lòng đăng nhập trước')
    window.location.href = '/pages/login.html'
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
