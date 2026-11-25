import { useState } from 'react'
import {
  AlertCircle,
  MessageCircle,
  MoreVertical,
  Phone,
  Send,
} from 'lucide-react'
import Button from './Button'
import Card from './Card'
import StatusBadge from './StatusBadge'
import { formatDate, formatPhone, formatRupiah } from '../utils/format'

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
 * Tabel daftar penghuni sesuai layar Stitch "Penghuni Pemilik Kos - Desktop",
 * mendukung gulir mendatar pada layar kecil (< 1024px).
 */
export default function TenantTable({
  tenants = [],
  onDetail,
  onViewInvoices,
  onEdit,
  onCheckout,
  onSendReminder,
  footer = null,
}) {
  const [openMenuId, setOpenMenuId] = useState(null)

  return (
    <Card padding="none" className="border-0 shadow-sm overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[820px]">
          <thead>
            <tr className="bg-surface-container-low text-muted text-[11px] leading-4 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4" scope="col">
                Penyewa &amp; Kontak
              </th>
              <th className="py-3 px-3" scope="col">
                Kamar
              </th>
              <th className="py-3 px-3" scope="col">
                Masa Sewa
              </th>
              <th className="py-3 px-3" scope="col">
                Jatuh Tempo
              </th>
              <th className="py-3 px-3" scope="col">
                Status Tagihan (Nov 2026)
              </th>
              <th className="py-3 px-4 text-right" scope="col">
                Aksi Cepat
              </th>
            </tr>
          </thead>

          <tbody className="text-sm leading-[22px] text-ink divide-y divide-line/60">
            {tenants.map((tenant) => {
              const invStatus = tenant.tagihanTerbaru?.status || 'lunas'
              const isLate = invStatus === 'telat'
              const isPartial = invStatus === 'sebagian'
              const isUnpaid = invStatus === 'belum_bayar'
              const needsAction = isLate || isPartial || isUnpaid
              const isMoved = tenant.status === 'pindah'

              const badgeLabel =
                isLate && tenant.daysLate
                  ? `Telat ${tenant.daysLate} Hari`
                  : undefined

              const dotColorClass = isMoved
                ? 'bg-disabled'
                : isLate
                  ? 'bg-status-late'
                  : isUnpaid || isPartial
                    ? 'bg-status-partial'
                    : 'bg-status-paid'

              return (
                <tr
                  key={tenant.id}
                  className={`transition-colors group ${
                    isLate
                      ? 'bg-status-late-bg/15 hover:bg-status-late-bg/25'
                      : 'hover:bg-app-bg'
                  }`}
                >
                  {/* Penyewa & Kontak */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`relative w-10 h-10 rounded-full font-semibold flex items-center justify-center shrink-0 ${
                          isLate
                            ? 'bg-status-late-bg text-status-late'
                            : isUnpaid
                              ? 'bg-surface-container-high text-primary-700'
                              : 'bg-primary-100 text-primary-700'
                        }`}
                      >
                        {getInitials(tenant.nama)}
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-surface ${dotColorClass}`}
                        />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-semibold truncate transition-colors ${
                              isLate
                                ? 'text-ink group-hover:text-status-late'
                                : 'text-ink group-hover:text-primary-600'
                            }`}
                          >
                            {tenant.nama}
                          </span>
                          <StatusBadge status={tenant.status} />
                        </div>

                        <div className="flex items-center gap-1 text-muted text-[11px] leading-4 mt-0.5">
                          {isLate ? (
                            <AlertCircle
                              className="w-3.5 h-3.5 text-status-late shrink-0"
                              aria-hidden="true"
                            />
                          ) : (
                            <Phone
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isUnpaid ? 'text-muted' : 'text-status-paid'
                              }`}
                              aria-hidden="true"
                            />
                          )}
                          <span>{formatPhone(tenant.noHp)}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Kamar */}
                  <td className="py-3 px-3">
                    <div className="inline-flex flex-col">
                      <span className="px-2 py-0.5 rounded bg-primary-50 text-primary-700 text-xs font-semibold w-fit">
                        Kmr {tenant.kamarNomor}
                      </span>
                      <span className="text-xs leading-[18px] text-muted mt-0.5">
                        Lt. {tenant.lantai || 1} • {tenant.kamarTipe || 'Tunggal AC'}
                      </span>
                    </div>
                  </td>

                  {/* Masa Sewa */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] leading-4 font-semibold text-ink">
                        {formatDate(tenant.tanggalMasuk)}
                      </span>
                      <span
                        className={`text-xs leading-[18px] ${
                          tenant.kontrakSegeraHabis
                            ? 'text-status-repair font-semibold'
                            : 'text-muted'
                        }`}
                      >
                        {isMoved && tenant.tanggalKeluar
                          ? `Keluar ${formatDate(tenant.tanggalKeluar)}`
                          : tenant.masaSewaLabel || 'Aktif'}
                      </span>
                    </div>
                  </td>

                  {/* Jatuh Tempo */}
                  <td className="py-3 px-3">
                    <span
                      className={`text-[11px] leading-4 ${
                        isLate
                          ? 'font-semibold text-status-late'
                          : isUnpaid
                            ? 'font-semibold text-status-partial'
                            : 'text-muted'
                      }`}
                    >
                      {isLate
                        ? `Tgl ${tenant.jatuhTempo} (Telat ${tenant.daysLate || 4} hari)`
                        : isUnpaid
                          ? `Hari Ini (${tenant.jatuhTempo} Nov)`
                          : `Tiap tgl ${tenant.jatuhTempo}`}
                    </span>
                  </td>

                  {/* Status Tagihan */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-0.5">
                      <StatusBadge status={invStatus} label={badgeLabel} />
                      <span
                        className={`text-xs leading-[18px] tabular-nums ${
                          isLate
                            ? 'text-status-late font-semibold'
                            : 'text-muted'
                        }`}
                      >
                        {tenant.tagihanTerbaru?.keterangan ||
                          formatRupiah(tenant.hargaSewa || 0)}
                      </span>
                    </div>
                  </td>

                  {/* Aksi Cepat */}
                  <td className="py-3 px-4 text-right relative">
                    <div className="inline-flex items-center gap-1 justify-end">
                      {needsAction ? (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => onSendReminder?.(tenant)}
                          icon={<Send className="w-3.5 h-3.5" aria-hidden="true" />}
                          className="min-h-[44px] lg:min-h-0 lg:h-8 px-3 rounded-lg bg-secondary hover:opacity-90 text-on-primary text-[11px]"
                        >
                          {isLate ? 'Kirim Pengingat' : 'Kirim WA'}
                        </Button>
                      ) : (
                        <button
                          type="button"
                          aria-label={`Hubungi WhatsApp ${tenant.nama}`}
                          title="Hubungi WhatsApp"
                          onClick={() => onSendReminder?.(tenant)}
                          className="min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 p-2 rounded-xl text-status-paid hover:bg-surface-container transition-colors inline-flex items-center justify-center cursor-pointer"
                        >
                          <MessageCircle className="w-5 h-5" aria-hidden="true" />
                        </button>
                      )}

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => onDetail?.(tenant)}
                        className="min-h-[44px] lg:min-h-0 lg:h-8 px-3 rounded-lg border-0 bg-surface text-ink shadow-sm hover:bg-surface-container text-[11px]"
                      >
                        Detail
                      </Button>

                      <button
                        type="button"
                        aria-label={`Pilihan lainnya untuk ${tenant.nama}`}
                        aria-expanded={openMenuId === tenant.id}
                        onClick={() =>
                          setOpenMenuId((prev) =>
                            prev === tenant.id ? null : tenant.id
                          )
                        }
                        className="min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 p-2 rounded-xl text-muted hover:bg-surface-container transition-colors inline-flex items-center justify-center cursor-pointer"
                      >
                        <MoreVertical className="w-[18px] h-[18px]" aria-hidden="true" />
                      </button>
                    </div>

                    {openMenuId === tenant.id && (
                      <div className="absolute right-4 top-12 z-20 w-40 bg-surface border border-line rounded-xl shadow-lg py-1 text-left">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null)
                            onViewInvoices?.(tenant)
                          }}
                          className="w-full min-h-[44px] lg:min-h-0 px-3 py-2 text-xs font-medium text-ink hover:bg-app-bg text-left cursor-pointer"
                        >
                          Lihat Tagihan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null)
                            onEdit?.(tenant)
                          }}
                          className="w-full min-h-[44px] lg:min-h-0 px-3 py-2 text-xs font-medium text-ink hover:bg-app-bg text-left cursor-pointer"
                        >
                          Ubah Data
                        </button>
                        {!isMoved && (
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null)
                              onCheckout?.(tenant)
                            }}
                            className="w-full min-h-[44px] lg:min-h-0 px-3 py-2 text-xs font-medium text-status-late hover:bg-status-late-bg/40 text-left cursor-pointer"
                          >
                            Check-out
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {footer}
    </Card>
  )
}
