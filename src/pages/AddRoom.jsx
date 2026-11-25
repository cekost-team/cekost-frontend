// AddRoom.jsx — Halaman "Tambah Kamar Baru" sesuai layar Stitch
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Section wrapper ───────────────────────────────────────────────────────────
function FormSection({ children, icon, iconBg, iconColor, title, subtitle, step }) {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-2 border-b border-border-line">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${iconBg}`}>
            <span className={`material-symbols-outlined text-[22px] ${iconColor}`}>{icon}</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink leading-[26px]">{title}</h2>
            <p className="text-xs leading-[18px] font-normal text-muted">{subtitle}</p>
          </div>
        </div>
        <span className="text-[11px] leading-4 font-semibold px-2 py-1 rounded-full bg-surface-container text-muted">
          {step}
        </span>
      </div>
      {children}
    </div>
  );
}

// ── Radio card (for floor & tipe) ─────────────────────────────────────────────
function RadioCard({ name, value, checked, onChange, children, className = '' }) {
  return (
    <label
      className={`relative flex items-center justify-center p-3 rounded-xl cursor-pointer bg-surface-container text-ink hover:bg-surface-container-high transition-all shadow-sm ${
        checked ? 'bg-primary-600 text-on-primary' : ''
      } ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {children}
    </label>
  );
}

// ── Facility chip (toggle) ────────────────────────────────────────────────────
function FacilityChip({ icon, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold leading-[22px] transition-all ${
        selected
          ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-600 shadow-sm'
          : 'bg-surface-container text-ink hover:bg-surface-container-high'
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

const FACILITIES_LIST = [
  { icon: 'mode_fan', label: 'AC Dingin', val: 'AC' },
  { icon: 'shower', label: 'Kamar Mandi Dalam', val: 'KM Dalam' },
  { icon: 'bed', label: 'Kasur Springbed (Queen)', val: 'Kasur Springbed' },
  { icon: 'checkroom', label: 'Lemari Pakaian 2 Pintu', val: 'Lemari Pakaian' },
  { icon: 'desk', label: 'Meja Kerja / Belajar', val: 'Meja Kerja' },
  { icon: 'wifi', label: 'Wi-Fi Fiber 50+ Mbps', val: 'Wi-Fi 50+ Mbps' },
  { icon: 'water_heater', label: 'Water Heater', val: 'Water Heater' },
  { icon: 'balcony', label: 'Balkon / Jendela Luar', val: 'Balkon Luar' },
  { icon: 'toys_fan', label: 'Kipas Plafon Ekstra', val: 'Kipas Angin' },
  { icon: 'tv', label: 'Smart TV 32 Inch', val: 'Smart TV' },
];

const INITIAL_SELECTED_FACILITIES = new Set(['AC', 'KM Dalam', 'Kasur Springbed', 'Lemari Pakaian', 'Meja Kerja', 'Wi-Fi 50+ Mbps']);

export default function AddRoom() {
  const navigate = useNavigate();

  const [nomorKamar, setNomorKamar] = useState('13');
  const [ukuranKamar, setUkuranKamar] = useState('3 x 4');
  const [lantai, setLantai] = useState('Lantai 2');
  const [tipeKamar, setTipeKamar] = useState('Standard AC');
  const [hargaSewa, setHargaSewa] = useState('1.400.000');
  const [deposit, setDeposit] = useState('500.000');
  const [utilitas, setUtilitas] = useState('token');
  const [selectedFacilities, setSelectedFacilities] = useState(new Set(INITIAL_SELECTED_FACILITIES));
  const [statusAwal, setStatusAwal] = useState('Tersedia');
  const [catatan, setCatatan] = useState('Cat baru warna broken white, kunci serep tersedia di pengelola pos depan.');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleFacility(val) {
    setSelectedFacilities((prev) => {
      const next = new Set(prev);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => navigate('/kamar'), 1200);
    }, 1000);
  }

  // Preview values
  const previewTitle = nomorKamar ? `Kamar ${nomorKamar}` : 'Kamar --';
  const previewType = `${tipeKamar} • Luas ${ukuranKamar} m²`;
  const previewPrice = hargaSewa ? `Rp ${hargaSewa}` : 'Rp 0';
  const previewFacilities = Array.from(selectedFacilities);
  const shownFacilities = previewFacilities.slice(0, 3);
  const extraCount = previewFacilities.length > 3 ? previewFacilities.length - 3 : 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Breadcrumb + Back ───────────────────────────────────────────── */}
      <div className="px-8 pt-6 pb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-1 text-xs leading-[18px] font-normal text-muted">
            <span className="hover:text-primary-600 cursor-pointer transition-colors">Properti</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="hover:text-primary-600 cursor-pointer transition-colors">Kos Melati Asri</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/kamar'); }}
              className="hover:text-primary-600 transition-colors"
            >
              Kelola Kamar
            </a>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-sm font-semibold text-ink leading-[22px]">Tambah Kamar Baru</span>
          </nav>
          <button
            type="button"
            onClick={() => navigate('/kamar')}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-surface hover:bg-surface-container transition-colors text-ink text-sm font-semibold leading-[22px] shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali ke Kelola Kamar</span>
          </button>
        </div>
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] leading-[30px] font-bold text-ink tracking-tight">Tambah Kamar Baru</h1>
            <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[11px] leading-4 font-semibold tracking-wide uppercase">
              Unit Baru #13
            </span>
          </div>
          <p className="text-sm leading-[22px] font-normal text-muted max-w-3xl">
            Lengkapi data spesifikasi, tarif sewa bulanan, dan fasilitas untuk unit kamar baru di Kos Melati Asri.
          </p>
        </div>
      </div>

      {/* ── Main grid: 8 col form + 4 col preview ──────────────────────── */}
      <div className="px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── FORM COLUMN ───────────────────────────────────────────── */}
          <form
            id="tambahKamarForm"
            onSubmit={handleSubmit}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            {/* Section 1 */}
            <FormSection
              icon="meeting_room"
              iconBg="bg-primary-50"
              iconColor="text-primary-600"
              title="1. Informasi Dasar Kamar"
              subtitle="Nomor identifikasi, posisi lantai, dan dimensi fisik unit."
              step="Langkah 1/5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nomor kamar */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ink leading-[22px] flex items-center justify-between">
                    <span>
                      Nomor / Kode Kamar <span className="text-error">*</span>
                    </span>
                    <span className="text-[11px] leading-4 font-medium text-muted">Harus unik</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-semibold text-muted select-none">Kamar</span>
                    <input
                      type="text"
                      value={nomorKamar}
                      onChange={(e) => setNomorKamar(e.target.value)}
                      maxLength={6}
                      required
                      placeholder="13"
                      className="w-full h-11 pl-16 pr-3 rounded-xl bg-surface-container-low text-ink text-sm font-semibold leading-[22px] focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-disabled"
                    />
                  </div>
                  <p className="text-[11px] leading-4 font-medium text-muted">
                    Otomatis terurut melanjutkan kamar terakhir (Kamar 12).
                  </p>
                </div>
                {/* Ukuran */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ink leading-[22px]">
                    Ukuran Kamar (P x L) <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={ukuranKamar}
                      onChange={(e) => setUkuranKamar(e.target.value)}
                      required
                      placeholder="Contoh: 3 x 4"
                      className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-ink text-sm font-normal leading-[22px] focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-disabled"
                    />
                    <span className="absolute right-3.5 text-xs leading-[18px] font-normal text-muted select-none pointer-events-none">
                      meter (m²)
                    </span>
                  </div>
                  <p className="text-[11px] leading-4 font-medium text-muted">
                    Luas bersih interior termasuk kamar mandi dalam.
                  </p>
                </div>
              </div>

              {/* Lantai */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-ink leading-[22px]">
                  Lantai <span className="text-error">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Lantai 1', 'Lantai 2', 'Lantai 3'].map((l) => (
                    <RadioCard
                      key={l}
                      name="lantai"
                      value={l}
                      checked={lantai === l}
                      onChange={() => setLantai(l)}
                    >
                      <div className={`flex items-center gap-1 ${lantai === l ? 'text-on-primary' : 'text-ink'}`}>
                        <span className="material-symbols-outlined text-[18px]">stairs</span>
                        <span className="text-sm font-semibold leading-[22px]">{l}</span>
                      </div>
                    </RadioCard>
                  ))}
                </div>
              </div>

              {/* Tipe kamar */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-ink leading-[22px]">
                  Kategori / Tipe Unit <span className="text-error">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { val: 'Standard AC', sub: 'Kamar mandi dalam + AC 0.5 PK hemat daya.' },
                    { val: 'AC VIP (Balkon)', sub: 'Jendela hadap taman, water heater & smart TV.' },
                    { val: 'Standard Fan', sub: 'Kamar mandi dalam dengan exhaust & kipas plafon.' },
                    { val: 'Kamar Mandi Luar', sub: 'Akses kamar mandi bersama di koridor yang sama.' },
                  ].map(({ val, sub }) => (
                    <label
                      key={val}
                      className={`relative p-3 rounded-xl cursor-pointer bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3 ${
                        tipeKamar === val ? 'bg-primary-50 ring-2 ring-primary-600' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipe_kamar"
                        value={val}
                        checked={tipeKamar === val}
                        onChange={() => setTipeKamar(val)}
                        className="mt-1 text-primary-600"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-ink leading-[22px]">{val}</span>
                        <span className="text-[11px] leading-4 font-medium text-muted">{sub}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </FormSection>

            {/* Section 2 */}
            <FormSection
              icon="payments"
              iconBg="bg-status-paid-bg"
              iconColor="text-status-paid"
              title="2. Tarif & Ketentuan Sewa"
              subtitle="Penetapan harga sewa, uang jaminan (deposit), dan pembagian utilitas."
              step="Langkah 2/5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Harga sewa */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ink leading-[22px]">
                    Harga Sewa Bulanan <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-surface-container flex items-center justify-center rounded-l-xl text-ink text-sm font-semibold leading-[22px] select-none">
                      Rp
                    </div>
                    <input
                      type="text"
                      value={hargaSewa}
                      onChange={(e) => setHargaSewa(e.target.value)}
                      required
                      placeholder="1.400.000"
                      className="w-full h-11 pl-14 pr-16 rounded-xl bg-surface-container-low text-ink text-sm font-semibold leading-[22px] focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-disabled"
                    />
                    <span className="absolute right-3.5 text-[11px] leading-4 font-medium text-muted select-none pointer-events-none">
                      / bulan
                    </span>
                  </div>
                  <p className="text-[11px] leading-4 font-medium text-muted">
                    Rata-rata tarif sekitar: Rp 1.350.000 - Rp 1.500.000/bln.
                  </p>
                </div>
                {/* Deposit */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ink leading-[22px] flex items-center justify-between">
                    <span>Uang Jaminan / Deposit</span>
                    <span className="text-[11px] leading-4 font-medium text-muted">Opsional</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-surface-container flex items-center justify-center rounded-l-xl text-ink text-sm font-semibold leading-[22px] select-none">
                      Rp
                    </div>
                    <input
                      type="text"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      placeholder="500.000"
                      className="w-full h-11 pl-14 pr-3 rounded-xl bg-surface-container-low text-ink text-sm font-normal leading-[22px] focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-disabled"
                    />
                  </div>
                  <p className="text-[11px] leading-4 font-medium text-muted">
                    Dikembalikan penuh saat penyewa checkout tanpa tunggakan/kerusakan.
                  </p>
                </div>
              </div>

              {/* Utilitas */}
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-sm font-semibold text-ink leading-[22px]">Ketentuan Listrik &amp; Air</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { val: 'token', label: 'Token Mandiri', sub: 'Meteran PLN terpisah per unit' },
                    { val: 'include', label: 'Termasuk Listrik', sub: 'All-in biaya sewa' },
                    { val: 'iuran', label: 'Iuran Flat Tambahan', sub: '+Rp 75.000/bln utilitas' },
                  ].map(({ val, label, sub }) => (
                    <label
                      key={val}
                      className={`flex items-center gap-2 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors ${
                        utilitas === val ? 'bg-primary-50 ring-1 ring-primary-600' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="utilitas"
                        value={val}
                        checked={utilitas === val}
                        onChange={() => setUtilitas(val)}
                        className="text-primary-600"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-ink leading-[22px]">{label}</span>
                        <span className="text-[11px] leading-4 font-medium text-muted">{sub}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </FormSection>

            {/* Section 3 */}
            <FormSection
              icon="tune"
              iconBg="bg-primary-100"
              iconColor="text-primary-700"
              title="3. Fasilitas Kamar & Bersama"
              subtitle="Pilih fasilitas yang tersedia. Ikon ini akan muncul di kartu ringkasan."
              step="Langkah 3/5"
            >
              <div className="flex flex-wrap gap-2">
                {FACILITIES_LIST.map(({ icon, label, val }) => (
                  <FacilityChip
                    key={val}
                    icon={icon}
                    label={label}
                    selected={selectedFacilities.has(val)}
                    onClick={() => toggleFacility(val)}
                  />
                ))}
              </div>
              <p className="text-[11px] leading-4 font-medium text-muted italic">
                Klik chip untuk memilih atau membatalkan pilihan fasilitas.
              </p>
            </FormSection>

            {/* Section 4 */}
            <FormSection
              icon="photo_library"
              iconBg="bg-secondary-fixed"
              iconColor="text-on-secondary-fixed"
              title="4. Foto & Dokumentasi Kamar"
              subtitle="Tampilkan kondisi ruangan terbaru untuk memudahkan calon penyewa."
              step="Langkah 4/5"
            >
              {/* Upload area */}
              <div className="border-2 border-dashed border-border-line rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 hover:border-primary-600 hover:bg-primary-50/20 transition-all cursor-pointer group">
                <div className="w-14 h-14 rounded-full bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center text-primary-600 transition-colors">
                  <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-ink leading-[22px]">
                    Tarik &amp; lepas foto kamar di sini, atau{' '}
                    <span className="text-primary-600 underline">telusuri file</span>
                  </p>
                  <p className="text-xs leading-[18px] font-normal text-muted">
                    Format file didukung: JPG, PNG, WEBP (Maksimal 5MB per file, disarankan min. 2 foto)
                  </p>
                </div>
              </div>

              {/* Uploaded photos */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-ink leading-[22px]">
                  Foto Kamar yang Terunggah (2/8)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Foto 1 placeholder */}
                  <div className="relative group rounded-xl overflow-hidden aspect-video bg-surface-container shadow-sm">
                    <div className="w-full h-full bg-surface-container flex items-center justify-center text-muted">
                      <span className="material-symbols-outlined text-[32px]">image</span>
                    </div>
                    <div className="absolute top-2 left-2 px-1 py-0.5 rounded bg-primary-600/90 text-on-primary text-[11px] leading-4 font-semibold">
                      Foto Utama
                    </div>
                    <button
                      type="button"
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-surface/80 hover:bg-error hover:text-on-error text-ink flex items-center justify-center transition-colors shadow"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                  {/* Foto 2 placeholder */}
                  <div className="relative group rounded-xl overflow-hidden aspect-video bg-surface-container shadow-sm">
                    <div className="w-full h-full bg-surface-container flex items-center justify-center text-muted">
                      <span className="material-symbols-outlined text-[32px]">image</span>
                    </div>
                    <button
                      type="button"
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-surface/80 hover:bg-error hover:text-on-error text-ink flex items-center justify-center transition-colors shadow"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                  {/* Tambah slot */}
                  <button
                    type="button"
                    className="border border-dashed border-border-line rounded-xl flex flex-col items-center justify-center gap-1 aspect-video hover:bg-surface-container-low transition-colors text-muted hover:text-primary-600"
                  >
                    <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
                    <span className="text-[11px] leading-4 font-medium">Tambah Foto</span>
                  </button>
                </div>
              </div>
            </FormSection>

            {/* Section 5 */}
            <FormSection
              icon="assignment_turned_in"
              iconBg="bg-status-repair-bg"
              iconColor="text-status-repair"
              title="5. Status Kesiapan & Catatan Pengelola"
              subtitle="Tentukan status awal publikasi kamar dan memo internal Pak Bambang."
              step="Langkah 5/5"
            >
              {/* Status awal */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-ink leading-[22px]">
                  Status Ketersediaan Awal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors flex items-center gap-3 ${
                      statusAwal === 'Tersedia'
                        ? 'bg-status-paid-bg/60 ring-2 ring-status-paid'
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="status_awal"
                      value="Tersedia"
                      checked={statusAwal === 'Tersedia'}
                      onChange={() => setStatusAwal('Tersedia')}
                      className="text-status-paid"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-status-paid" />
                        <span className="text-sm font-semibold text-ink leading-[22px]">Siap Huni (Tersedia)</span>
                      </div>
                      <span className="text-[11px] leading-4 font-medium text-muted">
                        Kamar bersih &amp; langsung dapat disewakan sekarang.
                      </span>
                    </div>
                  </label>
                  <label
                    className={`p-3 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors flex items-center gap-3 ${
                      statusAwal === 'Dalam Perbaikan'
                        ? 'bg-status-repair-bg/60 ring-2 ring-status-repair'
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="status_awal"
                      value="Dalam Perbaikan"
                      checked={statusAwal === 'Dalam Perbaikan'}
                      onChange={() => setStatusAwal('Dalam Perbaikan')}
                      className="text-status-repair"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-status-repair" />
                        <span className="text-sm font-semibold text-ink leading-[22px]">
                          Dalam Persiapan / Perbaikan
                        </span>
                      </div>
                      <span className="text-[11px] leading-4 font-medium text-muted">
                        Sedang pengecatan, pembersihan AC, atau renovasi.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Catatan */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-ink leading-[22px] flex items-center justify-between">
                  <span>Catatan Khusus Pengelola</span>
                  <span className="text-[11px] leading-4 font-medium text-muted">Catatan internal (hanya pemilik)</span>
                </label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={3}
                  placeholder="Contoh: Baru dicat warna broken white, kunci cadangan berada di gantungan laci pos pengelola."
                  className="w-full p-3 rounded-xl bg-surface-container-low text-ink text-sm font-normal leading-[22px] focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-disabled resize-none"
                />
              </div>
            </FormSection>
          </form>

          {/* ── PREVIEW COLUMN ────────────────────────────────────────── */}
          <div className="lg:col-span-4 sticky top-24 flex flex-col gap-5">
            {/* Preview header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px] text-primary-600">visibility</span>
                <span className="text-[11px] leading-4 font-semibold uppercase tracking-wider text-ink">
                  Pratinjau Kartu Kamar
                </span>
              </div>
              <span className="px-1 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] leading-4 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Langsung Sinkron
              </span>
            </div>

            {/* Preview card */}
            <div className="bg-surface rounded-xl overflow-hidden shadow-md flex flex-col transition-all duration-300">
              {/* Image area */}
              <div className="relative w-full h-44 bg-surface-container overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-muted">
                  <span className="material-symbols-outlined text-[48px]">image</span>
                </div>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1">
                  <span
                    className={`px-2 py-1 rounded-full text-[11px] leading-4 font-semibold shadow-sm ${
                      statusAwal === 'Tersedia'
                        ? 'bg-status-paid-bg text-status-paid'
                        : 'bg-status-repair-bg text-status-repair'
                    }`}
                  >
                    {statusAwal === 'Tersedia' ? 'Tersedia' : 'Perbaikan'}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-surface/90 text-ink text-[11px] leading-4 font-semibold shadow-sm">
                    {lantai}
                  </span>
                </div>
                {/* Price overlay */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-surface/90 shadow-sm flex items-baseline gap-1">
                  <span className="text-[11px] leading-4 font-medium text-muted">Tarif:</span>
                  <span className="text-sm font-semibold text-primary-700 leading-[22px]">{previewPrice}</span>
                  <span className="text-[11px] leading-4 font-medium text-muted">/bln</span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-ink leading-[26px]">{previewTitle}</h3>
                    <p className="text-xs leading-[18px] font-normal text-muted">{previewType}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-muted">
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                  </div>
                </div>
                {/* Facility badges */}
                <div className="flex flex-wrap gap-1">
                  {shownFacilities.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-lg bg-surface-container text-ink text-[11px] leading-4 font-medium"
                    >
                      {f}
                    </span>
                  ))}
                  {extraCount > 0 && (
                    <span className="px-2 py-0.5 rounded-lg bg-surface-container text-ink text-[11px] leading-4 font-medium">
                      +{extraCount} lainnya
                    </span>
                  )}
                </div>
                <div className="h-px bg-surface-container w-full" />
                {/* Occupant placeholder */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-muted">
                      <span className="material-symbols-outlined text-[16px]">person_off</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-ink leading-[18px]">Belum Ada Penghuni</span>
                      <span className="text-[11px] leading-4 font-medium text-muted">Siap dihubungkan ke penyewa</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 text-[11px] leading-4 font-semibold hover:bg-primary-100 transition-colors"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>

            {/* Tips box */}
            <div className="p-4 rounded-xl bg-surface shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary-600">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                <span className="text-sm font-semibold text-ink leading-[22px]">Tips Pengisian Unit Kos</span>
              </div>
              <p className="text-xs leading-[18px] font-normal text-muted">
                Penamaan kamar berurutan (misal: 13, 14, 15) mempermudah petugas saat mencatat meteran
                listrik mandiri dan mengirimkan penagihan tagihan WhatsApp bulanan secara otomatis.
              </p>
              <div className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between">
                <span className="text-[11px] leading-4 font-medium text-muted">Kapasitas Kos Saat Ini:</span>
                <span className="text-[11px] leading-4 font-semibold text-ink">12 Terisi / 12 Terdaftar</span>
              </div>
            </div>

            {/* Mini metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface rounded-xl p-3 shadow-sm flex flex-col">
                <span className="text-[11px] leading-4 font-medium text-muted">Target Okupansi</span>
                <span className="text-lg font-bold text-ink leading-[26px] mt-1">100%</span>
                <span className="text-[11px] leading-4 font-medium text-status-paid flex items-center gap-0.5 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  +1 Kamar
                </span>
              </div>
              <div className="bg-surface rounded-xl p-3 shadow-sm flex flex-col">
                <span className="text-[11px] leading-4 font-medium text-muted">Proyeksi Omset</span>
                <span className="text-lg font-bold text-primary-600 leading-[26px] mt-1">+Rp 1.4M</span>
                <span className="text-[11px] leading-4 font-medium text-muted mt-0.5">per bulan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Bottom Action Bar ────────────────────────────────────── */}
      <div className="fixed bottom-0 left-64 right-0 bg-surface/95 backdrop-blur-xl shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30 px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left status */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-status-paid animate-ping" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ink leading-[22px]">Draf Otomatis Tersimpan</span>
              <span className="text-[11px] leading-4 font-medium text-muted">Perubahan terakhir 1 menit lalu</span>
            </div>
          </div>
          {/* Right actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => navigate('/kamar')}
              className="px-5 py-2.5 rounded-xl text-muted hover:bg-surface-container text-sm font-semibold leading-[22px] transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-ink text-sm font-semibold leading-[22px] transition-colors flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Simpan Draf</span>
            </button>
            <button
              type="submit"
              form="tambahKamarForm"
              disabled={saving || saved}
              className={`px-6 py-2.5 rounded-xl text-on-primary text-sm font-semibold leading-[22px] transition-all flex items-center gap-1 shadow-md ${
                saved
                  ? 'bg-status-paid'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {saved ? 'done_all' : saving ? 'refresh' : 'check_circle'}
              </span>
              <span>
                {saved ? 'Kamar 13 Terbit!' : saving ? 'Menyimpan Kamar...' : 'Simpan & Terbitkan Kamar'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

