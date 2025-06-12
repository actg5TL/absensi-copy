/**
 * @file Sidebar.tsx
 * @fileoverview Komponen Sidebar untuk navigasi utama aplikasi.
 * @description Menampilkan panel navigasi samping yang responsif dan dapat diciutkan (collapsible).
 * Menggunakan ShadCN UI untuk komponen dan Lucide untuk ikon.
 */

// Impor hook dan komponen inti dari React.
import React from "react";

// Impor komponen UI kustom dari direktori components/ui (diasumsikan dari ShadCN).
import { Button } from "@/components/ui/button"; // Tombol interaktif.
import { ScrollArea } from "@/components/ui/scroll-area"; // Area konten yang dapat di-scroll.
import { Separator } from "@/components/ui/separator"; // Garis pemisah visual.

// Impor berbagai ikon dari pustaka 'lucide-react' untuk memperkaya visual.
import {
  Home, // Ikon untuk halaman utama.
  LayoutDashboard, // Ikon untuk dasbor.
  Calendar, // Ikon untuk kalender.
  Users, // Ikon untuk manajemen tim/pengguna.
  Settings, // Ikon untuk pengaturan.
  HelpCircle, // Ikon untuk bantuan atau FAQ.
  FolderKanban, // Ikon untuk proyek atau papan kanban.
} from "lucide-react";

// --- DEFINISI TIPE DATA (TYPESCRIPT) ---

/**
 * @interface NavItem
 * @description Mendefinisikan struktur data untuk setiap item navigasi di dalam sidebar.
 */
interface NavItem {
  icon: React.ReactNode; // Komponen ikon (JSX) yang akan ditampilkan di samping label.
  label: string; // Teks label yang ditampilkan untuk item navigasi.
  href?: string; // URL tujuan saat item diklik. Opsional, karena aksi bisa ditangani oleh `onItemClick`.
  isActive?: boolean; // Menandakan apakah item ini sedang aktif. Digunakan untuk styling.
}

/**
 * @interface SidebarProps
 * @description Mendefinisikan properti (props) yang dapat diterima oleh komponen Sidebar.
 */
interface SidebarProps {
  items?: NavItem[]; // Daftar item navigasi utama. Jika tidak disediakan, akan menggunakan `defaultNavItems`.
  activeItem?: string; // Label dari item yang sedang aktif, untuk menyorot item yang benar.
  onItemClick?: (label: string) => void; // Fungsi callback yang dipanggil saat sebuah item navigasi diklik.
  isOpen?: boolean; // Status sidebar saat ini (terbuka atau tertutup/ciut).
  onToggle?: () => void; // Fungsi callback untuk mengubah status `isOpen`, terutama untuk tombol di mode mobile.
}

// --- DATA DEFAULT ---

