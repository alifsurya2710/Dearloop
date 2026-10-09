import type { CassettePattern } from "@/lib/mixtape";
import { ALL_STICKERS } from "@/lib/mixtape";

// ─── Pattern fill data ───────────────────────────────────────────────────────
// Each pattern returns a background color + optional SVG children for the <pattern> element.
type PatternDef = {
  bg: string;
  patternChildren?: React.ReactNode;
};

function getPatternDef(id: CassettePattern, customPattern?: string): PatternDef {
  if (id === "custom" && customPattern) {
    const pid = "pat-custom";
    return {
      bg: `url(#${pid})`,
      patternChildren: (
        <pattern id={pid} patternUnits="userSpaceOnUse" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <image href={customPattern} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
        </pattern>
      ),
    };
  }

  const pid = `pat-${id}`;
  switch (id) {
    case "putih-polos":
      return { bg: "#f5f5f0" };
    case "kuning-bunga":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#f9f0c0" />
            <circle cx="12" cy="12" r="3" fill="#e8c840" />
            <circle cx="12" cy="7" r="2" fill="#f0d860" />
            <circle cx="12" cy="17" r="2" fill="#f0d860" />
            <circle cx="7" cy="12" r="2" fill="#f0d860" />
            <circle cx="17" cy="12" r="2" fill="#f0d860" />
          </pattern>
        ),
      };
    case "merah-kotak":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="16" height="16">
            <rect width="16" height="16" fill="#fff" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="#e88" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="16" y2="0" stroke="#e88" strokeWidth="1.2" />
          </pattern>
        ),
      };
    case "biru-bunga":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#ddeeff" />
            <circle cx="12" cy="12" r="3" fill="#aaccee" />
            <circle cx="12" cy="6" r="2.5" fill="#bbddff" />
            <circle cx="12" cy="18" r="2.5" fill="#bbddff" />
            <circle cx="6" cy="12" r="2.5" fill="#bbddff" />
            <circle cx="18" cy="12" r="2.5" fill="#bbddff" />
          </pattern>
        ),
      };
    case "cokelat-bintang":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#4a2c10" />
            <circle cx="10" cy="10" r="2" fill="#c8913a" />
            <circle cx="0" cy="0" r="1" fill="#c8913a" />
            <circle cx="20" cy="20" r="1" fill="#c8913a" />
          </pattern>
        ),
      };
    case "cokelat-daun":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#5c3318" />
            <ellipse cx="10" cy="10" rx="4" ry="6" fill="#7a4a28" opacity="0.6" transform="rotate(30 10 10)" />
            <ellipse cx="4" cy="4" rx="3" ry="4" fill="#7a4a28" opacity="0.4" transform="rotate(30 4 4)" />
          </pattern>
        ),
      };
    case "botanis":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#e8dcc8" />
            <ellipse cx="12" cy="10" rx="5" ry="7" fill="#b4a080" opacity="0.4" transform="rotate(-20 12 10)" />
            <ellipse cx="8" cy="16" rx="4" ry="5" fill="#b4a080" opacity="0.3" transform="rotate(20 8 16)" />
          </pattern>
        ),
      };
    case "kotak-cokelat":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="12" height="12">
            <rect width="12" height="12" fill="#d4a87a" />
            <rect width="6" height="6" fill="#b8844a" />
            <rect x="6" y="6" width="6" height="6" fill="#b8844a" />
          </pattern>
        ),
      };
    case "garis-vertikal":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="10" height="10" fill="#f8f4ee" />
            <line x1="5" y1="0" x2="5" y2="10" stroke="#d4c8b4" strokeWidth="1.5" />
          </pattern>
        ),
      };
    case "kotak-putih":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="14" height="14">
            <rect width="14" height="14" fill="#f8f4ee" />
            <line x1="0" y1="0" x2="0" y2="14" stroke="#d8ccb8" strokeWidth="0.8" />
            <line x1="0" y1="0" x2="14" y2="0" stroke="#d8ccb8" strokeWidth="0.8" />
          </pattern>
        ),
      };
    case "titik-putih":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="16" height="16">
            <rect width="16" height="16" fill="#f0ede8" />
            <circle cx="8" cy="8" r="1.5" fill="#bbb" />
          </pattern>
        ),
      };
    case "abu-langit":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#d4dde8" />
            <circle cx="10" cy="10" r="1" fill="#aab8c8" />
            <circle cx="0" cy="0" r="1" fill="#aab8c8" />
            <circle cx="20" cy="0" r="1" fill="#aab8c8" />
          </pattern>
        ),
      };
    case "hijau-tua":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="16" height="16">
            <rect width="16" height="16" fill="#2d4a2a" />
            <circle cx="8" cy="8" r="1.5" fill="#3d6438" />
            <circle cx="0" cy="0" r="1" fill="#3d6438" />
          </pattern>
        ),
      };
    case "hijau-bunga":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#e8f0e0" />
            <circle cx="10" cy="10" r="3" fill="#a8c880" opacity="0.6" />
            <circle cx="10" cy="4" r="2" fill="#90b860" opacity="0.5" />
            <circle cx="10" cy="16" r="2" fill="#90b860" opacity="0.5" />
            <circle cx="4" cy="10" r="2" fill="#90b860" opacity="0.5" />
            <circle cx="16" cy="10" r="2" fill="#90b860" opacity="0.5" />
          </pattern>
        ),
      };
    case "kotak-hijau":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="12" height="12">
            <rect width="12" height="12" fill="#c8d8a0" />
            <rect width="6" height="6" fill="#a8bc78" />
            <rect x="6" y="6" width="6" height="6" fill="#a8bc78" />
          </pattern>
        ),
      };
    case "bunga-kecil":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="18" height="18">
            <rect width="18" height="18" fill="#f0ece0" />
            <circle cx="9" cy="9" r="2.5" fill="#c8b890" opacity="0.5" />
            <circle cx="9" cy="4" r="1.5" fill="#d0c098" opacity="0.5" />
            <circle cx="9" cy="14" r="1.5" fill="#d0c098" opacity="0.5" />
            <circle cx="4" cy="9" r="1.5" fill="#d0c098" opacity="0.5" />
            <circle cx="14" cy="9" r="1.5" fill="#d0c098" opacity="0.5" />
          </pattern>
        ),
      };
    case "hati":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="18" height="18">
            <rect width="18" height="18" fill="#fff0f0" />
            <path d="M9 13 C9 13 4 9 4 6.5 C4 4.5 5.5 3 7 3 C8 3 9 4 9 4 C9 4 10 3 11 3 C12.5 3 14 4.5 14 6.5 C14 9 9 13 9 13Z"
              fill="#ee8888" opacity="0.6" />
          </pattern>
        ),
      };
    case "plaid-hijau":
      return {
        bg: `url(#${pid})`,
        patternChildren: (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="16" height="16">
            <rect width="16" height="16" fill="#d8e8d0" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="#88a878" strokeWidth="2" />
            <line x1="8" y1="0" x2="8" y2="16" stroke="#88a878" strokeWidth="0.8" />
            <line x1="0" y1="0" x2="16" y2="0" stroke="#88a878" strokeWidth="2" />
            <line x1="0" y1="8" x2="16" y2="8" stroke="#88a878" strokeWidth="0.8" />
          </pattern>
        ),
      };
    default:
      return { bg: "#f5f5f0" };
  }
}

