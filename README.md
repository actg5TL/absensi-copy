# Aplikasi Absen & Ijin Karyawan

**Versi: 1.0.04 tl**

Ini adalah aplikasi web modern yang dirancang untuk membantu perusahaan mengelola absensi dan perizinan karyawan secara efisien. Dibangun dengan teknologi terkini, aplikasi ini menawarkan antarmuka pengguna yang intuitif, responsif, dan kaya fitur.

## Fitur Utama

## Pembaruan Terkini & Kontribusi

- **Peningkatan Kualitas Kode & UX (v1.0.04 tl):**
  - **Refaktorisasi Navigasi:** Logika navigasi pada `PrivateRoute` telah diubah dari `window.location.href` menjadi hook `useNavigate()` dari React Router. Perubahan ini menghasilkan navigasi yang lebih cepat dan mulus khas *Single Page Application* (SPA) tanpa memerlukan *reload* halaman penuh.
  - **Dokumentasi Komprehensif:** Seluruh komponen utama dalam alur autentikasi (`LoginForm`, `SignUpForm`, `ForgotPasswordForm`, `ChangePasswordForm`, dan `PrivateRoute`) kini dilengkapi dengan dokumentasi JSDoc yang detail dalam Bahasa Indonesia. Tujuannya adalah untuk mempermudah pemahaman, pemeliharaan, dan pengembangan lebih lanjut.
  - **Standardisasi Bahasa:** Teks antarmuka pengguna (UI) pada komponen-komponen terkait telah diterjemahkan dan distandarisasi ke dalam Bahasa Indonesia untuk konsistensi.

- **Autentikasi Pengguna Lengkap:**
  - Login, Pendaftaran (Sign Up), Lupa Password.
  - Menggunakan Supabase Auth untuk keamanan.
- **Dasbor Karyawan (`/dashboard`):**
  - Tampilan utama setelah login, menampilkan ringkasan data absensi dan informasi relevan lainnya (`AttendanceDashboard.tsx`).
- **Pengajuan Izin Online (`/leave-request`):
  - Formulir bagi karyawan untuk mengajukan berbagai jenis izin (sakit, cuti, dll.) (`LeaveRequestForm.tsx`).
  - Kolom "Departemen" otomatis terisi dan tidak dapat diubah, berdasarkan profil pengguna.
- **Notifikasi Email Otomatis:**
  - Sistem mengirimkan email notifikasi (misalnya, saat ada pengajuan izin baru) kepada pihak terkait (admin/manajer) menggunakan Supabase Edge Function (`send-leave-notification`) dan Gmail SMTP.
- **Manajemen Profil Pengguna (`/profile`):
  - Pengguna dapat melihat dan memperbarui informasi profil mereka (`ProfilePage.tsx`).
  - Termasuk fitur ganti password (`ChangePasswordForm.tsx`).
- **Pengaturan Aplikasi/Pengguna (`/settings`):
  - Halaman untuk konfigurasi terkait pengguna atau aplikasi (`SettingsPage.tsx`).
- **Panel Admin (Dasar) (`/admin`):
  - Halaman dasbor terpisah (`Dashboard.tsx` dari `src/components/pages/`), kemungkinan untuk fungsi administratif dasar. Perlu pengembangan lebih lanjut untuk fitur admin yang komprehensif.
- **Desain Responsif & Modern:**
  - Tampilan optimal di berbagai perangkat (desktop, tablet, mobile).
  - Sidebar navigasi yang dapat disembunyikan/ditampilkan (*collapsible*) di semua ukuran layar.
  - Menggunakan komponen UI modern dari Shadcn UI/Radix UI.
- **Alat Bantu Internal:**
  - `faqconv.html` dan `tools.html`: Alat bantu internal untuk konversi FAQ dan keperluan lainnya (perlu dideskripsikan lebih lanjut jika relevan dengan operasional aplikasi).

## Teknologi yang Digunakan

- **Frontend:**
  - **React `18.x`** dengan **TypeScript**
  - **Vite:** Build tool modern dan cepat.
  - **Tailwind CSS:** Utility-first CSS framework, dengan plugin `tailwindcss-animate`.
  - **Shadcn UI / Radix UI:** Untuk komponen UI berkualitas tinggi, aksesibel, dan dapat dikustomisasi.
  - **Lucide React:** Pustaka ikon SVG.
  - **React Router DOM `6.x`:** Untuk routing sisi klien.
  - **React Hook Form** & **Zod:** Untuk manajemen formulir dan validasi skema data.
  - **Framer Motion:** Untuk animasi UI (terdeteksi di `package.json`).
