import api from './axios'

const USE_DUMMY =
  import.meta.env.VITE_USE_DUMMY === 'true' ||
  import.meta.env.VITE_USE_DUMMY === undefined

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const dummyOwnerSummary = {
  occupancy: {
    occupied: 10,
    total: 12,
    percentage: 83.3,
    emptyRooms: ['09', '11'],
  },
  incomeThisMonth: 14500000,
  incomeGrowth: '+8%',
  totalOverdue: 3200000,
  overdueCount: 3,
  urgentInvoices: [
    {
      id: 'inv-04',
      tenantName: 'Rian Pratama',
      roomNumber: '04',
      roomType: 'Standard Lt 1',
      amount: 1200000,
      dueDate: '2026-11-01',
      daysLate: 4,
      status: 'telat',
      note: 'Jatuh tempo 1 Nov (Telat 4 hari)',
    },
    {
      id: 'inv-08',
      tenantName: 'Siti Rahmawati',
      roomNumber: '08',
      roomType: 'Deluks Lt 2',
      amount: 1000000,
      dueDate: '2026-11-05',
      daysLate: 0,
      status: 'belum_bayar',
      note: 'Jatuh tempo hari ini (5 Nov 2026)',
    },
    {
      id: 'inv-02',
      tenantName: 'Dimas Setiawan',
      roomNumber: '02',
      roomType: 'VIP Lt 1',
      amount: 500000,
      totalAmount: 1500000,
      dueDate: '2026-11-03',
      daysLate: 2,
      status: 'sebagian',
      note: 'Sisa dari Rp 1.500.000 • JT 3 Nov 2026',
    },
  ],
  recentPayments: [
    {
      id: 'pay-01',
      tenantName: 'Andi Saputra',
      roomNumber: '01',
      amount: 1500000,
      method: 'Transfer BCA',
      date: '2026-11-04T14:20:00',
      status: 'lunas',
    },
    {
      id: 'pay-02',
      tenantName: 'Budi Santoso',
      roomNumber: '05',
      amount: 1200000,
      method: 'Tunai',
      date: '2026-11-03T10:15:00',
      status: 'lunas',
    },
    {
      id: 'pay-03',
      tenantName: 'Dewi Lestari',
      roomNumber: '03',
      amount: 1400000,
      method: 'E-Wallet GoPay',
      date: '2026-11-02T18:45:00',
      status: 'lunas',
    },
  ],
}

const dummyTenantSummary = {
  room: {
    number: '04',
    type: 'Standard AC • Lantai 1',
    pricePerMonth: 1200000,
    billingCycle: 'Tiap tanggal 1',
    entryDate: '2026-01-01',
    status: 'aktif',
    facilities: [
      'AC 0.5 PK',
      'Kamar Mandi Dalam',
      'Kasur Spring Bed',
      'Wi-Fi 50 Mbps',
      'Lemari Pakaian',
    ],
  },
  activeInvoice: {
    id: 'inv-tenant-04',
    period: 'November 2026',
    dueDate: '2026-11-01',
    amount: 1200000,
    status: 'telat',
    daysLate: 4,
    includes: 'Air Bersih, Sampah & Wi-Fi',
  },
  bankAccount: {
    bankName: 'Bank Central Asia (BCA)',
    accountNumber: '8271 0492 88',
    accountHolder: 'Bambang Wijaya',
  },
  lastPayment: {
    amount: 1200000,
    date: '2026-10-01T09:30:00',
    method: 'Transfer BCA',
    status: 'lunas',
  },
}

/**
 * Mengambil ringkasan data dashboard pemilik kos (okupansi, finansial, penagihan, riwayat transaksi)
 * Menyesuaikan dengan respons GET /reports/summary
 */
export async function getOwnerSummary() {
  if (USE_DUMMY) {
    await wait(400)
    return dummyOwnerSummary
  }

  const res = await api.get('/reports/summary')
  return res.data.data
}

/**
 * Mengambil ringkasan data portal penghuni kos (kamar, tagihan berjalan, info transfer)
 */
export async function getTenantSummary() {
  if (USE_DUMMY) {
    await wait(400)
    return dummyTenantSummary
  }

  const res = await api.get('/tenant/dashboard')
  return res.data.data
}
