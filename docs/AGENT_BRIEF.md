# Brief Agen: Frontend CeKost

## Proyek
CeKost adalah aplikasi manajemen kos. Pemilik kos mengelola kamar, penghuni, tagihan sewa, pembayaran, peringatan WhatsApp, dan laporan keuangan. Penghuni punya akun hanya-baca untuk melihat tagihan dan riwayat bayarnya. Satu akun pemilik mengelola satu kos.

## Teknologi
React (Vite), Tailwind CSS v4 (token di blok @theme pada src/index.css), react-router-dom, axios, lucide-react. Jangan tambah pustaka baru tanpa izin.

## Sumber desain
1. DESIGN.md di akar repo (warna, tipografi, komponen, aturan teks).
2. Proyek Stitch "Design System Implementation" lewat MCP stitch (hanya membaca). Layar Stitch adalah acuan visual, bukan acuan fitur.

## Aturan kode
- Semua warna lewat token dari @theme (bg-primary-600, text-muted, bg-status-late-bg, dan sebagainya). Dilarang menulis kode hex atau kelas warna bawaan Tailwind seperti slate-, blue-, red-.
- Ukuran dan sudut memakai token atau kelas standar (h-11, rounded-control, rounded-card).
- Semua teks berbahasa Indonesia. Uang "Rp 1.500.000", tanggal "5 Nov 2026" (fungsi di src/utils/format.js, pakai Intl). Data contoh memakai nama Indonesia dan tanggal 2026.
- Mobile-first (390 px), layar lebar memakai sidebar. Tombol dan elemen sentuh minimal 44 px.
- Status tidak boleh hanya dibedakan warna; selalu ada label teks.
- Komponen yang dipakai berulang ada di src/components dan menerima data lewat props. Jangan menyalin gaya tombol atau kartu ke halaman.
- Aksesibilitas: label terhubung ke input, ikon tanpa teks punya aria-label, elemen klik adalah button.
- Panggilan data lewat src/api. Di mode VITE_USE_DUMMY=true pakai data dummy dengan bentuk yang sama seperti respons API sungguhan ({ success, message, data }).

## Di luar cakupan PRD (jangan dibuat meski ada di Stitch)
Tombol demo pemilik/penghuni, "Daftarkan Properti Baru", login OTP WhatsApp, banyak kos per akun, notifikasi email, payment gateway, klaim keamanan seperti SSL atau SHA-256. Kalau ada elemen di Stitch yang meragukan, tanya dulu.

## Yang tidak boleh diubah tanpa izin
src/api/axios.js, src/api/auth.js, src/context/AuthContext.jsx, src/routes/ProtectedRoute.jsx, file .env, package.json (laporkan kalau butuh paket).
Boleh menambah file baru di src/api dan src/utils.

## Cara bekerja
1. Tunjukkan rencana (daftar file dan ringkasan) dan tunggu persetujuan sebelum menulis.
2. Kerjakan satu langkah per permintaan.
3. Setelah menulis: jalankan npm.cmd run build dan npm.cmd run lint, lalu periksa tidak ada hex atau kelas warna bawaan Tailwind (cari #, slate-, blue-, red-, gray-) di file yang disentuh.
4. Laporkan: daftar file dibuat atau diubah, hasil pemeriksaan, dan hal yang tidak pasti.
5. Jangan menjalankan perintah git yang mengubah riwayat atau mengirim (commit, push, merge, reset). Itu dikerjakan manusia.
6. Jangan menampilkan, menyalin, atau mencetak isi mcp_config.json maupun kunci API apa pun.