import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Bed,
  CheckCircle2,
  Clock,
  Hourglass,
  PlusCircle,
  PlusSquare,
  RefreshCw,
  Send,
  UserPlus,
  Wallet,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getOwnerSummary, getTenantSummary } from '../api/dashboard'
import Button from '../components/Button'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { formatDate, formatRupiah } from '../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  const isOwner = user?.role === 'owner' || !user?.role

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryTrigger, setRetryTrigger] = useState(0)
  const [activeReminder, setActiveReminder] = useState(null)
  const [reminderToast, setReminderToast] = useState('')

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setRetryTrigger((prev) => prev + 1)
  }

  useEffect(() => {
    let ignore = false

    async function fetchData() {
      try {
        if (isOwner) {
          const res = await getOwnerSummary()
          if (!ignore) {
            setData(res)
            if (res?.urgentInvoices?.length > 0) {
              setActiveReminder(res.urgentInvoices[0])
            }
            setLoading(false)
          }
        } else {
          const res = await getTenantSummary()
          if (!ignore) {
            setData(res)
            setLoading(false)
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || 'Gagal memuat data ringkasan beranda.')
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      ignore = true
    }
  }, [isOwner, retryTrigger])

  const handleSendReminder = (item) => {
    setActiveReminder(item)
    setReminderToast(`Pengingat WhatsApp disiapkan untuk ${item.tenantName} (Kamar ${item.roomNumber})`)
    setTimeout(() => {
      setReminderToast('')
    }, 4000)
  }

  // Tampilan Loading Skeleton
  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-2" role="status" aria-label="Memuat beranda">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-64 bg-surface-container-high rounded animate-pulse" />
            <div className="h-4 w-96 bg-surface-container rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-11 w-36 bg-surface rounded-control animate-pulse" />
            <div className="h-11 w-40 bg-surface-container rounded-control animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-surface rounded-card p-6 border border-line animate-pulse flex flex-col justify-between">
              <div className="h-5 w-32 bg-surface-container-high rounded" />
              <div className="h-9 w-44 bg-surface-container-high rounded" />
              <div className="h-3 w-full bg-surface-container rounded" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 h-96 bg-surface rounded-card border border-line animate-pulse" />
          <div className="lg:col-span-5 h-96 bg-surface rounded-card border border-line animate-pulse" />
        </div>
      </div>
    )
  }

  // Tampilan Error / Galat
  if (error) {
    return (
      <div className="p-8 my-8 bg-surface rounded-card border border-line text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-status-late-bg text-status-late mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-ink">Gagal Memuat Beranda</h2>
        <p className="text-sm text-muted mt-1.5 mb-6">{error}</p>
        <Button variant="primary" onClick={handleRetry} className="inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          <span>Coba Lagi</span>
        </Button>
      </div>
    )
  }

  // PORTAL PENGHUNI
  if (!isOwner) {
    return (
      <TenantDashboardView
        data={data}
        userName={user?.name || 'Penghuni'}
      />
    )
  }

  // PORTAL PEMILIK KOS (Desktop & Mobile matching Stitch)
  const occupancy = data?.occupancy || { occupied: 10, total: 12, percentage: 83.3, emptyRooms: ['06', '11'] }
  const incomeThisMonth = data?.incomeThisMonth || 14500000
  const incomeGrowth = data?.incomeGrowth || '+8%'
  const totalOverdue = data?.totalOverdue || 3200000
  const urgentInvoices = data?.urgentInvoices || []
  const recentPayments = data?.recentPayments || []
  const roomMosaic = data?.roomMosaic || []

  return (
    <div className="flex flex-col gap-6 py-1">
      {/* Toast notifikasi pengingat */}
      {reminderToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-ink text-surface px-4 py-3 rounded-control shadow-lg flex items-center gap-2.5 text-sm transition-all animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-status-paid shrink-0" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Sapaan & Tombol Aksi Cepat */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-ink tracking-tight">
              Selamat pagi, {user?.name || 'Pak Bambang'} 👋
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-status-paid-bg text-status-paid text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-status-paid" />
              Aktif
            </span>
          </div>
          <p className="text-sm text-muted">
            Periode Berjalan: <strong className="text-ink font-semibold">November 2026</strong> • Kos Melati Asri ({occupancy.total} Kamar Terdaftar)
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link to="/penghuni">
            <Button variant="secondary" size="md" className="flex items-center gap-1.5 text-ink">
              <UserPlus className="w-4 h-4 text-muted" />
              <span>Tambah Penghuni</span>
            </Button>
          </Link>
          <Link to="/kamar">
            <Button variant="secondary" size="md" className="flex items-center gap-1.5 text-ink">
              <PlusSquare className="w-4 h-4 text-muted" />
              <span>+ Tambah Kamar</span>
            </Button>
          </Link>
          <Link to="/tagihan">
            <Button variant="primary" size="md" className="flex items-center gap-1.5 shadow-sm shadow-primary-600/20">
              <PlusCircle className="w-4 h-4" />
              <span>Catat Pembayaran</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 3 Kartu Metrik Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Okupansi */}
        <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted">
                Tingkat Okupansi
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-ink tabular-nums">
                  {occupancy.occupied} / {occupancy.total}
                </span>
                <span className="text-sm text-muted font-normal">kamar</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-control bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <Bed className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 pt-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">
                Hunian {Math.round(occupancy.percentage)}%
              </span>
              <span className="text-muted">
                {occupancy.total - occupancy.occupied} Tersedia
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-primary-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${occupancy.percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-1 truncate">
              {occupancy.total - occupancy.occupied} Kamar Kosong:{' '}
              <strong className="text-ink font-semibold">
                {occupancy.emptyRooms?.map((r) => `Kamar ${r}`).join(', ') || 'Kamar 06, Kamar 11'}
              </strong>
            </p>
          </div>
        </Card>

        {/* Card 2: Pemasukan Bulan Ini */}
        <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted">
                Pemasukan Bulan Ini
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-ink tabular-nums">
                  {formatRupiah(incomeThisMonth)}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-control bg-status-paid-bg text-status-paid flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 pt-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-paid-bg text-status-paid font-semibold">
                {incomeGrowth} vs bulan lalu
              </span>
              <span className="text-muted tabular-nums">85.2% target</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-status-paid h-full rounded-full transition-all duration-500"
                style={{ width: '85.2%' }}
              />
            </div>
            <p className="text-xs text-muted mt-1">
              Target: <strong className="text-ink font-semibold tabular-nums">Rp 17.000.000</strong> (Tersisa Rp 2.500.000)
            </p>
          </div>
        </Card>

        {/* Card 3: Perlu Ditagih */}
        <Card accent="late" className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted">
                Perlu Ditagih
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-status-late tabular-nums">
                  {formatRupiah(totalOverdue)}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-control bg-status-late-bg text-status-late flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 pt-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-late-bg text-status-late font-semibold">
                {urgentInvoices.length} Tagihan Tertunda
              </span>
              <span className="text-status-late font-semibold">Tindakan Cepat</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-status-late h-full rounded-full transition-all duration-500"
                style={{ width: '45%' }}
              />
            </div>
            <p className="text-xs text-muted mt-1">
              {urgentInvoices.length} penyewa belum melunasi biaya sewa November
            </p>
          </div>
        </Card>
      </div>

      {/* Area Operasional 2 Kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Perlu Ditagih (7 cols) */}
        <Card className="lg:col-span-7 p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-ink">Perlu Ditagih</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-status-late-bg text-status-late text-xs font-semibold">
                {urgentInvoices.length} Penghuni
              </span>
            </div>
            <Link
              to="/tagihan"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
            >
              <span>Kelola Semua</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <p className="text-xs text-muted -mt-2">
            Daftar penyewa yang melewati jatuh tempo atau belum melunasi tagihan bulan berjalan.
          </p>

          {/* List Perlu Ditagih */}
          <div className="flex flex-col gap-3">
            {urgentInvoices.map((inv) => {
              const isSelected = activeReminder?.id === inv.id
              return (
                <div
                  key={inv.id}
                  onClick={() => setActiveReminder(inv)}
                  className={`p-4 rounded-control border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-surface border-primary-600 shadow-sm'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-control bg-surface border border-line flex flex-col items-center justify-center shrink-0 shadow-xs">
                      <span className="text-[10px] font-bold text-muted uppercase">KMR</span>
                      <span className="text-base font-bold text-ink leading-none">{inv.roomNumber}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-ink truncate">{inv.tenantName}</span>
                        {inv.status === 'telat' && (
                          <span className="px-2 py-0.5 rounded-full bg-status-late-bg text-status-late text-xs font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Telat {inv.daysLate} Hari</span>
                          </span>
                        )}
                        {inv.status === 'belum_bayar' && (
                          <span className="px-2 py-0.5 rounded-full bg-status-unpaid-bg text-status-unpaid text-xs font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Hari Ini</span>
                          </span>
                        )}
                        {inv.status === 'sebagian' && (
                          <span className="px-2 py-0.5 rounded-full bg-status-partial-bg text-status-partial text-xs font-semibold flex items-center gap-1">
                            <Hourglass className="w-3 h-3" />
                            <span>Sebagian</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted mt-0.5 truncate">{inv.note}</span>
                      <span className="text-sm font-bold text-status-late tabular-nums mt-1 sm:hidden">
                        {formatRupiah(inv.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0">
                    <span className="hidden sm:inline text-base font-bold text-ink tabular-nums">
                      {formatRupiah(inv.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSendReminder(inv)
                      }}
                      className="h-8 px-3 rounded-lg bg-whatsapp-bubble hover:opacity-90 text-on-secondary-container text-xs font-semibold flex items-center gap-1.5 transition-opacity"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Pengingat</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Banner Pratinjau Pengingat Otomatis */}
          {activeReminder && (
            <div className="p-3.5 rounded-control bg-whatsapp-bubble/40 border border-secondary/20 flex items-start gap-3 mt-1">
              <Send className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-bold text-ink">
                  Format Pengingat WhatsApp ({activeReminder.tenantName})
                </span>
                <p className="text-xs text-muted italic leading-relaxed">
                  &quot;Halo {activeReminder.tenantName}, mengingatkan tagihan sewa kamar {activeReminder.roomNumber} Kos Melati Asri periode November sebesar {formatRupiah(activeReminder.amount)} telah jatuh tempo. Mohon konfirmasi bukti transfer jika sudah membayar. Terima kasih.&quot;
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Kolom Kanan: Pembayaran Terbaru (5 cols) */}
        <Card className="lg:col-span-5 p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Pembayaran Terbaru</h2>
            <Link
              to="/tagihan"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <p className="text-xs text-muted -mt-2">
            3 transaksi pembayaran terakhir yang telah diverifikasi.
          </p>

          {/* List Pembayaran Terbaru */}
          <div className="flex flex-col gap-3">
            {recentPayments.map((pay) => (
              <div
                key={pay.id}
                className="p-3.5 rounded-control bg-surface-container-low flex items-center justify-between gap-3 hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-status-paid-bg text-status-paid flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-ink truncate">{pay.tenantName}</span>
                    <span className="text-xs text-muted truncate">
                      Kamar {pay.roomNumber} • {pay.method}
                    </span>
                    <span className="text-[11px] text-disabled mt-0.5">
                      {formatDate(pay.date)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span className="text-sm font-bold text-ink tabular-nums">
                    {formatRupiah(pay.amount)}
                  </span>
                  <StatusBadge status={pay.status} />
                </div>
              </div>
            ))}
          </div>

          {/* Feature Highlight Kwitansi */}
          <div className="p-3.5 rounded-control bg-primary-50 border border-primary-100 flex items-start gap-2.5 mt-auto">
            <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
            <p className="text-xs text-primary-700 leading-relaxed">
              <strong className="font-semibold">Kwitansi Digital CeKost:</strong> Otomatis tersimpan dan dapat dibagikan langsung ke WhatsApp penghuni saat pembayaran diverifikasi Lunas.
            </p>
          </div>
        </Card>
      </div>

      {/* Bagian Status Kamar Singkat (12 Kamar Mosaic) */}
      <Card className="p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-bold text-ink">Status Kamar Singkat (Lantai 1 &amp; 2)</h2>
            <p className="text-xs text-muted">
              Tinjau distribusi kamar, status penyewa aktif, serta unit siap huni.
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary-600" />
              <span>10 Terisi</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-paid-bg text-status-paid text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-status-paid" />
              <span>2 Tersedia</span>
            </div>
          </div>
        </div>

        {/* Room Cards Mosaic */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {roomMosaic.map((room) => {
            const isVacant = room.status === 'tersedia'
            return (
              <div
                key={room.number}
                className={`p-3.5 rounded-control transition-all flex flex-col justify-between h-32 border ${
                  isVacant
                    ? 'bg-status-paid-bg/30 border-status-paid/30 hover:bg-status-paid-bg/50'
                    : 'bg-surface-container-low border-transparent hover:shadow-xs hover:bg-surface-container'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-base font-bold ${isVacant ? 'text-status-paid' : 'text-ink'}`}>
                    {room.number}
                  </span>
                  <StatusBadge status={room.status} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`text-xs font-bold truncate ${isVacant ? 'text-status-paid' : 'text-ink'}`}>
                    {room.tenant}
                  </span>
                  <span className="text-[11px] text-muted truncate">
                    Lt. {room.floor} • {room.type}
                  </span>
                  <span
                    className={`text-xs font-semibold tabular-nums mt-0.5 truncate ${
                      isVacant ? 'text-ink' : room.status === 'telat' ? 'text-status-late' : 'text-primary-600'
                    }`}
                  >
                    {formatRupiah(room.price)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

/**
 * Tampilan Khusus Portal Penghuni (Role Tenant)
 */
function TenantDashboardView({ data, userName }) {
  const room = data?.room || { number: '04', type: 'Standard AC • Lantai 1', pricePerMonth: 1200000 }
  const activeInvoice = data?.activeInvoice || { period: 'November 2026', amount: 1200000, status: 'telat', dueDate: '2026-11-01' }
  const bankAccount = data?.bankAccount || { bankName: 'Bank Central Asia (BCA)', accountNumber: '8271 0492 88', accountHolder: 'Bambang Wijaya' }
  const lastPayment = data?.lastPayment || { amount: 1200000, date: '2026-10-01T09:30:00', method: 'Transfer BCA', status: 'lunas' }

  return (
    <div className="flex flex-col gap-6 py-1 max-w-4xl mx-auto">
      {/* Header sapaan penghuni */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-ink">Halo, {userName} 👋</h1>
        <p className="text-sm text-muted">
          Selamat datang di portal penghuni Kos Melati Asri.
        </p>
      </div>

      {/* Info Kamar & Tagihan Berjalan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-semibold text-muted tracking-wider">Unit Kamar Anda</span>
              <StatusBadge status="aktif" />
            </div>
            <div className="text-2xl font-bold text-ink mb-1">Kamar {room.number}</div>
            <p className="text-sm text-muted mb-4">{room.type}</p>
            <div className="text-lg font-bold text-primary-600 tabular-nums">
              {formatRupiah(room.pricePerMonth)} <span className="text-xs text-muted font-normal">/ bulan</span>
            </div>
          </div>
          <div className="pt-4 border-t border-line mt-4 flex items-center justify-between text-xs text-muted">
            <span>Siklus Pembayaran</span>
            <span className="font-semibold text-ink">{room.billingCycle || 'Tiap tanggal 1'}</span>
          </div>
        </Card>

        {/* Tagihan Berjalan */}
        <Card accent={activeInvoice.status === 'telat' ? 'late' : 'primary'} className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-semibold text-muted tracking-wider">Tagihan Berjalan</span>
              <StatusBadge status={activeInvoice.status} />
            </div>
            <div className="text-sm font-semibold text-ink mb-1">Periode {activeInvoice.period}</div>
            <div className="text-3xl font-bold text-ink tabular-nums mb-2">
              {formatRupiah(activeInvoice.amount)}
            </div>
            <p className="text-xs text-muted">
              Jatuh Tempo: <strong className="text-ink">{formatDate(activeInvoice.dueDate)}</strong>
            </p>
          </div>
          <div className="pt-4 border-t border-line mt-4">
            <Link to="/tagihan">
              <Button variant="primary" size="sm" className="w-full flex items-center justify-center gap-1.5">
                <span>Lihat Rincian Tagihan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Rekening Tujuan Transfer Pemilik */}
      <Card className="p-6 flex flex-col gap-3">
        <h2 className="text-base font-bold text-ink">Informasi Pembayaran Sewa</h2>
        <p className="text-xs text-muted">
          Silakan transfer ke rekening pemilik kos di bawah ini lalu konfirmasi lewat WhatsApp.
        </p>
        <div className="p-4 rounded-control bg-surface-container-low border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-muted block">{bankAccount.bankName}</span>
            <span className="text-lg font-bold text-ink tracking-wider block font-mono">{bankAccount.accountNumber}</span>
            <span className="text-xs text-muted block">a.n. {bankAccount.accountHolder}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigator?.clipboard?.writeText(bankAccount.accountNumber.replace(/\s+/g, ''))}
              className="h-8 px-3 rounded-lg bg-surface border border-line hover:bg-surface-container-high text-ink text-xs font-semibold transition-colors"
            >
              Salin No. Rekening
            </button>
          </div>
        </div>
      </Card>

      {/* Pembayaran Terakhir */}
      <Card className="p-6 flex flex-col gap-3">
        <h2 className="text-base font-bold text-ink">Pembayaran Terakhir Anda</h2>
        <div className="p-3.5 rounded-control bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-status-paid-bg text-status-paid flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-ink block">{formatRupiah(lastPayment.amount)}</span>
              <span className="text-xs text-muted block">{formatDate(lastPayment.date)} • {lastPayment.method}</span>
            </div>
          </div>
          <StatusBadge status={lastPayment.status} />
        </div>
      </Card>
    </div>
  )
}
