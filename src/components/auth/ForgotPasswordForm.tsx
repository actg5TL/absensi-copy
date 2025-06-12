/**
 * @file ForgotPasswordForm.tsx
 * @fileoverview Komponen formulir untuk proses lupa password.
 * @description Memungkinkan pengguna memasukkan email mereka untuk menerima instruksi reset password.
 * Menampilkan pesan konfirmasi setelah email berhasil dikirim.
 */

// --- IMPOR DEPENDENSI ---
import { useState } from "react"; // Hook untuk state management.
import { Button } from "@/components/ui/button"; // Komponen tombol.
import { Input } from "@/components/ui/input"; // Komponen input.
import { Label } from "@/components/ui/label"; // Komponen label.
import { Link } from "react-router-dom"; // Komponen untuk navigasi.
import { ArrowLeft, Mail } from "lucide-react"; // Ikon.
import AuthLayout from "./AuthLayout"; // Layout pembungkus.
import { useToast } from "@/components/ui/use-toast"; // Hook untuk notifikasi toast.
import { supabase } from "../../../supabase/supabase"; // Klien Supabase.

/**
 * Komponen `ForgotPasswordForm`.
 * @returns {JSX.Element} Elemen JSX yang me-render formulir atau pesan konfirmasi.
 */
export default function ForgotPasswordForm() {
  // --- STATE MANAGEMENT ---
  const [email, setEmail] = useState(""); // State untuk menyimpan email pengguna.
  const [isLoading, setIsLoading] = useState(false); // State untuk status loading.
  const [isSubmitted, setIsSubmitted] = useState(false); // State untuk menandai apakah form sudah disubmit.
  const { toast } = useToast(); // Hook untuk menampilkan notifikasi.

  /**
   * Menangani pengiriman formulir reset password.
   * @param {React.FormEvent} e - Event formulir.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validasi format email sederhana.
      const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Email Tidak Valid",
          description: "Silakan masukkan alamat email yang valid.",
          variant: "destructive",
        });
        return;
      }

      // Mengirim email reset password menggunakan Supabase.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // URL tujuan setelah pengguna mengklik link di email.
        redirectTo: `${window.location.origin}/change-password`,
      });

      if (error) throw error; // Lemparkan error jika ada.

      setIsSubmitted(true); // Set status submitted menjadi true.

      // Tampilkan notifikasi sukses.
      toast({
        title: "Email Reset Terkirim",
        description: "Silakan periksa email Anda untuk instruksi reset password.",
      });
    } catch (error) {
      console.error("Kesalahan Lupa Password:", error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal mengirim email reset. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER KONDISIONAL ---
  // Jika email berhasil dikirim, tampilkan pesan konfirmasi.
  if (isSubmitted) {
    return (
      <AuthLayout>
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto border border-gray-100 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="h-8 w-8 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Periksa Email Anda
          </h2>
          <p className="text-gray-600 mb-6">
            Kami telah mengirimkan instruksi reset password ke <strong>{email}</strong>
          </p>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Tidak menerima email? Periksa folder spam Anda atau coba lagi.
            </p>

            {/* Tombol untuk mencoba mengirim email lagi */}
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              variant="outline"
              className="w-full h-12 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Coba Lagi
            </Button>

            {/* Tombol untuk kembali ke halaman login */}
            <Link to="/login">
              <Button
                variant="ghost"
                className="w-full h-12 rounded-full text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Halaman Masuk
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // --- RENDER FORMULIR DEFAULT ---
  // Tampilan formulir jika email belum dikirim.
  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto border border-gray-100">
        {/* Header Formulir */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lupa Password?
          </h2>
          <p className="text-gray-600">
            Jangan khawatir! Masukkan email Anda dan kami akan mengirim instruksi reset.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Alamat Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan alamat email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500">
              Kami akan mengirim instruksi reset ke alamat email ini.
            </p>
          </div>

          {/* Tombol Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Mengirim..." : "Kirim Instruksi Reset"}
          </Button>

          {/* Tombol Kembali ke Login */}
          <Link to="/login">
            <Button
              type="button"
              variant="ghost"
              className="w-full h-12 rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Halaman Masuk
            </Button>
          </Link>
        </form>
      </div>
    </AuthLayout>
  );
}
