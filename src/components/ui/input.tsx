/**
 * @file input.tsx
 * @fileoverview Komponen input yang digayakan dan dapat digunakan kembali.
 * @description Menyediakan elemen <input> dengan gaya yang konsisten sesuai dengan
 * sistem desain aplikasi dan mendukung semua atribut input HTML standar.
 */

// --- IMPOR DEPENDENSI ---
import * as React from "react";
// `cn` adalah fungsi utilitas untuk menggabungkan nama kelas Tailwind CSS secara kondisional.
import { cn } from "@/lib/utils";

// --- INTERFACE PROPERTI ---
/**
 * Properti untuk komponen Input.
 * @interface InputProps
 * @extends React.InputHTMLAttributes<HTMLInputElement>
 * @description Interface ini memperluas semua properti standar dari elemen <input> HTML,
 * sehingga semua atribut seperti `type`, `placeholder`, `value`, `onChange`, dll., dapat digunakan.
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// --- KOMPONEN INPUT ---
/**
 * Komponen `Input`.
 * Menggunakan `React.forwardRef` untuk memungkinkan komponen induk mendapatkan referensi
 * langsung ke elemen <input> DOM yang mendasarinya.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        // Menggabungkan kelas-kelas gaya dasar dengan kelas kustom yang mungkin
        // diteruskan melalui prop `className`.
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref} // Meneruskan ref ke elemen input DOM.
        {...props} // Meneruskan semua properti lainnya (misalnya, `value`, `onChange`).
      />
    );
  }
);
// Menetapkan nama tampilan untuk debugging yang lebih mudah di React DevTools.
Input.displayName = "Input";

// --- EKSPOR ---
export { Input };

