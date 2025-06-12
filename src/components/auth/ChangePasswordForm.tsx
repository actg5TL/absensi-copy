/**
 * @file ChangePasswordForm.tsx
 * @fileoverview Komponen formulir untuk mengubah password pengguna yang sudah login.
 * @description Formulir ini biasanya digunakan di halaman pengaturan akun.
 * Memvalidasi input dan menangani pembaruan password melalui Supabase.
 */

// --- IMPOR DEPENDENSI ---
import { useState } from "react"; // Hook untuk state management.
import { Button } from "@/components/ui/button"; // Komponen tombol.
import { Input } from "@/components/ui/input"; // Komponen input.
import { Label } from "@/components/ui/label"; // Komponen label.
import { Eye, EyeOff, Lock } from "lucide-react"; // Ikon.
import { useToast } from "@/components/ui/use-toast"; // Hook untuk notifikasi toast.
import { supabase } from "../../../supabase/supabase"; // Klien Supabase.

/**
 * Komponen `ChangePasswordForm`.
 * @returns {JSX.Element} Elemen JSX yang me-render formulir ubah password.
 */
export default function ChangePasswordForm() {
  // --- STATE MANAGEMENT ---
  const [currentPassword, setCurrentPassword] = useState(""); // State untuk password saat ini.
  const [newPassword, setNewPassword] = useState(""); // State untuk password baru.
  const [confirmPassword, setConfirmPassword] = useState(""); // State untuk konfirmasi password baru.
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // State untuk toggle visibilitas password saat ini.
  const [showNewPassword, setShowNewPassword] = useState(false); // State untuk toggle visibilitas password baru.
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State untuk toggle visibilitas konfirmasi password.
  const [isLoading, setIsLoading] = useState(false); // State untuk status loading.
  const { toast } = useToast(); // Hook untuk menampilkan notifikasi.

  /**
   * Memvalidasi input formulir sebelum pengiriman.
   * @returns {boolean} `true` jika valid, `false` jika tidak.
   */
  const validateForm = () => {
    if (!currentPassword.trim()) {
      toast({
        title: "Password Saat Ini Diperlukan",
        description: "Silakan masukkan password Anda saat ini.",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password Terlalu Pendek",
        description: "Password baru harus memiliki minimal 8 karakter.",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Tidak Cocok",
        description: "Password baru dan konfirmasi password harus sama.",
        variant: "destructive",
      });
      return false;
    }

    if (currentPassword === newPassword) {
      toast({
        title: "Password Sama",
        description: "Password baru harus berbeda dari password saat ini.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  /**
   * Menangani pengiriman formulir untuk mengubah password.
   * @param {React.FormEvent} e - Event formulir.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return; // Hentikan jika validasi gagal.

    setIsLoading(true);

    try {
      // Memperbarui password pengguna menggunakan Supabase Auth.
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error; // Lemparkan error jika ada.

      // Reset semua field setelah berhasil.
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Tampilkan notifikasi sukses.
      toast({
        title: "Password Diperbarui",
        description: "Password Anda telah berhasil diubah.",
      });
    } catch (error: any) {
      console.error("Kesalahan Ubah Password:", error);
      toast({
        title: "Gagal Memperbarui Password",
        description:
          error.message || "Gagal memperbarui password. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER KOMPONEN ---
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Input Password Saat Ini */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
          Password Saat Ini *
        </Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Masukkan password Anda saat ini"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 pr-12 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={showCurrentPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Input Password Baru */}
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
          Password Baru *
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="Masukkan password baru Anda"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 pr-12 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={showNewPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Password harus memiliki minimal 8 karakter.
        </p>
      </div>

      {/* Input Konfirmasi Password Baru */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Konfirmasi Password Baru *
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Konfirmasi password baru Anda"
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
          Silakan konfirmasi password baru Anda.
        </p>
      </div>

      {/* Tombol Submit */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Lock className="h-4 w-4 mr-2 animate-pulse" />
              Memperbarui Password...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Perbarui Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
