import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dearloop — Sedikit cinta, yang terus berulang",
  description: "Rangkai mixtape kecil berisi lagu dan pesan untuk seseorang yang berarti.",
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
  openGraph: { title: "Dearloop — Sedikit cinta, yang terus berulang", description: "Lagu pilihanmu, pesan dari hati, dan satu mixtape penuh cerita.", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Caveat:wght@400;500;600;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
