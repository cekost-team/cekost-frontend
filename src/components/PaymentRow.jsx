import { CheckCircle2 } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatRupiah } from '../utils/format'

function formatShortDateTime(dateInput) {
  if (!dateInput) return '-'
  const parsed = new Date(dateInput)
  if (isNaN(parsed.getTime())) return '-'

  const datePart = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(parsed)

  const timePart = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(parsed)
    .replace('.', ':')

  return `${datePart}, ${timePart}`
}

/**
 * Baris riwayat pembayaran terbaru pada bagian "Pembayaran Terbaru".
 *
 * @param {Object} props
 * @param {Object} props.payment - Data pembayaran (tenantName, roomNumber, roomFloor, date, method, amount, status)
 */
export default function PaymentRow({ payment }) {
  return (
    <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-2 hover:bg-surface-container transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-status-paid-bg text-status-paid flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm leading-[22px] font-semibold text-ink truncate">
            {payment.tenantName}
          </span>
          <span className="text-[11px] leading-4 font-medium text-muted truncate">
            Kamar {payment.roomNumber} • Lantai {payment.roomFloor || 1}
          </span>
          <span className="text-[11px] leading-4 font-medium text-disabled mt-0.5 truncate">
            {formatShortDateTime(payment.date)} • {payment.method}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0 gap-1">
        <span className="text-sm leading-[22px] font-semibold text-ink tabular-nums">
          {formatRupiah(payment.amount)}
        </span>
        <StatusBadge status={payment.status} />
      </div>
    </div>
  )
}
