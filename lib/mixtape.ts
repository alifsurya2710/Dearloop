import { z } from "zod";

// ─── Background colors (vintage palette) ────────────────────────────────────
export const BG_COLORS: { id: string; label: string; value: string }[] = [
  { id: "krem",       label: "Krem",       value: "#f0e8d8" },
  { id: "sage",       label: "Sage",       value: "#c8d8c0" },
  { id: "dusty-rose", label: "Dusty Rose", value: "#e8c8c4" },
  { id: "lavender",   label: "Lavender",   value: "#d4cce8" },
  { id: "caramel",    label: "Karamel",    value: "#d8c0a0" },
  { id: "slate",      label: "Slate",      value: "#c4ccd8" },
  { id: "peach",      label: "Persik",     value: "#f0d4c0" },
  { id: "moss",       label: "Lumut",      value: "#b8c4a8" },
];

export function getBgValue(id: string): string {
  return BG_COLORS.find(c => c.id === id)?.value ?? "#f0e8d8";
}

export const CASSETTE_PATTERNS = [
  "putih-polos", "kuning-bunga", "merah-kotak", "biru-bunga",
  "cokelat-bintang", "cokelat-daun", "botanis", "kotak-cokelat",
  "garis-vertikal", "kotak-putih", "titik-putih", "abu-langit",
  "hijau-tua", "hijau-bunga", "kotak-hijau", "bunga-kecil",
  "hati", "plaid-hijau",
] as const;
export type CassettePattern = typeof CASSETTE_PATTERNS[number];

export const STICKER_CATEGORIES = ["musim gugur", "bintang", "bunga", "pita", "makanan", "alam", "vintage", "cinta"] as const;
export type StickerCategory = typeof STICKER_CATEGORIES[number];

