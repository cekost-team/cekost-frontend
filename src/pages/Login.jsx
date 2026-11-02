import { useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Building2,
  Info,
  Lock,
  Mail,
  MessageSquare,
  Receipt,
  Star,
  User,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../api/auth'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()

  // Tab peran: 'owner' (Pemilik Kos) atau 'tenant' (Penghuni)
  const [activeRole, setActiveRole] = useState('owner')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
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

      const targetDestination = location.state?.from?.pathname || '/'
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
    <div className="min-h-screen bg-app-bg text-ink flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-primary-100 selection:text-primary-700">
      <div className="w-full max-w-6xl mx-auto my-auto py-4">
        {/* Wadah Kartu Utama Split-Layout (Sesuai Stitch Layar Desktop) */}
        <div className="w-full bg-surface rounded-card shadow-xl border border-line overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* ================= SISI KIRI: BRANDING & FITUR SAAS (DESKTOP) ================= */}
          <div className="hidden lg:flex lg:col-span-5 bg-primary-600 text-white p-8 xl:p-10 flex-col justify-between relative overflow-hidden">
            {/* Background Decorative Aura */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-700/50 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-16 top-10 w-60 h-60 bg-primary-500/30 rounded-full blur-2xl pointer-events-none"></div>

            {/* Top Header Brand & Badge */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-white text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary-100 animate-pulse"></span>
                <span className="uppercase tracking-wider">
                  Sistem Manajemen Properti Kos Modern
                </span>
              </div>

              <div>
                <h2 className="text-2xl xl:text-3xl font-bold text-white tracking-tight leading-tight">
                  Otomatisasi Kos,
                  <br />
                  Bebas Ribet Tagihan.
                </h2>
                <p className="mt-2 text-xs xl:text-sm text-primary-100/90 leading-relaxed">
                  Platform terpadu untuk pemilik kos mengontrol okupansi dan penghuni memantau kuitansi pembayaran secara real-time.
                </p>
              </div>
            </div>

            {/* Highlights Key Features */}
            <div className="relative z-10 my-6 space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-control bg-white/10 backdrop-blur-sm transition-all hover:bg-white/15">
                <div className="w-9 h-9 rounded-control bg-white/20 flex items-center justify-center shrink-0 text-white">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs xl:text-sm text-white">
                    Notifikasi Tagihan WhatsApp
                  </h3>
                  <p className="text-[11px] xl:text-xs text-primary-100/80 mt-0.5 leading-snug">
                    Kirim tautan pembayaran otomatis tanpa perlu menyalin pesan manual satu per satu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-control bg-white/10 backdrop-blur-sm transition-all hover:bg-white/15">
                <div className="w-9 h-9 rounded-control bg-white/20 flex items-center justify-center shrink-0 text-white">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs xl:text-sm text-white">
                    Rekap Okupansi &amp; Finansial
                  </h3>
                  <p className="text-[11px] xl:text-xs text-primary-100/80 mt-0.5 leading-snug">
                    Laporan pemasukan transparan, kalkulasi sewa, dan data kamar kosong instan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-control bg-white/10 backdrop-blur-sm transition-all hover:bg-white/15">
                <div className="w-9 h-9 rounded-control bg-white/20 flex items-center justify-center shrink-0 text-white">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs xl:text-sm text-white">
                    Kuitansi Digital Sah
                  </h3>
                  <p className="text-[11px] xl:text-xs text-primary-100/80 mt-0.5 leading-snug">
                    Penghuni menerima bukti pembayaran resmi untuk transparansi arsip bersama.
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="relative z-10 pt-2">
              <div className="p-4 rounded-control bg-white/10 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-1 text-primary-100 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-current text-primary-100"
                    />
                  ))}
                </div>
                <p className="text-xs italic text-white/95 leading-relaxed">
                  &ldquo;CeKost memudahkan penagihan sewa bulanan dan transparansi catatan kuitansi digital secara otomatis. Waktu penagihan terpangkas hingga 80%.&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-surface text-primary-600 font-bold text-xs flex items-center justify-center shadow-xs">
                    H
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-white leading-none">
                      Hj. Rachmat Setiadi
                    </p>
                    <p className="text-[11px] text-primary-100/75 mt-0.5">
                      Pemilik Kos Griya Asri • 34 Kamar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= SISI KANAN: FORMULIR AUTENTIKASI ================= */}
          <div className="col-span-1 lg:col-span-7 p-6 sm:p-8 xl:p-12 flex flex-col justify-between bg-surface">
            <div className="max-w-md w-full mx-auto my-auto">
              {/* Header Logo & Identitas */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-control bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-lg shadow-xs border border-line">
                    CK
                  </div>
                  <div>
                    <span className="text-xl font-bold text-primary-600 tracking-tight block leading-none">
                      CeKost
                    </span>
                    <span className="text-xs text-muted mt-1 block">
                      Sistem Otomasi Tagihan &amp; Kamar
                    </span>
                  </div>
                </div>
              </div>

              {/* Greeting & Subtext */}
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-ink">
                  Selamat Datang di CeKost
                </h1>
                <p className="text-xs sm:text-sm text-muted mt-1">
                  Kelola kos lebih tertata, sewa hunian lebih nyaman.
                </p>
              </div>

              {/* Role Switcher Tabs (Segmented Control) */}
              <div
                className="bg-app-bg p-1.5 rounded-control mb-5 flex items-center gap-1.5 border border-line"
                role="tablist"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeRole === 'owner' ? 'true' : 'false'}
                  onClick={() => {
                    setActiveRole('owner')
                    setErrorMessage('')
                  }}
                  className={`flex-1 h-11 rounded-control font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer select-none ${
                    activeRole === 'owner'
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  <span>Pemilik Kos</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeRole === 'tenant' ? 'true' : 'false'}
                  onClick={() => {
                    setActiveRole('tenant')
                    setErrorMessage('')
                  }}
                  className={`flex-1 h-11 rounded-control font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer select-none ${
                    activeRole === 'tenant'
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Penghuni Kos</span>
                </button>
              </div>

              {/* Context Role Banner */}
              <div className="mb-5 p-3 rounded-control bg-primary-50 text-primary-700 flex items-start gap-2.5 text-xs border border-line">
                <Info className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
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
                    className="bg-status-late-bg border border-status-late/30 text-status-late rounded-control p-3 text-xs font-medium leading-relaxed"
                  >
                    {errorMessage}
                  </div>
                )}

                <Input
                  label="Email atau No. WhatsApp"
                  type="text"
                  placeholder={
                    activeRole === 'owner'
                      ? 'nama@email.com atau 08123456789'
                      : '0812xxxx (No. WhatsApp terdaftar)'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  prefix={<Mail className="h-4 w-4 text-muted" />}
                  required
                />

                <Input
                  label="Kata Sandi"
                  type="password"
                  placeholder="Masukkan kata sandi akun"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  prefix={<Lock className="h-4 w-4 text-muted" />}
                  required
                />

                {/* Remember me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 accent-primary-600 cursor-pointer"
                    />
                    <span className="text-xs text-muted">
                      Ingat saya di perangkat ini
                    </span>
                  </label>
                  <span className="text-[11px] text-muted">
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
                  icon={<ArrowRight className="h-4 w-4" />}
                  className="mt-3"
                >
                  Masuk ke Akun
                </Button>
              </form>
            </div>

            {/* Footer Hak Cipta & Info Singkat */}
            <div className="max-w-md w-full mx-auto mt-6 pt-4 text-center border-t border-line">
              <p className="text-[11px] text-muted">
                &copy; 2026 CeKost • Platform Manajemen Properti Kos Modern
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