// Daftar item navigasi default yang digunakan jika tidak ada `items` yang diberikan melalui props.
const defaultNavItems: NavItem[] = [
  { icon: <Home size={20} />, label: "Home", isActive: true },
  { icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { icon: <FolderKanban size={20} />, label: "Projects" },
  { icon: <Calendar size={20} />, label: "Calendar" },
  { icon: <Users size={20} />, label: "Team" },
];

// Daftar item navigasi yang selalu muncul di bagian bawah sidebar (misal: Pengaturan, Bantuan).
const defaultBottomItems: NavItem[] = [
  { icon: <Settings size={20} />, label: "Settings" },
  { icon: <HelpCircle size={20} />, label: "Help" },
];

// --- KOMPONEN UTAMA ---

/**
 * Komponen Sidebar
 * @param {SidebarProps} props - Properti untuk mengonfigurasi sidebar.
 * @returns {React.ReactElement} - Elemen JSX dari komponen sidebar.
 */
const Sidebar = ({
  items = defaultNavItems, // Gunakan item default jika props `items` tidak ada.
  activeItem = "Home", // Default item aktif adalah 'Home'.
  onItemClick = () => {}, // Sediakan fungsi kosong sebagai fallback untuk `onItemClick`.
  isOpen = false, // Secara default, sidebar dalam keadaan tertutup/ciut.
  onToggle = () => {}, // Sediakan fungsi kosong sebagai fallback untuk `onToggle`.
}: SidebarProps) => {
  return (
    <>
      {/* Lapisan Overlay untuk Mode Mobile */}
      {/* Ditampilkan hanya saat sidebar terbuka (`isOpen` true) di layar kecil (di bawah breakpoint `lg`). */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle} // Menutup sidebar saat area overlay ini diklik.
        />
      )}

      {/* Kontainer Utama Sidebar */}
      <aside
        className={`
        fixed lg:relative top-0 left-0 z-50 lg:z-auto /* Posisi: 'fixed' di mobile, 'relative' di desktop. */
        h-full bg-white/80 backdrop-blur-md border-r border-gray-200 flex flex-col /* Styling: tinggi penuh, latar belakang, border, layout flex kolom. */
        transform transition-all duration-300 ease-in-out  /* Efek transisi untuk animasi buka/tutup yang mulus. */
        ${isOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0 lg:w-[80px] w-[280px]"} /* Logika transisi: 'terbuka' vs 'tertutup'. */
        lg:w-[280px] /* Lebar tetap di layar desktop (selalu terbuka lebar). */
      `}
      >
        {/* Bagian Header Sidebar */}
        <div className={`p-6 ${!isOpen && 'lg:px-4'}`}> {/* Padding berubah saat diciutkan */}
          <h2 className={`text-xl font-semibold mb-2 text-gray-900 ${!isOpen && 'lg:hidden'}`}>Absensi</h2>
          <p className={`text-sm text-gray-500 ${!isOpen && 'lg:hidden'}`}>Attendance & Leave Management</p>
          
          {/* Ikon yang ditampilkan saat sidebar diciutkan di layar besar */}
          {!isOpen && (
            <div className="hidden lg:flex items-center justify-center py-4">
              <Home size={28} className="text-blue-600" /> {/* Ikon placeholder saat diciutkan */}
            </div>
          )}
        </div>

        {/* Area Konten Navigasi Utama yang Dapat Di-scroll */}
        <ScrollArea className="flex-1 px-4"> {/* `flex-1` membuat area ini mengisi sisa ruang vertikal */}
          <div className="space-y-1.5"> {/* Memberi jarak antar item navigasi */}
            {/* Iterasi dan render setiap item navigasi dari props `items` */}
            {items.map((item) => (
              <Button
                key={item.label} // Kunci unik untuk setiap elemen dalam list.
                variant={"ghost"} // Varian tombol tanpa latar belakang solid.
                className={`w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium ${item.label === activeItem ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "text-gray-700 hover:bg-gray-100"}`} // Styling dinamis berdasarkan status `activeItem`.
                onClick={() => onItemClick(item.label)} // Panggil callback saat tombol diklik.
              >
                <span
                  className={`${item.label === activeItem ? "text-blue-600" : "text-gray-500"}`}
                >
                  {item.icon} {/* Render ikon */}
                </span>
                {/* Sembunyikan label saat sidebar diciutkan di layar besar (lg) */}
                <span className={`${!isOpen && 'lg:hidden'}`}>{item.label}</span>
              </Button>
            ))}
          </div>

          <Separator className="my-4 bg-gray-100" /> {/* Garis pemisah visual */}

          {/* Bagian Filter (Contoh Statis) */}
          <div className="space-y-3">
            <h3 className={`text-xs font-medium px-4 py-1 text-gray-500 uppercase tracking-wider ${!isOpen && 'lg:hidden'}`}>
              Filters
            </h3>
            {/* Contoh tombol filter statis */}
            <Button variant="ghost" className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className={`${!isOpen && 'lg:hidden'}`}>Active</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              <span className={`${!isOpen && 'lg:hidden'}`}>High Priority</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
              <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
              <span className={`${!isOpen && 'lg:hidden'}`}>In Progress</span>
            </Button>
          </div>
        </ScrollArea>

        {/* Bagian Bawah Sidebar (Footer) */}
        <div className="p-4 mt-auto border-t border-gray-200"> {/* `mt-auto` mendorong bagian ini ke bawah */}
          {/* Iterasi dan render item navigasi bawah */}
          {defaultBottomItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 mb-1.5"
              onClick={() => onItemClick(item.label)}
            >
              <span className="text-gray-500">{item.icon}</span>
              <span className={`${!isOpen && 'lg:hidden'}`}>{item.label}</span>
            </Button>
          ))}
        </div>
      </aside>
    </>
  );
};

// Ekspor komponen Sidebar sebagai default export.
export default Sidebar;
