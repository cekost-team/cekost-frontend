/**
 * Format angka atau nominal uang ke format Rupiah standar CeKost
 * Contoh: 1500000 -> "Rp 1.500.000"
 *
 * @param {number | string} amount - Nilai nominal yang akan diformat
 * @returns {string} String representasi Rupiah
 */
export function formatRupiah(amount) {
  const numericValue =
    typeof amount === 'number'
      ? amount
      : typeof amount === 'string'
      ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) || 0
      : 0

  const formattedNumber = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(numericValue)

  return `Rp ${formattedNumber}`
}

/**
 * Format tanggal standar Indonesia
 * Contoh: "2026-11-05" -> "5 Nov 2026" atau opsi lengkap "5 November 2026"
 *
 * @param {string | Date} dateInput - Tanggal masukan
 * @param {'short' | 'long' | 'medium'} [style='short'] - Gaya penulisan bulan
 * @returns {string} Tanggal yang telah diformat
 */
export function formatDate(dateInput, style = 'short') {
  if (!dateInput) return '-'

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return '-'

  const monthFormat = style === 'long' ? 'long' : 'short'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: monthFormat,
    year: 'numeric',
  }).format(date)
}

/**
 * Format periode bulan dan tahun
 * Contoh: "2026-11-05" -> "November 2026"
 *
 * @param {string | Date} dateInput - Tanggal masukan
 * @returns {string} Periode bulan dan tahun
 */
export function formatMonthYear(dateInput) {
  if (!dateInput) return '-'

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Format nomor WhatsApp Indonesia ke tampilan lokal 08xx-xxxx-xxxx
 * Contoh: "6281234567890" -> "0812-3456-7890"
 *
 * @param {string} phone - Nomor telepon format internasional atau lokal
 * @returns {string} Nomor telepon terformat
 */
export function formatPhone(phone) {
  if (!phone) return '-'
  const digits = String(phone).replace(/\D/g, '')
  const local = digits.startsWith('62') ? `0${digits.slice(2)}` : digits
  if (local.length >= 10) {
    return `${local.slice(0, 4)}-${local.slice(4, 8)}-${local.slice(8)}`
  }
  return local || '-'
}
