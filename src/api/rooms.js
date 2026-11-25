import axios from './axios'

const USE_DUMMY =
  import.meta.env.VITE_USE_DUMMY === 'true' ||
  import.meta.env.VITE_USE_DUMMY === undefined

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Data dummy modul-level agar perubahan bertahan selama navigasi sesi ini
let roomsStore = [
  {
    id: '01',
    nomor: '01',
    tipe: 'Tunggal AC',
    lantai: 1,
    harga: 1500000,
    fasilitas: ['AC', 'K. Mandi Dalam', 'Wi-Fi', 'Springbed'],
    status: 'terisi',
    catatan: 'Sewa lunas periode berjalan',
    penghuni: 'Andi Saputra',
    paymentStatus: 'lunas',
    dueDate: '2026-12-01',
  },
  {
    id: '02',
    nomor: '02',
    tipe: 'Tunggal AC',
    lantai: 1,
    harga: 1500000,
    fasilitas: ['AC', 'K. Mandi Dalam', 'Wi-Fi'],
    status: 'terisi',
    catatan: 'Sisa tagihan Rp 500.000',
    penghuni: 'Dimas Setiawan',
    paymentStatus: 'sebagian',
    dueDate: '2026-11-03',
    remainingAmount: 500000,
  },
  {
    id: '03',
    nomor: '03',
    tipe: 'Tunggal AC',
    lantai: 1,
    harga: 1500000,
    fasilitas: ['AC', 'K. Mandi Dalam', 'Meja Kerja'],
    status: 'terisi',
    catatan: 'Lunas s/d 15 Des 2026',
    penghuni: 'Reza F.',
    paymentStatus: 'lunas',
    dueDate: '2026-12-15',
  },
  {
    id: '04',
    nomor: '04',
    tipe: 'Tunggal Fan',
    lantai: 1,
    harga: 1200000,
    fasilitas: ['Fan', 'K. Mandi Luar', 'Wi-Fi'],
    status: 'terisi',
    catatan: 'Jatuh tempo 1 Nov (Telat 4 hari)',
    penghuni: 'Rian Pratama',
    paymentStatus: 'telat',
    daysLate: 4,
    dueDate: '2026-11-01',
  },
  {
    id: '05',
    nomor: '05',
    tipe: 'Ganda AC',
    lantai: 1,
    harga: 1800000,
    fasilitas: ['Smart TV', 'AC 1 PK', 'Water Heater'],
    status: 'terisi',
    catatan: 'Sewa lunas periode berjalan',
    penghuni: 'Budi Santoso',
    paymentStatus: 'lunas',
    dueDate: '2026-12-10',
  },
  {
    id: '06',
    nomor: '06',
    tipe: 'Tunggal Non-AC',
    lantai: 1,
    harga: 1100000,
    fasilitas: ['Kipas Angin', 'K. Mandi Dalam', 'Kasur Single'],
    status: 'tersedia',
    catatan: 'Kunci unit tersedia di pengelola',
    penghuni: null,
    paymentStatus: null,
    dueDate: null,
  },
  {
    id: '07',
    nomor: '07',
    tipe: 'Balkon AC',
    lantai: 2,
    harga: 1200000,
    fasilitas: ['Balkon Pribadi', 'AC', 'Wi-Fi'],
    status: 'terisi',
    catatan: 'Sewa lunas periode berjalan',
    penghuni: 'Nadia Putri',
    paymentStatus: 'lunas',
    dueDate: '2026-12-05',
  },
  {
    id: '08',
    nomor: '08',
    tipe: 'Tunggal',
    lantai: 2,
    harga: 1000000,
    fasilitas: ['Kasur Single', 'Meja Belajar', 'Wi-Fi'],
    status: 'terisi',
    catatan: 'Sewa lunas periode berjalan',
    penghuni: 'Siti Rahmawati',
    paymentStatus: 'lunas',
    dueDate: '2026-12-01',
  },
  {
    id: '09',
    nomor: '09',
    tipe: 'Tunggal AC',
    lantai: 2,
    harga: 1000000,
    fasilitas: ['AC', 'Wi-Fi', 'K. Mandi Luar'],
    status: 'terisi',
    catatan: 'Sewa lunas periode berjalan',
    penghuni: 'Farhan H.',
    paymentStatus: 'lunas',
    dueDate: '2026-11-20',
  },
  {
    id: '10',
    nomor: '10',
    tipe: 'Tunggal AC',
    lantai: 2,
    harga: 1400000,
    fasilitas: ['AC', 'Lemari Pakaian', 'Wi-Fi'],
    status: 'terisi',
    catatan: 'Sewa lunas periode berjalan',
    penghuni: 'Agus T.',
    paymentStatus: 'lunas',
    dueDate: '2026-12-17',
  },
  {
    id: '11',
    nomor: '11',
    tipe: 'AC Corner',
    lantai: 2,
    harga: 1400000,
    fasilitas: ['Jendela Sudut', 'AC', 'K. Mandi Dalam'],
    status: 'tersedia',
    catatan: 'Sudut jendela luas, sirkulasi segar',
    penghuni: null,
    paymentStatus: null,
    dueDate: null,
  },
  {
    id: '12',
    nomor: '12',
    tipe: 'Balkon',
    lantai: 2,
    harga: 1300000,
    fasilitas: ['Balkon', 'K. Mandi Dalam', 'Meja Rias'],
    status: 'terisi',
    catatan: 'Sewa lunas periode berjalan',
    penghuni: 'Dewi A.',
    paymentStatus: 'lunas',
    dueDate: '2026-12-18',
  },
]

