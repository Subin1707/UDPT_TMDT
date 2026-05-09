// Chi tiết sản phẩm
document.addEventListener('DOMContentLoaded', async () => {
  const productId = getUrlParam('id')
  const detailContainer = $('#product-detail')

  if (!productId) {
    showError(detailContainer, 'Sản phẩm không tồn tại')
    return
  }

  try {
    showLoading(detailContainer)
    const product = await productAPI.getById(productId)

    let quantity = 1
    detailContainer.innerHTML = `
      <div class="detail-grid">
        <div class="detail-image">
          <img src="${product.thumbnail_url || '/placeholder.jpg'}" alt="${product.name}">
        </div>
        <div class="detail-info">
          <p class="detail-category">${product.category_name || product.category || 'Danh mục'}</p>
          <h1>${product.name}</h1>
          <p class="detail-description">${product.description || 'Không có mô tả'}</p>
          
          <div class="detail-meta">
            <span class="detail-price">${formatCurrency(product.price)}</span>
            <span class="detail-status">${product.status || 'ACTIVE'}</span>
          </div>

          <div class="detail-stats">
            <div>
              <p class="stat-label">Đánh giá</p>
              <p class="stat-value">${product.average_rating || 0} / 5</p>
            </div>
            <div>
              <p class="stat-label">Đã bán</p>
              <p class="stat-value">${product.sold_count || 0}</p>
            </div>
          </div>

          <div class="detail-actions">
            <div class="quantity-selector">
              <button onclick="changeQuantity(-1)">-</button>
              <span id="qty">${quantity}</span>
              <button onclick="changeQuantity(1)">+</button>
            </div>
            <button onclick="addToCartDetail(${product.id}, '${product.name}', ${product.price})" class="btn">
              🛒 Thêm vào giỏ
            </button>
          </div>

          <p class="detail-note">Giao hàng nhanh, đảm bảo chất lượng.</p>
        </div>
      </div>
    `

    window.productQuantity = quantity
  } catch (error) {
    showError(detailContainer, 'Lỗi tải sản phẩm: ' + error.message)
  }
})

function changeQuantity(delta) {
  window.productQuantity = Math.max(1, window.productQuantity + delta)
  $('#qty').textContent = window.productQuantity
}

function addToCartDetail(productId, productName, price) {
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

  const qty = window.productQuantity || 1
  cart.addItem(product, qty)
  showToast(`Đã thêm ${qty} "${productName}" vào giỏ hàng`, 'success')
}
