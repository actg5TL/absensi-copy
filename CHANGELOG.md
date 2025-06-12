# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan dalam file ini.

Format file ini didasarkan pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.04-tl] - 2023-10-27 (Perkiraan)

Versi ini berfokus pada peningkatan kualitas kode, dokumentasi, dan pengalaman pengguna (UX) pada alur otentikasi.

### Added (Ditambahkan)

- **Dokumentasi Kode:** Menambahkan komentar JSDoc yang komprehensif dalam Bahasa Indonesia untuk semua komponen inti dalam alur autentikasi:
  - `LoginForm.tsx`
  - `SignUpForm.tsx`
  - `ForgotPasswordForm.tsx`
  - `ChangePasswordForm.tsx`
  - Komponen `PrivateRoute` di dalam `App.tsx`.
- **File `CHANGELOG.md`:** Membuat file ini untuk melacak riwayat perubahan proyek.
- **Pembaruan `README.md`:** Menambahkan bagian "Pembaruan Terkini & Kontribusi" untuk menyoroti peningkatan kualitas kode.

### Changed (Diubah)

- **Refaktorisasi Navigasi:** Logika navigasi di dalam komponen `PrivateRoute` telah diubah dari penggunaan `window.location.href` menjadi hook `useNavigate()` dari `react-router-dom`. Ini menghilangkan *reload* halaman penuh saat bernavigasi melalui sidebar, menghasilkan pengalaman pengguna yang lebih mulus dan cepat (standar SPA).
- **Standardisasi Bahasa:** Teks antarmuka (UI) pada semua formulir autentikasi telah diterjemahkan dan distandarisasi ke dalam Bahasa Indonesia untuk memberikan pengalaman yang konsisten bagi pengguna.

### Fixed (Diperbaiki)

- (Tidak ada perbaikan bug spesifik di versi ini)
