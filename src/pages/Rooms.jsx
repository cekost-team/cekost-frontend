import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  DoorOpen,
  Download,
  Info,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Users,
  Wrench,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getRooms } from '../api/rooms'
import Button from '../components/Button'
import Card from '../components/Card'
import FilterChip from '../components/FilterChip'
import RoomCard from '../components/RoomCard'
import SearchBar from '../components/SearchBar'
import StatusBadge from '../components/StatusBadge'
import SummaryCard from '../components/SummaryCard'

function FloorHeader({ floor, dotClass, total, occupied, available }) {
  return (
    <div className="flex items-center justify-between pt-2 mb-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
        <h2 className="text-lg leading-[26px] font-bold text-ink">
          Lantai {floor}
        </h2>
        <span className="text-[11px] leading-4 font-medium text-muted bg-surface px-2.5 py-0.5 rounded-full shadow-sm">
          {total} Kamar ({occupied} Terisi, {available} Tersedia)
        </span>
      </div>
    </div>
  )
}

export default function Rooms() {
  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryTrigger, setRetryTrigger] = useState(0)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterFloor, setFilterFloor] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    let ignore = false

    async function loadRooms() {
      try {
        const res = await getRooms()
        const list = Array.isArray(res) ? res : res?.data || []
        if (!ignore) {
          setRooms(list)
          setLoading(false)
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || 'Gagal memuat data kamar.')
          setLoading(false)
        }
      }
    }

    loadRooms()
    return () => {
      ignore = true
    }
  }, [retryTrigger])

  const handleRetry = () => {
    setLoading(true)
    setError('')
    setRetryTrigger((prev) => prev + 1)
  }

  const handleEditRoom = (room) => {
    navigate(`/kamar/${room.id}/ubah`)
  }

  const handleDetailRoom = () => {
    // TODO: hubungkan aksi Detail kamar ke modal/halaman detail unit
  }

  const handleAddTenant = () => {
    // TODO: hubungkan aksi Masukkan Penghuni ke form tambah penghuni
  }

  const handleCollectRent = () => {
    // TODO: hubungkan aksi Tagih Sewa ke pengingat atau catat pembayaran
  }

  const handleExport = () => {
    // TODO: hubungkan aksi Ekspor Data Unit
  }

  const totalCount = rooms.length
  const terisiCount = rooms.filter((r) => r.status === 'terisi').length
  const tersediaCount = rooms.filter((r) => r.status === 'tersedia').length
  const perbaikanCount = rooms.filter((r) => r.status === 'perbaikan').length
  const overdueCount = rooms.filter((r) => r.paymentStatus === 'telat').length

  const floor1All = rooms.filter((r) => (r.lantai ?? 1) === 1)
  const floor2All = rooms.filter((r) => (r.lantai ?? 1) === 2)
  const occupancyPct =
    totalCount > 0 ? Math.round((terisiCount / totalCount) * 100) : 0
  const availablePct =
    totalCount > 0 ? Number(((tersediaCount / totalCount) * 100).toFixed(1)) : 0
  const repairPct =
    totalCount > 0 ? Number(((perbaikanCount / totalCount) * 100).toFixed(1)) : 0

  const vacantSummary =
    rooms
      .filter((r) => r.status === 'tersedia')
      .map((r) => `Kamar ${r.nomor} (Lt ${r.lantai ?? 1})`)
      .join(' & ') || 'Tidak ada unit tersedia'

  const types = useMemo(() => {
    return Array.from(new Set(rooms.map((r) => r.tipe).filter(Boolean)))
  }, [rooms])

  const filteredRooms = useMemo(() => {
    const query = search.trim().toLowerCase()
    return rooms.filter((room) => {
      if (filterStatus !== 'all' && room.status !== filterStatus) return false
      if (filterFloor !== 'all' && String(room.lantai ?? 1) !== filterFloor) {
        return false
      }
      if (filterType !== 'all' && room.tipe !== filterType) return false

      if (query) {
        const matchNumber = room.nomor?.toLowerCase().includes(query)
        const matchName = `kamar ${room.nomor}`.toLowerCase().includes(query)
        const matchTenant = room.penghuni?.toLowerCase().includes(query)
        const matchFacility = room.fasilitas?.some((f) =>
          f.toLowerCase().includes(query)
        )
        if (!matchNumber && !matchName && !matchTenant && !matchFacility) {
          return false
        }
      }
      return true
    })
  }, [rooms, filterStatus, filterFloor, filterType, search])

  const floor1Filtered = filteredRooms.filter((r) => (r.lantai ?? 1) === 1)
  const floor2Filtered = filteredRooms.filter((r) => (r.lantai ?? 1) === 2)
  const otherFloorsFiltered = filteredRooms.filter(
    (r) => (r.lantai ?? 1) !== 1 && (r.lantai ?? 1) !== 2
  )

  if (loading) {
    return (
      <div
        className="flex flex-col gap-6"
        role="status"
        aria-label="Memuat daftar kamar"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-line rounded animate-pulse" />
            <div className="h-7 w-48 bg-line rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-11 w-36 bg-surface rounded-xl animate-pulse" />
            <div className="h-11 w-44 bg-line rounded-xl animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="h-36 bg-surface rounded-xl p-5 animate-pulse flex flex-col justify-between"
            >
              <div className="h-4 w-28 bg-line rounded" />
              <div className="h-8 w-20 bg-line rounded" />
              <div className="h-2 w-full bg-line/60 rounded" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="h-64 bg-surface rounded-xl p-5 animate-pulse flex flex-col justify-between"
            >
              <div className="h-11 w-40 bg-line rounded" />
              <div className="h-14 w-full bg-line/50 rounded-xl" />
              <div className="h-8 w-28 bg-line rounded ml-auto" />
            </div>
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

  if (rooms.length === 0) {
    return (
      <Card className="p-8 my-8 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 mx-auto flex items-center justify-center mb-4">
          <DoorOpen className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="text-lg leading-[26px] font-bold text-ink">
          Belum ada kamar
        </h2>
        <p className="text-sm leading-[22px] text-muted mt-1.5 mb-6">
          Tambahkan unit kamar pertama untuk mulai mengelola tarif sewa dan
          ketersediaan.
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate('/kamar/baru')}
          icon={<Plus className="w-5 h-5" aria-hidden="true" />}
        >
          Tambah Kamar Pertama
        </Button>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section with Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-muted mb-1">
            <span className="text-xs leading-[18px]">Properti</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-xs leading-[18px] text-primary-600 font-semibold">
              Kos Melati Asri
            </span>
          </div>
          <h1 className="text-[22px] leading-[30px] text-ink tracking-tight font-bold">
            Kelola Kamar
          </h1>
          <p className="text-sm leading-[22px] text-muted mt-0.5">
            Pantau ketersediaan, kelola harga sewa, dan data unit kamar Kos
            Melati Asri
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Button
            type="button"
            variant="secondary"
            onClick={handleExport}
            icon={<Download className="w-5 h-5" aria-hidden="true" />}
            className="bg-surface border-0 text-primary-600 shadow-sm hover:bg-primary-50 px-4 rounded-xl"
          >
            Ekspor Data Unit
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate('/kamar/baru')}
            icon={<Plus className="w-5 h-5" aria-hidden="true" />}
            className="px-5 rounded-xl shadow-sm"
          >
            Tambah Kamar Baru
          </Button>
        </div>
      </div>

      {/* 4 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          label="TOTAL KAPASITAS"
          tone="default"
          value={
            <>
              {totalCount}{' '}
              <span className="text-sm leading-[22px] font-semibold text-muted">
                Unit
              </span>
            </>
          }
          icon={<DoorOpen className="w-5 h-5" aria-hidden="true" />}
          className="p-5 border-0 shadow-sm"
          subtext={
            <span className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-[11px] leading-4 text-muted">
                <span>
                  Lt. 1: <strong className="text-ink">{floor1All.length} Unit</strong>
                </span>
                <span className="text-disabled">•</span>
                <span>
                  Lt. 2: <strong className="text-ink">{floor2All.length} Unit</strong>
                </span>
              </span>
              <span className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden block">
                <span className="bg-primary-600 h-full rounded-full w-full block" />
              </span>
            </span>
          }
        />

        <SummaryCard
          label="KAMAR TERISI"
          tone="default"
          value={
            <span className="flex items-baseline gap-1 w-full">
              <span>{terisiCount}</span>
              <span className="text-sm leading-[22px] font-semibold text-muted">
                Kamar
              </span>
              <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full bg-status-paid-bg text-status-paid text-[11px] leading-4 font-semibold">
                {occupancyPct}% Okupansi
              </span>
            </span>
          }
          icon={<Users className="w-5 h-5" aria-hidden="true" />}
          className="p-5 border-0 shadow-sm"
          subtext={
            <span className="flex flex-col gap-3">
              <span className="text-[11px] leading-4 text-muted block">
                {terisiCount} penghuni aktif terdaftar
              </span>
              <span className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden block">
                <span
                  className="bg-primary-600 h-full rounded-full block"
                  style={{ width: `${occupancyPct}%` }}
                />
              </span>
            </span>
          }
        />

        <SummaryCard
          label="SIAP DIHUNI"
          tone="success"
          value={
            <span className="flex items-baseline gap-1 w-full">
              <span>{tersediaCount}</span>
              <span className="text-sm leading-[22px] font-semibold text-muted">
                Kamar
              </span>
              <span className="ml-auto">
                <StatusBadge
                  status="tersedia"
                  className="!bg-status-paid !text-on-primary"
                />
              </span>
            </span>
          }
          icon={<CheckCircle2 className="w-5 h-5" aria-hidden="true" />}
          className="p-5 border-0 shadow-sm"
          subtext={
            <span className="flex flex-col gap-3">
              <span className="text-[11px] leading-4 text-muted truncate block">
                {vacantSummary}
              </span>
              <span className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden block">
                <span
                  className="bg-status-paid h-full rounded-full block"
                  style={{ width: `${availablePct}%` }}
                />
              </span>
            </span>
          }
        />

        <SummaryCard
          label="DALAM PERBAIKAN"
          tone="default"
          value={
            <span className="flex items-baseline gap-1 w-full">
              <span>{perbaikanCount}</span>
              <span className="text-sm leading-[22px] font-semibold text-muted">
                Unit
              </span>
              <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-muted text-[11px] leading-4 font-semibold">
                {perbaikanCount === 0 ? 'Nihil' : `${perbaikanCount} Unit`}
              </span>
            </span>
          }
          icon={<Wrench className="w-5 h-5 text-muted" aria-hidden="true" />}
          className="p-5 border-0 shadow-sm"
          subtext={
            <span className="flex flex-col gap-3">
              <span className="text-[11px] leading-4 text-muted block">
                {perbaikanCount === 0
                  ? 'Semua unit dalam kondisi prima'
                  : `${perbaikanCount} unit sedang diperbaiki`}
              </span>
              <span className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden block">
                <span
                  className="bg-status-repair h-full rounded-full block"
                  style={{ width: `${repairPct}%` }}
                />
              </span>
            </span>
          }
        />
      </div>

      {/* Filter & Search Toolbar */}
      <Card
        padding="sm"
        className="border-0 shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3"
      >
        <div className="flex-1 min-w-[260px]">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor kamar, nama penghuni, atau fasilitas..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 p-1 bg-app-bg rounded-xl overflow-x-auto">
            <FilterChip
              label="Semua"
              count={totalCount}
              active={filterStatus === 'all'}
              onClick={() => setFilterStatus('all')}
              className="min-h-[44px] lg:min-h-0"
            />
            <FilterChip
              label="Terisi"
              count={terisiCount}
              active={filterStatus === 'terisi'}
              onClick={() => setFilterStatus('terisi')}
              className="min-h-[44px] lg:min-h-0"
            />
            <FilterChip
              label="Tersedia"
              count={tersediaCount}
              active={filterStatus === 'tersedia'}
              onClick={() => setFilterStatus('tersedia')}
              className="min-h-[44px] lg:min-h-0"
            />
            <FilterChip
              label="Perbaikan"
              count={perbaikanCount}
              active={filterStatus === 'perbaikan'}
              onClick={() => setFilterStatus('perbaikan')}
              className="min-h-[44px] lg:min-h-0"
            />
          </div>

          <div className="h-6 w-px bg-line hidden sm:block" />

          {/* Floor Dropdown */}
          <div className="relative">
            <select
              aria-label="Filter lantai"
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="h-11 pl-3.5 pr-8 rounded-xl bg-app-bg text-sm leading-[22px] font-semibold text-ink border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
            >
              <option value="all">Semua Lantai</option>
              <option value="1">Lantai 1 ({floor1All.length} Unit)</option>
              <option value="2">Lantai 2 ({floor2All.length} Unit)</option>
            </select>
            <ChevronDown
              className="w-[18px] h-[18px] text-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
          </div>

          {/* Type Dropdown */}
          <div className="relative">
            <select
              aria-label="Filter tipe kamar"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-11 pl-3.5 pr-8 rounded-xl bg-app-bg text-sm leading-[22px] font-semibold text-ink border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
            >
              <option value="all">Semua Tipe Kamar</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown
              className="w-[18px] h-[18px] text-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-app-bg p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Tampilan grid"
              aria-pressed={viewMode === 'grid'}
              title="Tampilan Grid"
              className={`min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-surface text-primary-600 shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <LayoutGrid className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="Tampilan daftar"
              aria-pressed={viewMode === 'list'}
              title="Tampilan Daftar"
              className={`min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-surface text-primary-600 shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <List className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Card>

      {/* Floor 1 Rooms */}
      {floor1Filtered.length > 0 && (
        <section>
          <FloorHeader
            floor={1}
            dotClass="bg-primary-600"
            total={floor1All.length}
            occupied={floor1All.filter((r) => r.status === 'terisi').length}
            available={floor1All.filter((r) => r.status === 'tersedia').length}
          />
          <div
            className={
              viewMode === 'list'
                ? 'grid grid-cols-1 gap-4'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
            }
          >
            {floor1Filtered.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onEdit={handleEditRoom}
                onDetail={handleDetailRoom}
                onAddTenant={handleAddTenant}
                onCollect={handleCollectRent}
              />
            ))}
          </div>
        </section>
      )}

      {/* Floor 2 Rooms */}
      {floor2Filtered.length > 0 && (
        <section className="pt-2">
          <FloorHeader
            floor={2}
            dotClass="bg-primary-500"
            total={floor2All.length}
            occupied={floor2All.filter((r) => r.status === 'terisi').length}
            available={floor2All.filter((r) => r.status === 'tersedia').length}
          />
          <div
            className={
              viewMode === 'list'
                ? 'grid grid-cols-1 gap-4'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
            }
          >
            {floor2Filtered.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onEdit={handleEditRoom}
                onDetail={handleDetailRoom}
                onAddTenant={handleAddTenant}
                onCollect={handleCollectRent}
              />
            ))}
          </div>
        </section>
      )}

      {/* Any extra rooms if added on other floors */}
      {otherFloorsFiltered.length > 0 && (
        <section className="pt-2">
          <div
            className={
              viewMode === 'list'
                ? 'grid grid-cols-1 gap-4'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
            }
          >
            {otherFloorsFiltered.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onEdit={handleEditRoom}
                onDetail={handleDetailRoom}
                onAddTenant={handleAddTenant}
                onCollect={handleCollectRent}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty Filter State */}
      {filteredRooms.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm leading-[22px] font-semibold text-ink">
            Tidak ada kamar yang sesuai filter
          </p>
          <p className="text-xs leading-[18px] text-muted mt-1 mb-4">
            Ubah kata kunci pencarian atau atur ulang filter status kamar.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearch('')
              setFilterStatus('all')
              setFilterFloor('all')
              setFilterType('all')
            }}
          >
            Atur Ulang Filter
          </Button>
        </Card>
      )}

      {/* Legend Bar */}
      <Card
        padding="md"
        className="border-0 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-muted text-[11px] leading-4 font-medium"
      >
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary-600" />
            <span>Terisi ({terisiCount} Unit)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-status-paid" />
            <span>Siap Huni ({tersediaCount} Unit)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-status-late" />
            <span>Menunggak Pembayaran ({overdueCount} Unit)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-status-repair" />
            <span>Perbaikan ({perbaikanCount} Unit)</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted">
          <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>
            Harga sewa dapat diperbarui dari tombol{' '}
            <strong className="text-ink">Ubah</strong> pada setiap unit.
          </span>
        </div>
      </Card>
    </div>
  )
}
