import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-5xl font-bold text-blue-600">404</p>
      <p className="text-slate-600">Halaman yang kamu cari tidak ditemukan.</p>
      <Link to="/" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
        Kembali ke beranda
      </Link>
    </div>
  );
}
