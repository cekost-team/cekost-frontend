import { useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  IdCard,
  Info,
  KeyRound,
  Smartphone,
  Star,
  User,
  Wallet,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../api/auth'
import cekostLogo from '../assets/cekost-logo.png'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()

  // Tab peran hanya visual: tidak memengaruhi payload atau alur autentikasi API
  const [activeRole, setActiveRole] = useState('owner')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [infoNotice, setInfoNotice] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setInfoNotice('')
    setLoading(true)

    try {
      if (typeof auth?.login === 'function') {
        await auth.login(email, password)
      } else {
        const result = await apiLogin({ email, password })
        if (result?.token) {
          localStorage.setItem('cekost_token', result.token)
        }
      }

      if (rememberMe) {
        localStorage.setItem('cekost_remember_role', activeRole)
      }

      const targetDestination =
        location.state?.from?.pathname || location.state?.from || '/'
      navigate(targetDestination, { replace: true })
    } catch (err) {
      setErrorMessage(
        err?.message ||
          'Email atau kata sandi salah. Periksa kembali dan coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app-bg font-sans text-sm leading-[22px] text-ink flex flex-col justify-between selection:bg-primary-100 selection:text-primary-700">
      <main className="w-full flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="flex flex-col w-full max-w-6xl mx-auto my-auto py-5">
          <Card
            padding="none"
            className="w-full shadow-xl border-0 grid grid-cols-1 lg:grid-cols-12 min-h-[640px]"
          >
            {/* Sisi Kiri: Branding & Showcase Fitur SaaS CeKost (Desktop >= 1024px) */}
            <div className="hidden lg:flex lg:col-span-5 bg-primary-600 text-on-primary p-8 flex-col justify-between relative overflow-hidden">
              <div
                className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-700/40 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute -left-16 top-10 w-60 h-60 bg-primary-500/30 rounded-full blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              {/* Top Header Brand & Badge */}
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface/15 backdrop-blur-md rounded-full text-on-primary">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
                  <span className="text-[11px] leading-4 font-semibold tracking-wide uppercase">
                    Sistem Manajemen Properti Kos Modern
                  </span>
                </div>

                <div>
                  <h2 className="text-[28px] leading-[36px] font-bold text-on-primary tracking-tight">
                    Otomatisasi Kos,
                    <br />
                    Bebas Ribet Tagihan.
                  </h2>
                  <p className="mt-2 text-sm leading-[22px] text-primary-100/90">
                    Platform terpadu untuk pemilik properti mengontrol okupansi
                    dan penghuni memantau kuitansi pembayaran secara real-time.
                  </p>
                </div>
              </div>

              {/* Highlights Key Features */}
              <div className="relative z-10 my-6 space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/10 backdrop-blur-sm transition-all hover:bg-surface/15">
                  <div className="w-10 h-10 rounded-lg bg-surface/20 flex items-center justify-center shrink-0">
                    <Smartphone
                      className="w-[22px] h-[22px] text-on-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm leading-[22px] font-semibold text-on-primary">
                      Notifikasi Tagihan WhatsApp
                    </h4>
                    <p className="text-xs leading-[18px] text-primary-100/80">
                      Kirim tautan pembayaran otomatis tanpa perlu menyalin pesan
                      manual satu per satu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/10 backdrop-blur-sm transition-all hover:bg-surface/15">
                  <div className="w-10 h-10 rounded-lg bg-surface/20 flex items-center justify-center shrink-0">
                    <Wallet
                      className="w-[22px] h-[22px] text-on-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm leading-[22px] font-semibold text-on-primary">
                      Rekap Okupansi &amp; Finansial
                    </h4>
                    <p className="text-xs leading-[18px] text-primary-100/80">
                      Laporan pemasukan transparan, kalkulasi sewa parsial, dan
                      data kamar kosong instan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/10 backdrop-blur-sm transition-all hover:bg-surface/15">
                  <div className="w-10 h-10 rounded-lg bg-surface/20 flex items-center justify-center shrink-0">
                    <BadgeCheck
                      className="w-[22px] h-[22px] text-on-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm leading-[22px] font-semibold text-on-primary">
                      Kuitansi Digital Sah
                    </h4>
                    <p className="text-xs leading-[18px] text-primary-100/80">
                      Penghuni menerima bukti pembayaran resmi ber-QR Code untuk
                      arsip langsung.
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial Quote */}
              <div className="relative z-10 pt-3">
                <div className="p-4 rounded-xl bg-surface/10 backdrop-blur-md">
                  <div
                    className="flex items-center gap-1 text-secondary-fixed mb-1"
                    aria-label="Rating 5 dari 5 bintang"
                  >
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <Star
                        key={idx}
                        className="w-[18px] h-[18px] fill-current"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-[22px] italic text-on-primary/95">
                    &ldquo;CeKost memudahkan penagihan sewa bulanan dan
                    transparansi catatan kuitansi digital secara otomatis. Waktu
                    penagihan terpangkas hingga 80%.&rdquo;
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface text-primary-600 text-lg leading-[26px] font-semibold flex items-center justify-center shadow-sm shrink-0">
                      H
                    </div>
                    <div>
                      <p className="text-sm leading-[22px] font-semibold text-on-primary">
                        Hj. Rachmat Setiadi
                      </p>
                      <p className="text-xs leading-[18px] text-primary-100/75 mt-0.5">
                        Pemilik Kos Griya Asri • 34 Kamar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Formulir Autentikasi Terpadu */}
            <div className="col-span-1 lg:col-span-7 p-5 sm:p-6 md:p-8 flex flex-col justify-between bg-surface">
              <div className="max-w-md w-full mx-auto">
                {/* Header Logo & Identity */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={cekostLogo}
                      alt="CeKost Logo"
                      className="h-10 w-10 object-contain rounded-lg shrink-0"
                    />
                    <div>
                      <span className="text-[22px] leading-[30px] text-primary-600 tracking-tight font-bold block">
                        CeKost
                      </span>
                      <span className="text-[11px] leading-4 font-medium text-muted mt-1 block">
                        Sistem Otomasi Tagihan &amp; Kamar
                      </span>
                    </div>
                  </div>
                </div>

                {/* Greeting & Subtext */}
                <div className="mb-5">
                  <h1 className="text-[22px] leading-[30px] text-ink font-bold">
                    Selamat Datang di CeKost
                  </h1>
                  <p className="text-sm leading-[22px] text-muted mt-1">
                    Kelola kos lebih tertata, sewa hunian lebih nyaman.
                  </p>
                </div>

                {/* Role Switcher Tabs (Visual Only) */}
                <div
                  className="bg-surface-container-low p-1.5 rounded-xl mb-5 flex items-center gap-1.5"
                  role="tablist"
                  aria-label="Pilih peran tampilan masuk"
                >
                  <button
                    type="button"
                    role="tab"
                    id="tab-owner"
                    aria-selected={activeRole === 'owner'}
                    onClick={() => {
                      setActiveRole('owner')
                      setErrorMessage('')
                      setInfoNotice('')
                    }}
                    className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-lg text-sm leading-[22px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeRole === 'owner'
                        ? 'text-on-primary bg-primary-600 shadow-sm'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <Building2 className="w-[18px] h-[18px]" aria-hidden="true" />
                    <span>Pemilik Kos</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    id="tab-tenant"
                    aria-selected={activeRole === 'tenant'}
                    onClick={() => {
                      setActiveRole('tenant')
                      setErrorMessage('')
                      setInfoNotice('')
                    }}
                    className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-lg text-sm leading-[22px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeRole === 'tenant'
                        ? 'text-on-primary bg-primary-600 shadow-sm'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <User className="w-[18px] h-[18px]" aria-hidden="true" />
                    <span>Penghuni Kos</span>
                  </button>
                </div>

                {/* Context Role Banner */}
                <div
                  id="role-context-banner"
                  className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-xs leading-[18px] ${
                    activeRole === 'owner'
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-status-paid-bg text-secondary'
                  }`}
                >
                  <Info className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
                  <span>
                    {activeRole === 'owner'
                      ? 'Mode Pemilik: Kelola kamar, monitor arus kas, dan kirim tagihan sewa.'
                      : 'Mode Penghuni: Cek tagihan berjalan, rincian kamar, dan unduh kuitansi resmi.'}
                  </span>
                </div>

                {/* Form Input Fields */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div
                      role="alert"
                      className="bg-status-late-bg border border-status-late/30 text-status-late rounded-control p-3 text-xs font-medium leading-[18px]"
                    >
                      {errorMessage}
                    </div>
                  )}

                  {infoNotice && (
                    <div
                      role="status"
                      className="bg-primary-50 text-primary-700 rounded-control p-3 text-xs font-medium leading-[18px]"
                    >
                      {infoNotice}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="identifier-input"
                      className="block text-sm leading-[22px] font-semibold text-ink mb-1.5"
                    >
                      Email atau No. WhatsApp
                    </label>
                    <Input
                      id="identifier-input"
                      type="text"
                      placeholder={
                        activeRole === 'owner'
                          ? 'nama@email.com atau 08123456789'
                          : '0812xxxx (No. HP terdaftar pada kos)'
                      }
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      prefix={
                        <IdCard
                          className="w-5 h-5 text-muted"
                          aria-hidden="true"
                        />
                      }
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="password-input"
                        className="text-sm leading-[22px] font-semibold text-ink"
                      >
                        Kata Sandi
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setInfoNotice(
                            'Hubungi pemilik kos atau admin CeKost untuk pemulihan kata sandi akun Anda.'
                          )
                        }
                        className="min-h-[44px] lg:min-h-0 inline-flex items-center text-xs leading-[18px] text-primary-600 hover:text-primary-700 font-medium hover:underline cursor-pointer"
                      >
                        Lupa Kata Sandi?
                      </button>
                    </div>
                    <Input
                      id="password-input"
                      type="password"
                      placeholder="Masukkan kata sandi akun"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      prefix={
                        <KeyRound
                          className="w-5 h-5 text-muted"
                          aria-hidden="true"
                        />
                      }
                      required
                    />
                  </div>

                  {/* Remember me & Session info */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="min-h-[44px] lg:min-h-0 flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 accent-primary-600 cursor-pointer"
                      />
                      <span className="text-xs leading-[18px] text-muted">
                        Ingat saya di perangkat ini
                      </span>
                    </label>
                    <span className="text-[11px] leading-4 font-medium text-disabled">
                      Sesi 30 hari aktif
                    </span>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    loading={loading}
                    icon={<ArrowRight className="w-[18px] h-[18px]" />}
                    className="shadow-md shadow-primary-600/20"
                  >
                    Masuk ke Akun
                  </Button>
                </form>
              </div>

              {/* Card Footer Links */}
              <div className="max-w-md w-full mx-auto mt-5 pt-4 text-center">
                <div className="flex items-center justify-center gap-3 text-[11px] leading-4 font-medium text-disabled">
                  <button
                    type="button"
                    onClick={() =>
                      setInfoNotice(
                        'Syarat & Ketentuan CeKost tersedia melalui pengelola properti kos Anda.'
                      )
                    }
                    className="min-h-[44px] lg:min-h-0 inline-flex items-center hover:text-muted cursor-pointer"
                  >
                    Syarat &amp; Ketentuan
                  </button>
                  <span aria-hidden="true">•</span>
                  <button
                    type="button"
                    onClick={() =>
                      setInfoNotice(
                        'Bantuan WhatsApp tersedia melalui kontak resmi pengelola kos Anda.'
                      )
                    }
                    className="min-h-[44px] lg:min-h-0 inline-flex items-center hover:text-muted cursor-pointer"
                  >
                    Bantuan WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <footer className="w-full py-4 text-center">
        <p className="text-xs leading-[18px] text-muted">
          &copy; 2025 CeKost. Kelola kos &amp; tagihan lebih praktis.
        </p>
      </footer>
    </div>
  )
}
