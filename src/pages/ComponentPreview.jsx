import { useState } from 'react'
import {
  CheckCircle2,
  Clock,
  Filter,
  Receipt,
  Search,
} from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import FilterChip from '../components/FilterChip'
import Input from '../components/Input'
import SearchBar from '../components/SearchBar'
import StatusBadge from '../components/StatusBadge'
import SummaryCard from '../components/SummaryCard'

export default function ComponentPreview() {
  const [clickCount, setClickCount] = useState(0)
  const [textVal, setTextVal] = useState('')
  const [passwordVal, setPasswordVal] = useState('rahasia123')
  const [nominalVal, setNominalVal] = useState('1.500.000')

  // State untuk Batch 2
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const filterOptions = [
    { id: 'all', label: 'Semua', count: 12 },
    { id: 'unpaid', label: 'Belum Bayar', count: 2 },
    { id: 'late', label: 'Telat', count: 2 },
    { id: 'partial', label: 'Sebagian', count: 1 },
    { id: 'paid', label: 'Lunas', count: 7 },
  ]

  return (
    <div className="min-h-screen bg-app-bg text-ink p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-line pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-bold text-primary-600">CeKost</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-600 font-semibold">
              Design System Preview
            </span>
          </div>
          <h1 className="text-2xl font-bold text-ink">
            Katalog Komponen (Batch 1 & Batch 2)
          </h1>
          <p className="text-sm text-muted">
            Pratinjau visual dan interaktif untuk Button, Input, Card, StatusBadge,
            SearchBar, FilterChip, dan SummaryCard.
          </p>
        </header>

        {/* ================= BATCH 2 COMPONENTS ================= */}

        {/* 5. Kolom Pencarian (SearchBar) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">
              5. Kolom Pencarian (SearchBar)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 font-semibold">
              Batch 2
            </span>
          </div>

          <Card title="Pencarian Interaktif">
            <div className="space-y-3">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama penghuni atau nomor kamar..."
              />

              <div className="text-xs text-muted flex items-center justify-between">
                <span>
                  Status query:{' '}
                  <strong className="text-ink">
                    {searchQuery ? `"${searchQuery}"` : '(Kosong)'}
                  </strong>
                </span>
                {searchQuery && (
                  <span className="text-primary-600 font-medium">
                    Ketik teks lalu klik ikon silang (X) untuk menghapus
                  </span>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* 6. Chip Filter (FilterChip) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">
              6. Chip Filter (FilterChip)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 font-semibold">
              Batch 2
            </span>
          </div>

          <Card
            title="Daftar Filter Status (Tagihan)"
            subtitle="Tinggi 32px (h-8), bentuk kapsul, dapat diklik secara interaktif"
          >
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
              <div className="flex items-center text-muted text-xs pr-1 shrink-0">
                <Filter className="w-3.5 h-3.5 mr-1" />
                <span>Filter:</span>
              </div>
              {filterOptions.map((opt) => (
                <FilterChip
                  key={opt.id}
                  label={opt.label}
                  count={opt.count}
                  active={activeFilter === opt.id}
                  onClick={() => setActiveFilter(opt.id)}
                />
              ))}
            </div>

            <div className="text-xs text-muted mt-3 pt-3 border-t border-line">
              Filter aktif saat ini:{' '}
              <strong className="text-primary-600 uppercase font-semibold">
                {activeFilter}
              </strong>
            </div>
          </Card>
        </section>

        {/* 7. Kartu Ringkasan (SummaryCard) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">
              7. Kartu Ringkasan (SummaryCard)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 font-semibold">
              Batch 2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard
              label="TOTAL DITAGIH"
              value="Rp 16.500.000"
              tone="default"
              icon={<Receipt className="w-4 h-4" />}
              subtext="12 Kamar Terdaftar • Nov 2026"
            />

            <SummaryCard
              label="SUDAH DITERIMA"
              value="Rp 12.800.000"
              tone="success"
              icon={<CheckCircle2 className="w-4 h-4" />}
              subtext="77.5% tertagih (8 kos)"
            />

            <SummaryCard
              label="SISA TUNGGAKAN"
              value="Rp 3.700.000"
              tone="danger"
              icon={<Clock className="w-4 h-4" />}
              subtext="4 kos menunggak sewa"
            />
          </div>

          <SummaryCard
            label="KARTU RINGKASAN INTERAKTIF"
            value="18 / 20 Kamar"
            tone="default"
            subtext="Tingkat okupansi hunian 90% (Klik kartu ini untuk menguji interaktivitas)"
            onClick={() => alert('Kartu ringkasan diklik!')}
          />
        </section>

        {/* ================= BATCH 1 COMPONENTS ================= */}

        {/* 1. Tombol (Button) */}
        <section className="space-y-4 pt-4 border-t border-line">
          <h2 className="text-lg font-bold text-ink">1. Tombol (Button)</h2>
          <Card title="Varian Utama (Tinggi 44px - h-11)" subtitle="Tinggi standar kontrol formulir">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary (Simpan)</Button>
              <Button variant="secondary">Secondary (Batal)</Button>
              <Button variant="danger">Danger (Hapus / Check-out)</Button>
            </div>
          </Card>

          <Card title="Ukuran Kecil (Tinggi 32px - h-8)" subtitle="Dipakai untuk aksi di dalam kartu">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">
                Kirim Pengingat
              </Button>
              <Button variant="secondary" size="sm">
                Lihat Tagihan
              </Button>
              <Button variant="danger" size="sm">
                Hapus
              </Button>
            </div>
          </Card>

          <Card title="Kondisi Status (Loading & Disabled)">
            <div className="flex flex-wrap items-center gap-3">
              <Button loading>Memproses</Button>
              <Button variant="secondary" loading>
                Memproses
              </Button>
              <Button disabled>Disabled</Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
            </div>
          </Card>

          <Card title="Dengan Ikon & Lebar Penuh (Full Width)">
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                icon={<Search className="w-4 h-4" />}
              >
                Masuk ke Akun
              </Button>
            </div>
          </Card>
        </section>

        {/* 2. Kolom Input */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-ink">2. Kolom Input</h2>
          <Card title="Varian & State Formulir">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                placeholder="Contoh: Budi Santoso"
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                helperText="Sesuai kartu identitas resmi (KTP)"
              />

              <Input
                label="Email Pengelola"
                placeholder="nama@email.com"
                required
                helperText="Wajib untuk menerima laporan bulanan"
              />

              <Input
                label="Kata Sandi"
                type="password"
                value={passwordVal}
                onChange={(e) => setPasswordVal(e.target.value)}
                required
                helperText="Klik ikon mata untuk memeriksa sandi"
              />

              <Input
                label="Nomor WhatsApp"
                placeholder="81234567890"
                prefix="+62"
                required
              />

              <Input
                label="Nominal Sewa"
                value={nominalVal}
                onChange={(e) => setNominalVal(e.target.value)}
                prefix="Rp"
                suffix="/ bulan"
              />

              <Input
                label="Nomor Kamar (Dengan Galat Validasi)"
                placeholder="Misal: 101"
                error="Nomor kamar ini sudah terdaftar."
                defaultValue="04"
              />

              <Input
                label="Status Input Nonaktif"
                placeholder="Tidak dapat diubah"
                disabled
                defaultValue="Kamar Utama 01"
              />
            </div>
          </Card>
        </section>

        {/* 3. Lencana Status (StatusBadge) */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-ink">
            3. Lencana Status (StatusBadge)
          </h2>
          <Card title="Kategori Tagihan & Keuangan">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="lunas" />
              <StatusBadge status="sebagian" />
              <StatusBadge status="belum_bayar" />
              <StatusBadge status="telat" />
              <StatusBadge status="telat" label="Telat 4 Hari" />
            </div>
          </Card>

          <Card title="Kategori Kamar">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="tersedia" />
              <StatusBadge status="terisi" />
              <StatusBadge status="perbaikan" />
            </div>
          </Card>

          <Card title="Kategori Penghuni & Pengingat WhatsApp">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="aktif" />
              <StatusBadge status="pindah" />
              <StatusBadge status="terkirim" />
              <StatusBadge status="gagal" />
            </div>
          </Card>

          <Card title="Status Tidak Dikenal (Fallback Abu-abu Netral + Console Warn)">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="menunggu_konfirmasi" />
              <StatusBadge status="pending" label="Tertunda" />
            </div>
          </Card>
        </section>

        {/* 4. Kartu (Card) */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-ink">4. Kartu (Card)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              title="Kamar 01"
              subtitle="Lantai 1 • Tipe Deluxe"
              action={<StatusBadge status="terisi" />}
            >
              <div className="text-sm text-muted mt-2">
                Penghuni: <strong className="text-ink">Ahmad Fikri</strong>
              </div>
              <div className="text-sm font-semibold text-ink mt-1">
                Rp 1.500.000 / bln
              </div>
            </Card>

            <Card
              title="Tagihan Jatuh Tempo"
              subtitle="Periode November 2026"
              accent="late"
              action={<StatusBadge status="telat" label="Telat 2 Hari" />}
            >
              <div className="text-sm text-muted mt-2">
                Kamar 04 • Rian Pratama
              </div>
              <div className="text-base font-bold text-status-late mt-1">
                Rp 1.200.000
              </div>
            </Card>

            <Card
              title="Aksen Sebagian"
              subtitle="Menunggu pelunasan sisa"
              accent="partial"
              action={<StatusBadge status="sebagian" />}
            >
              <div className="text-sm text-muted mt-1">
                Sisa tunggakan: Rp 500.000
              </div>
            </Card>

            <Card
              title="Aksen Lunas"
              subtitle="Pembayaran berhasil diverifikasi"
              accent="paid"
              action={<StatusBadge status="lunas" />}
            >
              <div className="text-sm text-status-paid font-semibold mt-1">
                Diterima via Transfer Bank
              </div>
            </Card>
          </div>

          <Card
            title="Kartu Interaktif (Bisa Diklik & Navigasi Keyboard)"
            subtitle="Memiliki role='button', tabIndex={0}, dan handler Enter/Spasi"
            onClick={() => setClickCount((c) => c + 1)}
          >
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted">
                Jumlah klik kartu atau tombol Enter/Spasi:
              </span>
              <span className="font-bold text-primary-600 text-base">
                {clickCount} kali
              </span>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