export const ALL_STICKERS: Record<StickerCategory, Array<{ id: string; emoji: string; label: string }>> = {
  "musim gugur": [
    { id: "daun-maple",    emoji: "🍁", label: "Daun Maple" },
    { id: "daun-kuning",   emoji: "🍂", label: "Daun Gugur" },
    { id: "daun-hijau",    emoji: "🍃", label: "Daun Hijau" },
    { id: "jeruk-kering",  emoji: "🍊", label: "Jeruk Kering" },
    { id: "kopi",          emoji: "☕", label: "Kopi Latte" },
    { id: "kayu",          emoji: "🪵", label: "Kayu" },
    { id: "jamur",         emoji: "🍄", label: "Jamur" },
    { id: "labu",          emoji: "🎃", label: "Labu" },
    { id: "teh",           emoji: "🍵", label: "Teh Hangat" },
    { id: "apel",          emoji: "🍎", label: "Apel" },
    { id: "anggur",        emoji: "🍇", label: "Anggur" },
    { id: "kastanye",      emoji: "🌰", label: "Kastanye" },
  ],
  "bintang": [
    { id: "bintang-emas",  emoji: "⭐", label: "Bintang" },
    { id: "bulan-bintang", emoji: "🌙", label: "Bulan" },
    { id: "bintang-jatuh", emoji: "🌟", label: "Bintang Jatuh" },
    { id: "komet",         emoji: "☄️", label: "Komet" },
    { id: "galaksi",       emoji: "🌌", label: "Galaksi" },
    { id: "planet",        emoji: "🪐", label: "Planet" },
    { id: "matahari",      emoji: "☀️", label: "Matahari" },
    { id: "pelangi",       emoji: "🌈", label: "Pelangi" },
    { id: "awan-bintang",  emoji: "⛅", label: "Awan" },
    { id: "petir",         emoji: "⚡", label: "Petir" },
    { id: "salju",         emoji: "❄️", label: "Salju" },
    { id: "bulan-penuh",   emoji: "🌕", label: "Bulan Penuh" },
  ],
  "bunga": [
    { id: "bunga-merah",   emoji: "🌹", label: "Mawar" },
    { id: "bunga-pink",    emoji: "🌸", label: "Sakura" },
    { id: "bunga-kuning",  emoji: "🌻", label: "Bunga Matahari" },
    { id: "tulip",         emoji: "🌷", label: "Tulip" },
    { id: "bunga-putih",   emoji: "🌼", label: "Bunga Putih" },
    { id: "bunga-ungu",    emoji: "💐", label: "Buket Bunga" },
    { id: "kaktus",        emoji: "🌵", label: "Kaktus" },
    { id: "pohon-natal",   emoji: "🌲", label: "Pohon" },
    { id: "tanaman",       emoji: "🪴", label: "Tanaman Pot" },
    { id: "semanggi",      emoji: "🍀", label: "Semanggi" },
    { id: "bambu",         emoji: "🎋", label: "Bambu" },
    { id: "bunga-sakura2", emoji: "🏵️", label: "Karangan Bunga" },
  ],
  "pita": [
    { id: "pita-merah",    emoji: "🎀", label: "Pita Merah" },
    { id: "hadiah",        emoji: "🎁", label: "Hadiah" },
    { id: "amplop",        emoji: "💌", label: "Surat Cinta" },
    { id: "balon",         emoji: "🎈", label: "Balon" },
    { id: "pesta",         emoji: "🎉", label: "Pesta" },
    { id: "kue",           emoji: "🎂", label: "Kue Ulang Tahun" },
    { id: "lilin",         emoji: "🕯️", label: "Lilin" },
    { id: "mahkota",       emoji: "👑", label: "Mahkota" },
    { id: "berlian",       emoji: "💎", label: "Berlian" },
    { id: "kamera",        emoji: "📸", label: "Kamera" },
    { id: "kaset-pita",    emoji: "📼", label: "Kaset" },
    { id: "musik-note",    emoji: "🎵", label: "Not Musik" },
  ],
  "makanan": [
    { id: "roti",          emoji: "🥐", label: "Croissant" },
    { id: "donat",         emoji: "🍩", label: "Donat" },
    { id: "eskrim",        emoji: "🍦", label: "Es Krim" },
    { id: "cokelat",       emoji: "🍫", label: "Cokelat" },
    { id: "permen",        emoji: "🍬", label: "Permen" },
    { id: "lolipop",       emoji: "🍭", label: "Lolipop" },
    { id: "kopi2",         emoji: "🧋", label: "Bubble Tea" },
    { id: "wafel",         emoji: "🧇", label: "Wafel" },
    { id: "cupcake",       emoji: "🧁", label: "Cupcake" },
    { id: "pancake",       emoji: "🥞", label: "Pancake" },
    { id: "strawberry",    emoji: "🍓", label: "Stroberi" },
    { id: "ceri",          emoji: "🍒", label: "Ceri" },
  ],
  "alam": [
    { id: "kupu-kupu",     emoji: "🦋", label: "Kupu-Kupu" },
    { id: "lebah",         emoji: "🐝", label: "Lebah" },
    { id: "kepik",         emoji: "🐞", label: "Kepik" },
    { id: "burung",        emoji: "🐦", label: "Burung" },
    { id: "kelinci",       emoji: "🐰", label: "Kelinci" },
    { id: "beruang",       emoji: "🐻", label: "Beruang" },
    { id: "kucing",        emoji: "🐱", label: "Kucing" },
    { id: "rubah",         emoji: "🦊", label: "Rubah" },
    { id: "rusa",          emoji: "🦌", label: "Rusa" },
    { id: "hedgehog",      emoji: "🦔", label: "Hedgehog" },
    { id: "laut",          emoji: "🌊", label: "Ombak" },
    { id: "gunung",        emoji: "⛰️", label: "Gunung" },
  ],
  "vintage": [
    { id: "kamera-film",   emoji: "📷", label: "Kamera Film" },
    { id: "telepon-tua",   emoji: "📞", label: "Telepon Lawas" },
    { id: "surat",         emoji: "✉️", label: "Surat" },
    { id: "buku",          emoji: "📖", label: "Buku" },
    { id: "jam-tua",       emoji: "⌚", label: "Jam Tangan" },
    { id: "topi",          emoji: "🎩", label: "Topi" },
    { id: "pensil",        emoji: "✏️", label: "Pensil" },
    { id: "pita-mesin",    emoji: "🎞️", label: "Film Roll" },
    { id: "gramaphone",    emoji: "📻", label: "Radio" },
    { id: "peta",          emoji: "🗺️", label: "Peta" },
    { id: "kunci",         emoji: "🗝️", label: "Kunci Lama" },
    { id: "lilin2",        emoji: "🕯️", label: "Lilin Vintage" },
  ],
  "cinta": [
    { id: "hati-merah",    emoji: "❤️", label: "Hati Merah" },
    { id: "hati-pink",     emoji: "🩷", label: "Hati Pink" },
    { id: "hati-ungu",     emoji: "💜", label: "Hati Ungu" },
    { id: "hati-kuning",   emoji: "💛", label: "Hati Kuning" },
    { id: "hati-biru",     emoji: "💙", label: "Hati Biru" },
    { id: "hati-pecah",    emoji: "💔", label: "Hati Pecah" },
    { id: "ciuman",        emoji: "💋", label: "Ciuman" },
    { id: "berkilau",      emoji: "✨", label: "Berkilau" },
    { id: "api",           emoji: "🔥", label: "Api" },
    { id: "infinity",      emoji: "♾️", label: "Selamanya" },
    { id: "pasangan",      emoji: "👫", label: "Pasangan" },
    { id: "musik-hati",    emoji: "🎶", label: "Melodi Cinta" },
  ],
};

