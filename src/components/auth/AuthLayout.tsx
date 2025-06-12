/**
 * @file AuthLayout.tsx
 * @fileoverview Komponen layout untuk halaman-halaman otentikasi.
 * @description Menyediakan struktur visual yang konsisten (header, background, centering)
 * untuk halaman seperti Login, Sign Up, dan Forgot Password.
 */

// --- IMPOR DEPENDENSI ---
import { ReactNode } from "react"; // Tipe data untuk children komponen React.
import { Link } from "react-router-dom"; // Komponen untuk navigasi internal.

/**
 * Properti untuk komponen AuthLayout.
 * @interface AuthLayoutProps
 */
interface AuthLayoutProps {
  /**
   * Komponen anak yang akan di-render di dalam layout ini (misalnya, formulir login).
   * @type {ReactNode}
   */
  children: ReactNode;
}

/**
 * Komponen `AuthLayout`.
 * @param {AuthLayoutProps} props - Properti yang diterima oleh komponen.
 * @returns {JSX.Element} Elemen JSX yang me-render layout otentikasi.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // Container utama dengan background gradien dan tinggi minimal satu layar.
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header navigasi yang tetap di bagian atas halaman */}
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo atau Nama Aplikasi */}
          <div className="flex items-center">
            <Link to="/" className="font-bold text-2xl text-blue-600">
              AbsensiApp
            </Link>
          </div>
          {/* Menu Navigasi (tersembunyi di mobile) */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Fitur
            </Link>
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Harga
            </Link>
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dukungan
            </Link>
          </nav>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="max-w-md w-full">
          {/* Header Konten (Logo dan Judul) */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
              {/* Ikon centang sebagai representasi visual */}
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Selamat Datang di AbsensiApp
            </h2>
            <p className="text-lg text-gray-600">
              Solusi manajemen absensi modern untuk Anda.
            </p>
          </div>
          {/* Di sini komponen anak (misalnya, LoginForm) akan dirender */}
          {children}
        </div>
      </main>
    </div>
  );
}