// ─── Helper to resolve sticker emoji from id ─────────────────────────────────
function getStickerEmojis(stickers: string[]): string[] {
  return stickers.map(id => {
    for (const cat of Object.values(ALL_STICKERS)) {
      const found = cat.find(s => s.id === id);
      if (found) return found.emoji;
    }
    return "";
  }).filter(Boolean);
}

// ─── CassetteSVG ─────────────────────────────────────────────────────────────
interface CassetteSVGProps {
  pattern: CassettePattern | string;
  customPattern?: string;
  stickers: string[];
  size?: number;
}

export function CassetteSVG({ pattern, customPattern, stickers, size = 340 }: CassetteSVGProps) {
  const p = getPatternDef(pattern as CassettePattern, customPattern);
  const W = 340;
  const H = 210;
  const scale = size / W;
  const emojis = getStickerEmojis(stickers);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W * scale}
      height={H * scale}
      style={{ display: "block", overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        {p.patternChildren}
        <filter id="cs-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#00000028" />
        </filter>
        <clipPath id="label-clip">
          <rect x="22" y="18" width="296" height="126" rx="8" />
        </clipPath>
      </defs>

      {/* Outer White Body Shell (Matching Image 2) */}
      <rect x="10" y="8" width="320" height="194" rx="14"
        fill="#f5f5f2" stroke="#dcdcd4" strokeWidth="2" filter="url(#cs-shadow)" />
      
      {/* Inner chamfer border */}
      <rect x="16" y="14" width="308" height="182" rx="10"
        fill="none" stroke="#e8e8e2" strokeWidth="1.2" />

      {/* Main Pattern Label (Top 65% area) */}
      <rect x="22" y="18" width="296" height="126" rx="8"
        fill={p.bg} stroke="#dcdcd2" strokeWidth="1.2" />

      {/* Center Window (White Pill Frame - Image 2) */}
      <rect x="70" y="54" width="200" height="56" rx="28"
        fill="#f8f8f4" stroke="#d4d4cc" strokeWidth="2.5" />

      {/* Magnetic Tape Window Center */}
      <rect x="132" y="62" width="76" height="40" rx="4"
        fill="#78a0c8" opacity="0.4" stroke="#b0c8dc" strokeWidth="1.2" />

      {/* Magnetic Tape Film behind reels */}
      <rect x="136" y="66" width="68" height="32" fill="#2a221b" opacity="0.8" />
      <line x1="70" y1="82" x2="270" y2="82" stroke="#1c1612" strokeWidth="10" opacity="0.7" />

      {/* Left Reel Hub */}
      <g transform="translate(112, 82)">
        <circle r="22" fill="#e0e0d8" stroke="#b8b8b0" strokeWidth="1" />
        <circle r="18" fill="white" stroke="#c0c0b8" strokeWidth="1.5" />
        {[
          { cx: 13, cy: 0 },
          { cx: 6.5, cy: 11.258 },
          { cx: -6.5, cy: 11.258 },
          { cx: -13, cy: 0 },
          { cx: -6.5, cy: -11.258 },
          { cx: 6.5, cy: -11.258 },
        ].map((pt, i) => (
          <circle key={i} cx={pt.cx} cy={pt.cy} r="2.5" fill="#888880" />
        ))}
        <circle r="7" fill="#f8f8f4" stroke="#d0d0c8" strokeWidth="1" />
      </g>

      {/* Right Reel Hub */}
      <g transform="translate(228, 82)">
        <circle r="22" fill="#e0e0d8" stroke="#b8b8b0" strokeWidth="1" />
        <circle r="18" fill="white" stroke="#c0c0b8" strokeWidth="1.5" />
        {[
          { cx: 13, cy: 0 },
          { cx: 6.5, cy: 11.258 },
          { cx: -6.5, cy: 11.258 },
          { cx: -13, cy: 0 },
          { cx: -6.5, cy: -11.258 },
          { cx: 6.5, cy: -11.258 },
        ].map((pt, i) => (
          <circle key={i} cx={pt.cx} cy={pt.cy} r="2.5" fill="#888880" />
        ))}
        <circle r="7" fill="#f8f8f4" stroke="#d0d0c8" strokeWidth="1" />
      </g>

      {/* Bottom Raised Trapezoid Bevel Plate (Image 2) */}
      <path d="M 40 148 L 300 148 L 312 196 L 28 196 Z"
        fill="#eaeae4" stroke="#d4d4cc" strokeWidth="1.5" />

      {/* Port Holes on Trapezoid Plate */}
      <circle cx="85" cy="174" r="7" fill="#c0c0b8" stroke="#a8a8a0" strokeWidth="1" />
      <rect x="118" y="168" width="18" height="11" rx="3" fill="#c0c0b8" stroke="#a8a8a0" strokeWidth="1" />
      <rect x="204" y="168" width="18" height="11" rx="3" fill="#c0c0b8" stroke="#a8a8a0" strokeWidth="1" />
      <circle cx="255" cy="174" r="7" fill="#c0c0b8" stroke="#a8a8a0" strokeWidth="1" />

      {/* Corner Screws */}
      {([[20, 18], [320, 18], [20, 192], [320, 192]] as [number, number][]).map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="4" fill="#d0d0c8" stroke="#b0b0a8" strokeWidth="0.8" />
          <line x1={cx - 2} y1={cy - 2} x2={cx + 2} y2={cy + 2} stroke="#888880" strokeWidth="0.8" />
          <line x1={cx + 2} y1={cy - 2} x2={cx - 2} y2={cy + 2} stroke="#888880" strokeWidth="0.8" />
        </g>
      ))}

      {/* Sticker emojis on pattern label */}
      {emojis.map((emoji, i) => (
        <text key={i} x={([75, 170, 265] as number[])[i] ?? 170} y={42}
          textAnchor="middle" fontSize="24">{emoji}</text>
      ))}
    </svg>
  );
}