- **Backend & Database:**
  - **Supabase:** Platform Backend-as-a-Service (BaaS) meliputi:
    - Database **PostgreSQL**
    - **Supabase Auth** (Autentikasi Pengguna)
    - **Supabase Edge Functions** (Deno Runtime) untuk logika backend, contoh: `send-leave-notification`.
    - **Supabase Storage** (jika digunakan untuk upload file).
- **Layanan Email:**
  - **Nodemailer** (dalam Edge Function) dengan **Gmail SMTP**.
- **Alat Bantu Pengembangan:**
  - **ESLint** & **Prettier:** Untuk linting dan format kode.
  - **Tempo Devtools:** (Terintegrasi melalui Vite) untuk debugging dan pengembangan.

## Struktur Proyek Utama

- `src/`: Kode sumber utama aplikasi frontend.
  - `App.tsx`: Komponen root, mengatur routing utama (`<Routes>`, `PrivateRoute`) dan layout dasar.
  - `main.tsx`: Titik masuk aplikasi, merender `App` dan menginisialisasi `AuthProvider`.
  - `components/`:
    - `auth/`: Komponen terkait autentikasi (`LoginForm.tsx`, `SignUpForm.tsx`, dll.).
    - `pages/`: Komponen untuk halaman utama (`home.tsx`, `profile.tsx`, `settings.tsx`, `dashboard.tsx`).
    - `attendance/`: Komponen spesifik fitur absensi/izin (`AttendanceDashboard.tsx`, `LeaveRequestForm.tsx`).
    - `dashboard/layout/`: Komponen tata letak dasbor (`Sidebar.tsx`, `TopNavigation.tsx`).
    - `ui/`: Komponen UI generik dari Shadcn (misalnya, `Button.tsx`, `Card.tsx`, `Input.tsx`).
  - `lib/`: Utilitas, seperti `utils.ts` (dari Shadcn) dan `helpers.ts`.
  - `supabase/`: Konfigurasi dan helper untuk Supabase (`auth.tsx`, `supabaseClient.ts`).
  - `types/`: Definisi tipe TypeScript, termasuk `supabase.ts` (tipe dari skema DB Supabase).
  - `index.css`: CSS global, termasuk variabel tema Tailwind.
- `supabase/functions/`: Kode untuk Supabase Edge Functions.
  - `send-leave-notification/index.ts`: Fungsi untuk mengirim email notifikasi pengajuan izin.
  - `_shared/`: Kode yang dapat dibagikan antar fungsi (misalnya, `cors.ts`).
- `public/`: Aset statis.
- `.env.example`: Contoh file environment variables.

## Memulai Aplikasi (Untuk Pengembang)

1.  **Prasyarat:**
    *   Node.js (versi `18.x` atau lebih tinggi direkomendasikan).
    *   npm atau yarn (atau pnpm).
2.  **Klon Repositori (jika belum):**
    ```bash
    git clone <URL_REPOSITORI_ANDA>
    cd <NAMA_DIREKTORI_PROYEK>
    ```
3.  **Instalasi Dependensi:**
    ```bash
    npm install
    # atau
    yarn install
    # atau
    pnpm install
    ```
4.  **Konfigurasi Environment Variables:**
    Salin `.env.example` menjadi `.env` dan isi dengan kredensial Supabase Anda:
    ```bash
    cp .env.example .env
    ```
    Edit `.env`:
    ```env
    VITE_SUPABASE_URL=URL_PROYEK_SUPABASE_ANDA
    VITE_SUPABASE_ANON_KEY=KUNCI_ANON_PUBLIK_SUPABASE_ANDA
    ```
    Pastikan juga variabel environment untuk fungsi Supabase (seperti `GMAIL_SMTP_USERNAME`, `GMAIL_SMTP_PASSWORD`, `SUPABASE_SERVICE_ROLE_KEY`) telah diatur di dashboard Supabase proyek Anda.
5.  **Generate Tipe Supabase (Opsional, tapi direkomendasikan):**
    Jika skema database Anda berubah, generate tipe TypeScript:
    ```bash
    npx supabase gen types typescript --project-id "$(grep VITE_SUPABASE_URL .env | cut -d '=' -f2 | sed 's|https://\(.*\).supabase.co.*|\1|')" --schema public > src/types/supabase.ts
    ```
    (Pastikan `jq` terinstal atau sesuaikan perintah untuk mengekstrak project ID jika berbeda)
