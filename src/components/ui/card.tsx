/**
 * @file card.tsx
 * @fileoverview Komponen-komponen untuk membangun UI kartu yang terstruktur.
 * @description Menyediakan serangkaian komponen (Card, CardHeader, CardTitle, dll.)
 * untuk membuat kontainer visual yang kohesif untuk konten.
 */

// --- IMPOR DEPENDENSI ---
import * as React from "react";
// `cn` adalah fungsi utilitas untuk menggabungkan nama kelas Tailwind CSS secara kondisional.
import { cn } from "@/lib/utils";

// --- KOMPONEN CARD UTAMA ---
/**
 * Komponen `Card`.
 * @description Pembungkus utama untuk semua elemen kartu. Menyediakan border, background, dan shadow.
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// --- KOMPONEN CARD HEADER ---
/**
 * Komponen `CardHeader`.
 * @description Kontainer untuk bagian header kartu. Memberikan padding dan tata letak flex.
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// --- KOMPONEN CARD TITLE ---
/**
 * Komponen `CardTitle`.
 * @description Elemen judul untuk kartu. Dirender sebagai `<h3>` dengan gaya yang sesuai.
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// --- KOMPONEN CARD DESCRIPTION ---
/**
 * Komponen `CardDescription`.
 * @description Elemen deskripsi untuk kartu. Dirender sebagai `<p>` dengan gaya teks sekunder.
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// --- KOMPONEN CARD CONTENT ---
/**
 * Komponen `CardContent`.
 * @description Kontainer utama untuk konten di dalam kartu. Memiliki padding yang sesuai.
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// --- KOMPONEN CARD FOOTER ---
/**
 * Komponen `CardFooter`.
 * @description Kontainer untuk bagian footer kartu. Biasanya digunakan untuk tombol aksi.
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// --- EKSPOR ---
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