// ─── CassetteCase ─────────────────────────────────────────────────────────────
export function CassetteCase({ pattern, customPattern, stickers, songTitles = [], size = 300 }: {
  pattern?: CassettePattern | string;
  customPattern?: string;
  stickers: string[];
  songTitles?: string[];
  size?: number;
}) {
  const W = 300;
  const H = 190;
  const scale = size / W;
  const emojis = getStickerEmojis(stickers);
  const p = pattern ? getPatternDef(pattern as CassettePattern, customPattern) : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale}
      style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      <defs>
        {p?.patternChildren}
        <filter id="cc-shadow">
          <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#00000025" />
        </filter>
        <linearGradient id="cc-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.65" />
          <stop offset="100%" stopColor="white" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Case body */}
      <rect x="4" y="4" width="292" height="182" rx="10"
        fill="url(#cc-grad)" stroke="#d0ccc8" strokeWidth="1.5"
        filter="url(#cc-shadow)" />

      {/* Pattern background layer */}
      {p && (
        <rect x="10" y="10" width="280" height="170" rx="7" fill={p.bg} />
      )}

      <rect x="10" y="10" width="280" height="170" rx="7"
        fill="none" stroke="#e0dcd8" strokeWidth="1" />

      {/* Label */}
      <rect x="16" y="16" width="268" height="140" rx="5" fill="white" fillOpacity="0.85" />

      {/* A tag */}
      <rect x="22" y="95" width="18" height="9" rx="1.5" fill="#111" />
      <text x="31" y="102" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold" fontFamily="monospace">A</text>
      <text x="46" y="100" fontSize="5.5" fill="#666" fontFamily="monospace">TANGGAL/WAKTU</text>
      <text x="46" y="107" fontSize="5" fill="#888" fontFamily="monospace">NOISE REDUCTION  □ ON  □ OFF</text>

      {/* B tag */}
      <rect x="152" y="95" width="18" height="9" rx="1.5" fill="#111" />
      <text x="161" y="102" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold" fontFamily="monospace">B</text>
      <text x="176" y="100" fontSize="5.5" fill="#666" fontFamily="monospace">TANGGAL/WAKTU</text>
      <text x="176" y="107" fontSize="5" fill="#888" fontFamily="monospace">NOISE REDUCTION  □ ON  □ OFF</text>

      <line x1="22" y1="114" x2="278" y2="114" stroke="#ccc" strokeWidth="0.8" />
      {([126, 136, 146] as number[]).map(y => (
        <line key={y} x1="22" y1={y} x2="278" y2={y}
          stroke="#ccc" strokeWidth="0.6" strokeDasharray="3,3" />
      ))}

      {/* Song titles on dotted lines */}
      {songTitles.slice(0, 3).map((title, i) => (
        <text key={`st-${i}`} x="26" y={124 + i * 10}
          fontSize="6.5" fontFamily="Caveat, cursive" fill="#4a78b8">
          {title.length > 40 ? title.substring(0, 37) + "…" : title}
        </text>
      ))}

      {/* Stickers */}
      {emojis.map((emoji, i) => (
        <text key={i} x={([70, 150, 230] as number[])[i] ?? 150} y={75}
          textAnchor="middle" fontSize="36">{emoji}</text>
      ))}

      {/* Bottom bumps */}
      {([30, 140, 270] as number[]).map((x, i) => (
        <rect key={i} x={x} y={162} width="20" height="10" rx="3" fill="#d4d0cc" />
      ))}
    </svg>
  );
}