export async function getRooms() {
  if (USE_DUMMY) {
    await wait(250)
    return {
      success: true,
      message: 'Daftar kamar berhasil dimuat',
      data: [...roomsStore],
    }
  }
  const { data } = await axios.get('/rooms')
  return data
}

export async function getRoom(id) {
  if (USE_DUMMY) {
    await wait(200)
    const found = roomsStore.find((r) => r.id === id)
    if (!found) {
      throw new Error('Kamar tidak ditemukan.')
    }
    return {
      success: true,
      message: 'Detail kamar berhasil dimuat',
      data: { ...found },
    }
  }
  const { data } = await axios.get(`/rooms/${id}`)
  return data
}

export async function createRoom(payload) {
  if (USE_DUMMY) {
    await wait(250)
    const normalizedNomor = String(payload.nomor || '').trim().toLowerCase()
    if (!normalizedNomor) {
      throw new Error('Nomor kamar wajib diisi.')
    }
    const exists = roomsStore.some(
      (r) => String(r.nomor).trim().toLowerCase() === normalizedNomor
    )
    if (exists) {
      throw new Error(`Nomor kamar ${payload.nomor} sudah terdaftar.`)
    }

    const nextId = String(roomsStore.length + 1).padStart(2, '0')
    const newRoom = {
      id: nextId,
      nomor: String(payload.nomor).trim(),
      tipe: payload.tipe || 'Kamar Tunggal',
      lantai: Number(payload.lantai) || 1,
      ukuran: payload.ukuran || '',
      harga: Number(payload.harga) || 0,
      deposit: Number(payload.deposit) || 0,
      utilitas: payload.utilitas || 'token',
      fasilitas: Array.isArray(payload.fasilitas) ? payload.fasilitas : [],
      status: payload.status || 'tersedia',
      catatan: payload.catatan || '',
      penghuni: payload.penghuni || null,
      paymentStatus: payload.paymentStatus || null,
      dueDate: payload.dueDate || null,
    }
    roomsStore = [...roomsStore, newRoom]
    return {
      success: true,
      message: 'Kamar baru berhasil ditambahkan',
      data: newRoom,
    }
  }
  const { data } = await axios.post('/rooms', payload)
  return data
}

export async function updateRoom(id, payload) {
  if (USE_DUMMY) {
    await wait(250)
    const index = roomsStore.findIndex((r) => r.id === id)
    if (index === -1) {
      throw new Error('Kamar tidak ditemukan.')
    }
    if (payload.nomor !== undefined) {
      const normalizedNomor = String(payload.nomor).trim().toLowerCase()
      const duplicate = roomsStore.some(
        (r) =>
          r.id !== id &&
          String(r.nomor).trim().toLowerCase() === normalizedNomor
      )
      if (duplicate) {
        throw new Error(`Nomor kamar ${payload.nomor} sudah terdaftar.`)
      }
    }
    const updated = { ...roomsStore[index], ...payload }
    roomsStore = roomsStore.map((r) => (r.id === id ? updated : r))
    return {
      success: true,
      message: 'Data kamar berhasil diperbarui',
      data: updated,
    }
  }
  const { data } = await axios.put(`/rooms/${id}`, payload)
  return data
}

export async function deleteRoom(id) {
  if (USE_DUMMY) {
    await wait(250)
    const target = roomsStore.find((r) => r.id === id)
    if (!target) {
      throw new Error('Kamar tidak ditemukan.')
    }
    if (target.status === 'terisi') {
      throw new Error('Kamar yang sedang terisi tidak dapat dihapus.')
    }
    roomsStore = roomsStore.filter((r) => r.id !== id)
    return {
      success: true,
      message: `Kamar ${target.nomor} berhasil dihapus`,
      data: { id },
    }
  }
  const { data } = await axios.delete(`/rooms/${id}`)
  return data
}
