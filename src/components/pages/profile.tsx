// Impor hook useState dan useEffect dari React untuk pengelolaan state dan side effects.
import { useState, useEffect } from "react";
// Impor komponen UI kustom dari direktori components/ui.
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Building,
  Save,
  Loader2,
  Briefcase,
  UserCircle,
  BadgeInfo,
  Users,
} from "lucide-react"; // Impor ikon dari pustaka lucide-react.
// Impor hook useAuth untuk mengakses informasi autentikasi pengguna dari Supabase.
import { useAuth } from "../../../supabase/auth";
// Impor instance client Supabase untuk interaksi dengan database.
import { supabase } from "../../../supabase/supabase";
// Impor hook useToast untuk menampilkan notifikasi toast.
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
// Impor komponen TopNavigation, meskipun tidak digunakan secara langsung di JSX halaman ini (mungkin bagian dari layout yang lebih tinggi).
import TopNavigation from "../dashboard/layout/TopNavigation";

// Interface UserProfile mendefinisikan struktur data untuk profil pengguna.
interface UserProfile {
  full_name?: string;
  email?: string;
  custom_user_id?: string; // Field untuk custom user ID (3-8 karakter)
  nik?: string; // Field baru untuk NIK (16 digit)
  phone?: string;
  department?: string;
  position?: string;
  location?: string;
  gender?: "male" | "female" | ""; // Field baru untuk gender
  birth_date?: string; // Field baru untuk tanggal lahir
  language?: "en" | "id"; // Field baru untuk bahasa
  avatar_url?: string; // URL untuk avatar pengguna.
}

