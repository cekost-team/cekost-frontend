import { MessageSquare } from 'lucide-react'
import Button from './Button'
import StatusBadge from './StatusBadge'
import { formatDate, formatRupiah } from '../utils/format'

/**
 * Baris daftar tagihan mendesak pada bagian "Perlu Ditagih".
 *
 * @param {Object} props
 * @param {Object} props.invoice - Data tagihan (roomNumber, tenantName, status, daysLate, dueDate, amount, totalAmount, note)
 * @param {function} [props.onSendReminder] - Handler klik tombol Kirim Pengingat
 */
export default function UrgentInvoiceRow({ invoice, onSendReminder }) {
  const isPartial = invoice.status === 'sebagian'
  const isLate = invoice.status === 'telat'

  const badgeLabel = isLate
    ? `Telat ${invoice.daysLate} Hari`
    : invoice.status === 'belum_bayar'
      ? 'Hari Ini'
      : isPartial
        ? 'Sebagian'
        : ''

  const subtitle = isPartial
    ? `Sewa Bulanan • Jatuh tempo ${formatDate(invoice.dueDate)} (Sisa tagihan)`
    : `Sewa Bulanan • Jatuh tempo ${formatDate(invoice.dueDate)}`

  return (
    <div className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-surface flex flex-col items-center justify-center shadow-sm shrink-0">
          <span className="text-[11px] leading-4 font-semibold text-muted uppercase">
            KMR
          </span>
          <span className="text-lg leading-none font-bold text-ink">
            {invoice.roomNumber}
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm leading-[22px] font-semibold text-ink truncate">
              {invoice.tenantName}
            </span>
            <StatusBadge status={invoice.status} label={badgeLabel} />
          </div>
          <span className="text-xs leading-[18px] text-muted mt-0.5 truncate">
            {subtitle}
          </span>
          {isPartial && invoice.totalAmount ? (
            <div className="flex items-center gap-1 mt-1 sm:hidden">
              <span className="text-sm leading-[22px] font-semibold text-status-partial tabular-nums">
                {formatRupiah(invoice.amount)}
              </span>
              <span className="text-[11px] leading-4 text-muted tabular-nums">
                / {formatRupiah(invoice.totalAmount)}
              </span>
            </div>
          ) : (
            <span
              className={`text-sm leading-[22px] font-semibold tabular-nums mt-1 sm:hidden ${
                isLate ? 'text-status-late' : 'text-ink'
              }`}
            >
              {formatRupiah(invoice.amount)}
            </span>
          )}
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0">
        {isPartial && invoice.totalAmount ? (
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-lg leading-[26px] font-bold text-status-partial tabular-nums">
              {formatRupiah(invoice.amount)}
            </span>
            <span className="text-[11px] leading-4 font-medium text-muted tabular-nums">
              dari total {formatRupiah(invoice.totalAmount)}
            </span>
          </div>
        ) : (
          <span className="hidden sm:inline text-lg leading-[26px] font-bold text-ink tabular-nums">
            {formatRupiah(invoice.amount)}
          </span>
        )}

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => onSendReminder?.(invoice)}
          icon={<MessageSquare className="w-[18px] h-[18px]" aria-hidden="true" />}
          className="min-h-[44px] lg:min-h-0 lg:h-9 px-3 rounded-lg bg-secondary hover:bg-secondary/90 text-on-primary text-sm leading-[22px] font-semibold shadow-sm"
        >
          Kirim Pengingat
        </Button>
      </div>
    </div>
  )
}
