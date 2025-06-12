import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Impor file terjemahan Anda di sini
import translationEN from './locales/en/translation.json';
import translationID from './locales/id/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  id: {
    translation: translationID,
  },
};

i18n
  // Mendeteksi bahasa pengguna (misalnya dari pengaturan browser)
  .use(LanguageDetector)
  // Mengoper instance i18n ke react-i18next
  .use(initReactI18next)
  // Menginisialisasi i18next
  .init({
    resources,
    fallbackLng: 'en', // Bahasa default jika bahasa pengguna tidak tersedia
    debug: true, // Aktifkan mode debug untuk pengembangan
    interpolation: {
      escapeValue: false, // React sudah melakukan escaping
    },
  });

export default i18n;
