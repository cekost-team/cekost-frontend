# CeKost Design System

Acuan desain untuk aplikasi CeKost, platform manajemen kos untuk pemilik kos dan penghuni. Dokumen ini dipakai tiga pihak: Sei (desain di Stitch/Figma), Dafa dan Ikbal (implementasi React + Tailwind), dan siapa pun yang menambah layar baru. Semua nilai warna, ukuran, dan aturan di bawah adalah usulan awal; ubah di sini dulu, baru di desain dan kode.

---

## 1. Prinsip desain

- **Mobile-first.** Pemilik kos paling sering memakai ponsel. Desain utama 390 px; versi desktop menyesuaikan.
- **Jelas dan tenang.** Angka uang dan status tagihan harus terbaca sekilas. Hindari dekorasi yang tidak membawa informasi.
- **Konsisten.** Satu komponen, satu tampilan. Status yang sama selalu memakai warna dan label yang sama di semua layar.
- **Bahasa Indonesia.** Semua teks antarmuka berbahasa Indonesia, dengan kalimat singkat dan sopan.
- **Transparan.** Penghuni melihat tagihan dan riwayat bayar miliknya dengan tampilan yang sama jelasnya dengan pemilik, tanpa tombol pengelolaan.

---

## 2. Peran dan navigasi

| Peran | Menu |
|---|---|
| Pemilik Kos | Beranda, Kamar, Penghuni, Tagihan, Laporan |
| Penghuni | Beranda, Tagihan |

- **Mobile (di bawah 1024 px):** header di atas, bottom navigation di bawah (tinggi 64 px ditambah area aman perangkat). Tab aktif berwarna primary, tab lain abu-abu.
- **Desktop (1024 px ke atas):** bottom navigation diganti sidebar kiri selebar 256 px. Konten dibatasi lebar maksimal sekitar 1024 px dan berada di tengah.
- Header menampilkan nama dan peran pengguna serta tombol keluar.

---

## 3. Warna

### Primer

| Token | Hex | Pemakaian |
|---|---|---|
| primary-50 | `#EFF6FF` | latar menu aktif, highlight lembut |
| primary-100 | `#DBEAFE` | latar lencana info |
| primary-500 | `#3B82F6` | fokus input, ikon aktif sekunder |
| **primary-600** | `#2563EB` | warna utama: tombol, tab aktif, tautan |
| primary-700 | `#1D4ED8` | tombol saat ditekan atau hover |

### Netral

| Token | Hex | Pemakaian |
|---|---|---|
| bg | `#F8FAFC` | latar halaman |
| surface | `#FFFFFF` | kartu, header, bottom nav |
| border | `#E2E8F0` | garis pemisah, batas input |
| text | `#0F172A` | teks utama |
| text-muted | `#64748B` | teks pendukung, label |
| text-disabled | `#94A3B8` | elemen nonaktif |

### Status

Setiap status punya warna teks dan warna latar lembut. Dipakai untuk lencana (badge).

**Tagihan**

| Status | Teks | Latar | Label |
|---|---|---|---|
| Lunas | `#16A34A` | `#DCFCE7` | Lunas |
| Sebagian | `#D97706` | `#FEF3C7` | Sebagian |
| Belum bayar | `#475569` | `#F1F5F9` | Belum Bayar |
| Telat | `#DC2626` | `#FEE2E2` | Telat |

**Kamar**

| Status | Teks | Latar | Label |
|---|---|---|---|
| Terisi | `#2563EB` | `#DBEAFE` | Terisi |
| Tersedia | `#16A34A` | `#DCFCE7` | Tersedia |
| Perbaikan | `#EA580C` | `#FFEDD5` | Perbaikan |

**Penghuni**

| Status | Teks | Latar | Label |
|---|---|---|---|
| Aktif | `#16A34A` | `#DCFCE7` | Aktif |
| Pindah | `#475569` | `#F1F5F9` | Pindah |

**Pengingat WhatsApp**

| Status | Warna | Label |
|---|---|---|
| Terkirim | hijau | Terkirim |
| Gagal | merah | Gagal |

