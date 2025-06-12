/**
 * @file SignUpForm.tsx
 * @fileoverview Komponen formulir untuk pendaftaran pengguna baru.
 * @description Menangani input pengguna, validasi, dan proses pendaftaran melalui Supabase.
 */

// --- IMPOR DEPENDENSI ---
import { useState } from "react"; // Hook untuk state management.
import { useAuth } from "../../../supabase/auth"; // Hook kustom untuk interaksi otentikasi Supabase.
import { Button } from "@/components/ui/button"; // Komponen tombol.
import { Input } from "@/components/ui/input"; // Komponen input.
import { Label } from "@/components/ui/label"; // Komponen label.
import { useNavigate, Link } from "react-router-dom"; // Hook dan komponen untuk navigasi.
import { Eye, EyeOff } from "lucide-react"; // Ikon untuk toggle visibilitas password.
import AuthLayout from "./AuthLayout"; // Layout pembungkus untuk halaman otentikasi.
import { useToast } from "@/components/ui/use-toast"; // Hook untuk menampilkan notifikasi toast.

/**
 * Komponen `SignUpForm`.
 * @returns {JSX.Element} Elemen JSX yang me-render formulir pendaftaran.
 */
export default function SignUpForm() {
  // --- STATE MANAGEMENT ---
  // State untuk data input formulir.
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // State untuk fungsionalitas UI.
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- HOOKS ---
  const { signUp } = useAuth(); // Fungsi signUp dari konteks otentikasi.
  const navigate = useNavigate(); // Fungsi untuk navigasi programmatic.
  const { toast } = useToast(); // Fungsi untuk menampilkan notifikasi.

  /**
   * Memvalidasi input formulir berdasarkan aturan yang ditentukan.
   * @returns {boolean} `true` jika valid, `false` jika tidak.
   */
  const validateForm = () => {
    if (userId.length < 3) {
      setError("User ID harus memiliki minimal 3 karakter.");
      return false;
    }
    if (password.length < 8) {
      setError("Password harus memiliki minimal 8 karakter.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return false;
    }
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Silakan masukkan alamat email yang valid.");
      return false;
    }
    return true;
  };

  /**
   * Menangani proses submit formulir pendaftaran.
   * @param {React.FormEvent} e - Event formulir.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset pesan error pada setiap percobaan submit.

    // Validasi form sebelum melanjutkan.
    if (!validateForm()) {
      return;
    }

    setIsLoading(true); // Aktifkan status loading.

    try {
      // Panggil fungsi signUp dari hook useAuth.
      await signUp(email, password, fullName);

      // Tampilkan notifikasi sukses.
      toast({
        title: "Akun Berhasil Dibuat",
        description: "Silakan periksa email Anda untuk verifikasi sebelum masuk.",
        duration: 5000,
      });

      // Arahkan pengguna ke halaman login setelah berhasil.
      navigate("/login");
    } catch (error) {
      console.error("Kesalahan pendaftaran:", error);
      setError("Gagal membuat akun. Silakan coba lagi.");

      // Tampilkan notifikasi error.
      toast({
        title: "Pendaftaran Gagal",
        description: "Terjadi kesalahan saat membuat akun Anda. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Nonaktifkan status loading setelah selesai.
    }
  };

  // --- RENDER KOMPONEN ---
  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto border border-gray-100">
        {/* Header Formulir */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Buat Akun Baru
          </h2>
          <p className="text-gray-600">
            Bergabunglah bersama kami! Isi detail Anda di bawah.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Nama Lengkap */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Nama Lengkap *
            </Label>
            <Input
              id="fullName"
              placeholder="Masukkan nama lengkap Anda"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Input User ID */}
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-sm font-medium text-gray-700">
              User ID *
            </Label>
            <Input
              id="userId"
              placeholder="Buat user ID unik"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              minLength={3}
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500">
              Minimal 3 karakter. Ini akan menjadi pengenal unik Anda.
            </p>
          </div>

          {/* Input Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Alamat Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Input Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Buat password yang kuat"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 pr-12 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Password harus memiliki minimal 8 karakter.
            </p>
          </div>

          {/* Input Konfirmasi Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Konfirmasi Password *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi password Anda"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 pr-12 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Silakan konfirmasi password Anda.
            </p>
          </div>

          {/* Tampilan Pesan Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Tombol Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Membuat akun..." : "Buat Akun"}
          </Button>

          {/* Link Persyaratan Layanan dan Kebijakan Privasi */}
          <div className="text-xs text-center text-gray-500 mt-6">
            Dengan membuat akun, Anda menyetujui{" "}
            <Link to="/" className="text-blue-600 hover:text-blue-700 transition-colors">
              Ketentuan Layanan
            </Link>{" "}
            dan{" "}
            <Link to="/" className="text-blue-600 hover:text-blue-700 transition-colors">
              Kebijakan Privasi
            </Link>{" "}
            kami.
          </div>

          {/* Link ke Halaman Login */}
          <div className="text-sm text-center text-gray-600 mt-6">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Masuk di sini
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