// Fungsi utilitas toTitleCase untuk mengubah string menjadi format Title Case.
// Contoh: "hello world" menjadi "Hello World".
const toTitleCase = (str: string | undefined) => {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Komponen utama untuk halaman profil pengguna.
export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  // Mengambil objek pengguna yang sedang login dari hook useAuth.
  const { user } = useAuth();
  // Mengambil fungsi toast dari hook useToast untuk menampilkan notifikasi.
  const { toast } = useToast();
  // State untuk menyimpan data profil pengguna yang akan ditampilkan dan diedit.
  const [profile, setProfile] = useState<UserProfile>({
    full_name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    custom_user_id: "", // Inisialisasi field baru
    nik: "", // Inisialisasi NIK
    phone: "",
    department: "",
    position: "",
    location: "",
    gender: "", // Inisialisasi gender
    birth_date: "", // Inisialisasi tanggal lahir
    language: "en", // Default bahasa English, bisa diubah pengguna.
  });

  // State untuk cache departemen dari localStorage
  // State untuk menyimpan daftar departemen yang tersedia, diambil dari settings atau cache.
  const [departments, setDepartments] = useState<string[]>([]);
  // State untuk menandakan status loading data profil.
  const [isLoading, setIsLoading] = useState(false);
  // State untuk menandakan status penyimpanan data profil.
  const [isSaving, setIsSaving] = useState(false);

  // useEffect hook untuk mengambil data profil dan daftar departemen saat komponen dimuat atau user berubah.
  useEffect(() => {
    if (user) {
      fetchProfile();
      loadDepartments(); // Load departemen dari settings
    }
  }, [user]); // Dependensi pada 'user', sehingga akan dijalankan ulang jika 'user' berubah.

  // Function untuk load departemen dari settings
  // Fungsi asinkron untuk memuat daftar departemen.
  // Mencoba mengambil dari tabel 'app_settings' di Supabase, kemudian fallback ke default jika gagal.
  // Hasilnya juga disimpan di localStorage untuk penggunaan offline.
  const loadDepartments = async () => {
    try {
      // Ambil data departemen dari app_settings
      const { data, error } = await supabase
        .from("app_settings")
        .select("setting_value")
        .eq("setting_key", "departments")
        .single();

      if (error) {
        console.error("Error fetching departments:", error);
        // Fallback ke default departments
        const defaultDepts = [
          "Human Resources",
          "Information Technology",
          "Finance",
          "Marketing",
          "Operations",
          "Sales",
          "Customer Service",
          "Administration",
        ];
        setDepartments(defaultDepts);
        return;
      }

      if (data && data.setting_value) {
        setDepartments(data.setting_value);
        // Cache ke localStorage untuk offline use
        localStorage.setItem("departments", JSON.stringify(data.setting_value));
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      // Fallback ke cache localStorage jika ada
      const cachedDepts = localStorage.getItem("departments");
      // Jika ada data departemen di cache localStorage, gunakan itu.
      if (cachedDepts) {
        setDepartments(JSON.parse(cachedDepts));
      }
    }
  };

  // Fungsi asinkron untuk mengambil data profil pengguna dari tabel 'users' di Supabase.
  const fetchProfile = async () => {
    try {
      setIsLoading(true); // Set status loading menjadi true.
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || user?.user_metadata?.full_name || "",
          email: data.email || user?.email || "",
          custom_user_id: data.custom_user_id || "", // Load custom_user_id dari database
          nik: data.nik || "", // Load NIK dari database
          phone: data.phone || "",
          department: data.department || "",
          position: data.position || "",
          location: data.location || "",
          gender: data.gender || "", // Load gender dari database
          birth_date: data.birth_date || "", // Load tanggal lahir dari database
          language: data.language || "en", // Load bahasa dari database
          avatar_url: data.avatar_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false); // Set status loading menjadi false setelah selesai.
    }
  };

  // Fungsi asinkron untuk menangani penyimpanan perubahan data profil.
  const handleSave = async () => {
    if (!user) return;

    // Validasi field wajib
    // Daftar field yang wajib diisi oleh pengguna.
    const requiredFields: (keyof UserProfile)[] = ['full_name', 'gender', 'birth_date', 'department', 'language', 'position', 'location'];
    // Label yang lebih ramah pengguna untuk field wajib, digunakan dalam pesan error.
    const fieldLabels: Partial<Record<keyof UserProfile, string>> = {
      full_name: t('profile.form.fullName'),
      gender: t('profile.form.gender'),
      birth_date: t('profile.form.birthDate'),
      department: t('profile.form.department'),
      language: t('profile.form.language'),
      position: t('profile.form.position'),
      location: t('profile.form.location'),
    };  

    // Iterasi melalui setiap field wajib untuk validasi.
    for (const field of requiredFields) {
      // Jika field kosong atau hanya berisi spasi (untuk string), tampilkan error.
      if (!profile[field] || (typeof profile[field] === 'string' && !(profile[field] as string).trim())) {
        toast({
          title: t('profile.toast.validationErrorTitle'),
          description: t('profile.toast.validationErrorDesc', { field: fieldLabels[field] || field.replace('_', ' ') }),
          variant: "destructive",
        });
        return;
      }
    }

    if (!user) return;

    try {
      setIsSaving(true); // Set status penyimpanan menjadi true.

      // Validasi custom_user_id
      // Validasi untuk field custom_user_id jika diisi.
      if (profile.custom_user_id) {
        // Ubah custom_user_id menjadi huruf kecil untuk konsistensi.
        const userIdLower = profile.custom_user_id.toLowerCase();
        // Validasi panjang karakter custom_user_id (antara 3-8 karakter).
        if (userIdLower.length < 3 || userIdLower.length > 8) {
          toast({
            title: "Invalid User ID",
            description: "User ID must be between 3-8 characters.",
            variant: "destructive",
          });
          return;
        }
        // Validasi bahwa custom_user_id hanya berisi huruf kecil dan angka.
        if (!/^[a-z0-9]+$/.test(userIdLower)) {
          toast({
            title: "Invalid User ID",
            description:
              "User ID can only contain lowercase letters and numbers.",
            variant: "destructive",
          });
          return;
        }
        // Update state profile dengan custom_user_id yang sudah di-lowercase.
        profile.custom_user_id = userIdLower;
      }

      // Validasi NIK: harus 16 digit dan hanya berisi angka.
      if (
        profile.nik &&
        (profile.nik.length !== 16 || !/^\d{16}$/.test(profile.nik))
      ) {
        toast({
          title: "Invalid NIK",
          description: "NIK must be exactly 16 digits.",
          variant: "destructive",
        });
        return;
      }

      // Memproses beberapa field sebelum disimpan, contohnya mengubah full_name menjadi Title Case.
      const processedProfile = {
        ...profile,
        full_name: toTitleCase(profile.full_name),
      };

      // Melakukan operasi upsert (update atau insert jika belum ada) ke tabel 'users' di Supabase.
      const { error } = await supabase.from("users").upsert({
        id: user.id,
        user_id: user.id, // Keep original user_id as UUID
        custom_user_id: processedProfile.custom_user_id, // Simpan custom user ID
        nik: processedProfile.nik, // Simpan NIK
        full_name: processedProfile.full_name,
        email: profile.email || user.email,
        phone: processedProfile.phone,
        department: processedProfile.department,
        position: processedProfile.position,
        location: processedProfile.location,
        gender: processedProfile.gender, // Simpan gender
        birth_date: processedProfile.birth_date, // Simpan tanggal lahir
        language: processedProfile.language, // Simpan bahasa
        avatar_url: processedProfile.avatar_url,
        token_identifier: user.email || user.id,
        updated_at: new Date().toISOString(), // Set waktu pembaruan ke waktu saat ini.
      });

      // Jika ada error dari Supabase, lemparkan error tersebut untuk ditangani di blok catch.
      if (error) throw error;

      toast({
        title: t('profile.toast.updateSuccessTitle'),
        description: t('profile.toast.updateSuccessDesc'),
      });
      // Ganti bahasa secara dinamis jika berubah
      if (i18n.language !== profile.language) {
        i18n.changeLanguage(profile.language);
      }
    } catch (error) {
      // Log error ke konsol untuk debugging.
      console.error("Error updating profile:", error);
      toast({
        title: t('profile.toast.updateFailedTitle'),
        description: t('profile.toast.updateFailedDesc'),
        variant: "destructive", // Varian toast untuk error.
      });
    // Blok finally akan selalu dijalankan, baik sukses maupun gagal.
    } finally {
      // Set status penyimpanan kembali ke false.
      setIsSaving(false);
    }
  };

  // Fungsi untuk menangani perubahan nilai pada input field di form.
  // Menerima 'field' (nama field dari UserProfile) dan 'value' (nilai baru dari input).
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    // Untuk custom_user_id, convert ke lowercase dan filter hanya alphanumeric
    // Perlakuan khusus untuk field 'custom_user_id'.
    if (field === "custom_user_id") {
      // Membersihkan nilai: ubah ke lowercase, hapus karakter non-alphanumeric, dan batasi panjang maksimal 8 karakter.
      const cleanValue = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 8);
      // Update state profile dengan nilai yang sudah dibersihkan.
      setProfile((prev) => ({ ...prev, [field]: cleanValue }));
    } else {
      // Untuk field lain, update state profile secara langsung dengan nilai baru.
      setProfile((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Kondisi untuk menampilkan UI loading saat data sedang diambil.
  // Jika isLoading bernilai true, maka komponen akan merender tampilan loading.
  if (isLoading) {
    return (
      // Container utama untuk tampilan loading.
      // Menggunakan Flexbox untuk memusatkan konten secara horizontal dan vertikal.
      // min-h-[calc(100vh-64px)] mengatur tinggi minimal agar loader berada di tengah viewport (dikurangi tinggi header jika ada).
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="flex items-center space-x-2">
          {/* Komponen ikon Loader2 dari lucide-react dengan animasi berputar (animate-spin). */}
          <Loader2 className="h-6 w-6 animate-spin" />
          {/* Teks informatif yang ditampilkan bersama ikon loader. */}
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Bagian return utama dari komponen ProfilePage, merender UI halaman profil.
  // Container utama dengan kelas Tailwind CSS untuk styling:
  // - max-w-4xl: Lebar maksimal konten.
  // - mx-auto: Memusatkan container secara horizontal.
  // - p-6: Padding di semua sisi.
  // - space-y-6: Memberikan jarak vertikal antar elemen anak langsung.
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* === Bagian Header Halaman === */}
      <div className="text-center mb-8"> {/* Container untuk header, teks di tengah dengan margin bawah. */}
        {/* Judul utama halaman 'Profile'. */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profile.headerTitle')}</h1>
        <p className="text-lg text-gray-600">
          {t('profile.headerDescription')}
        </p>
      </div>

      {/* === Layout Utama Konten (Grid) === */}
      {/* Menggunakan sistem grid Tailwind CSS untuk mengatur tata letak kartu profil dan form edit.
           - grid-cols-1: Satu kolom pada layar kecil.
           - lg:grid-cols-3: Tiga kolom pada layar besar (lg) dan di atasnya.
           - gap-6: Jarak antar item grid. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === Kartu Profil Pengguna (Kolom Kiri) === */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="items-center text-center p-6">
            {/* Avatar Pengguna */}
            <Avatar className="w-24 h-24 mx-auto mb-4 ring-2 ring-offset-2 ring-blue-500">
              <AvatarImage
                src={profile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.email || 'default'}`}
                alt={profile.full_name || "User Avatar"}
              />
              <AvatarFallback>
                {profile.full_name
                  ? profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            {/* Nama Lengkap Pengguna */}
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {toTitleCase(profile.position) || t('profile.card.placeholderPosition')}
            </CardTitle>
            {/* Email Pengguna */}
            <CardDescription className="text-gray-600">
              {profile.email || "email@example.com"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4 px-6 pb-6">
            {/* Informasi Posisi */}
            {profile.position && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.position}</span>
              </div>
            )}
            {/* Informasi Departemen */}
            {profile.department && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.department}</span>
              </div>
            )}
            {/* Informasi Lokasi */}
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.location}</span>
              </div>
            )}
            {/* Informasi Custom User ID */}
            {profile.custom_user_id && (
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm">ID: {profile.custom_user_id}</span>
              </div>
            )}
            {/* Informasi NIK */}
            {profile.nik && (
              <div className="flex items-center gap-2">
                <BadgeInfo className="h-4 w-4 text-gray-500" />
                <span className="text-sm">NIK: {profile.nik}</span>
              </div>
            )}
            {/* Informasi Nomor Telepon */}
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            )}
            {/* Informasi Gender */}
            {profile.gender && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm capitalize">{profile.gender}</span>
              </div>
            )}
            <Separator />
            {/* Tanggal Bergabung */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Joined {new Date(user?.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* === Form Edit Profil (Kolom Kanan) === */}
        {/* Komponen Card untuk form edit profil */}
        <Card className="lg:col-span-2 bg-white shadow-lg">
          {/* Bagian Header Form Edit Profil */}
          <CardHeader>
            <CardTitle>{t('profile.form.title')}</CardTitle>
            <CardDescription>
              {t('profile.form.description')}
            </CardDescription>
          </CardHeader>
          {/* Bagian Konten Form Edit Profil */}
          <CardContent className="space-y-6">
            {/* === Baris Input: Full Name & Email === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">{t('profile.form.fullName')}<span className="text-red-500">*</span></Label>
                <Input
                  id="fullName"
                  value={profile.full_name || ""}
                  onChange={(e) =>
                    handleInputChange("full_name", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('profile.form.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled
                  className="bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">
                  {t('profile.form.emailDescription')}
                </p>
              </div>
            </div>

            {/* === Baris Input: Custom User ID & NIK === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="custom_user_id">{t('profile.form.employeeId')}</Label>
                <Input
                  id="customUserId"
                  value={profile.custom_user_id || ""}
                  onChange={(e) =>
                    handleInputChange("custom_user_id", e.target.value)
                  }
                  placeholder={t('profile.form.employeeIdPlaceholder')}
                  maxLength={8}
                />
                <p className="text-xs text-gray-500">
                  {t('profile.form.employeeIdDescription')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nik">{t('profile.form.nik')}</Label>
                <Input
                  id="nik"
                  value={profile.nik || ""}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 16);
                    handleInputChange("nik", value);
                  }}
                  placeholder={t('profile.form.nikPlaceholder')}
                  maxLength={16}
                />
                <p className="text-xs text-gray-500">
                  {t('profile.form.nikDescription')}
                </p>
              </div>
            </div>

            {/* === Baris Input: Phone & Gender === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('profile.form.phone')}</Label>
                <Input
                  id="phone"
                  value={profile.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder={t('profile.form.phonePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">{t('profile.form.gender')}<span className="text-red-500">*</span></Label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={profile.gender === "male"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{t('profile.genderOptions.male')}</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={profile.gender === "female"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{t('profile.genderOptions.female')}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Birth Date & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birth_date">{t('profile.form.birthDate')}<span className="text-red-500">*</span></Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={profile.birth_date || ""}
                  onChange={(e) =>
                    handleInputChange("birth_date", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t('profile.form.location')}<span className="text-red-500">*</span></Label>
                <Input
                  id="location"
                  value={profile.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Enter your location"
                />
              </div>
            </div>

            {/* Department & Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">{t('profile.form.department')}<span className="text-red-500">*</span></Label>
                <select
                  id="department"
                  value={profile.department || ""}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  Department data is cached for offline use
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">{t('profile.form.language')}<span className="text-red-500">*</span></Label>
                <select
                  id="language"
                  value={profile.language || "en"}
                  onChange={(e) =>
                    handleInputChange("language", e.target.value as "en" | "id")
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="en">English</option>
                  <option value="id">Indonesian</option>
                </select>
              </div>
            </div>

            {/* Position & Location (second instance) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">{t('profile.form.position')}<span className="text-red-500">*</span></Label>
                <Input
                  id="position"
                  value={profile.position || ""}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  placeholder="Enter your position"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t('profile.form.location')}<span className="text-red-500">*</span></Label>
                <Input
                  id="location"
                  value={profile.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Enter your location"
                />
              </div>
            </div>

            <Separator />

            {/* Tombol Save Changes */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {isSaving ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('profile.form.saving')}</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t('profile.form.saveChanges')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