**Aturan:** warna tidak boleh jadi satu-satunya pembeda. Setiap status selalu disertai label teks.

---

## 4. Tipografi

Font: **Plus Jakarta Sans** (cadangan: Inter, system-ui, sans-serif).

| Gaya | Ukuran / tinggi baris | Berat | Pemakaian |
|---|---|---|---|
| display | 28 / 36 | 700 | angka besar (total pemasukan, tunggakan) |
| h1 | 22 / 30 | 700 | judul halaman |
| h2 | 18 / 26 | 600 | judul bagian |
| body | 14 / 22 | 400 | isi umum |
| body-strong | 14 / 22 | 600 | nama, nominal di daftar |
| small | 12 / 18 | 400 | keterangan, tanggal |
| caption | 11 / 16 | 500 | label tab bawah, lencana |

Angka uang memakai angka tabular (`tabular-nums`) agar rata saat berjajar.

---

## 5. Jarak, sudut, bayangan

- **Satuan dasar 4 px.** Skala jarak: 4, 8, 12, 16, 20, 24, 32.
- **Padding halaman:** 16 px di mobile, 32 px di desktop.
- **Jarak antar kartu:** 12 px. **Jarak antar bagian:** 24 px.
- **Radius:** sm 8 px (input kecil, chip), md 12 px (tombol, input), lg 16 px (kartu, bottom sheet), full (lencana, avatar).
- **Bayangan kartu:** `0 1px 2px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.08)`.
- **Bayangan bottom sheet:** `0 -8px 24px rgba(15,23,42,.12)`.
- **Area sentuh minimal 44 x 44 px** untuk semua elemen yang bisa ditekan.

---

## 6. Komponen

### Tombol
- **Primary:** latar primary-600, teks putih, tinggi 44 px, radius 12 px, teks 14 px berat 600. Lebar penuh untuk aksi utama di form.
- **Secondary:** latar putih, batas primary-600, teks primary-600.
- **Danger:** batas dan teks merah (`#DC2626`), dipakai untuk aksi merusak seperti Check-out atau Hapus.
- **Kecil:** tinggi 32 px, untuk aksi di dalam kartu seperti "Kirim Pengingat" atau "Lihat Tagihan".
- **Status:** hover/pressed menggelapkan satu tingkat; disabled memakai opasitas 50 persen; loading menampilkan spinner dan teks "Memproses...".

### Input
- Tinggi 44 px, radius 12 px, batas `border`, latar putih. Label di atas, teks 14 px berat 500.
- Fokus: batas primary-500. Error: batas merah dengan pesan 12 px merah di bawah.
- Variasi: teks, password (ikon tampil/sembunyikan), angka rupiah (awalan "Rp", pemisah titik), nomor WhatsApp (awalan "+62"), tanggal, dropdown, textarea.

### Kolom pencarian dan chip filter
- Pencarian: ikon kaca pembesar di kiri, placeholder spesifik ("Cari nomor kamar...").
- Chip filter: tinggi 32 px, bentuk kapsul. Aktif: latar primary-600, teks putih. Tidak aktif: latar putih, batas `border`, teks `text-muted`. Bisa digulir mendatar bila banyak.

### Kartu
- Latar putih, radius 16 px, padding 16 px, bayangan kartu.
- **Kartu ringkasan:** label kecil di atas, angka display di bawah, ikon opsional di kanan atas.
- **Kartu kamar:** nomor kamar tebal, tipe dan harga per bulan, lencana status di kanan atas, nama penghuni bila terisi, tombol kecil Ubah dan Detail.
- **Kartu penghuni:** nama, nomor kamar, jatuh tempo ("Jatuh tempo tiap tanggal 5"), lencana status tagihan terbaru, tombol kecil "Lihat Tagihan".
- **Kartu tagihan:** nama penghuni, kamar, nominal, jatuh tempo, lencana status, dan sisa tagihan bila statusnya Sebagian.

