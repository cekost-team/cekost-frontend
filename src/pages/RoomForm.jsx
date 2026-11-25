import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowUp,
  Banknote,
  BedDouble,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CloudUpload,
  DoorOpen,
  Eye,
  Fan,
  ImagePlus,
  Images,
  Lightbulb,
  Monitor,
  Save,
  ShowerHead,
  SlidersHorizontal,
  Sparkles,
  Layers,
  Thermometer,
  Trash2,
  UserX,
  Wifi,
  Zap,
  Armchair,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createRoom, getRoom, getRooms, updateRoom } from '../api/rooms'
import roomPreview1 from '../assets/room-preview-1.jpg'
import roomPreview2 from '../assets/room-preview-2.jpg'
import Button from '../components/Button'
import Card from '../components/Card'
import FilterChip from '../components/FilterChip'
import Input from '../components/Input'
import StatusBadge from '../components/StatusBadge'
import Textarea from '../components/Textarea'
import { formatRupiah } from '../utils/format'

const FACILITY_OPTIONS = [
  { val: 'AC', label: 'AC Dingin', icon: Fan },
  { val: 'KM Dalam', label: 'Kamar Mandi Dalam', icon: ShowerHead },
  { val: 'Kasur Springbed', label: 'Kasur Springbed (Queen)', icon: BedDouble },
  { val: 'Lemari Pakaian', label: 'Lemari Pakaian 2 Pintu', icon: DoorOpen },
  { val: 'Meja Kerja', label: 'Meja Kerja / Belajar', icon: Armchair },
  { val: 'Wi-Fi 50+ Mbps', label: 'Wi-Fi Fiber 50+ Mbps', icon: Wifi },
  { val: 'Water Heater', label: 'Water Heater', icon: Thermometer },
  { val: 'Balkon Luar', label: 'Balkon / Jendela Luar', icon: Sparkles },
  { val: 'Kipas Angin', label: 'Kipas Plafon Ekstra', icon: Fan },
  { val: 'Smart TV', label: 'Smart TV 32 Inch', icon: Monitor },
]

function formatThousands(plainDigits) {
  if (!plainDigits) return ''
  const num = Number(plainDigits)
  if (!Number.isFinite(num) || num <= 0) return ''
  return new Intl.NumberFormat('id-ID').format(num)
}

function parseDigits(rawValue) {
  const digits = String(rawValue || '').replace(/\D/g, '')
  return digits ? Number(digits) : 0
}

