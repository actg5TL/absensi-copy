/**
 * @file LoginForm.tsx
 * @fileoverview Komponen formulir untuk proses login pengguna.
 * @description Komponen ini menyediakan antarmuka bagi pengguna untuk masuk
 * menggunakan email, ID pengguna, atau NIK beserta kata sandi. Ini menangani
 * state formulir, validasi, interaksi dengan layanan otentikasi, dan umpan balik pengguna.
 */

// --- IMPOR DEPENDENSI ---
import { useState } from "react";
import { useAuth } from "../../../supabase/auth"; // Hook kustom untuk interaksi otentikasi Supabase.
import { Button } from "@/components/ui/button"; // Komponen tombol dari ShadCN/UI.
import { Input } from "@/components/ui/input"; // Komponen input dari ShadCN/UI.
import { Label } from "@/components/ui/label"; // Komponen label dari ShadCN/UI.
import { useNavigate, Link } from "react-router-dom"; // Hook dan komponen untuk navigasi.
import { Eye, EyeOff } from "lucide-react"; // Ikon untuk toggle visibilitas kata sandi.
import AuthLayout from "./AuthLayout"; // Komponen layout pembungkus untuk halaman otentikasi.
import { useToast } from "@/components/ui/use-toast"; // Hook untuk menampilkan notifikasi toast.

/**
 * Komponen `LoginForm`.
 * @returns {JSX.Element} Elemen JSX yang me-render formulir login.
 */
export default function LoginForm() {
  // --- STATE MANAGEMENT ---
  // State untuk menyimpan input dari kolom login (bisa email, user_id, atau NIK).
  const [loginField, setLoginField] = useState("");
  // State untuk menyimpan input kata sandi.
  const [password, setPassword] = useState("");
  // State untuk mengontrol visibilitas kata sandi (tampil/sembunyi).
  const [showPassword, setShowPassword] = useState(false);
  // State untuk menyimpan pesan error jika login gagal.
  const [error, setError] = useState("");
  // State untuk menandakan proses login sedang berlangsung (menonaktifkan tombol submit).
  const [isLoading, setIsLoading] = useState(false);

  // --- HOOKS ---
  // Mendapatkan fungsi `signIn` dari konteks otentikasi.
  const { signIn } = useAuth();
  // Hook untuk melakukan navigasi programmatic setelah login berhasil.
  const navigate = useNavigate();
  // Hook untuk menampilkan notifikasi toast.
  const { toast } = useToast();

  /**
   * Menangani proses submit formulir login.
   * @param {React.FormEvent} e - Event dari form submission.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman standar saat form disubmit.
    setIsLoading(true); // Memulai indikator loading.
    setError(""); // Menghapus pesan error sebelumnya.

    try {
      // Validasi sederhana untuk memastikan semua kolom terisi.
      if (!loginField.trim() || !password.trim()) {
        setError("Harap isi semua kolom yang tersedia.");
        return; // Menghentikan proses jika validasi gagal.
      }

      // Memanggil fungsi `signIn` dari hook `useAuth` dengan kredensial pengguna.
      await signIn(loginField, password);

      // Menampilkan notifikasi toast sukses.
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali! Anda akan diarahkan ke dasbor.",
      });

      // Mengarahkan pengguna ke halaman dasbor setelah login berhasil.
      navigate("/dashboard");
    } catch (error) {
      // Menangkap dan menangani error yang mungkin terjadi selama proses login.
      console.error("Login error:", error);
      setError("Kredensial tidak valid. Silakan periksa kembali data Anda.");

      // Menampilkan notifikasi toast error.
      toast({
        title: "Login Gagal",
        description: "Kredensial tidak valid. Silakan coba lagi.",
        variant: "destructive", // Menggunakan varian destruktif (merah) untuk error.
      });
    } finally {
      // Blok `finally` akan selalu dieksekusi, baik sukses maupun gagal.
      setIsLoading(false); // Menghentikan indikator loading.
    }
  };

  // --- RENDER KOMPONEN ---
  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto border border-gray-100">
        {/* Header formulir */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Masuk</h2>
          <p className="text-gray-600">
            Selamat datang kembali! Silakan masuk untuk melanjutkan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Kolom Input: Email, User ID, atau NIK */}
          <div className="space-y-2">
            <Label
              htmlFor="loginField"
              className="text-sm font-medium text-gray-700"
            >
              Email, User ID, atau NIK
            </Label>
            <Input
              id="loginField"
              type="text"
              placeholder="Masukkan email, ID pengguna, atau NIK"
              value={loginField}
              onChange={(e) => setLoginField(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500">
              Anda dapat masuk menggunakan alamat email, ID pengguna, atau NIK.
            </p>
          </div>

          {/* Kolom Input: Kata Sandi dengan Opsi Tampil/Sembunyi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Kata Sandi
              </Label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"} // Tipe input berubah berdasarkan state `showPassword`.
                placeholder="Masukkan kata sandi Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 pr-12 transition-colors"
              />
              {/* Tombol untuk toggle visibilitas kata sandi */}
              <button
                type="button" // `type="button"` mencegah submit form saat diklik.
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Tampilan Pesan Error (jika ada) */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Tombol Submit Utama */}
          <Button
            type="submit"
            disabled={isLoading} // Tombol dinonaktifkan selama proses login.
            className="w-full h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Teks tombol berubah berdasarkan state `isLoading`. */}
            {isLoading ? "Sedang masuk..." : "Masuk"}
          </Button>

          {/* Link untuk Navigasi ke Halaman Pendaftaran */}
          <div className="text-sm text-center text-gray-600 mt-6">
            Belum punya akun?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Daftar di sini
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

