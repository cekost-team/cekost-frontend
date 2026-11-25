import axios from './axios'

const USE_DUMMY =
  import.meta.env.VITE_USE_DUMMY === 'true' ||
  import.meta.env.VITE_USE_DUMMY === undefined

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Data dummy modul-level selaras dengan kamar terisi di src/api/rooms.js (tanggal tahun 2026)
let tenantsStore = [
  {
    id: 't-01',
    nama: 'Andi Saputra',
    noHp: '6281234567890',
    kamarId: '01',
    kamarNomor: '01',
    lantai: 1,
    kamarTipe: 'Tunggal AC',
    tanggalMasuk: '2026-01-01',
    tanggalKeluar: null,
    masaSewaLabel: '11 Bulan Berjalan',
    jatuhTempo: 1,
    deposit: 500000,
    hargaSewa: 1500000,
    status: 'aktif',
    tagihanTerbaru: {
      periode: 'November 2026',
      status: 'lunas',
      nominal: 1500000,
      keterangan: 'Rp 1.500.000 • 4 Nov (BCA)',
    },
  },
  {
    id: 't-02',
    nama: 'Dimas Setiawan',
    noHp: '6281398765432',
    kamarId: '02',
    kamarNomor: '02',
    lantai: 1,
    kamarTipe: 'Tunggal AC',
    tanggalMasuk: '2026-04-03',
    tanggalKeluar: null,
    masaSewaLabel: 'Habis dlm 28 hari',
    kontrakSegeraHabis: true,
    jatuhTempo: 3,
    deposit: 500000,
    hargaSewa: 1500000,
    status: 'aktif',
    tagihanTerbaru: {
      periode: 'November 2026',
      status: 'sebagian',
      nominal: 500000,
      keterangan: 'Sisa Rp 500.000 / 1,5 jt',
    },
  },
  {
    id: 't-03',
    nama: 'Reza F.',
    noHp: '6282111223344',
    kamarId: '03',
    kamarNomor: '03',
    lantai: 1,
    kamarTipe: 'Tunggal AC',
    tanggalMasuk: '2026-03-15',
    tanggalKeluar: null,
    masaSewaLabel: '8 Bulan Berjalan',
    jatuhTempo: 15,
    deposit: 500000,
    hargaSewa: 1500000,
    status: 'aktif',
    tagihanTerbaru: {
      periode: 'November 2026',
      status: 'lunas',
      nominal: 1500000,
      keterangan: 'Aktif s/d 15 Des 2026',
    },
  },
  {
    id: 't-04',
    nama: 'Rian Pratama',
    noHp: '6285777889900',
    kamarId: '04',
    kamarNomor: '04',
    lantai: 1,
    kamarTipe: 'Tunggal Fan',
    tanggalMasuk: '2026-02-01',
    tanggalKeluar: null,
    masaSewaLabel: 'Habis dlm 26 hari',
    kontrakSegeraHabis: true,
    jatuhTempo: 1,
    daysLate: 4,
    deposit: 400000,
    hargaSewa: 1200000,
    status: 'aktif',
    tagihanTerbaru: {
      periode: 'November 2026',
      status: 'telat',
      nominal: 1200000,
      keterangan: 'Rp 1.200.000',
    },
  },
  {
    id: 't-05',
    nama: 'Budi Santoso',
    noHp: '6281922334455',
    kamarId: '05',
    kamarNomor: '05',
    lantai: 1,
    kamarTipe: 'Ganda AC',
    tanggalMasuk: '2026-03-10',
    tanggalKeluar: null,
    masaSewaLabel: '8 Bulan Berjalan',
    jatuhTempo: 10,
    deposit: 600000,
    hargaSewa: 1800000,
    status: 'aktif',
    tagihanTerbaru: {
      periode: 'November 2026',
      status: 'lunas',
      nominal: 1800000,
      keterangan: 'Rp 1.800.000 • QRIS',
    },
  },
  {
    id: 't-07',
    nama: 'Nadia Putri',
    noHp: '6281288990011',
    kamarId: '07',
    kamarNomor: '07',
    lantai: 2,
    kamarTipe: 'Balkon AC',
    tanggalMasuk: '2026-02-05',
    tanggalKeluar: null,
    masaSewaLabel: '9 Bulan Berjalan',
    jatuhTempo: 5,
    deposit: 500000,
    hargaSewa: 1200000,
    status: 'aktif',
    tagihanTerbaru: {
      periode: 'November 2026',
      status: 'lunas',
      nominal: 1200000,
      keterangan: 'Rp 1.200.000 • Tunai',
    },
  },
  {
    id: 't-08',
    nama: 'Siti Rahmawati',
    noHp: '6287855667788',
    kamarId: '08',
    kamarNomor: '08',
    lantai: 2,
    kamarTipe: 'Tunggal',
    tanggalMasuk: '2026-05-05',
    tanggalKeluar: null,
    masaSewaLabel: '6 Bulan Berjalan',
    jatuhTempo: 5,
    deposit: 400000,
    hargaSewa: 1000000,
    status: 'aktif',
    tagihanTerbaru: {
      periode: 'November 2026',
      status: 'belum_bayar',
      nominal: 1000000,
      keterangan: 'Rp 1.000.000',
    },
  },
  {
    id: 't-09',
    nama: 'Farhan H.',
    noHp: '6282244556677',
    kamarId: '09',
    kamarNomor: '09',
    lantai: 2,
    kamarTipe: 'Tunggal AC',
    tanggalMasuk: '2026-04-20',
    tanggalKeluar: null,
    masaSewaLabel: '7 Bulan Berjalan',
    jatuhTempo: 20,
    deposit: 400000,
    hargaSewa: 1000000,
    status: 'aktif',
    tagihanTerbaru: {
      periode: 'November 2026',
      status: 'lunas',
      nominal: 1000000,
      keterangan: 'Aktif s/d 20 Nov 2026',
    },
  },
  {
    id: 't-10',
    nama: 'Agus T.',
    noHp: '6281533445566',
    kamarId: '10',
    kamarNomor: '10',
    lantai: 2,
    kamarTipe: 'Tunggal AC',
    tanggalMasuk: '2026-04-12',
    tanggalKeluar: null,
    masaSewaLabel: '7 Bulan Berjalan',
    jatuhTempo: 12,
    deposit: 500000,
    hargaSewa: 1400000,
    status: 'aktif',
    tagihanTerbaru: {
      periode: 'November 2026',
      status: 'lunas',
      nominal: 1400000,
      keterangan: 'Rp 1.400.000 • Transfer',
    },
  },
  {
    id: 't-12',
    nama: 'Dewi A.',
    noHp: '6281377889911',
    kamarId: '12',
    kamarNomor: '12',
    lantai: 2,
    kamarTipe: 'Balkon',
    tanggalMasuk: '2026-01-18',
    tanggalKeluar: null,
    masaSewaLabel: '10 Bulan Berjalan',
    jatuhTempo: 18,
    deposit: 500000,
    hargaSewa: 1300000,
    status: 'aktif',
    tagihanTerbaru: {
      periode: 'November 2026',
      status: 'lunas',
      nominal: 1300000,
      keterangan: 'Rp 1.300.000 • Transfer',
    },
  },
  {
    id: 't-13',
    nama: 'Hendra Wijaya',
    noHp: '6281277001122',
    kamarId: '06',
    kamarNomor: '06',
    lantai: 1,
    kamarTipe: 'Tunggal Non-AC',
    tanggalMasuk: '2026-02-01',
    tanggalKeluar: '2026-10-15',
    masaSewaLabel: 'Keluar 15 Okt 2026',
    jatuhTempo: 1,
    deposit: 400000,
    hargaSewa: 1100000,
    status: 'pindah',
    tagihanTerbaru: {
      periode: 'Oktober 2026',
      status: 'lunas',
      nominal: 1100000,
      keterangan: 'Lunas saat check-out',
    },
  },
  {
    id: 't-14',
    nama: 'Fajar Ramadhan',
    noHp: '6285644332211',
    kamarId: '11',
    kamarNomor: '11',
    lantai: 2,
    kamarTipe: 'AC Corner',
    tanggalMasuk: '2026-03-10',
    tanggalKeluar: '2026-10-28',
    masaSewaLabel: 'Keluar 28 Okt 2026',
    jatuhTempo: 10,
    deposit: 500000,
    hargaSewa: 1400000,
    status: 'pindah',
    tagihanTerbaru: {
      periode: 'Oktober 2026',
      status: 'lunas',
      nominal: 1400000,
      keterangan: 'Lunas saat check-out',
    },
  },
]

