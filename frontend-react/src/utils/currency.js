export const formatCurrencyVND = (amount = 0) => {
  const value = Number(amount) || 0
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}
