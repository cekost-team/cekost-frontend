import { useEffect } from 'react'

const STATUS_MAP = {
  // Tagihan
  lunas: {
    label: 'Lunas',
    className: 'bg-status-paid-bg text-status-paid',
  },
  paid: {
    label: 'Lunas',
    className: 'bg-status-paid-bg text-status-paid',
  },
  sebagian: {
    label: 'Sebagian',
    className: 'bg-status-partial-bg text-status-partial',
  },
  partial: {
    label: 'Sebagian',
    className: 'bg-status-partial-bg text-status-partial',
  },
  belum_bayar: {
    label: 'Belum Bayar',
    className: 'bg-status-unpaid-bg text-status-unpaid',
  },
  'belum bayar': {
    label: 'Belum Bayar',
    className: 'bg-status-unpaid-bg text-status-unpaid',
  },
  unpaid: {
    label: 'Belum Bayar',
    className: 'bg-status-unpaid-bg text-status-unpaid',
  },
  telat: {
    label: 'Telat',
    className: 'bg-status-late-bg text-status-late',
  },
  late: {
    label: 'Telat',
    className: 'bg-status-late-bg text-status-late',
  },

  // Kamar
  terisi: {
    label: 'Terisi',
    className: 'bg-primary-100 text-primary-600',
  },
  occupied: {
    label: 'Terisi',
    className: 'bg-primary-100 text-primary-600',
  },
  tersedia: {
    label: 'Tersedia',
    className: 'bg-status-paid-bg text-status-paid',
  },
  available: {
    label: 'Tersedia',
    className: 'bg-status-paid-bg text-status-paid',
  },
  perbaikan: {
    label: 'Perbaikan',
    className: 'bg-status-repair-bg text-status-repair',
  },
  repair: {
    label: 'Perbaikan',
    className: 'bg-status-repair-bg text-status-repair',
  },

  // Penghuni
  aktif: {
    label: 'Aktif',
    className: 'bg-status-paid-bg text-status-paid',
  },
  active: {
    label: 'Aktif',
    className: 'bg-status-paid-bg text-status-paid',
  },
  pindah: {
    label: 'Pindah',
    className: 'bg-status-unpaid-bg text-status-unpaid',
  },
  moved: {
    label: 'Pindah',
    className: 'bg-status-unpaid-bg text-status-unpaid',
  },

  // Pengingat WhatsApp
  terkirim: {
    label: 'Terkirim',
    className: 'bg-status-paid-bg text-status-paid',
  },
  sent: {
    label: 'Terkirim',
    className: 'bg-status-paid-bg text-status-paid',
  },
  gagal: {
    label: 'Gagal',
    className: 'bg-status-late-bg text-status-late',
  },
  failed: {
    label: 'Gagal',
    className: 'bg-status-late-bg text-status-late',
  },
}

/**
 * Komponen StatusBadge - Acuan CeKost Design System
 *
 * @param {Object} props
 * @param {string} props.status - Kunci status (Wajib diisi: lunas, sebagian, belum_bayar, telat, terisi, tersedia, perbaikan, aktif, pindah, terkirim, gagal)
 * @param {string} [props.label=''] - Teks kustom opsional (jika kosong, memakai label acuan standar)
 * @param {string} [props.className=''] - Kelas Tailwind kustom tambahan
 */
export default function StatusBadge({ status, label = '', className = '' }) {
  const normalizedKey = typeof status === 'string' ? status.trim().toLowerCase() : ''
  const config = STATUS_MAP[normalizedKey]

  const isUnknown = !config

  useEffect(() => {
    if (isUnknown && import.meta.env?.DEV) {
      console.warn(`[StatusBadge] Status tidak dikenal: "${status}"`)
    }
  }, [isUnknown, status])

  const badgeColorClass = config
    ? config.className
    : 'bg-status-unpaid-bg text-status-unpaid'

  const displayText = label || (config ? config.label : String(status || ''))

  return (
    <span
      className={`h-6 px-2.5 rounded-full inline-flex items-center justify-center font-semibold text-xs leading-none select-none shrink-0 ${badgeColorClass} ${className}`.trim()}
    >
      {displayText}
    </span>
  )
}
