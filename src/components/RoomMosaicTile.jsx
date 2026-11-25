import StatusBadge from './StatusBadge'
import { formatRupiah } from '../utils/format'

/**
 * Tile ringkas status kamar pada grid "Status Kamar Singkat".
 *
 * @param {Object} props
 * @param {Object} props.room - Data ringkas kamar (number, tenant, floor, type, price, status, note)
 */
export default function RoomMosaicTile({ room }) {
  const isVacant = room.status === 'tersedia'
  const isPartial = room.status === 'sebagian'
  const isLate = room.status === 'telat'
  const isUnpaid = room.status === 'belum_bayar'

  const badgeLabel = isUnpaid ? 'Tagihan' : ''

  const priceColorClass = isVacant
    ? 'text-ink'
    : isPartial
      ? 'text-status-partial'
      : isLate
        ? 'text-status-late'
        : isUnpaid
          ? 'text-status-unpaid'
          : 'text-primary-600'

  return (
    <div
      className={`p-3 rounded-xl transition-all flex flex-col justify-between h-32 ${
        isVacant
          ? 'bg-status-paid-bg/40 hover:bg-status-paid-bg'
          : 'bg-surface-container-low hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <span
          className={`text-lg leading-[26px] font-bold ${
            isVacant ? 'text-status-paid' : 'text-ink'
          }`}
        >
          {room.number}
        </span>
        <StatusBadge
          status={room.status}
          label={badgeLabel}
          className={
            isVacant ? '!bg-status-paid !text-on-primary' : undefined
          }
        />
      </div>

      <div className="flex flex-col min-w-0">
        <span
          className={`text-sm leading-[22px] font-semibold truncate ${
            isVacant ? 'text-status-paid' : 'text-ink'
          }`}
        >
          {room.tenant}
        </span>
        <span className="text-[11px] leading-4 font-medium text-muted truncate">
          Lt. {room.floor} • {room.type}
        </span>
        <span
          className={`text-[11px] leading-4 font-semibold tabular-nums mt-0.5 truncate ${priceColorClass}`}
        >
          {room.note || formatRupiah(room.price)}
        </span>
      </div>
    </div>
  )
}
