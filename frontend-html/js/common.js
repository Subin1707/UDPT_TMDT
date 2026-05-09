// Utility functions chung
function $(selector) {
  return document.querySelector(selector)
}

function $$(selector) {
  return document.querySelectorAll(selector)
}

// Hiển thị loading
function showLoading(element) {
  if (element) {
    element.innerHTML = '<div class="loader">Đang tải...</div>'
  }
}

// Hiển thị error
function showError(element, message) {
  if (element) {
    element.innerHTML = `<div class="error-message">${message}</div>`
  }
}

// Format tiền
function formatCurrency(amount) {
  return '$' + parseFloat(amount).toFixed(2)
}

// Format ngày
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

// Tạo element
function createElement(html) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.firstElementChild
}

// Render list
function renderList(container, items, renderItem) {
  if (!container) return
  
  if (items.length === 0) {
    container.innerHTML = '<div class="empty-state">Không có dữ liệu</div>'
    return
  }

  container.innerHTML = items.map(renderItem).join('')
}

// Redirect
function redirect(url) {
  window.location.href = url
}

// Get URL params
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search)
  return params.get(name)
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = createElement(`
    <div class="toast toast-${type}">
      ${message}
    </div>
  `)
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 3000)
}
