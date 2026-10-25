import { NavLink, Outlet } from "react-router-dom";
import { Home, DoorOpen, Users, Receipt, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Menu per peran. Pemilik melihat semua, penghuni hanya Beranda dan Tagihan.
const MENU = {
  owner: [
    { to: "/", label: "Beranda", icon: Home, end: true },
    { to: "/kamar", label: "Kamar", icon: DoorOpen },
    { to: "/penghuni", label: "Penghuni", icon: Users },
    { to: "/tagihan", label: "Tagihan", icon: Receipt },
    { to: "/laporan", label: "Laporan", icon: BarChart3 },
  ],
  tenant: [
    { to: "/", label: "Beranda", icon: Home, end: true },
    { to: "/tagihan", label: "Tagihan", icon: Receipt },
  ],
};

const ROLE_LABEL = { owner: "Pemilik Kos", tenant: "Penghuni" };

export default function MainLayout() {
  const { user, logout } = useAuth();
  const items = MENU[user?.role] ?? MENU.tenant;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar: hanya tampil di layar lebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="px-6 py-5 text-xl font-bold text-blue-600">CeKost</div>
        <nav className="flex-1 space-y-1 px-3">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Kolom kanan: navbar atas + konten */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
          <span className="text-lg font-bold text-blue-600 lg:hidden">CeKost</span>
          <span className="hidden text-sm text-slate-500 lg:block">
            {ROLE_LABEL[user?.role]}
          </span>

          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-slate-500">{ROLE_LABEL[user?.role]}</p>
            </div>
            <button
              onClick={logout}
              aria-label="Keluar"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Area konten: halaman dirender di sini lewat Outlet */}
        <main className="mx-auto w-full max-w-5xl p-4 pb-24 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Bottom navigation: hanya tampil di ponsel, sesuai desain Stitch */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid border-t border-slate-200 bg-white lg:hidden"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                isActive ? "text-blue-600" : "text-slate-500"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
