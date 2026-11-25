import {
  AlertTriangle,
  BadgeCheck,
  Check,
  Clock,
  KeyRound,
  UserPlus,
  Wrench,
} from 'lucide-react'
import Button from './Button'
import Card from './Card'
import StatusBadge from './StatusBadge'
import { formatDate, formatRupiah } from '../utils/format'

function getInitials(name) {
  if (!name) return '?'
  const parts = String(name).trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('')
}

function TenantBanner({ room }) {
  const { status, penghuni, tipe, lantai, catatan, paymentStatus, dueDate, remainingAmount, daysLate } =
    room

  if (status === 'tersedia' || (!penghuni && status !== 'perbaikan')) {
    return (
      <div className="mt-3 p-3 rounded-xl bg-status-paid-bg/40 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-status-paid-bg text-status-paid flex items-center justify-center shrink-0">
            <KeyRound className="w-[18px] h-[18px]" aria-hidden="true" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm leading-[22px] font-semibold text-status-paid truncate">
              Kamar Bersih &amp; Kosong
            </span>
            <span className="text-[11px] leading-4 font-medium text-muted truncate">
              {tipe} • Lt. {lantai}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'perbaikan') {
    return (
      <div className="mt-3 p-3 rounded-xl bg-status-repair-bg/40 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-status-repair-bg text-status-repair flex items-center justify-center shrink-0">
            <Wrench className="w-[18px] h-[18px]" aria-hidden="true" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm leading-[22px] font-semibold text-status-repair truncate">
              Dalam Pemeliharaan
            </span>
            <span className="text-[11px] leading-4 font-medium text-muted truncate">
              {catatan || 'Sedang dalam perbaikan unit'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'sebagian') {
    return (
      <div className="mt-3 p-3 rounded-xl bg-status-partial-bg/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-status-partial-bg text-status-partial flex items-center justify-center font-semibold text-[11px] leading-4 shrink-0">
            {getInitials(penghuni)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm leading-[22px] font-semibold text-ink truncate">
              {penghuni}
            </span>
            <span className="text-[11px] leading-4 font-medium text-status-partial truncate">
              {remainingAmount
                ? `Sisa tagihan ${formatRupiah(remainingAmount)}`
                : catatan}
            </span>
          </div>
        </div>
        <Clock
          className="w-[18px] h-[18px] text-status-partial shrink-0"
          aria-hidden="true"
        />
      </div>
    )
  }

  if (paymentStatus === 'telat') {
    return (
      <div className="mt-3 p-3 rounded-xl bg-status-late-bg/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-status-late-bg text-status-late flex items-center justify-center font-semibold text-[11px] leading-4 shrink-0">
            {getInitials(penghuni)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm leading-[22px] font-semibold text-ink truncate">
              {penghuni}
            </span>
            <span className="text-[11px] leading-4 font-medium text-status-late truncate">
              {dueDate
                ? `Jatuh tempo ${formatDate(dueDate)}${daysLate ? ` (Telat ${daysLate} hari)` : ''}`
                : catatan}
            </span>
          </div>
        </div>
        <AlertTriangle
          className="w-[18px] h-[18px] text-status-late shrink-0"
          aria-hidden="true"
        />
      </div>
    )
  }

  const hasExplicitLunas = catatan && catatan.startsWith('Lunas')
  return (
    <div className="mt-3 p-3 rounded-xl bg-app-bg flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-[11px] leading-4 shrink-0">
          {getInitials(penghuni)}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm leading-[22px] font-semibold text-ink truncate">
            {penghuni}
          </span>
          <span
            className={`text-[11px] leading-4 font-medium truncate ${
              hasExplicitLunas ? 'text-status-paid' : 'text-muted'
            }`}
          >
            {hasExplicitLunas
              ? `Lunas s/d ${formatDate(dueDate)}`
              : `${tipe} • Lt. ${lantai}`}
          </span>
        </div>
      </div>
      {hasExplicitLunas ? (
        <Check
          className="w-[18px] h-[18px] text-status-paid shrink-0"
          aria-hidden="true"
        />
      ) : (
        <BadgeCheck
          className="w-[18px] h-[18px] text-muted shrink-0"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

/**
 * Komponen RoomCard - Menampilkan kartu unit kamar sesuai desain Stitch CeKost.
 *
 * @param {Object} props
 * @param {Object} props.room - Data kamar (id, nomor, tipe, lantai, harga, fasilitas, status, catatan, penghuni)
 * @param {function} [props.onEdit] - Handler tombol Ubah
 * @param {function} [props.onDetail] - Handler tombol Detail / Detail Unit
 * @param {function} [props.onAddTenant] - Handler tombol Masukkan Penghuni
 * @param {function} [props.onCollect] - Handler tombol Tagih Sewa
 */
export default function RoomCard({
  room,
  onEdit,
  onDetail,
  onAddTenant,
  onCollect,
}) {
  const { nomor, tipe, lantai = 1, harga, fasilitas = [], status, paymentStatus } =
    room
  const isVacant = status === 'tersedia'
  const isOverdue = paymentStatus === 'telat'

  return (
    <Card
      padding="none"
      className={`p-5 border-0 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow ${
        isVacant ? 'ring-2 ring-status-paid/30' : ''
      }`}
    >
      <div>
        {/* Header: Nomor kamar, Tipe & Lantai, StatusBadge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg leading-[26px] font-bold shrink-0 ${
                isVacant
                  ? 'bg-status-paid-bg text-status-paid'
                  : status === 'perbaikan'
                    ? 'bg-status-repair-bg text-status-repair'
                    : 'bg-primary-50 text-primary-600'
              }`}
            >
              {nomor}
            </div>
            <div>
              <h3 className="text-sm leading-[22px] font-bold text-ink">
                Kamar {nomor}
              </h3>
              <span className="text-xs leading-[18px] text-muted">
                {tipe} • Lt. {lantai}
              </span>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Tarif Sewa */}
        <div className="mt-4 pt-3 border-t border-line flex items-baseline justify-between">
          <span className="text-xs leading-[18px] text-muted">Tarif Sewa</span>
          <span className="text-sm leading-[22px] font-bold text-ink tabular-nums">
            {formatRupiah(harga)}
            <span className="text-xs leading-[18px] font-normal text-muted">
              {' '}
              /bln
            </span>
          </span>
        </div>

        {/* Tenant / Status Banner */}
        <TenantBanner room={room} />

        {/* Facility Chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {fasilitas.map((item) => (
            <span
              key={item}
              className="px-2 py-0.5 rounded-lg bg-surface-container-low text-on-surface-variant text-[11px] leading-4 font-medium"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3 border-t border-line flex items-center justify-end gap-2">
        {isVacant ? (
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onDetail?.(room)}
              className="min-h-[44px] lg:min-h-0 lg:h-9 px-3.5 rounded-lg border-0 text-muted hover:text-ink hover:bg-app-bg shadow-none text-sm font-semibold"
            >
              Detail Unit
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onAddTenant?.(room)}
              icon={<UserPlus className="w-[18px] h-[18px]" aria-hidden="true" />}
              className="min-h-[44px] lg:min-h-0 lg:h-9 px-4 rounded-lg bg-status-paid hover:opacity-90 text-on-primary text-sm font-semibold shadow-sm"
            >
              Masukkan Penghuni
            </Button>
          </>
        ) : isOverdue ? (
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onEdit?.(room)}
              className="min-h-[44px] lg:min-h-0 lg:h-8 px-3 rounded-lg border-0 text-muted hover:text-ink hover:bg-app-bg shadow-none text-sm font-semibold"
            >
              Ubah
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onCollect?.(room)}
              className="min-h-[44px] lg:min-h-0 lg:h-8 px-3.5 rounded-lg border-0 bg-status-late-bg text-status-late hover:opacity-85 text-sm font-semibold"
            >
              Tagih Sewa
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onEdit?.(room)}
              className="min-h-[44px] lg:min-h-0 lg:h-8 px-3 rounded-lg border-0 text-muted hover:text-ink hover:bg-app-bg shadow-none text-sm font-semibold"
            >
              Ubah
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onDetail?.(room)}
              className="min-h-[44px] lg:min-h-0 lg:h-8 px-3.5 rounded-lg border-0 bg-primary-50 text-primary-600 hover:bg-primary-100 text-sm font-semibold"
            >
              Detail
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
