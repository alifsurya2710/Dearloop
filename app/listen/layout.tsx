import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Untuk kamu — Dearloop",
  description: "Seseorang merangkai mixtape ini khusus untukmu. Dengarkan lagu dan baca pesannya.",
  openGraph: { title: "Sebuah mixtape untukmu — Dearloop", description: "Lagu-lagu pilihan dan sebuah pesan dari hati.", type: "website" },
};
export default function ListenLayout({ children }: { children: React.ReactNode }) { return children; }
