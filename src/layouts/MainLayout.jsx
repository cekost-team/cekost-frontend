import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronsUpDown,
  DoorOpen,
  LayoutGrid,
  LogOut,
  ReceiptText,
  User,
  Users,
} from 'lucide-react'
import cekostLogo from '../assets/cekost-logo.png'
import SearchBar from '../components/SearchBar'
import { useAuth } from '../context/AuthContext'

// Menu per peran. Pemilik melihat semua, penghuni hanya Beranda dan Tagihan.
const MENU = {
  owner: [
    { to: '/', label: 'Beranda', icon: LayoutGrid, end: true },
    { to: '/kamar', label: 'Kamar', icon: DoorOpen },
    { to: '/penghuni', label: 'Penghuni', icon: Users },
    { to: '/tagihan', label: 'Tagihan', icon: ReceiptText },
    { to: '/laporan', label: 'Laporan', icon: BarChart3 },
  ],
  tenant: [
    { to: '/', label: 'Beranda', icon: LayoutGrid, end: true },
    { to: '/tagihan', label: 'Tagihan', icon: ReceiptText },
  ],
}

const ROLE_LABEL = { owner: 'Pemilik Kos', tenant: 'Penghuni' }

export default function MainLayout() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const isOwner = user?.role === 'owner' || !user?.role
  const items = MENU[user?.role] ?? MENU.owner
  const displayName = user?.name || (isOwner ? 'Pak Bambang' : 'Penghuni')
  const displayRole = ROLE_LABEL[user?.role] || 'Pemilik Kos'

  return (
    <div className="min-h-screen bg-app-bg text-ink font-sans">
      {/* Sidebar Desktop (>= 1024px) */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface z-50 hidden lg:flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col">
          {/* Brand Logo */}
          <div className="h-16 px-5 flex items-center gap-2">
            <img
              src={cekostLogo}
              alt="Logo CeKost"
              className="w-8 h-8 object-contain shrink-0"
            />
            <span className="text-lg leading-[26px] font-bold text-primary-600 tracking-tight">
              CeKost
            </span>
          </div>

          {/* Info Properti Tunggal */}
          {isOwner && (
            <div className="px-4 mb-4">
              <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="flex flex-col min-w-0">
                  <span className="text-sm leading-[22px] font-semibold text-ink truncate max-w-[140px]">
                    Kos Melati Asri
                  </span>
                  <span className="text-xs leading-[18px] text-muted">
                    12 Kamar Terdaftar
                  </span>
                </div>
                <ChevronsUpDown
                  className="w-[18px] h-[18px] text-muted shrink-0"
                  aria-hidden="true"
                />
              </div>
            </div>
          )}

          {/* Navigasi Utama */}
          <nav className="flex flex-col px-3 gap-1" aria-label="Menu utama">
            {items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl text-sm leading-[22px] transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-on-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-ink font-normal'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Profil & Keluar di Bawah Sidebar */}
        <div className="p-4">
          <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary-700 text-on-primary flex items-center justify-center shrink-0">
                <User className="w-[18px] h-[18px]" aria-hidden="true" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm leading-[22px] font-semibold text-ink truncate max-w-[110px]">
                  {displayName}
                </span>
                <span className="text-xs leading-[18px] text-muted truncate">
                  {displayRole}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Keluar"
              title="Keluar"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:bg-surface-container-high hover:text-status-late transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-[18px] h-[18px]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* Kolom Kanan: Header Atas + Konten */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] px-4 lg:px-8">
          {/* Logo Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <img
              src={cekostLogo}
              alt="Logo CeKost"
              className="w-7 h-7 object-contain shrink-0"
            />
            <span className="text-lg leading-[26px] font-bold text-primary-600 tracking-tight">
              CeKost
            </span>
          </div>

          {/* Search Bar Global (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari penghuni, kamar, atau tagihan..."
            />
          </div>

          {/* Sisi Kanan Header: Tanggal, Notifikasi, Avatar */}
          <div className="flex items-center gap-2 sm:gap-5">
            <div className="hidden sm:flex items-center gap-1 text-muted">
              <Calendar className="w-[18px] h-[18px]" aria-hidden="true" />
              <span className="text-[11px] leading-4 font-medium">
                5 November 2026
              </span>
            </div>

            <button
              type="button"
              aria-label="Notifikasi"
              className="relative min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 p-2 rounded-xl text-muted hover:bg-surface-container-high hover:text-ink transition-colors flex items-center justify-center cursor-pointer"
            >
              <Bell className="w-[22px] h-[22px]" aria-hidden="true" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </button>

            <div
              className="w-8 h-8 rounded-full bg-primary-700 text-on-primary flex items-center justify-center shadow-sm shrink-0"
              title={`${displayName} • ${displayRole}`}
            >
              <User className="w-[18px] h-[18px]" aria-hidden="true" />
            </div>

            <button
              type="button"
              onClick={logout}
              aria-label="Keluar"
              title="Keluar"
              className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-muted hover:bg-surface-container-high hover:text-status-late transition-colors lg:hidden cursor-pointer"
            >
              <LogOut className="w-[18px] h-[18px]" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Area Konten Utama */}
        <main className="bg-app-bg min-h-[calc(100vh-4rem)]">
          <div className="max-w-[1024px] mx-auto p-4 pb-24 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Navigation (< 1024px) */}
      <nav
        aria-label="Navigasi bawah"
        className="fixed inset-x-0 bottom-0 z-30 grid border-t border-line bg-surface lg:hidden pb-[env(safe-area-inset-bottom)]"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `min-h-[64px] flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] leading-4 font-medium transition-colors ${
                isActive ? 'text-primary-600' : 'text-muted'
              }`
            }
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