6.  **Menjalankan Aplikasi (Mode Development):**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:xxxx` (port akan ditampilkan di terminal).
7.  **Deploy Supabase Functions (jika ada perubahan):**
    ```bash
    npx supabase functions deploy <NAMA_FUNGSI> --no-verify-jwt
    # Contoh:
    # npx supabase functions deploy send-leave-notification --no-verify-jwt
    ```
8.  **Build untuk Produksi:**
    ```bash
    npm run build
    ```
    Hasil build akan ada di direktori `dist/`.

## Changelog

### Versi 1.0.04 tl (Pembaruan Terkini)

- **Perbaikan Stabilitas & Refactoring Komponen `AttendanceDashboard.tsx`:**
  - Memperbaiki serangkaian bug kritis yang menyebabkan duplikasi kode dan kerusakan struktur JSX.
  - Melakukan refactoring pada logika pengambilan data (`fetchData`), status (`checkCurrentStatus`), dan penanganan aksi (`handleCheckIn`, `handleCheckOut`) untuk meningkatkan keandalan dan keterbacaan.
  - Menambahkan penanganan untuk state kosong (misalnya, menampilkan pesan "Belum ada riwayat absensi") untuk meningkatkan pengalaman pengguna.
- **Penambahan Komentar Kode Komprehensif (Bahasa Indonesia):**
  - Melanjutkan inisiatif dokumentasi kode dengan menambahkan komentar penjelasan yang sangat detail ke seluruh file komponen utama, termasuk `AttendanceDashboard.tsx` dan `Sidebar.tsx`.
  - Tujuannya adalah untuk membuat alur kerja, manajemen state, dan logika rendering lebih mudah dipahami oleh tim pengembang.

### Versi 1.0.03 tl

Perubahan signifikan dari versi `1.0.02 tl 20250605 - Copy`:

- **Perbaikan Fungsi Notifikasi Email (Supabase Edge Function `send-leave-notification`):**
  - Fungsi telah dioptimalkan untuk mengirim email ke banyak penerima yang diambil dari tabel `app_settings` (format JSON).
  - Mengatasi error runtime `process is not defined` dengan menggunakan `Deno.env.get()`.
  - Memperbaiki impor modul (`@supabase/supabase-js` dari CDN, `nodemailer`) agar kompatibel dengan Deno runtime.
  - Memastikan penggunaan variabel environment Supabase yang benar untuk koneksi dan autentikasi SMTP.
  - Template konten email HTML telah diperbarui.
- **Peningkatan UI & UX Sidebar:**
  - Tombol toggle sidebar (sandwich menu) kini selalu terlihat di semua ukuran layar (menghapus `lg:hidden`).
  - Sidebar di layar besar mendukung mode *collapse* (menyusut menjadi ikon saja) dan *expand* (menampilkan ikon dan label) dengan transisi halus.
- **Peningkatan Form Pengajuan Izin (`LeaveRequestForm.tsx`):**
  - Kolom "Departemen" pada form pengajuan izin kini otomatis terisi berdasarkan data profil pengguna yang login dan tidak dapat diubah (disabled).

**Detail Aktivitas Pengembangan Tambahan pada Versi 1.0.03 tl:**

- **Analisis Proyek Komprehensif:**
  - Identifikasi mendalam terhadap teknologi yang digunakan, struktur folder, dan alur kerja utama aplikasi.
  - Pemetaan fitur berdasarkan analisis routing di `App.tsx` dan komponen-komponen terkait.
  - Pembuatan sitemap logis aplikasi.
- **Penambahan Komentar Kode (Berkelanjutan):**
  - Komentar penjelasan ditambahkan ke berbagai file (`index.html`, `src/index.css`, `src/main.tsx`, dan akan dilanjutkan ke file komponen React dan fungsi Supabase) untuk meningkatkan keterbacaan dan kemudahan pemeliharaan kode.
  - Penerjemahan komentar bahasa Inggris ke Bahasa Indonesia di beberapa bagian kode.
- **Pembaruan Dokumentasi:**
  - `README.md` ini telah diperbarui secara signifikan dengan deskripsi aplikasi yang lebih detail, daftar fitur yang lebih lengkap, teknologi yang digunakan, struktur proyek yang lebih jelas, panduan memulai yang disempurnakan, dan changelog ini.

### Versi 1.0.02 tl (Sebelumnya)

- (Informasi detail mengenai perubahan pada versi ini perlu ditambahkan jika tersedia dari catatan historis atau perbandingan file manual.)

---

Bagian di bawah ini adalah template standar dari Vite, dapat disesuaikan atau dihapus jika tidak relevan seluruhnya.

# React + TypeScript + Vite (Template Bawaan)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```typescript
// tsconfig.json or tsconfig.node.json
{
  "compilerOptions": {
    // ...
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  // ...
}
```

```javascript
// eslintrc.cjs
module.exports = {
  // ...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
