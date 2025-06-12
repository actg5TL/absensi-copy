// Impor komponen UI dari shadcn/ui dan ikon dari lucide-react.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  MapPin,
  FileText,
  History,
  Settings,
  User,
  Smartphone,
  Wifi,
  Shield,
} from "lucide-react";
// Impor Link untuk navigasi dan useNavigate untuk navigasi programatik dari react-router-dom.
import { Link, useNavigate } from "react-router-dom";
// Impor hook useAuth untuk mengakses status autentikasi pengguna dan fungsi signOut.
import { useAuth } from "../../../supabase/auth";

/**
 * Komponen LandingPage.
 * Menampilkan halaman utama aplikasi dengan informasi fitur dan navigasi.
 * Tampilan berubah tergantung status login pengguna.
 */
export default function LandingPage() {
  // Mengambil informasi pengguna yang sedang login dan fungsi signOut dari hook useAuth.
  const { user, signOut } = useAuth();

  // Hook untuk melakukan navigasi programatik.
  const navigate = useNavigate();

  // Render komponen LandingPage.
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900">
      {/* Header Navigasi Aplikasi */}
      {/* Menggunakan posisi fixed, latar belakang transparan dengan blur, dan bayangan. */}
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo Aplikasi */}
          <div className="flex items-center">
            <Link to="/" className="font-bold text-2xl text-blue-600">
              Absensi
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {/* Tampilan jika pengguna sudah login */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-blue-600 hover:bg-blue-50"
                  >
                    Dashboard
                  </Button>
                </Link>
                {/* Dropdown menu untuk pengguna yang sudah login */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 hover:cursor-pointer ring-2 ring-blue-100">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""} // Fallback jika user.email null
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    {/* Menampilkan email pengguna di label dropdown */}
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* Item menu untuk logout */}
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()} // Memanggil fungsi signOut saat diklik
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : ( // Tampilan jika pengguna belum login
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-blue-600 hover:bg-blue-50"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm px-6 shadow-md">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Konten Utama Halaman */}
      <main className="pt-16">
        {/* Bagian Hero */}
        {/* Menampilkan judul utama, deskripsi singkat, dan tombol call-to-action. */}
        <section className="py-16 sm:py-24 text-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg">
                <Clock className="h-10 w-10 text-white" />
              </div>
            </div>
            {/* Judul Utama Aplikasi */}
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Absensi
            </h1>
            {/* Sub-judul atau Deskripsi Singkat Aplikasi */}
            <h2 className="text-xl sm:text-2xl font-medium text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Mobile-first attendance & leave management PWA with offline
              capabilities and automated notifications
            </h2>
            {/* Tombol Call-to-Action (CTA) */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              {/* Tombol CTA jika pengguna belum login */}
              {!user && (
                <>
                  <Link to="/signup">
                    <Button className="w-full sm:w-auto rounded-full bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
              {/* Tombol CTA jika pengguna sudah login */}
              {/* Tombol CTA jika pengguna sudah login */}
          {user && (
                <Link to="/dashboard">
                  <Button className="w-full sm:w-auto rounded-full bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Bagian Fitur Utama Aplikasi */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-gray-900">
                Key Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need for modern attendance and leave management
              </p>
            </div>
            {/* Grid untuk menampilkan daftar fitur */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Kartu Fitur 1: Quick Attendance */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Quick Attendance
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Record attendance with geolocation verification and timestamp
                  tracking for accurate records.
                </p>
              </div>
              {/* Kartu Fitur 2: Leave Requests */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="h-14 w-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Leave Requests
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Simple form workflow with dropdown selections for department,
                  leave type, and reason categories.
                </p>
              </div>
              {/* Kartu Fitur 3: Offline Support */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="h-14 w-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Wifi className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Offline Support
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Works offline with cached data and syncs automatically when
                  connection is restored.
                </p>
              </div>
              {/* Kartu Fitur 4: Mobile-First */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="h-14 w-14 bg-orange-600 rounded-2xl flex items-center justify-center mb-6">
                  <Smartphone className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Mobile-First
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Clean, card-based interface optimized for mobile devices with
                  comfortable spacing.
                </p>
              </div>
              {/* Kartu Fitur 5: Secure Authentication */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="h-14 w-14 bg-red-600 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Secure Authentication
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Google authentication for secure login and automatic user
                  identification.
                </p>
              </div>
              {/* Kartu Fitur 6: History Tracking */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <History className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  History Tracking
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  View attendance records and leave request history with
                  detailed status tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bagian 'How It Works' */}
        {/* Menjelaskan alur kerja sederhana aplikasi. */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-gray-900">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple workflow designed for efficiency
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Daftar langkah-langkah cara kerja aplikasi */}
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      Sign In Securely
                    </h3>
                    <p className="text-gray-600">
                      Use your Google account for quick and secure
                      authentication.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      Record Attendance
                    </h3>
                    <p className="text-gray-600">
                      Quick geolocation-verified check-in with automatic
                      timestamp recording.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      Submit Leave Requests
                    </h3>
                    <p className="text-gray-600">
                      Easy form with dropdown selections for department, leave
                      type, and reasons.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      Track History
                    </h3>
                    <p className="text-gray-600">
                      View your attendance records and leave request status
                      anytime.
                    </p>
                  </div>
                </div>
              </div>
              {/* Ilustrasi visual untuk bagian 'How It Works' */}
              <div className="bg-white p-8 rounded-3xl shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-blue-600" />
                      <span className="font-medium text-gray-900">
                        Check In
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">09:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-green-600" />
                      <span className="font-medium text-gray-900">
                        Leave Request
                      </span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                      Approved
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-6 w-6 text-purple-600" />
                      <span className="font-medium text-gray-900">
                        Location Verified
                      </span>
                    </div>
                    <span className="text-sm text-purple-600 font-medium">
                      ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bagian Call to Action (CTA) Terakhir */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          {/* Judul CTA */}
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to streamline your attendance management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations using Absensi for efficient
            attendance and leave management.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button className="w-full sm:w-auto rounded-full bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 font-semibold shadow-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          )}
          {/* Tombol CTA jika pengguna sudah login */}
          {user && (
            <Link to="/dashboard">
              <Button className="w-full sm:w-auto rounded-full bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 font-semibold shadow-lg">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900 text-gray-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-2">
                <Link to="/" className="font-bold text-2xl text-white mb-4 block">
                  Absensi
                </Link>
                <p className="text-gray-400 mb-4 max-w-md">
                  Modern attendance and leave management system designed for the
                  mobile-first world.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Security
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Integrations
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              {/* Copyright Aplikasi */}
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Absensi. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
