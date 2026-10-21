import axios from "axios";

const TOKEN_KEY = "cekost_token";

// Penyimpanan token. Dibungkus try/catch supaya aplikasi tidak error
// kalau localStorage diblokir browser.
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* abaikan */
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* abaikan */
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Tempelkan token JWT ke setiap request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Seragamkan error menjadi { status, message, errors }
// sesuai format kontrak API: { success: false, message, errors }.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? 0;
    const body = error.response?.data;

    // Token tidak valid atau kedaluwarsa: hapus token, arahkan ke login.
    // Request login sendiri dikecualikan agar pesan "password salah" tetap tampil.
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (status === 401 && !isLoginRequest) {
      clearToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    const message =
      body?.message ||
      (status === 0
        ? "Tidak dapat terhubung ke server. Periksa koneksi atau coba lagi."
        : "Terjadi kesalahan. Silakan coba lagi.");

    return Promise.reject({
      status,
      message,
      errors: body?.errors || null,
    });
  }
);

export default api;
