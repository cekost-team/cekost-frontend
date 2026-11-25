import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  LayoutGrid,
  MessageSquare,
  MessageSquareDot,
  RefreshCw,
  TableProperties,
  UserPlus,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getTenants } from '../api/tenants'
import Button from '../components/Button'
import Card from '../components/Card'
import FilterChip from '../components/FilterChip'
import SearchBar from '../components/SearchBar'
import SummaryCard from '../components/SummaryCard'
import TenantCard from '../components/TenantCard'
import TenantTable from '../components/TenantTable'
import { formatRupiah } from '../utils/format'

export default function Tenants() {
  const navigate = useNavigate()

  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryTrigger, setRetryTrigger] = useState(0)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('aktif')
  const [floorFilter, setFloorFilter] = useState('all')
  const [sortBy, setSortBy] = useState('nama')
  const [viewMode, setViewMode] = useState('table')

  useEffect(() => {
    let ignore = false

    async function loadTenants() {
      try {
        const res = await getTenants()
        const list = Array.isArray(res) ? res : res?.data || []
        if (!ignore) {
          setTenants(list)
          setLoading(false)
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || 'Gagal memuat data penghuni.')
          setLoading(false)
        }
      }
    }

    loadTenants()
    return () => {
      ignore = true
    }
  }, [retryTrigger])

  const handleRetry = () => {
    setLoading(true)
    setError('')
    setRetryTrigger((prev) => prev + 1)
  }

  const handleExport = () => {
    // TODO: hubungkan aksi Ekspor Data penghuni
  }

  const handleViewInvoices = () => {
    // TODO: hubungkan aksi Lihat Tagihan penghuni
  }

  const handleEditTenant = () => {
    // TODO: hubungkan aksi Ubah data penghuni
  }

  const handleDetailTenant = () => {
    // TODO: hubungkan aksi Detail penghuni
  }

  const handleCheckoutTenant = () => {
    // TODO: hubungkan aksi Check-out penghuni
  }

  const handleSendReminder = () => {
    // TODO: hubungkan aksi kirim pengingat WhatsApp
  }

  const totalCount = tenants.length
  const activeTenants = tenants.filter((t) => t.status === 'aktif')
  const movedTenants = tenants.filter((t) => t.status === 'pindah')
  const overdueTenants = activeTenants.filter(
    (t) =>
      t.tagihanTerbaru?.status === 'telat' ||
      t.tagihanTerbaru?.status === 'sebagian' ||
      t.tagihanTerbaru?.status === 'belum_bayar'
  )
  const paidOnTimeCount = activeTenants.filter(
    (t) => t.tagihanTerbaru?.status === 'lunas'
  ).length
  const expiringCount = activeTenants.filter((t) => t.kontrakSegeraHabis).length
  const overdueTotalAmount = overdueTenants.reduce(
    (sum, t) => sum + (t.tagihanTerbaru?.nominal || 0),
    0
  )
  const totalRooms = 12
  const emptyRoomsCount = Math.max(0, totalRooms - activeTenants.length)
  const occupancyPct = Math.round((activeTenants.length / totalRooms) * 100)
  const onTimePct =
    activeTenants.length > 0
      ? Math.round((paidOnTimeCount / activeTenants.length) * 100)
      : 0

  const filteredTenants = useMemo(() => {
    const query = search.trim().toLowerCase()

    const result = tenants.filter((t) => {
      if (statusFilter === 'aktif' && t.status !== 'aktif') return false
      if (statusFilter === 'pindah' && t.status !== 'pindah') return false
      if (statusFilter === 'menunggak') {
        const inv = t.tagihanTerbaru?.status
        if (
          t.status !== 'aktif' ||
          (inv !== 'telat' && inv !== 'sebagian' && inv !== 'belum_bayar')
        ) {
          return false
        }
      }

      if (floorFilter !== 'all' && String(t.lantai || 1) !== floorFilter) {
        return false
      }

      if (query) {
        const matchName = t.nama?.toLowerCase().includes(query)
        const matchRoom = t.kamarNomor?.toLowerCase().includes(query)
        const matchRoomFull = `kmr ${t.kamarNomor}`.toLowerCase().includes(query)
        const matchPhone = t.noHp?.toLowerCase().includes(query)
        if (!matchName && !matchRoom && !matchRoomFull && !matchPhone) {
          return false
        }
      }

      return true
    })

    const sorted = [...result]
    if (sortBy === 'nama') {
      sorted.sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
    } else if (sortBy === 'jatuhTempo') {
      sorted.sort((a, b) => (a.jatuhTempo || 0) - (b.jatuhTempo || 0))
    } else if (sortBy === 'kamar') {
      sorted.sort((a, b) =>
        String(a.kamarNomor).localeCompare(String(b.kamarNomor), 'id')
      )
    } else if (sortBy === 'status') {
      sorted.sort((a, b) =>
        String(a.tagihanTerbaru?.status || '').localeCompare(
          String(b.tagihanTerbaru?.status || '')
        )
      )
    }

    return sorted
  }, [tenants, search, statusFilter, floorFilter, sortBy])

  if (loading) {
    return (
      <div
        className="flex flex-col gap-6"
        role="status"
        aria-label="Memuat daftar penghuni"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-44 bg-line rounded animate-pulse" />
            <div className="h-7 w-52 bg-line rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-11 w-32 bg-surface rounded-xl animate-pulse" />
            <div className="h-11 w-48 bg-line rounded-xl animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="h-32 bg-surface rounded-xl p-4 animate-pulse flex flex-col justify-between"
            >
              <div className="h-4 w-28 bg-line rounded" />
              <div className="h-7 w-24 bg-line rounded" />
            </div>
          ))}
        </div>

        <div className="bg-surface rounded-xl p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className="h-14 bg-app-bg rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

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

  if (tenants.length === 0) {
    return (
      <Card className="p-8 my-8 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 mx-auto flex items-center justify-center mb-4">
          <Users className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="text-lg leading-[26px] font-bold text-ink">
          Belum ada penghuni
        </h2>
        <p className="text-sm leading-[22px] text-muted mt-1.5 mb-6">
          Tambahkan penghuni pertama untuk mulai mencatat kontrak sewa dan
          tagihan bulanan.
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate('/penghuni/baru')}
          icon={<UserPlus className="w-5 h-5" aria-hidden="true" />}
        >
          Tambah Penghuni Pertama
        </Button>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Breadcrumb & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-muted text-[11px] leading-4 font-medium"
          >
            <span>Properti</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Kos Melati Asri</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="font-semibold text-ink">Kelola Penghuni</span>
          </nav>

          <h1 className="text-[22px] leading-[30px] text-ink tracking-tight font-bold mt-1">
            Kelola Penghuni
          </h1>
          <p className="text-sm leading-[22px] text-muted max-w-2xl">
            Pantau daftar penyewa aktif, riwayat kamar, status tagihan sewa, dan
            kontak darurat penghuni Kos Melati Asri.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Button
            type="button"
            variant="secondary"
            onClick={handleExport}
            icon={<Download className="w-[18px] h-[18px]" aria-hidden="true" />}
            className="bg-surface border-0 text-ink shadow-sm hover:bg-surface-container px-4 rounded-xl"
          >
            Ekspor Data
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate('/penghuni/baru')}
            icon={<UserPlus className="w-5 h-5" aria-hidden="true" />}
            className="px-5 rounded-xl shadow-md"
          >
            + Tambah Penghuni Baru
          </Button>
        </div>
      </div>

      {/* 2. Metric Summary Grid (4 Bento Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          label="TOTAL PENGHUNI"
          tone="default"
          value={
            <>
              {activeTenants.length}{' '}
              <span className="text-sm leading-[22px] font-normal text-muted">
                / {totalRooms} Kamar
              </span>
            </>
          }
          icon={<Users className="w-5 h-5" aria-hidden="true" />}
          className="p-4 border-0 shadow-sm hover:shadow-md transition-all"
          subtext={
            <span className="mt-2 pt-2 flex items-center justify-between text-[11px] leading-4">
              <span className="flex items-center gap-1.5 text-muted">
                <span className="w-2 h-2 rounded-full bg-primary-600" />
                <span>Okupansi {occupancyPct}%</span>
              </span>
              <span className="font-semibold text-primary-600">
                {emptyRoomsCount} Kosong
              </span>
            </span>
          }
        />

        <SummaryCard
          label="TAGIHAN LANCAR"
          tone="success"
          value={
            <>
              {paidOnTimeCount}{' '}
              <span className="text-sm leading-[22px] font-normal text-muted">
                Penyewa
              </span>
            </>
          }
          icon={<CheckCircle2 className="w-5 h-5" aria-hidden="true" />}
          className="p-4 border-0 shadow-sm hover:shadow-md transition-all"
          subtext={
            <span className="mt-2 pt-2 flex items-center justify-between text-[11px] leading-4">
              <span className="flex items-center gap-1.5 text-muted">
                <span className="w-2 h-2 rounded-full bg-status-paid" />
                <span>{onTimePct}% Tepat Waktu</span>
              </span>
              <span className="font-semibold text-status-paid">Tertib</span>
            </span>
          }
        />

        <SummaryCard
          label="MENUNGGAK / TELAT"
          tone="danger"
          value={
            <>
              {overdueTenants.length}{' '}
              <span className="text-sm leading-[22px] font-normal text-muted">
                Penghuni
              </span>
            </>
          }
          icon={<AlertTriangle className="w-5 h-5" aria-hidden="true" />}
          className="p-4 border-0 shadow-sm hover:shadow-md transition-all"
          subtext={
            <span className="mt-2 pt-2 flex items-center justify-between text-[11px] leading-4">
              <span className="flex items-center gap-1.5 text-muted">
                <span className="w-2 h-2 rounded-full bg-status-late" />
                <span>Tertunda</span>
              </span>
              <span className="font-semibold text-status-late tabular-nums">
                {formatRupiah(overdueTotalAmount)}
              </span>
            </span>
          }
        />

        <SummaryCard
          label="KONTRAK SEGERA HABIS"
          tone="default"
          value={
            <span className="text-status-repair">
              {expiringCount}{' '}
              <span className="text-sm leading-[22px] font-normal text-muted">
                Penyewa
              </span>
            </span>
          }
          icon={
            <Clock
              className="w-5 h-5 text-status-repair"
              aria-hidden="true"
            />
          }
          className="p-4 border-0 shadow-sm hover:shadow-md transition-all"
          subtext={
            <span className="mt-2 pt-2 flex items-center justify-between text-[11px] leading-4">
              <span className="flex items-center gap-1.5 text-muted">
                <span className="w-2 h-2 rounded-full bg-status-repair" />
                <span>&lt; 30 Hari Ke Depan</span>
              </span>
              <span className="font-semibold text-status-repair">
                Konfirmasi
              </span>
            </span>
          }
        />
      </div>

      {/* 3. Search, Filters, and View Switcher */}
      <Card padding="sm" className="border-0 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          <div className="flex-1 max-w-lg">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama penghuni, nomor kamar, atau nomor WhatsApp..."
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0">
            <FilterChip
              label="Semua Penghuni"
              count={totalCount}
              active={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
              className="min-h-[44px] lg:min-h-0"
            />
            <FilterChip
              label="Aktif"
              count={activeTenants.length}
              active={statusFilter === 'aktif'}
              onClick={() => setStatusFilter('aktif')}
              className="min-h-[44px] lg:min-h-0"
            />
            <FilterChip
              label="Menunggak"
              count={overdueTenants.length}
              active={statusFilter === 'menunggak'}
              onClick={() => setStatusFilter('menunggak')}
              className="min-h-[44px] lg:min-h-0"
            />
            <FilterChip
              label="Riwayat Pindah"
              count={movedTenants.length}
              active={statusFilter === 'pindah'}
              onClick={() => setStatusFilter('pindah')}
              className="min-h-[44px] lg:min-h-0"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div className="relative">
              <select
                aria-label="Filter lantai"
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className="h-11 lg:h-10 pl-3 pr-8 bg-app-bg rounded-xl text-sm leading-[22px] text-ink appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">Semua Lantai (1 &amp; 2)</option>
                <option value="1">Lantai 1</option>
                <option value="2">Lantai 2</option>
              </select>
              <ChevronDown
                className="w-[18px] h-[18px] text-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
            </div>

            <div className="relative">
              <select
                aria-label="Urutkan penghuni"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 lg:h-10 pl-3 pr-8 bg-app-bg rounded-xl text-sm leading-[22px] text-ink appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="nama">Urutkan: Nama (A-Z)</option>
                <option value="jatuhTempo">Urutkan: Jatuh Tempo</option>
                <option value="kamar">Urutkan: Kamar (01-12)</option>
                <option value="status">Urutkan: Status Bayar</option>
              </select>
              <ChevronDown
                className="w-[18px] h-[18px] text-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
            </div>

            <div className="flex items-center p-1 bg-app-bg rounded-xl">
              <button
                type="button"
                aria-label="Tampilan tabel"
                aria-pressed={viewMode === 'table'}
                title="Tampilan Tabel"
                onClick={() => setViewMode('table')}
                className={`min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-surface text-primary-600 shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <TableProperties className="w-[18px] h-[18px]" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Tampilan grid kartu"
                aria-pressed={viewMode === 'grid'}
                title="Tampilan Grid Kartu"
                onClick={() => setViewMode('grid')}
                className={`min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-surface text-primary-600 shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <LayoutGrid className="w-[18px] h-[18px]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Tenant Table or Grid Cards */}
      {filteredTenants.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm leading-[22px] font-semibold text-ink">
            Tidak ada penghuni yang sesuai filter
          </p>
          <p className="text-xs leading-[18px] text-muted mt-1 mb-4">
            Ubah kata kunci pencarian atau pilih filter status penghuni lain.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearch('')
              setStatusFilter('all')
              setFloorFilter('all')
            }}
          >
            Tampilkan Semua Penghuni
          </Button>
        </Card>
      ) : viewMode === 'table' ? (
        <TenantTable
          tenants={filteredTenants}
          onDetail={handleDetailTenant}
          onViewInvoices={handleViewInvoices}
          onEdit={handleEditTenant}
          onCheckout={handleCheckoutTenant}
          onSendReminder={handleSendReminder}
          footer={
            <div className="py-3 px-4 bg-surface flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-line/60">
              <div className="flex items-center gap-1.5 text-[11px] leading-4 text-muted flex-wrap">
                <span>Menampilkan</span>
                <span className="font-semibold text-ink">
                  1 - {filteredTenants.length}
                </span>
                <span>
                  dari {activeTenants.length} penghuni aktif ({emptyRoomsCount}{' '}
                  kamar kosong: Kamar 06 &amp; 11)
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  aria-label="Halaman sebelumnya"
                  className="min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center text-disabled cursor-not-allowed"
                >
                  <ChevronLeft className="w-[18px] h-[18px]" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-current="page"
                  className="min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 lg:w-9 lg:h-9 rounded-xl bg-primary-600 text-on-primary text-[11px] leading-4 font-semibold shadow-sm"
                >
                  1
                </button>
                <button
                  type="button"
                  className="min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 lg:w-9 lg:h-9 rounded-xl text-muted hover:bg-surface-container text-[11px] leading-4 font-semibold transition-colors cursor-pointer"
                >
                  2
                </button>
                <button
                  type="button"
                  aria-label="Halaman berikutnya"
                  className="min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center text-muted hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-[18px] h-[18px]" aria-hidden="true" />
                </button>
              </div>
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              onViewInvoices={handleViewInvoices}
              onEdit={handleEditTenant}
              onDetail={handleDetailTenant}
              onCheckout={handleCheckoutTenant}
            />
          ))}
        </div>
      )}

      {/* 6. Bottom Helper Card: WhatsApp Integration & Broadcast */}
      <Card
        padding="md"
        className="border-0 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-status-paid-bg flex items-center justify-center shrink-0">
            <MessageSquareDot
              className="w-6 h-6 text-secondary"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm leading-[22px] font-semibold text-ink">
              Kirim Pengingat Tagihan Otomatis
            </span>
            <p className="text-xs leading-[18px] text-muted">
              Ada {overdueTenants.length} penghuni yang belum melunasi tagihan
              bulan November. Anda dapat mengirimkan pesan template WhatsApp
              resmi CeKost sekali klik.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={handleSendReminder}
          icon={<MessageSquare className="w-[18px] h-[18px]" aria-hidden="true" />}
          className="w-full md:w-auto bg-secondary hover:opacity-90 text-on-primary rounded-xl shadow-sm shrink-0"
        >
          Broadcast Pengingat ({overdueTenants.length} Orang)
        </Button>
      </Card>
    </div>
  )
}
