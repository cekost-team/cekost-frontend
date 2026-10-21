import api from "./axios";

// Selama backend belum siap, set VITE_USE_DUMMY=true di .env.
// Kalau endpoint auth Zidan sudah jalan, ubah jadi false (atau hapus barisnya).
const USE_DUMMY = import.meta.env.VITE_USE_DUMMY === "true";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const dummyUsers = [
  {
    email: "owner@cekost.test",
    password: "password123",
    user: { id: "u1", name: "Pemilik Contoh", email: "owner@cekost.test", role: "owner" },
  },
  {
    email: "tenant@cekost.test",
    password: "password123",
    user: { id: "u2", name: "Penghuni Contoh", email: "tenant@cekost.test", role: "tenant" },
  },
];

// POST /auth/login -> { success, message, data: { token, user } }
export async function login({ email, password }) {
  if (USE_DUMMY) {
    await wait(500);
    const found = dummyUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) {
      throw { status: 401, message: "Email atau kata sandi salah.", errors: null };
    }
    return { token: `dummy-token-${found.user.role}`, user: found.user };
  }

  const res = await api.post("/auth/login", { email, password });
  return res.data.data;
}

// POST /auth/register
export async function register(payload) {
  if (USE_DUMMY) {
    await wait(500);
    return { id: "u-baru", ...payload, role: "owner" };
  }

  const res = await api.post("/auth/register", payload);
  return res.data.data;
}

// GET /auth/me -> data pengguna dari token yang tersimpan
export async function getMe() {
  if (USE_DUMMY) {
    await wait(300);
    const token = localStorage.getItem("cekost_token") || "";
    const role = token.endsWith("tenant") ? "tenant" : "owner";
    return dummyUsers.find((u) => u.user.role === role).user;
  }

  const res = await api.get("/auth/me");
  return res.data.data;
}
