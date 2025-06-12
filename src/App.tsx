/**
 * @file App.tsx
 * @fileoverview Komponen root aplikasi yang mengatur routing, layout, dan provider utama.
 * @description File ini mendefinisikan struktur navigasi aplikasi menggunakan React Router,
 * memisahkan rute publik dan privat, serta membungkus aplikasi dengan konteks
 * seperti autentikasi (AuthProvider) dan notifikasi (Toaster).
 */

// --- IMPOR DEPENDENSI ---

// Impor hook dari React untuk state management dan lazy loading.
import { Suspense, useState, useEffect } from "react";

// Impor komponen dan hook dari React Router untuk menangani navigasi.
import {
  Navigate, // Komponen untuk pengalihan (redirect).
  Route, // Komponen untuk mendefinisikan sebuah rute.
  Routes, // Komponen pembungkus untuk semua rute.
  useRoutes, // Hook alternatif untuk mendefinisikan rute dalam bentuk objek.
  useLocation, // Hook untuk mendapatkan objek lokasi saat ini.
  useNavigate, // Hook untuk navigasi programmatic (tanpa reload halaman).
} from "react-router-dom";

// Impor rute untuk Tempo Devtools (hanya aktif dalam mode development tertentu).
import routes from "tempo-routes";

// Impor komponen halaman (views) yang akan dirender oleh router.
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import AttendanceDashboard from "./components/attendance/AttendanceDashboard";
import LeaveRequestForm from "./components/attendance/LeaveRequestForm";
import ProfilePage from "./components/pages/profile";
import SettingsPage from "./components/pages/settings";

// Impor provider dan hook autentikasi dari Supabase.
import { AuthProvider, useAuth } from "../supabase/auth";

// Impor komponen UI global.
import { Toaster } from "./components/ui/toaster"; // Untuk menampilkan notifikasi.
import { useTranslation } from 'react-i18next';
import { LoadingScreen } from "./components/ui/loading-spinner"; // Tampilan loading satu halaman penuh.
import TopNavigation from "./components/dashboard/layout/TopNavigation"; // Navigasi atas.
import Sidebar from "./components/dashboard/layout/Sidebar"; // Navigasi samping.

// Impor ikon dari Lucide React.
import {
  Clock,
  FileText,
  User,
  Settings as SettingsIcon,
} from "lucide-react";

// --- KOMPONEN PEMBANTU (HELPER COMPONENT) ---

/**
 * @component PrivateRoute
 * @description Komponen Higher-Order (HOC) untuk melindungi rute yang memerlukan autentikasi.
 * Jika pengguna belum login, akan dialihkan ke halaman utama ('/').
 * Jika autentikasi sedang diproses, menampilkan layar loading.
 * Jika sudah login, merender komponen anak (`children`) di dalam layout dasbor.
 * @param {{ children: React.ReactNode }} props - Komponen anak yang akan dirender jika autentikasi berhasil.
 * @returns {React.ReactElement}
 */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(); // Dapatkan status pengguna dan loading dari AuthContext.
  const { i18n } = useTranslation(); // Dapatkan instance i18n.
  const location = useLocation(); // Dapatkan path URL saat ini.
  const navigate = useNavigate(); // Hook untuk melakukan navigasi secara programmatic.
  const [sidebarOpen, setSidebarOpen] = useState(false); // State untuk mengontrol visibilitas sidebar.

  useEffect(() => {
    // Cek preferensi bahasa pengguna saat data pengguna tersedia
    if (user && user.user_metadata?.language_preference) {
      const preferredLang = user.user_metadata.language_preference;
      if (i18n.language !== preferredLang) {
        i18n.changeLanguage(preferredLang);
      }
    }
  }, [user, i18n]);

  // 1. Tampilkan layar loading saat status autentikasi sedang diperiksa.
  if (loading) {
    return <LoadingScreen text="Mengautentikasi..." />;
  }

  // 2. Jika tidak ada pengguna (belum login), alihkan ke halaman utama.
  if (!user) {
    return <Navigate to="/" />;
  }

  // Fungsi untuk menentukan item sidebar mana yang aktif berdasarkan URL.
  const getActiveItem = () => {
    switch (location.pathname) {
      case "/dashboard": return "Dashboard";
      case "/leave-request": return "Leave Request";
      case "/profile": return "Profile";
      case "/settings": return "Settings";
      default: return "Dashboard"; // Fallback jika tidak ada path yang cocok.
    }
  };

  /**
   * @description Menangani navigasi saat item sidebar diklik.
   * Menggunakan hook `useNavigate` untuk navigasi SPA tanpa reload halaman penuh,
   * sehingga memberikan pengalaman pengguna yang lebih mulus.
   */
  const handleItemClick = (label: string) => {
    const path = `/${label.toLowerCase().replace(' ', '-')}`;
    navigate(path); // Navigasi ke path yang dituju tanpa reload.
    setSidebarOpen(false); // Tutup sidebar setelah klik.
  };

  // 3. Jika pengguna sudah login, render layout dasbor dengan konten halaman.
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          activeItem={getActiveItem()}
          items={[
            { icon: <Clock size={20} />, label: "Dashboard" },
            { icon: <FileText size={20} />, label: "Leave Request" },
            { icon: <User size={20} />, label: "Profile" },
            { icon: <SettingsIcon size={20} />, label: "Settings" },
          ]}
          onItemClick={handleItemClick}
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

/**
 * @component AppRoutes
 * @description Mendefinisikan semua rute navigasi dalam aplikasi.
 * Menggunakan komponen <PrivateRoute> untuk melindungi halaman yang memerlukan login.
 */
function AppRoutes() {
  return (
    <>
      <Routes>
        {/* --- Rute Publik (Tidak Perlu Login) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/success" element={<Success />} />

        {/* --- Rute Privat (Perlu Login) --- */}
        <Route path="/dashboard" element={<PrivateRoute><AttendanceDashboard /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/leave-request" element={<PrivateRoute><LeaveRequestForm /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
      </Routes>

      {/* Render rute Tempo Devtools jika environment variable VITE_TEMPO aktif */}
      {import.meta.env.VITE_TEMPO && <TempoRoutes />}
    </>
  );
}

/**
 * @component TempoRoutes
 * @description Komponen untuk merender rute khusus development dari `tempo-routes`.
 */
function TempoRoutes() {
  const appRoutes = useRoutes(routes);
  return appRoutes;
}

// --- KOMPONEN UTAMA APLIKASI ---

/**
 * @component App
 * @description Komponen root yang membungkus seluruh aplikasi.
 * Tugas utamanya adalah menyediakan konteks global (seperti AuthProvider)
 * dan merender struktur routing aplikasi.
 */
function App() {
  return (
    // Suspense memberikan fallback UI (loading) jika ada komponen yang di-lazy-load.
    <Suspense fallback={<LoadingScreen />}>
      {/* AuthProvider menyediakan data dan status autentikasi ke semua komponen anak. */}
      <AuthProvider>
        {/* AppRoutes berisi semua definisi rute aplikasi. */}
        <AppRoutes />
        {/* Toaster bertanggung jawab untuk menampilkan notifikasi (toast) di seluruh aplikasi. */}
        <Toaster />
      </AuthProvider>
    </Suspense>
  );
}

export default App;