### Lencana status
Kapsul tinggi 24 px, padding mendatar 10 px, teks caption berat 600, warna sesuai tabel status di bagian 3.

### Bottom sheet dan modal
- Bottom sheet naik dari bawah, sudut atas 16 px, garis pegangan kecil di tengah atas, latar gelap transparan di belakang. Dipakai untuk form singkat: Catat Pembayaran, Kirim Pengingat WhatsApp.
- Modal konfirmasi di tengah layar untuk aksi berisiko (Check-out, Hapus), dengan tombol Batal dan tombol aksi.

### Pratinjau pesan WhatsApp
Gelembung pesan gaya obrolan (latar hijau muda `#DCF8C6`, sudut membulat) berisi isi pengingat. Di bawahnya tombol "Kirim" (primary) dan "Ubah Pesan" (secondary).

### Grafik dan indikator
- **Grafik batang pemasukan bulanan:** batang primary-600, batang bulan berjalan lebih pekat, label bulan singkat (Jan, Feb, ...), sumbu sederhana tanpa banyak garis bantu.
- **Cincin tingkat hunian:** cincin primary-600 di atas jalur abu-abu, persentase besar di tengah.
- **Daftar rincian pengeluaran:** baris dengan ikon kategori, nama, dan nominal di kanan.

### Navigasi
- **Bottom nav:** ikon 20 px dengan label caption; tab aktif primary-600.
- **Sidebar (desktop):** logo di atas, item menu tinggi 44 px, item aktif berlatar primary-50 dan teks primary-700.

### Kondisi khusus
- **Kosong:** ilustrasi sederhana, judul ("Belum ada kamar"), keterangan satu kalimat, dan tombol aksi ("Tambah Kamar Pertama").
- **Memuat:** kerangka abu-abu (skeleton) berbentuk kartu yang berdenyut halus.
- **Galat:** ikon peringatan, "Gagal memuat data", dan tombol "Coba Lagi".
- **Toast:** notifikasi singkat di atas bottom nav untuk keberhasilan atau kegagalan aksi.

---

## 7. Daftar layar

### Pemilik kos
1. **Login:** tab Pemilik Kos / Penghuni, email, kata sandi, tombol "Masuk ke Akun", tautan daftar. Tanpa bottom nav.
2. **Beranda:** sapaan, kartu ringkasan (Kamar Terisi, Pemasukan Bulan Ini, Total Tunggakan), "Perlu Ditagih" dengan tombol Kirim Pengingat, "Pembayaran Terbaru".
3. **Kamar:** pencarian, chip filter status, daftar kartu kamar, tombol Tambah Kamar. Form tambah/ubah kamar: nomor, tipe, harga sewa, fasilitas (chip), status, catatan.
4. **Penghuni:** pencarian, filter Aktif/Pindah, daftar kartu penghuni, tombol Tambah Penghuni. Form tambah penghuni dan halaman detail dengan riwayat tagihan serta aksi Check-out.
5. **Tagihan:** pemilih periode, ringkasan total, chip filter status, daftar kartu tagihan. Detail tagihan dengan riwayat pembayaran dan bottom sheet "Catat Pembayaran" (nominal, tanggal, metode: Tunai / Transfer / E-Wallet).
6. **Peringatan WhatsApp:** bottom sheet pratinjau pesan dan layar "Riwayat Pengingat" (penerima, waktu, jenis Otomatis/Manual, status Terkirim/Gagal).
7. **Laporan:** pemilih periode, total pemasukan, grafik bulanan, tingkat hunian, rincian pengeluaran, tombol "Catat Pengeluaran".

### Penghuni
8. **Beranda penghuni:** kamar yang ditempati, kartu tagihan berjalan (periode, nominal, jatuh tempo, status), pembayaran terakhir.
9. **Tagihan penghuni:** daftar tagihan sendiri dan riwayat pembayaran. Hanya baca.

---

## 8. Aturan teks dan format

