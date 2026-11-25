import { useEffect, useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bed,
  DoorOpen,
  MessageSquare,
  PlusCircle,
  RefreshCw,
  TrendingUp,
  UserPlus,
  Wallet,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { getOwnerSummary } from '../api/dashboard'
import Button from '../components/Button'
import Card from '../components/Card'
import PaymentRow from '../components/PaymentRow'
import RoomMosaicTile from '../components/RoomMosaicTile'
import StatusBadge from '../components/StatusBadge'
import SummaryCard from '../components/SummaryCard'
import UrgentInvoiceRow from '../components/UrgentInvoiceRow'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isOwner = user?.role !== 'tenant'

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(isOwner)
  const [error, setError] = useState('')
  const [retryTrigger, setRetryTrigger] = useState(0)

  const handleRetry = () => {
    setLoading(true)
    setError('')
    setRetryTrigger((prev) => prev + 1)
  }

  useEffect(() => {
    if (!isOwner) return undefined

    let ignore = false

    async function fetchData() {
      try {
        const res = await getOwnerSummary()
        if (!ignore) {
          setData(res)
          setLoading(false)
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || 'Gagal memuat data')
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => {
      ignore = true
    }
  }, [isOwner, retryTrigger])

  const handleSendReminder = () => {
    // TODO: hubungkan tombol Kirim Pengingat ke alur pengingat WhatsApp
  }

  // Placeholder khusus peran penghuni
  if (!isOwner) {
    return (
      <Card className="p-6 text-center max-w-md mx-auto my-8">
        <p className="text-sm leading-[22px] font-semibold text-ink">
          Beranda Penghuni belum dibuat
        </p>
      </Card>
    )
  }

  // Kondisi Memuat
  if (loading) {
    return (
      <div
        className="flex flex-col w-full gap-6"
        role="status"
        aria-label="Memuat beranda"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-64 bg-line rounded-lg animate-pulse" />
            <div className="h-4 w-80 bg-line/60 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-11 w-36 bg-surface rounded-xl animate-pulse" />
            <div className="h-11 w-40 bg-line rounded-xl animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="h-44 bg-surface rounded-card p-5 animate-pulse flex flex-col justify-between"
            >
              <div className="h-4 w-32 bg-line rounded" />
              <div className="h-8 w-40 bg-line rounded" />
              <div className="h-3 w-full bg-line/60 rounded" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 h-96 bg-surface rounded-card animate-pulse" />
          <div className="lg:col-span-5 h-96 bg-surface rounded-card animate-pulse" />
        </div>
      </div>
    )
  }

  // Kondisi Galat
  if (error) {
    return (
      <Card className="p-8 my-8 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-status-late-bg text-status-late mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="text-lg leading-[26px] font-semibold text-ink">
          Gagal memuat data
        </h2>
        <p className="text-sm leading-[22px] text-muted mt-1.5 mb-6">{error}</p>
        <Button
          type="button"
          variant="primary"
          onClick={handleRetry}
          icon={<RefreshCw className="w-4 h-4" aria-hidden="true" />}
        >
          Coba Lagi
        </Button>
      </Card>
    )
  }

  const occupancy = data?.occupancy
  const urgentInvoices = data?.urgentInvoices ?? []
  const recentPayments = data?.recentPayments ?? []
  const roomMosaic = data?.roomMosaic ?? []

  // Kondisi Kosong
  if (
    !data ||
    (!occupancy &&
      urgentInvoices.length === 0 &&
      recentPayments.length === 0 &&
      roomMosaic.length === 0)
  ) {
    return (
      <Card className="p-8 my-8 text-center max-w-lg mx-auto">
        <h2 className="text-lg leading-[26px] font-semibold text-ink">
          Belum ada data beranda
        </h2>
        <p className="text-sm leading-[22px] text-muted mt-1.5 mb-6">
          Data ringkasan kos akan tampil setelah kamar dan penghuni ditambahkan.
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate('/kamar')}
        >
          Kelola Kamar
        </Button>
      </Card>
    )
  }

  const totalRooms = occupancy?.total ?? 12
  const occupiedRooms = occupancy?.occupied ?? 0
  const availableRooms = Math.max(0, totalRooms - occupiedRooms)
  const occupancyPct = Math.round(occupancy?.percentage ?? 0)
  const emptyRoomsLabel =
    occupancy?.emptyRooms?.map((r) => `Kamar ${r}`).join(', ') || '-'

  const incomeThisMonth = data.incomeThisMonth ?? 0
  const incomeTarget = 17000000
  const incomeRemaining = Math.max(0, incomeTarget - incomeThisMonth)
  const incomeTargetPct = Number(
    Math.min(100, (incomeThisMonth / incomeTarget) * 100).toFixed(1)
  )

  const totalOverdue = data.totalOverdue ?? 0
  const pendingCount = urgentInvoices.length
  const ownerName = user?.name || 'Pak Bambang'
  const firstUrgent = urgentInvoices[0]

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Greeting & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[22px] leading-[30px] text-ink font-bold tracking-tight">
              Selamat pagi, {ownerName} 👋
            </h1>
            <StatusBadge status="aktif" />
          </div>
          <p className="text-sm leading-[22px] text-muted">
            Periode Berjalan:{' '}
            <span className="text-ink font-semibold">November 2026</span> • Kos
            Melati Asri ({totalRooms} Kamar Terdaftar)
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/penghuni')}
            icon={
              <UserPlus className="w-[18px] h-[18px]" aria-hidden="true" />
            }
            className="bg-surface border-line text-ink hover:bg-surface-container-low shadow-sm px-4 rounded-xl"
          >
            Tambah Penghuni
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/kamar')}
            icon={
              <DoorOpen className="w-[18px] h-[18px]" aria-hidden="true" />
            }
            className="bg-surface border-line text-ink hover:bg-surface-container-low shadow-sm px-4 rounded-xl"
          >
            + Tambah Kamar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate('/tagihan')}
            icon={<PlusCircle className="w-5 h-5" aria-hidden="true" />}
            className="px-5 rounded-xl shadow-md shadow-primary-600/20"
          >
            Catat Pembayaran
          </Button>
        </div>
      </div>

      {/* 3-Column Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          label="TINGKAT OKUPANSI"
          tone="default"
          value={
            <>
              {occupiedRooms} / {totalRooms}{' '}
              <span className="text-sm leading-[22px] font-normal text-muted">
                kamar
              </span>
            </>
          }
          icon={<Bed className="w-6 h-6" aria-hidden="true" />}
          className="p-5 border-0 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.08)] hover:shadow-md transition-shadow"
          subtext={
            <span className="mt-4 pt-3 flex flex-col gap-1">
              <span className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[11px] leading-4 font-semibold">
                  Hunian {occupancyPct}%
                </span>
                <span className="text-[11px] leading-4 font-medium text-muted">
                  {availableRooms} Tersedia
                </span>
              </span>
              <span className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1 block">
                <span
                  className="bg-primary-600 h-full rounded-full transition-all duration-500 block"
                  style={{ width: `${occupancyPct}%` }}
                />
              </span>
              <span className="text-xs leading-[18px] text-muted mt-1 truncate block">
                {availableRooms} Kamar Kosong:{' '}
                <span className="font-semibold text-ink">
                  {emptyRoomsLabel}
                </span>
              </span>
            </span>
          }
        />

        <SummaryCard
          label="PEMASUKAN BULAN INI"
          tone="success"
          value={formatRupiah(incomeThisMonth)}
          icon={<Wallet className="w-6 h-6" aria-hidden="true" />}
          className="p-5 border-0 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.08)] hover:shadow-md transition-shadow"
          subtext={
            <span className="mt-4 pt-3 flex flex-col gap-1">
              <span className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-paid-bg text-status-paid text-[11px] leading-4 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{data.incomeGrowth || '+8%'} vs bulan lalu</span>
                </span>
                <span className="text-[11px] leading-4 font-medium text-muted tabular-nums">
                  {incomeTargetPct}% target
                </span>
              </span>
              <span className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1 block">
                <span
                  className="bg-status-paid h-full rounded-full transition-all duration-500 block"
                  style={{ width: `${incomeTargetPct}%` }}
                />
              </span>
              <span className="text-xs leading-[18px] text-muted mt-1 block">
                Target:{' '}
                <span className="font-semibold text-ink tabular-nums">
                  {formatRupiah(incomeTarget)}
                </span>{' '}
                (Tersisa {formatRupiah(incomeRemaining)})
              </span>
            </span>
          }
        />

        <SummaryCard
          label="PERLU DITAGIH"
          tone="danger"
          value={formatRupiah(totalOverdue)}
          icon={<AlertCircle className="w-6 h-6" aria-hidden="true" />}
          className="p-5 border-0 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.08)] hover:shadow-md transition-shadow"
          subtext={
            <span className="mt-4 pt-3 flex flex-col gap-1">
              <span className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-late-bg text-status-late text-[11px] leading-4 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{pendingCount} Tagihan Tertunda</span>
                </span>
                <span className="text-[11px] leading-4 font-semibold text-status-late">
                  Tindakan Cepat
                </span>
              </span>
              <span className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1 block">
                <span
                  className="bg-status-late h-full rounded-full transition-all duration-500 block"
                  style={{ width: '45%' }}
                />
              </span>
              <span className="text-xs leading-[18px] text-muted mt-1 block">
                {pendingCount} penyewa belum melunasi biaya sewa November
              </span>
            </span>
          }
        />
      </div>

      {/* Two-Column Main Operational Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Perlu Ditagih */}
        <Card className="lg:col-span-7 p-5 border-0 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.08)] flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg leading-[26px] font-bold text-ink">
                Perlu Ditagih
              </h2>
              <StatusBadge status="telat" label={`${pendingCount} Penghuni`} />
            </div>
            <Link
              to="/tagihan"
              className="text-sm leading-[22px] font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
            >
              <span>Kelola Semua</span>
              <ArrowRight
                className="w-[18px] h-[18px] group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>

          <p className="text-xs leading-[18px] text-muted -mt-2">
            Daftar penyewa yang melewati jatuh tempo atau belum melunasi tagihan
            bulan berjalan.
          </p>

          {urgentInvoices.length === 0 ? (
            <div className="p-4 rounded-xl bg-surface-container-low text-center text-xs text-muted">
              Tidak ada tagihan yang perlu ditagih saat ini.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {urgentInvoices.map((inv) => (
                <UrgentInvoiceRow
                  key={inv.id}
                  invoice={inv}
                  onSendReminder={handleSendReminder}
                />
              ))}
            </div>
          )}

          {/* Quick WhatsApp Generator Preview Banner */}
          {firstUrgent && (
            <div className="p-3 rounded-xl bg-status-paid-bg/40 flex items-start gap-3">
              <MessageSquare
                className="w-[22px] h-[22px] text-secondary shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm leading-[22px] font-semibold text-ink">
                  Format Pesan Pengingat Otomatis
                </span>
                <p className="text-[11px] leading-4 font-medium text-muted italic line-clamp-2">
                  &quot;Halo Mas {firstUrgent.tenantName}, mengingatkan sewa
                  kamar {firstUrgent.roomNumber} Kos Melati Asri periode
                  November sebesar {formatRupiah(firstUrgent.amount)} telah
                  jatuh tempo. Mohon konfirmasi bukti transfer jika sudah
                  membayar. Terima kasih.&quot;
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Right Column: Pembayaran Terbaru */}
        <Card className="lg:col-span-5 p-5 border-0 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.08)] flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg leading-[26px] font-bold text-ink">
              Pembayaran Terbaru
            </h2>
            <Link
              to="/tagihan"
              className="text-sm leading-[22px] font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
            >
              <span>Lihat Semua</span>
              <ArrowRight
                className="w-[18px] h-[18px] group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>

          <p className="text-xs leading-[18px] text-muted -mt-2">
            {recentPayments.length} transaksi pembayaran terakhir yang telah
            diverifikasi.
          </p>

          {recentPayments.length === 0 ? (
            <div className="p-4 rounded-xl bg-surface-container-low text-center text-xs text-muted">
              Belum ada pembayaran terbaru.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentPayments.map((pay) => (
                <PaymentRow key={pay.id} payment={pay} />
              ))}
            </div>
          )}

          {/* Feature Highlight Card */}
          <div className="p-3 rounded-xl bg-primary-50 flex items-start gap-2 mt-auto">
            <BadgeCheck
              className="w-5 h-5 text-primary-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-[11px] leading-relaxed font-medium text-primary-700">
              <strong className="font-semibold">Kwitansi Digital CeKost</strong>{' '}
              otomatis dikirimkan ke WhatsApp penghuni tepat saat verifikasi
              status pembayaran ditandai Lunas.
            </p>
          </div>
        </Card>
      </div>

      {/* Bottom Visual Section: Room Occupancy Mini Grid */}
      <Card className="p-5 border-0 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.08)] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg leading-[26px] font-bold text-ink">
              Status Kamar Singkat (Lantai 1 &amp; 2)
            </h2>
            <p className="text-xs leading-[18px] text-muted">
              Tinjau distribusi kamar, status penyewa aktif, serta unit siap
              huni.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[11px] leading-4 font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary-600" />
              <span>{occupiedRooms} Terisi</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-paid-bg text-status-paid text-[11px] leading-4 font-semibold">
              <span className="w-2 h-2 rounded-full bg-status-paid" />
              <span>{availableRooms} Tersedia</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {roomMosaic.map((room) => (
            <RoomMosaicTile key={room.number} room={room} />
          ))}
        </div>
      </Card>
    </div>
  )
}