function SectionHeader({ icon: Icon, iconBoxClass, title, subtitle, step }) {
  return (
    <div className="flex items-center justify-between pb-2 gap-3">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBoxClass}`}
        >
          <Icon className="w-[22px] h-[22px]" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg leading-[26px] text-ink font-semibold">
            {title}
          </h2>
          <p className="text-xs leading-[18px] text-muted">{subtitle}</p>
        </div>
      </div>
      <span className="text-[11px] leading-4 font-semibold px-2.5 py-1 rounded-full bg-surface-container text-muted shrink-0">
        {step}
      </span>
    </div>
  )
}

export default function RoomForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const nomorRef = useRef(null)
  const tipeRef = useRef(null)
  const hargaRef = useRef(null)

  const [existingRooms, setExistingRooms] = useState([])
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Form state (empty on Create mode)
  const [nomor, setNomor] = useState('')
  const [ukuran, setUkuran] = useState('')
  const [lantai, setLantai] = useState(1)
  const [tipe, setTipe] = useState('')
  const [hargaNum, setHargaNum] = useState(0)
  const [depositNum, setDepositNum] = useState(0)
  const [utilitas, setUtilitas] = useState('token')
  const [fasilitas, setFasilitas] = useState([])
  const [status, setStatus] = useState('tersedia')
  const [initialStatus, setInitialStatus] = useState('tersedia')
  const [penghuni, setPenghuni] = useState(null)
  const [catatan, setCatatan] = useState('')
  const [photos, setPhotos] = useState([
    { id: 'p1', src: roomPreview1, alt: 'Foto Utama Kamar', cover: true },
    { id: 'p2', src: roomPreview2, alt: 'Kamar Mandi Dalam', cover: false },
  ])

  const [initialSnapshot, setInitialSnapshot] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [draftNotice, setDraftNotice] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadFormData() {
      setLoadingInitial(true)
      setNotFound(false)

      try {
        const listRes = await getRooms()
        const allRooms = Array.isArray(listRes) ? listRes : listRes?.data || []
        if (!ignore) setExistingRooms(allRooms)

        if (isEdit) {
          const roomRes = await getRoom(id)
          const roomData = roomRes?.data || roomRes
          if (!roomData) {
            if (!ignore) setNotFound(true)
            return
          }
          if (!ignore) {
            const loadedNomor = roomData.nomor || ''
            const loadedUkuran = roomData.ukuran || ''
            const loadedLantai = Number(roomData.lantai) || 1
            const loadedTipe = roomData.tipe || ''
            const loadedHarga = Number(roomData.harga) || 0
            const loadedDeposit = Number(roomData.deposit) || 0
            const loadedUtilitas = roomData.utilitas || 'token'
            const loadedFasilitas = Array.isArray(roomData.fasilitas)
              ? roomData.fasilitas
              : []
            const loadedStatus = roomData.status || 'tersedia'
            const loadedCatatan = roomData.catatan || ''

            setNomor(loadedNomor)
            setUkuran(loadedUkuran)
            setLantai(loadedLantai)
            setTipe(loadedTipe)
            setHargaNum(loadedHarga)
            setDepositNum(loadedDeposit)
            setUtilitas(loadedUtilitas)
            setFasilitas(loadedFasilitas)
            setStatus(loadedStatus)
            setInitialStatus(loadedStatus)
            setPenghuni(roomData.penghuni || null)
            setCatatan(loadedCatatan)
            setInitialSnapshot(
              JSON.stringify({
                nomor: loadedNomor,
                ukuran: loadedUkuran,
                lantai: loadedLantai,
                tipe: loadedTipe,
                hargaNum: loadedHarga,
                depositNum: loadedDeposit,
                utilitas: loadedUtilitas,
                fasilitas: loadedFasilitas,
                status: loadedStatus,
                catatan: loadedCatatan,
              })
            )
          }
        } else if (!ignore) {
          setInitialSnapshot(
            JSON.stringify({
              nomor: '',
              ukuran: '',
              lantai: 1,
              tipe: '',
              hargaNum: 0,
              depositNum: 0,
              utilitas: 'token',
              fasilitas: [],
              status: 'tersedia',
              catatan: '',
            })
          )
        }
      } catch {
        if (!ignore && isEdit) setNotFound(true)
      } finally {
        if (!ignore) setLoadingInitial(false)
      }
    }

    loadFormData()
    return () => {
      ignore = true
    }
  }, [id, isEdit])

  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        nomor,
        ukuran,
        lantai,
        tipe,
        hargaNum,
        depositNum,
        utilitas,
        fasilitas,
        status,
        catatan,
      }),
    [
      nomor,
      ukuran,
      lantai,
      tipe,
      hargaNum,
      depositNum,
      utilitas,
      fasilitas,
      status,
      catatan,
    ]
  )

  const isDirty = Boolean(initialSnapshot && currentSnapshot !== initialSnapshot)
  const isOccupiedLocked = isEdit && initialStatus === 'terisi'

  const toggleFacility = (val) => {
    setFasilitas((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    )
  }

  const handleNavigateBack = () => {
    if (isDirty) {
      const ok = window.confirm(
        'Ada perubahan yang belum disimpan. Keluar tanpa menyimpan?'
      )
      if (!ok) return
    }
    navigate('/kamar')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    const nextErrors = {}
    const trimmedNomor = nomor.trim()
    const trimmedTipe = tipe.trim()

    if (!trimmedNomor) {
      nextErrors.nomor = 'Nomor kamar wajib diisi.'
    } else {
      const duplicate = existingRooms.some(
        (r) =>
          (!isEdit || r.id !== id) &&
          String(r.nomor || '')
            .trim()
            .toLowerCase() === trimmedNomor.toLowerCase()
      )
      if (duplicate) {
        nextErrors.nomor = `Nomor kamar ${trimmedNomor} sudah digunakan.`
      }
    }

    if (!trimmedTipe) {
      nextErrors.tipe = 'Tipe kamar wajib dipilih.'
    }

    if (!hargaNum || hargaNum <= 0) {
      nextErrors.harga = 'Harga sewa wajib diisi dengan angka positif.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      if (nextErrors.nomor) {
        nomorRef.current?.focus()
      } else if (nextErrors.tipe) {
        tipeRef.current?.focus()
      } else if (nextErrors.harga) {
        hargaRef.current?.focus()
      }
      return
    }

    setErrors({})
    setSubmitting(true)

    const payload = {
      nomor: trimmedNomor,
      tipe: trimmedTipe,
      lantai,
      ukuran: ukuran.trim(),
      harga: hargaNum,
      deposit: depositNum,
      utilitas,
      fasilitas,
      status: isOccupiedLocked ? 'terisi' : status,
      catatan: catatan.trim(),
      penghuni: isEdit ? penghuni : null,
    }

    try {
      if (isEdit) {
        await updateRoom(id, payload)
      } else {
        await createRoom(payload)
      }
      navigate('/kamar')
    } catch (err) {
      setSubmitError(err?.message || 'Gagal menyimpan data kamar.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial) {
    return (
      <div
        className="flex flex-col gap-6 pb-16"
        role="status"
        aria-label="Memuat formulir kamar"
      >
        <div className="h-8 w-56 bg-line rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-72 bg-surface rounded-card animate-pulse" />
            <div className="h-64 bg-surface rounded-card animate-pulse" />
          </div>
          <div className="lg:col-span-4 h-96 bg-surface rounded-card animate-pulse" />
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <Card className="p-8 my-8 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-status-late-bg text-status-late mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="text-lg leading-[26px] font-bold text-ink">
          Kamar tidak ditemukan
        </h1>
        <p className="text-sm leading-[22px] text-muted mt-1.5 mb-6">
          Data kamar dengan ID tersebut tidak tersedia atau telah dihapus.
        </p>
        <Link
          to="/kamar"
          className="inline-flex items-center justify-center h-11 px-5 rounded-control bg-primary-600 text-on-primary text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          Kembali ke Kelola Kamar
        </Link>
      </Card>
    )
  }

  const nextUnitNumber = existingRooms.length + 1
  const occupiedCount = existingRooms.filter((r) => r.status === 'terisi').length
  const totalCount = existingRooms.length
  const previewTitle = nomor.trim() ? `Kamar ${nomor.trim()}` : 'Kamar --'
  const previewSub = `${tipe || 'Pilih tipe unit'} • Luas ${ukuran.trim() || '3 x 4'} m²`
  const previewPrice = hargaNum > 0 ? formatRupiah(hargaNum) : 'Rp 0'
  const previewOmsetM =
    hargaNum > 0 ? `+Rp ${(hargaNum / 1000000).toFixed(1)}M` : '+Rp 0'
  const statusBadgeKey = isOccupiedLocked ? 'terisi' : status
  const tipeErrorId = 'tipe-kamar-error'

  return (
    <div className="flex flex-col w-full pb-28 lg:pb-24">
      {/* Top Breadcrumb & Title Header */}
      <div className="pb-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-xs leading-[18px] text-muted flex-wrap"
          >
            <span>Properti</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Kos Melati Asri</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <Link to="/kamar" className="hover:text-primary-600 transition-colors">
              Kelola Kamar
            </Link>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-sm leading-[22px] font-semibold text-ink">
              {isEdit ? `Ubah Kamar ${nomor || id}` : 'Tambah Kamar Baru'}
            </span>
          </nav>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleNavigateBack}
            icon={<ArrowLeft className="w-[18px] h-[18px]" aria-hidden="true" />}
            className="min-h-[44px] lg:min-h-0 lg:h-10 px-3 rounded-xl bg-surface border-0 text-ink hover:bg-surface-container shadow-sm"
          >
            Kembali ke Kelola Kamar
          </Button>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[22px] leading-[30px] text-ink tracking-tight font-bold">
              {isEdit ? `Ubah Kamar ${nomor || id}` : 'Tambah Kamar Baru'}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[11px] leading-4 font-semibold tracking-wide uppercase">
              {isEdit ? `Unit #${nomor || id}` : `Unit Baru #${nextUnitNumber}`}
            </span>
          </div>
          <p className="text-sm leading-[22px] text-muted max-w-3xl">
            Lengkapi data spesifikasi, tarif sewa bulanan, dan fasilitas untuk
            unit kamar {isEdit ? 'ini' : 'baru'} di Kos Melati Asri.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <form
          id="tambahKamarForm"
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-8 flex flex-col gap-6"
        >
          {submitError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-status-late-bg border border-status-late/30 text-status-late text-xs leading-[18px] font-medium"
            >
              {submitError}
            </div>
          )}

          {/* SECTION 1: Informasi Dasar Kamar */}
          <Card
            padding="none"
            className="p-6 border-0 shadow-sm flex flex-col gap-5 rounded-xl"
          >
            <SectionHeader
              icon={DoorOpen}
              iconBoxClass="bg-primary-50 text-primary-600"
              title="1. Informasi Dasar Kamar"
              subtitle="Nomor identifikasi, posisi lantai, dan dimensi fisik unit."
              step="Langkah 1/5"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                ref={nomorRef}
                id="inputNomorKamar"
                label="Nomor / Kode Kamar"
                prefix="Kamar"
                placeholder="13"
                maxLength={6}
                value={nomor}
                onChange={(e) => {
                  setNomor(e.target.value)
                  if (errors.nomor) setErrors((prev) => ({ ...prev, nomor: '' }))
                }}
                error={errors.nomor}
                helperText="Otomatis terurut melanjutkan kamar terakhir (Kamar 12)."
                required
              />

              <Input
                id="inputUkuranKamar"
                label="Ukuran Kamar (P x L)"
                placeholder="Contoh: 3 x 4"
                suffix="meter (m²)"
                value={ukuran}
                onChange={(e) => setUkuran(e.target.value)}
                helperText="Luas bersih interior termasuk kamar mandi dalam."
              />
            </div>

            {/* Lantai Selection */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm leading-[22px] font-semibold text-ink">
                Lantai
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[1, 2, 3].map((floorNum) => {
                  const selected = lantai === floorNum
                  return (
                    <label
                      key={floorNum}
                      className={`min-h-[44px] relative flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all shadow-sm ${
                        selected
                          ? 'bg-primary-600 text-on-primary'
                          : 'bg-surface-container text-ink hover:bg-surface-container-high'
                      }`}
                    >
                      <input
                        type="radio"
                        name="lantai"
                        value={floorNum}
                        checked={selected}
                        onChange={() => setLantai(floorNum)}
                        className="sr-only"
                      />
                      <span className="flex items-center gap-1.5 text-sm leading-[22px] font-semibold">
                        <Layers className="w-[18px] h-[18px]" aria-hidden="true" />
                        <span>Lantai {floorNum}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Kategori / Tipe Unit */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm leading-[22px] font-semibold text-ink flex items-center justify-between">
                <span>Kategori / Tipe Unit</span>
                <span className="text-xs text-muted font-normal">Wajib</span>
              </span>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                role="radiogroup"
                aria-label="Kategori atau Tipe Unit"
                aria-invalid={errors.tipe ? 'true' : 'false'}
                aria-describedby={errors.tipe ? tipeErrorId : undefined}
              >
                {[
                  {
                    value: 'Kamar Tunggal',
                    desc: 'Kapasitas 1 orang, cocok untuk mahasiswa/pekerja solo.',
                  },
                  {
                    value: 'Kamar Ganda',
                    desc: 'Kapasitas 2 orang / pasutri dengan area ekstra leluasa.',
                  },
                ].map((opt, idx) => {
                  const isChecked =
                    tipe === opt.value ||
                    (idx === 0 &&
                      tipe &&
                      tipe !== 'Kamar Ganda' &&
                      !tipe.toLowerCase().includes('ganda')) ||
                    (idx === 1 && tipe.toLowerCase().includes('ganda'))
                  return (
                    <label
                      key={opt.value}
                      className={`min-h-[44px] relative p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'bg-primary-50 ring-2 ring-primary-600'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <input
                        ref={idx === 0 ? tipeRef : undefined}
                        type="radio"
                        name="tipe_kamar"
                        value={opt.value}
                        checked={isChecked}
                        onChange={() => {
                          setTipe(opt.value)
                          if (errors.tipe) {
                            setErrors((prev) => ({ ...prev, tipe: '' }))
                          }
                        }}
                        className="mt-1 accent-primary-600"
                      />
                      <span className="flex flex-col">
                        <span className="text-sm leading-[22px] font-semibold text-ink">
                          {opt.value}
                        </span>
                        <span className="text-[11px] leading-4 text-muted">
                          {opt.desc}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
              {errors.tipe && (
                <p
                  id={tipeErrorId}
                  className="text-xs text-status-late font-medium mt-0.5"
                >
                  {errors.tipe}
                </p>
              )}
            </div>
          </Card>

          {/* SECTION 2: Tarif & Ketentuan Sewa */}
          <Card
            padding="none"
            className="p-6 border-0 shadow-sm flex flex-col gap-5 rounded-xl"
          >
            <SectionHeader
              icon={Banknote}
              iconBoxClass="bg-status-paid-bg text-status-paid"
              title="2. Tarif & Ketentuan Sewa"
              subtitle="Penetapan harga sewa, uang jaminan (deposit), dan pembagian utilitas."
              step="Langkah 2/5"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                ref={hargaRef}
                id="inputHargaSewa"
                label="Harga Sewa Bulanan"
                inputMode="numeric"
                prefix="Rp"
                suffix="/ bulan"
                placeholder="1.400.000"
                value={formatThousands(hargaNum)}
                onChange={(e) => {
                  const numeric = parseDigits(e.target.value)
                  setHargaNum(numeric)
                  if (errors.harga) setErrors((prev) => ({ ...prev, harga: '' }))
                }}
                error={errors.harga}
                helperText="Rata-rata tarif sekitar: Rp 1.350.000 - Rp 1.500.000/bln."
                required
              />

              <Input
                id="inputDeposit"
                label="Uang Jaminan / Deposit"
                inputMode="numeric"
                prefix="Rp"
                placeholder="500.000"
                value={formatThousands(depositNum)}
                onChange={(e) => setDepositNum(parseDigits(e.target.value))}
                helperText="Dikembalikan penuh saat penyewa checkout tanpa tunggakan/kerusakan."
              />
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <span className="text-sm leading-[22px] font-semibold text-ink">
                Ketentuan Listrik &amp; Air
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    value: 'token',
                    title: 'Token Mandiri',
                    desc: 'Meteran PLN terpisah per unit',
                  },
                  {
                    value: 'include',
                    title: 'Termasuk Listrik',
                    desc: 'All-in biaya sewa',
                  },
                  {
                    value: 'iuran',
                    title: 'Iuran Flat Tambahan',
                    desc: '+Rp 75.000/bln utilitas',
                  },
                ].map((opt) => {
                  const selected = utilitas === opt.value
                  return (
                    <label
                      key={opt.value}
                      className={`min-h-[44px] flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors ${
                        selected
                          ? 'bg-primary-50 ring-1 ring-primary-600'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <input
                        type="radio"
                        name="utilitas"
                        value={opt.value}
                        checked={selected}
                        onChange={() => setUtilitas(opt.value)}
                        className="accent-primary-600"
                      />
                      <span className="flex flex-col">
                        <span className="text-sm leading-[22px] font-semibold text-ink">
                          {opt.title}
                        </span>
                        <span className="text-[11px] leading-4 text-muted">
                          {opt.desc}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* SECTION 3: Fasilitas Kamar & Bersama */}
          <Card
            padding="none"
            className="p-6 border-0 shadow-sm flex flex-col gap-5 rounded-xl"
          >
            <SectionHeader
              icon={SlidersHorizontal}
              iconBoxClass="bg-primary-100 text-primary-700"
              title="3. Fasilitas Kamar & Bersama"
              subtitle="Pilih fasilitas yang tersedia. Ikon ini akan muncul di kartu ringkasan."
              step="Langkah 3/5"
            />

            <div className="flex flex-wrap gap-2">
              {FACILITY_OPTIONS.map(({ val, label, icon: Icon }) => (
                <FilterChip
                  key={val}
                  label={label}
                  icon={<Icon className="w-[18px] h-[18px]" aria-hidden="true" />}
                  active={fasilitas.includes(val)}
                  onClick={() => toggleFacility(val)}
                  className="min-h-[44px] lg:min-h-0 lg:h-9 rounded-xl px-3 text-sm"
                />
              ))}
            </div>
            <p className="text-[11px] leading-4 text-muted italic">
              Klik chip untuk memilih atau membatalkan pilihan fasilitas.
            </p>
          </Card>

          {/* SECTION 4: Foto & Dokumentasi Kamar */}
          <Card
            padding="none"
            className="p-6 border-0 shadow-sm flex flex-col gap-5 rounded-xl"
          >
            <SectionHeader
              icon={Images}
              iconBoxClass="bg-secondary-fixed text-on-secondary-fixed"
              title="4. Foto & Dokumentasi Kamar"
              subtitle="Tampilkan kondisi ruangan terbaru untuk memudahkan calon penyewa."
              step="Langkah 4/5"
            />

            <div className="border-2 border-dashed border-line rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 hover:border-primary-600 hover:bg-primary-50/20 transition-all cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center text-primary-600 transition-colors">
                <CloudUpload className="w-7 h-7" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm leading-[22px] font-semibold text-ink">
                  Tarik &amp; lepas foto kamar di sini, atau{' '}
                  <span className="text-primary-600 underline">
                    telusuri file
                  </span>
                </p>
                <p className="text-xs leading-[18px] text-muted">
                  Format file didukung: JPG, PNG, WEBP (Maksimal 5MB per file,
                  disarankan min. 2 foto)
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm leading-[22px] font-semibold text-ink">
                Foto Kamar yang Terunggah ({photos.length}/8)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group rounded-xl overflow-hidden aspect-video bg-surface-container shadow-sm"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                    {photo.cover && (
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-primary-600/90 text-on-primary text-[11px] leading-4 font-semibold">
                        Foto Utama
                      </div>
                    )}
                    <button
                      type="button"
                      aria-label={`Hapus ${photo.alt}`}
                      onClick={() =>
                        setPhotos((prev) =>
                          prev.filter((item) => item.id !== photo.id)
                        )
                      }
                      className="absolute top-2 right-2 min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 lg:w-7 lg:h-7 rounded-lg bg-surface/80 hover:bg-error hover:text-on-error text-ink flex items-center justify-center transition-colors shadow cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setPhotos((prev) =>
                      prev.length < 8
                        ? [
                            ...prev,
                            {
                              id: `p-${prev.length + 1}`,
                              src: roomPreview1,
                              alt: `Foto Tambahan ${prev.length + 1}`,
                              cover: false,
                            },
                          ]
                        : prev
                    )
                  }
                  className="min-h-[44px] border border-dashed border-line rounded-xl flex flex-col items-center justify-center gap-1 aspect-video hover:bg-surface-container-low transition-colors text-muted hover:text-primary-600 cursor-pointer"
                >
                  <ImagePlus className="w-6 h-6" aria-hidden="true" />
                  <span className="text-[11px] leading-4">Tambah Foto</span>
                </button>
              </div>
            </div>
          </Card>

          {/* SECTION 5: Status Kesiapan & Catatan Pengelola */}
          <Card
            padding="none"
            className="p-6 border-0 shadow-sm flex flex-col gap-5 rounded-xl"
          >
            <SectionHeader
              icon={ClipboardCheck}
              iconBoxClass="bg-status-repair-bg text-status-repair"
              title="5. Status Kesiapan & Catatan Pengelola"
              subtitle="Tentukan status awal publikasi kamar dan memo internal Pak Bambang."
              step="Langkah 5/5"
            />

            <div className="flex flex-col gap-1.5">
              <span className="text-sm leading-[22px] font-semibold text-ink">
                Status Ketersediaan Awal
              </span>

              {isOccupiedLocked && (
                <p className="text-xs leading-[18px] text-primary-700 bg-primary-50 px-3 py-2 rounded-lg">
                  Kamar ini sedang berstatus <strong>Terisi</strong> oleh{' '}
                  <strong>{penghuni || 'penghuni'}</strong>. Status tetap Terisi
                  dan hanya dapat diubah saat penghuni check-out.
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`min-h-[44px] p-3 rounded-xl flex items-center gap-3 transition-colors ${
                    isOccupiedLocked
                      ? 'opacity-50 cursor-not-allowed bg-app-bg'
                      : status === 'tersedia'
                        ? 'bg-status-paid-bg/60 ring-2 ring-status-paid cursor-pointer'
                        : 'bg-surface-container-low hover:bg-surface-container cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name="status_awal"
                    value="tersedia"
                    disabled={isOccupiedLocked}
                    checked={!isOccupiedLocked && status === 'tersedia'}
                    onChange={() => setStatus('tersedia')}
                    className="accent-status-paid"
                  />
                  <span className="flex flex-col">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-status-paid" />
                      <span className="text-sm leading-[22px] font-semibold text-ink">
                        Siap Huni (Tersedia)
                      </span>
                    </span>
                    <span className="text-[11px] leading-4 text-muted">
                      Kamar bersih &amp; langsung dapat disewakan sekarang.
                    </span>
                  </span>
                </label>

                <label
                  className={`min-h-[44px] p-3 rounded-xl flex items-center gap-3 transition-colors ${
                    isOccupiedLocked
                      ? 'opacity-50 cursor-not-allowed bg-app-bg'
                      : status === 'perbaikan'
                        ? 'bg-status-repair-bg/60 ring-2 ring-status-repair cursor-pointer'
                        : 'bg-surface-container-low hover:bg-surface-container cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name="status_awal"
                    value="perbaikan"
                    disabled={isOccupiedLocked}
                    checked={!isOccupiedLocked && status === 'perbaikan'}
                    onChange={() => setStatus('perbaikan')}
                    className="accent-status-repair"
                  />
                  <span className="flex flex-col">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-status-repair" />
                      <span className="text-sm leading-[22px] font-semibold text-ink">
                        Dalam Persiapan / Perbaikan
                      </span>
                    </span>
                    <span className="text-[11px] leading-4 text-muted">
                      Sedang pengecatan, pembersihan AC, atau renovasi.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <Textarea
              id="inputCatatan"
              label="Catatan Khusus Pengelola"
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Baru dicat warna broken white, kunci cadangan berada di gantungan laci pos pengelola."
              helperText="Catatan internal (hanya pemilik)"
            />
          </Card>

          {/* Mobile / Below-1024px Inline Action Bar */}
          <div className="flex flex-col gap-2 lg:hidden">
            {draftNotice && (
              <p className="text-xs text-primary-700 bg-primary-50 p-2.5 rounded-lg">
                {draftNotice}
              </p>
            )}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={submitting}
              icon={<CheckCircle2 className="w-[18px] h-[18px]" aria-hidden="true" />}
            >
              {isEdit ? 'Simpan Perubahan' : 'Simpan & Terbitkan Kamar'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleNavigateBack}
            >
              Batal
            </Button>
          </div>
        </form>

        {/* Right Column: Live Sticky Preview */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted">
              <Eye className="w-[18px] h-[18px] text-primary-600" aria-hidden="true" />
              <span className="text-[11px] leading-4 font-semibold uppercase tracking-wider text-ink">
                Pratinjau Kartu Kamar
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] leading-4 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Langsung Sinkron
            </span>
          </div>

          <Card padding="none" className="overflow-hidden shadow-md border-0 rounded-xl">
            <div className="relative w-full h-44 bg-surface-container overflow-hidden">
              <img
                src={photos[0]?.src || roomPreview1}
                alt="Pratinjau Kamar"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <StatusBadge status={statusBadgeKey} />
                <span className="px-2 py-1 rounded-full bg-surface/90 text-ink text-[11px] leading-4 font-semibold shadow-sm">
                  Lantai {lantai}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-surface/90 shadow-sm flex items-baseline gap-1">
                <span className="text-[11px] leading-4 text-muted">Tarif:</span>
                <span className="text-sm leading-[22px] font-semibold text-primary-700 tabular-nums">
                  {previewPrice}
                </span>
                <span className="text-[11px] leading-4 text-muted">/bln</span>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg leading-[26px] font-bold text-ink">
                    {previewTitle}
                  </h3>
                  <p className="text-xs leading-[18px] text-muted">
                    {previewSub}
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-muted"
                  title="Unit Mandiri"
                >
                  <Zap className="w-[18px] h-[18px]" aria-hidden="true" />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {fasilitas.length === 0 ? (
                  <span className="text-[11px] leading-4 text-muted">
                    Belum ada fasilitas dipilih
                  </span>
                ) : (
                  <>
                    {fasilitas.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded-lg bg-surface-container text-ink text-[11px] leading-4"
                      >
                        {item}
                      </span>
                    ))}
                    {fasilitas.length > 3 && (
                      <span className="px-2 py-0.5 rounded-lg bg-surface-container text-ink text-[11px] leading-4">
                        +{fasilitas.length - 3} lainnya
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className="h-px bg-surface-container w-full my-0.5" />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-muted shrink-0">
                    <UserX className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs leading-[18px] font-semibold text-ink truncate">
                      {penghuni || 'Belum Ada Penghuni'}
                    </span>
                    <span className="text-[11px] leading-4 text-muted truncate">
                      {penghuni
                        ? 'Penghuni aktif terdaftar'
                        : 'Siap dihubungkan ke penyewa'}
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="border-0 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-xl"
                >
                  Detail
                </Button>
              </div>
            </div>
          </Card>

          {/* Helpful Tips Box */}
          <Card padding="none" className="p-4 border-0 shadow-sm rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary-600">
              <Lightbulb className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm leading-[22px] font-semibold text-ink">
                Tips Pengisian Unit Kos
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Penamaan kamar berurutan (misal: 13, 14, 15) mempermudah petugas
              saat mencatat meteran listrik mandiri dan mengirimkan penagihan
              tagihan WhatsApp bulanan secara otomatis.
            </p>
            <div className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between">
              <span className="text-[11px] leading-4 text-muted">
                Kapasitas Kos Saat Ini:
              </span>
              <span className="text-[11px] leading-4 font-semibold text-ink">
                {occupiedCount} Terisi / {totalCount} Terdaftar
              </span>
            </div>
          </Card>

          {/* Summary Mini Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card padding="none" className="p-3 border-0 shadow-sm rounded-xl flex flex-col">
              <span className="text-[11px] leading-4 text-muted">
                Target Okupansi
              </span>
              <span className="text-lg leading-[26px] font-bold text-ink mt-1">
                100%
              </span>
              <span className="text-[11px] leading-4 text-status-paid flex items-center gap-0.5 mt-0.5">
                <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                +1 Kamar
              </span>
            </Card>
            <Card padding="none" className="p-3 border-0 shadow-sm rounded-xl flex flex-col">
              <span className="text-[11px] leading-4 text-muted">
                Proyeksi Omset
              </span>
              <span className="text-lg leading-[26px] font-bold text-primary-600 mt-1 tabular-nums">
                {previewOmsetM}
              </span>
              <span className="text-[11px] leading-4 text-muted mt-0.5">
                per bulan
              </span>
            </Card>
          </div>
        </div>
      </div>

      {/* Desktop Persistent Sticky Action Bar */}
      <div className="hidden lg:block fixed bottom-0 left-64 right-0 bg-surface/95 backdrop-blur-xl shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30 px-8 py-3">
        <div className="max-w-[1024px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-status-paid animate-ping" />
            <div className="flex flex-col">
              <span className="text-sm leading-[22px] font-semibold text-ink">
                {draftNotice || 'Draf Otomatis Tersimpan'}
              </span>
              <span className="text-[11px] leading-4 text-muted">
                Perubahan terakhir 1 menit lalu
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleNavigateBack}
              className="border-0 text-muted hover:bg-surface-container shadow-none px-5 rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDraftNotice('Draf kamar tersimpan sementara.')}
              icon={<Save className="w-[18px] h-[18px]" aria-hidden="true" />}
              className="border-0 bg-surface-container hover:bg-surface-container-high text-ink shadow-sm px-5 rounded-xl"
            >
              Simpan Draf
            </Button>
            <Button
              type="submit"
              form="tambahKamarForm"
              variant="primary"
              loading={submitting}
              icon={<CheckCircle2 className="w-[18px] h-[18px]" aria-hidden="true" />}
              className="px-6 rounded-xl shadow-md"
            >
              {isEdit ? 'Simpan Perubahan' : 'Simpan & Terbitkan Kamar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
