/**
 * @file button.tsx
 * @fileoverview Komponen tombol yang dapat dikustomisasi dan dapat digunakan kembali.
 * @description Dibangun menggunakan class-variance-authority (CVA) untuk varian gaya
 * dan Radix UI Slot untuk komposisi komponen yang fleksibel.
 */

// --- IMPOR DEPENDENSI ---
import * as React from "react";
// `Slot` memungkinkan komponen ini untuk "menyatu" dengan elemen anaknya.
import { Slot } from "@radix-ui/react-slot";
// `cva` adalah library untuk membuat varian kelas CSS yang dapat digunakan kembali.
import { cva, type VariantProps } from "class-variance-authority";
// `cn` adalah fungsi utilitas untuk menggabungkan nama kelas Tailwind CSS secara kondisional.
import { cn } from "@/lib/utils";

// --- DEFINISI VARIAN TOMBOL ---
// `buttonVariants` mendefinisikan semua gaya yang mungkin untuk komponen tombol.
const buttonVariants = cva(
  // Kelas dasar yang diterapkan pada semua varian tombol.
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // Varian gaya visual tombol.
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90", // Tombol utama.
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90", // Tombol untuk aksi berbahaya (misalnya, hapus).
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground", // Tombol dengan garis tepi.
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80", // Tombol sekunder.
        ghost: "hover:bg-accent hover:text-accent-foreground", // Tombol tanpa background atau border.
        link: "text-primary underline-offset-4 hover:underline", // Tombol yang terlihat seperti link.
      },
      // Varian ukuran tombol.
      size: {
        default: "h-9 px-4 py-2", // Ukuran standar.
        sm: "h-8 rounded-md px-3 text-xs", // Ukuran kecil.
        lg: "h-10 rounded-md px-8", // Ukuran besar.
        icon: "h-9 w-9", // Ukuran untuk tombol ikon.
      },
    },
    // Varian default yang akan digunakan jika tidak ada yang ditentukan.
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// --- INTERFACE PROPERTI ---
/**
 * Properti untuk komponen Button.
 * @interface ButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 * @extends VariantProps<typeof buttonVariants>
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Jika `true`, komponen akan merender elemen anaknya dan "meneruskan" properti
   * ke dalamnya, alih-alih merender elemen `<button>` baru. Berguna untuk komposisi.
   * @type {boolean}
   * @default false
   */
  asChild?: boolean;
}

// --- KOMPONEN TOMBOL ---
/**
 * Komponen `Button`.
 * Menggunakan `React.forwardRef` untuk meneruskan `ref` ke elemen DOM yang mendasarinya.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Tentukan komponen yang akan dirender: `Slot` jika `asChild` true, jika tidak, render `button`.
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        // Gabungkan kelas-kelas CSS: varian dari `cva` dan kelas kustom dari `className`.
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
// Menetapkan nama tampilan untuk debugging yang lebih mudah di React DevTools.
Button.displayName = "Button";

// --- EKSPOR ---
// Mengekspor komponen `Button` dan `buttonVariants` untuk digunakan di tempat lain.
export { Button, buttonVariants };