export async function getTenants() {
  if (USE_DUMMY) {
    await wait(250)
    return {
      success: true,
      message: 'Daftar penghuni berhasil dimuat',
      data: [...tenantsStore],
    }
  }
  const { data } = await axios.get('/tenants')
  return data
}

export async function getTenant(id) {
  if (USE_DUMMY) {
    await wait(200)
    const found = tenantsStore.find((t) => t.id === id)
    if (!found) {
      throw new Error('Penghuni tidak ditemukan.')
    }
    return {
      success: true,
      message: 'Detail penghuni berhasil dimuat',
      data: { ...found },
    }
  }
  const { data } = await axios.get(`/tenants/${id}`)
  return data
}

export async function createTenant(payload) {
  if (USE_DUMMY) {
    await wait(250)
    const nextId = `t-${String(tenantsStore.length + 1).padStart(2, '0')}`
    const created = {
      id: nextId,
      nama: payload.nama,
      noHp: payload.noHp,
      kamarId: payload.kamarId || payload.kamarNomor,
      kamarNomor: payload.kamarNomor,
      lantai: Number(payload.lantai) || 1,
      kamarTipe: payload.kamarTipe || 'Tunggal AC',
      tanggalMasuk: payload.tanggalMasuk || '2026-11-05',
      tanggalKeluar: null,
      jatuhTempo: Number(payload.jatuhTempo) || 5,
      deposit: Number(payload.deposit) || 0,
      status: 'aktif',
      tagihanTerbaru: payload.tagihanTerbaru || {
        periode: 'November 2026',
        status: 'belum_bayar',
      },
    }
    tenantsStore = [...tenantsStore, created]
    return {
      success: true,
      message: 'Penghuni baru berhasil ditambahkan',
      data: created,
    }
  }
  const { data } = await axios.post('/tenants', payload)
  return data
}