export const trackSchema = z.object({
  title: z.string().min(1).max(100),
  artist: z.string().max(100),
  url: z.string().url().max(500).refine(
    v => /^https:\/\/(open\.spotify\.com|www\.youtube\.com|youtube\.com|youtu\.be|music\.youtube\.com)\//.test(v),
    "Gunakan tautan Spotify atau YouTube."
  ),
});
export type Track = z.infer<typeof trackSchema>;

export const mixtapeSchema = z.object({
  title: z.string().min(1).max(60),
  from: z.string().min(1).max(40),
  to: z.string().min(1).max(40),
  pattern: z.enum(CASSETTE_PATTERNS).default("putih-polos"),
  stickers: z.array(z.string()).max(3).default([]),
  stickerPositions: z.array(z.object({ x: z.number(), y: z.number() })).max(3).default([]),
  note: z.string().max(1200),
  photo: z.string().optional(),
  tracks: z.array(trackSchema).max(4),
  bgColor: z.string().max(20).default("krem"),
});

export type Mixtape = z.infer<typeof mixtapeSchema>;

export const initialMixtape: Mixtape = {
  title: "Lagu-lagu untukmu",
  from: "Aku",
  to: "Kamu",
  pattern: "putih-polos",
  stickers: [],
  stickerPositions: [],
  note: "Ada hal-hal yang sulit diucapkan. Jadi biarkan lagu-lagu ini yang berbicara. ♡",
  photo: undefined,
  tracks: [],
  bgColor: "krem",
};

export function encodeMixtape(tape: Mixtape) {
  const bytes = new TextEncoder().encode(JSON.stringify(mixtapeSchema.parse(tape)));
  return btoa(Array.from(bytes, b => String.fromCharCode(b)).join(""));
}

export function decodeMixtape(value: string): Mixtape {
  if (value.length > 60000) throw new Error("Tautan terlalu panjang.");
  const bytes = Uint8Array.from(atob(value), c => c.charCodeAt(0));
  return mixtapeSchema.parse(JSON.parse(new TextDecoder().decode(bytes)));
}
