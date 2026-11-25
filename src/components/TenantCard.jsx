import { Phone } from 'lucide-react'
import Button from './Button'
import Card from './Card'
import StatusBadge from './StatusBadge'
import { formatDate, formatPhone } from '../utils/format'

function getInitials(name) {
  if (!name) return '?'
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

/**
 * Kartu ringkas penghuni untuk tampilan grid dan katalog komponen.
 */
export default function TenantCard({
  tenant,
  onViewInvoices,
  onEdit,
  onDetail,
  onCheckout,
}) {
  const isMoved = tenant.status === 'pindah'
  const invStatus = tenant.tagihanTerbaru?.status || 'lunas'

  return (
    <Card padding="md" className="border-0 shadow-sm flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm flex items-center justify-center shrink-0">
              {getInitials(tenant.nama)}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm leading-[22px] font-semibold text-ink truncate">
                {tenant.nama}
              </h3>
              <p className="text-xs leading-[18px] text-muted flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-status-paid" aria-hidden="true" />
                <span>{formatPhone(tenant.noHp)}</span>
              </p>
            </div>
          </div>
          <StatusBadge status={tenant.status} />
        </div>

        <div className="mt-3 p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-primary-700">
              Kamar {tenant.kamarNomor}
            </span>
            <p className="text-[11px] leading-4 text-muted">
              Jatuh tempo tiap tanggal {tenant.jatuhTempo}
            </p>
            <p className="text-[11px] leading-4 text-muted">
              Masuk {formatDate(tenant.tanggalMasuk)}
            </p>
          </div>
          <StatusBadge status={invStatus} />
        </div>
      </div>

      <div className="pt-3 border-t border-line flex items-center justify-end gap-2 flex-wrap">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onViewInvoices?.(tenant)}
          className="min-h-[44px] lg:min-h-0"
        >
          Lihat Tagihan
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onEdit?.(tenant)}
          className="min-h-[44px] lg:min-h-0 border-0 text-muted hover:text-ink hover:bg-app-bg shadow-none"
        >
          Ubah
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onDetail?.(tenant)}
          className="min-h-[44px] lg:min-h-0 border-0 bg-primary-50 text-primary-600 hover:bg-primary-100 shadow-none"
        >
          Detail
        </Button>
        {!isMoved && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onCheckout?.(tenant)}
            className="min-h-[44px] lg:min-h-0"
          >
            Check-out
          </Button>
        )}
      </div>
    </Card>
  )
}
