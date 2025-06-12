/**
 * @file main.tsx
 * @fileoverview Titik masuk (entry point) utama untuk aplikasi React.
 * @description File ini bertanggung jawab untuk me-render komponen root (`App`)
 * ke dalam DOM HTML, serta menginisialisasi komponen tingkat atas seperti
 * `BrowserRouter` untuk routing dan `React.StrictMode` untuk pengecekan di mode development.
 */

// --- IMPOR DEPENDENSI ---

// Mengimpor library React inti.
import React from "react";
// Mengimpor ReactDOM, spesifik untuk interaksi dengan DOM di browser.
import ReactDOM from "react-dom/client";
// Mengimpor komponen root dari aplikasi kita.
import App from "./App.tsx";
// Mengimpor stylesheet global yang akan diterapkan di seluruh aplikasi.
import "./index.css";
// Mengimpor komponen `BrowserRouter` untuk mengaktifkan routing berbasis URL di browser.
import { BrowserRouter } from "react-router-dom";
import './i18n'; // Impor konfigurasi i18next

// Mengimpor dan menginisialisasi TempoDevtools (alat bantu development).
import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// --- KONFIGURASI ROUTING ---

// Mendapatkan base URL dari environment variables Vite (`import.meta.env`).
// Ini penting agar routing bekerja dengan benar jika aplikasi di-deploy di dalam sub-folder,
// misalnya `https://example.com/my-app/`.
const basename = import.meta.env.BASE_URL;

// --- RENDER APLIKASI ---

// Mencari elemen HTML dengan ID 'root' di `index.html` dan menjadikannya
// sebagai titik mount untuk aplikasi React.
const rootElement = document.getElementById("root");

// Memastikan elemen root ditemukan sebelum mencoba me-render aplikasi.
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    // `React.StrictMode` adalah pembungkus yang mengaktifkan pengecekan dan peringatan tambahan
    // untuk potensi masalah dalam aplikasi. Ini hanya aktif di mode development.
    <React.StrictMode>
      {/* `BrowserRouter` membungkus aplikasi untuk menyediakan fungsionalitas routing. */}
      {/* `basename` dikonfigurasi di sini untuk semua link dan rute. */}
      <BrowserRouter basename={basename}>
        {/* Merender komponen `App`, yang berisi semua halaman dan logika aplikasi. */}
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
} else {
  // Memberikan pesan error yang jelas di konsol jika elemen root tidak ditemukan.
  console.error("Fatal Error: Root element with id 'root' not found in the DOM.");
}
