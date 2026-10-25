import { useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import StatusBadge from '../components/StatusBadge'

export default function ComponentPreview() {
  const [clickCount, setClickCount] = useState(0)
  const [textVal, setTextVal] = useState('')
  const [passwordVal, setPasswordVal] = useState('rahasia123')
  const [nominalVal, setNominalVal] = useState('1.500.000')

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
            Katalog Komponen (Batch 1)
          </h1>
          <p className="text-sm text-muted">
            Pratinjau visual dan interaktif untuk Button, Input, Card, dan
            StatusBadge.
          </p>
        </header>

        {/* 1. Tombol (Button) */}
        <section className="space-y-4">
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
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                }
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