- **Mata uang:** `Rp 1.500.000` (awalan "Rp", spasi, titik sebagai pemisah ribuan, tanpa desimal).
- **Tanggal:** `5 November 2026`. Periode: `November 2026`. Tanggal singkat di daftar: `5 Nov 2026`.
- **Nomor WhatsApp:** tampil `0812-3456-7890`, disimpan format internasional `62812...`.
- **Nada:** ramah dan jelas, tanpa istilah teknis. Tombol berupa kata kerja ("Simpan", "Kirim Pengingat", "Catat Pembayaran").
- **Pesan kesalahan:** menyebut masalah dan solusinya ("Email atau kata sandi salah. Periksa lagi dan coba kembali.").
- **Data contoh di desain:** nama Indonesia yang realistis, tanggal tahun 2026, kamar bernomor 01 sampai 12, harga sewa Rp 900.000 sampai Rp 1.800.000.

---

## 9. Aksesibilitas

- Kontras teks terhadap latar minimal 4,5 banding 1 (teks putih di primary-600 sudah memenuhi).
- Area sentuh minimal 44 px, jarak antar tombol minimal 8 px.
- Status tidak hanya dibedakan warna; selalu ada label teks.
- Ikon tanpa teks wajib punya label aksesibilitas (misalnya `aria-label="Keluar"`).
- Fokus keyboard terlihat jelas (cincin primary-500) untuk tampilan desktop.

---

## 10. Titik henti responsif

| Lebar | Perilaku |
|---|---|
| di bawah 640 px | satu kolom, bottom nav |
| 640 - 1023 px | satu kolom lebih longgar, bottom nav, kartu ringkasan bisa berjajar dua |
| 1024 px ke atas | sidebar kiri, konten tengah maksimal sekitar 1024 px, kartu ringkasan tiga kolom, daftar bisa dua kolom |

---

## 11. Token untuk Tailwind (Dafa dan Ikbal)

Tailwind v4: taruh di `src/index.css` setelah `@import "tailwindcss";`. Dengan ini, kelas seperti `bg-primary-600`, `text-muted`, dan `bg-status-late-bg` bisa dipakai di seluruh aplikasi, dan perubahan warna cukup dilakukan di satu tempat.

```css
@import "tailwindcss";

@theme {
  --font-sans: "Plus Jakarta Sans", Inter, system-ui, sans-serif;

  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;

  --color-app-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-line: #e2e8f0;
  --color-ink: #0f172a;
  --color-muted: #64748b;

  --color-status-paid: #16a34a;
  --color-status-paid-bg: #dcfce7;
  --color-status-partial: #d97706;
  --color-status-partial-bg: #fef3c7;
  --color-status-unpaid: #475569;
  --color-status-unpaid-bg: #f1f5f9;
  --color-status-late: #dc2626;
  --color-status-late-bg: #fee2e2;
  --color-status-repair: #ea580c;
  --color-status-repair-bg: #ffedd5;

  --radius-card: 16px;
  --radius-control: 12px;
}
```

Font Plus Jakarta Sans dimuat lewat tag `<link>` Google Fonts di `index.html`.

### Peta komponen untuk pembagian kerja

| Komponen | Folder | Pemilik |
|---|---|---|
| Button, Input, SearchBar, FilterChip, StatusBadge, Card, SummaryCard | `src/components/` | Ikbal |
| RoomCard, TenantCard, InvoiceCard | `src/components/` | Ikbal |
| BottomSheet, ConfirmModal, Toast, EmptyState, Skeleton | `src/components/` | Ikbal |
| MainLayout (header, sidebar, bottom nav) | `src/layouts/` | Dafa |
| Halaman Login, Beranda, Kamar | `src/pages/` | Dafa |
| Halaman Penghuni, Tagihan, Laporan | `src/pages/` | Ikbal |

---

## 12. Catatan perubahan

- v1.0: draf awal, mengikuti PRD (login email dan kata sandi, peringatan WhatsApp masuk MVP, pengeluaran dan ekspor sebagai fitur tambahan).
- Setiap perubahan warna, komponen, atau layar dicatat di sini dengan tanggal dan nama yang mengubah.