// ─── Notecard ─────────────────────────────────────────────────────────────────
export function Notecard({ message }: { message: string }) {
  const line1 = message.substring(0, 36);
  const line2 = message.substring(36, 72);
  const line3 = message.substring(72, 108);

  return (
    <svg viewBox="0 0 280 160" width="280" height="160"
      style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      <defs>
        <filter id="nc-shadow">
          <feDropShadow dx="1" dy="3" stdDeviation="5" floodColor="#00000020" />
        </filter>
      </defs>
      <rect x="2" y="2" width="276" height="156" rx="4"
        fill="white" stroke="#e8e4e0" strokeWidth="1" filter="url(#nc-shadow)" />
      <circle cx="18" cy="20" r="5" fill="#e8e4e0" />
      <circle cx="18" cy="40" r="5" fill="#e8e4e0" />
      <line x1="36" y1="8" x2="36" y2="152" stroke="#ffaaaa" strokeWidth="1.2" />
      {([30, 50, 70, 90, 110, 130] as number[]).map(y => (
        <line key={y} x1="40" y1={y} x2="268" y2={y} stroke="#c8daf0" strokeWidth="0.7" />
      ))}
      <text x="44" y="36" fontSize="13" fontFamily="Caveat, cursive" fill="#4a90d9">{line1}</text>
      {line2 && <text x="44" y="56" fontSize="13" fontFamily="Caveat, cursive" fill="#4a90d9">{line2}</text>}
      {line3 && <text x="44" y="76" fontSize="13" fontFamily="Caveat, cursive" fill="#4a90d9">{line3}</text>}
    </svg>
  );
}

// ─── Polaroid Card ─────────────────────────────────────────────────────────────
export function PolaroidCard({ photo, caption, onRemove }: { photo: string; caption?: string; onRemove?: () => void }) {
  return (
    <div className="polaroid-card">
      <div className="polaroid-tape" />
      {onRemove && (
        <button className="polaroid-remove-btn" onClick={onRemove} title="Hapus foto">
          ×
        </button>
      )}
      <div className="polaroid-photo-frame">
        <img src={photo} alt="Selfie" className="polaroid-img" />
      </div>
      {caption && <p className="polaroid-caption">{caption}</p>}
    </div>
  );
}