export async function updateTenant(id, payload) {
  if (USE_DUMMY) {
    await wait(250)
    const idx = tenantsStore.findIndex((t) => t.id === id)
    if (idx === -1) {
      throw new Error('Penghuni tidak ditemukan.')
    }
    const updated = { ...tenantsStore[idx], ...payload }
    tenantsStore = tenantsStore.map((t) => (t.id === id ? updated : t))
    return {
      success: true,
      message: 'Data penghuni berhasil diperbarui',
      data: updated,
    }
  }
  const { data } = await axios.put(`/tenants/${id}`, payload)
  return data
}

export async function checkoutTenant(id, tanggalKeluar = '2026-11-25') {
  if (USE_DUMMY) {
    await wait(250)
    const idx = tenantsStore.findIndex((t) => t.id === id)
    if (idx === -1) {
      throw new Error('Penghuni tidak ditemukan.')
    }
    const updated = {
      ...tenantsStore[idx],
      status: 'pindah',
      tanggalKeluar,
    }
    tenantsStore = tenantsStore.map((t) => (t.id === id ? updated : t))
    return {
      success: true,
      message: `Penghuni ${updated.nama} berhasil check-out`,
      data: updated,
    }
  }
  const { data } = await axios.post(`/tenants/${id}/checkout`, { tanggalKeluar })
  return data
}
