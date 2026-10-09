"use client";
import { useState, useRef } from "react";
import { Check, X, Copy, ExternalLink, Loader2, Camera, Upload, Image as ImageIcon, Coffee } from "lucide-react";
import { CassetteSVG, CassetteCase, Notecard, PolaroidCard } from "@/components/cassette";
import { MusicPlayer } from "@/components/MusicPlayer";
import { DonationModal } from "@/components/DonationModal";
import { processSelfieImage } from "@/lib/photo";
import {
  initialMixtape, encodeMixtape, trackSchema,
  CASSETTE_PATTERNS, ALL_STICKERS, STICKER_CATEGORIES,
  type Mixtape, type CassettePattern, type StickerCategory,
} from "@/lib/mixtape";

// ─── Background color palette (vintage) ─────────────────────────────────────
import { BG_COLORS, getBgValue } from "@/lib/mixtape";

// ─── Pattern swatch data ─────────────────────────────────────────────────────
const PATTERN_COLORS: Record<CassettePattern, string> = {
  "putih-polos":     "#f5f5f0",
  "kuning-bunga":    "#f9f0c0",
  "merah-kotak":     "#fff0f0",
  "biru-bunga":      "#ddeeff",
  "cokelat-bintang": "#4a2c10",
  "cokelat-daun":    "#5c3318",
  "botanis":         "#e8dcc8",
  "kotak-cokelat":   "#d4a87a",
  "garis-vertikal":  "#f8f4ee",
  "kotak-putih":     "#f8f4ee",
  "titik-putih":     "#f0ede8",
  "abu-langit":      "#d4dde8",
  "hijau-tua":       "#2d4a2a",
  "hijau-bunga":     "#e8f0e0",
  "kotak-hijau":     "#c8d8a0",
  "bunga-kecil":     "#f0ece0",
  "hati":            "#fff0f0",
  "plaid-hijau":     "#d8e8d0",
};
const PATTERN_ICONS: Record<CassettePattern, string> = {
  "putih-polos": "○", "kuning-bunga": "✿", "merah-kotak": "⊞",
  "biru-bunga": "❀", "cokelat-bintang": "✦", "cokelat-daun": "✿",
  "botanis": "❧", "kotak-cokelat": "▦", "garis-vertikal": "∥",
  "kotak-putih": "⊟", "titik-putih": "·", "abu-langit": "·",
  "hijau-tua": "·", "hijau-bunga": "✿", "kotak-hijau": "▦",
  "bunga-kecil": "✾", "hati": "♥", "plaid-hijau": "⊠",
};

// ─── Step dots ───────────────────────────────────────────────────────────────
function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="step-dots">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`step-dot${i < step ? " done" : ""}${i === step ? " active" : ""}`}>
          {i < step ? <Check size={10} strokeWidth={3} /> : i + 1}
        </div>
      ))}
    </div>
  );
}

// ─── Nav buttons ─────────────────────────────────────────────────────────────
function NavButtons({ step, onBack, onNext, nextLabel = "Lanjut", disabled = false }: {
  step: number; onBack: () => void; onNext: () => void;
  nextLabel?: string; disabled?: boolean;
}) {
  return (
    <div className="nav-buttons">
      {step > 0
        ? <button className="btn-back" onClick={onBack}>Kembali</button>
        : <span />}
      <button className="btn-next" onClick={onNext} disabled={disabled}>{nextLabel}</button>
    </div>
  );
}

// ─── Step 1: Pilih motif + warna background ───────────────────────────────────
function StepPattern({ tape, update }: {
  tape: Mixtape;
  update: (k: keyof Mixtape, v: Mixtape[keyof Mixtape]) => void;
}) {
  return (
    <div className="step-content">
      <h2 className="step-heading">PILIH MOTIF KASET</h2>
      <div className="cassette-preview-center">
        <CassetteSVG pattern={tape.pattern} stickers={tape.stickers} size={300} />
      </div>
      <div className="pattern-grid">
        {CASSETTE_PATTERNS.map(pat => (
          <button
            key={pat}
            className={`pattern-swatch${tape.pattern === pat ? " selected" : ""}`}
            onClick={() => update("pattern", pat)}
            title={pat}
            style={{ background: PATTERN_COLORS[pat] }}
            aria-label={pat}
          >
            <span style={{
              fontSize: "14px",
              color: ["cokelat-bintang","cokelat-daun","hijau-tua"].includes(pat) ? "#fff" : "#555",
            }}>
              {PATTERN_ICONS[pat]}
            </span>
            {tape.pattern === pat && (
              <span className="swatch-check"><Check size={9} strokeWidth={3} /></span>
            )}
          </button>
        ))}
      </div>

      {/* Background color picker - syncs to tape.bgColor so it's included in share URL */}
      <div className="bg-picker">
        <p className="bg-picker-label">WARNA LATAR</p>
        <div className="bg-swatches">
          {BG_COLORS.map(c => (
            <button
              key={c.id}
              className={`bg-swatch${tape.bgColor === c.id ? " selected" : ""}`}
              style={{ background: c.value }}
              onClick={() => update("bgColor", c.id)}
              title={c.label}
              aria-label={c.label}
            >
              {tape.bgColor === c.id && <Check size={11} strokeWidth={3} color="#333" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Tambah stiker (dengan drag & hapus) ─────────────────────────────
function StepStickers({ tape, update }: {
  tape: Mixtape;
  update: (k: keyof Mixtape, v: Mixtape[keyof Mixtape]) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<StickerCategory>("musim gugur");
  // dragging state: which sticker index is being dragged
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, ox: 0, oy: 0 });
  const caseRef = useRef<HTMLDivElement>(null);

  const MAX = 3;
  const stickers = tape.stickers as string[];
  const positions = (tape.stickerPositions ?? []) as { x: number; y: number }[];

  // Default positions for up to 3 stickers (relative to case container, %)
  const DEFAULT_POS = [
    { x: 22, y: 38 },
    { x: 48, y: 38 },
    { x: 74, y: 38 },
  ];

  function getPos(i: number) {
    return positions[i] ?? DEFAULT_POS[i] ?? { x: 20 + i * 25, y: 38 };
  }

  function addSticker(id: string) {
    if (stickers.includes(id)) {
      // remove
      const idx = stickers.indexOf(id);
      const newS = stickers.filter((_, j) => j !== idx);
      const newP = positions.filter((_, j) => j !== idx);
      update("stickers", newS);
      update("stickerPositions", newP);
    } else if (stickers.length < MAX) {
      const newS = [...stickers, id];
      const newP = [...positions, DEFAULT_POS[stickers.length] ?? { x: 50, y: 38 }];
      update("stickers", newS);
      update("stickerPositions", newP);
    }
  }

  function removeSticker(idx: number) {
    const newS = stickers.filter((_, j) => j !== idx);
    const newP = positions.filter((_, j) => j !== idx);
    update("stickers", newS);
    update("stickerPositions", newP);
  }

  function onMouseDown(e: React.MouseEvent, idx: number) {
    e.preventDefault();
    const pos = getPos(idx);
    setDragging(idx);
    setDragStart({ mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y });
  }

  function onTouchStart(e: React.TouchEvent, idx: number) {
    const t = e.touches[0];
    const pos = getPos(idx);
    setDragging(idx);
    setDragStart({ mx: t.clientX, my: t.clientY, ox: pos.x, oy: pos.y });
  }

  function onMouseMove(e: React.MouseEvent) {
    if (dragging === null || !caseRef.current) return;
    const rect = caseRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.mx) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.my) / rect.height) * 100;
    const newX = Math.max(5, Math.min(90, dragStart.ox + dx));
    const newY = Math.max(5, Math.min(85, dragStart.oy + dy));
    const newP = positions.map((p, i) => i === dragging ? { x: newX, y: newY } : p);
    // fill gaps if needed
    while (newP.length <= dragging) newP.push(DEFAULT_POS[newP.length] ?? { x: 50, y: 40 });
    newP[dragging] = { x: newX, y: newY };
    update("stickerPositions", newP);
  }

  function onTouchMove(e: React.TouchEvent) {
    if (dragging === null || !caseRef.current) return;
    const t = e.touches[0];
    const rect = caseRef.current.getBoundingClientRect();
    const dx = ((t.clientX - dragStart.mx) / rect.width) * 100;
    const dy = ((t.clientY - dragStart.my) / rect.height) * 100;
    const newX = Math.max(5, Math.min(90, dragStart.ox + dx));
    const newY = Math.max(5, Math.min(85, dragStart.oy + dy));
    const newP = [...positions];
    while (newP.length <= dragging) newP.push(DEFAULT_POS[newP.length] ?? { x: 50, y: 40 });
    newP[dragging] = { x: newX, y: newY };
    update("stickerPositions", newP);
  }

  function stopDrag() { setDragging(null); }

  // Resolve emoji from id
  function getEmoji(id: string) {
    for (const cat of Object.values(ALL_STICKERS)) {
      const found = cat.find(s => s.id === id);
      if (found) return found.emoji;
    }
    return "?";
  }

  return (
    <div className="step-content">
      <h2 className="step-heading">TAMBAH STIKER</h2>

      {/* Interactive case preview with draggable stickers */}
      <div
        className="case-drag-area"
        ref={caseRef}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchMove={onTouchMove}
        onTouchEnd={stopDrag}
      >
        {/* Case background (static SVG with motif pattern) */}
        <CassetteCase pattern={tape.pattern} stickers={[]} songTitles={[]} size={300} />

        {/* Draggable sticker overlays */}
        {stickers.map((id, i) => {
          const pos = getPos(i);
          return (
            <div
              key={id}
              className={`drag-sticker${dragging === i ? " dragging" : ""}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseDown={e => onMouseDown(e, i)}
              onTouchStart={e => onTouchStart(e, i)}
            >
              <span className="drag-sticker-emoji">{getEmoji(id)}</span>
              <button
                className="drag-sticker-del"
                onClick={e => { e.stopPropagation(); removeSticker(i); }}
                aria-label="Hapus stiker"
              >
                <X size={9} />
              </button>
            </div>
          );
        })}

        {stickers.length === 0 && (
          <div className="case-empty-hint">Pilih stiker di bawah untuk ditambahkan</div>
        )}
      </div>

      {/* Sticker count bar */}
      {stickers.length > 0 && (
        <p className="sticker-placed-info">
          {stickers.length}/3 stiker · seret untuk memindahkan · × untuk menghapus
        </p>
      )}

      {/* Picker panel */}
      <div className="sticker-panel">
        <div className="sticker-panel-header">
          <span>PILIH MAKSIMAL 3 STIKER</span>
          <span className="sticker-count">{stickers.length}/3</span>
        </div>
        <div className="sticker-tabs">
          {STICKER_CATEGORIES.map(cat => (
            <button key={cat}
              className={`sticker-tab${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="sticker-grid">
          {ALL_STICKERS[activeCategory].map(s => {
            const sel = stickers.includes(s.id);
            const maxed = !sel && stickers.length >= MAX;
            return (
              <button key={s.id}
                className={`sticker-item${sel ? " selected" : ""}${maxed ? " disabled" : ""}`}
                onClick={() => !maxed && addSticker(s.id)}
                disabled={maxed} title={s.label}>
                <span style={{ fontSize: "28px" }}>{s.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers: parse YouTube / Spotify from URL ────────────────────────────────
function detectSource(url: string): "youtube" | "spotify" | null {
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/spotify\.com/.test(url)) return "spotify";
  return null;
}

function extractYoutubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// Fetch YouTube title via noembed (no API key needed)
async function fetchYoutubeTitle(url: string): Promise<{ title: string; author: string } | null> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    if (data.title) return { title: data.title, author: data.author_name ?? "" };
  } catch {}
  return null;
}

// ─── Step 3: Tambah lagu (URL only, auto-fetch title) ────────────────────────
function StepSongs({ tape, update }: {
  tape: Mixtape;
  update: (k: keyof Mixtape, v: Mixtape[keyof Mixtape]) => void;
}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const MAX = 4;

  async function addSong() {
    const trimmed = url.trim();
    if (!trimmed) { setErr("Tempel tautan YouTube atau Spotify."); return; }
    const source = detectSource(trimmed);
    if (!source) { setErr("Gunakan tautan YouTube atau Spotify."); return; }
    if (tape.tracks.length >= MAX) { setErr(`Maksimal ${MAX} lagu.`); return; }

    // Prevent duplicate links/songs
    const isDuplicate = tape.tracks.some(t => {
      if (t.url.trim().toLowerCase() === trimmed.toLowerCase()) return true;
      const yt1 = extractYoutubeId(t.url);
      const yt2 = extractYoutubeId(trimmed);
      if (yt1 && yt2 && yt1 === yt2) return true;
      return false;
    });

    if (isDuplicate) {
      setErr("Lagu/tautan ini sudah ada dalam daftar. Pilih lagu yang berbeda.");
      return;
    }

    setLoading(true); setErr("");
    let title = ""; let artist = "";

    if (source === "youtube") {
      const info = await fetchYoutubeTitle(trimmed);
      if (info) { title = info.title; artist = info.author; }
      else { title = "Lagu tanpa judul"; artist = ""; }
    } else {
      // Spotify — extract track name from URL path segment as fallback
      const m = trimmed.match(/track\/[A-Za-z0-9]+/);
      title = m ? "Lagu Spotify" : "Lagu Spotify";
      artist = "Spotify";
    }

    // Validate with schema
    const result = trackSchema.safeParse({ title, artist, url: trimmed });
    if (!result.success) { setErr("Tautan tidak valid."); setLoading(false); return; }

    update("tracks", [...tape.tracks, result.data]);
    setUrl("");
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") addSong();
  }

  const songTitles = tape.tracks.map(t => t.title);

  return (
    <div className="step-content">
      <h2 className="step-heading">TAMBAH LAGU</h2>

      {/* Case preview with song titles on label */}
      <div className="case-preview-center">
        <CassetteCase pattern={tape.pattern} stickers={tape.stickers} songTitles={songTitles} size={300} />
      </div>

      {/* Song cards list */}
      <div className="songs-panel">
        {tape.tracks.length === 0 ? (
          <div className="songs-empty">
            <p className="songs-empty-title">BELUM ADA LAGU — MAKS {MAX}</p>
            <div className="songs-empty-divider" />
            <p className="songs-empty-count">0/{MAX} LAGU DITAMBAHKAN</p>
          </div>
        ) : (
          <div className="songs-list">
            {tape.tracks.map((track, i) => {
              const src = detectSource(track.url);
              const ytId = src === "youtube" ? extractYoutubeId(track.url) : null;
              return (
                <div className="song-card" key={i}>
                  {ytId ? (
                    <img
                      className="song-thumb"
                      src={`https://img.youtube.com/vi/${ytId}/default.jpg`}
                      alt=""
                      width={48} height={36}
                    />
                  ) : (
                    <div className="song-thumb song-thumb-spotify">♫</div>
                  )}
                  <div className="song-card-info">
                    <a href={track.url} target="_blank" rel="noopener noreferrer"
                      className="song-card-title">{track.title}</a>
                    <span className="song-card-artist">{track.artist}</span>
                    <span className={`song-badge ${src}`}>
                      {src === "youtube" ? "YOUTUBE" : "SPOTIFY"}
                    </span>
                  </div>
                  <button className="song-card-del"
                    onClick={() => update("tracks", tape.tracks.filter((_, j) => j !== i))}
                    aria-label={`Hapus ${track.title}`}>
                    <X size={14} />
                  </button>
                </div>
              );
            })}
            <p className="songs-count-bar">{tape.tracks.length}/{MAX} LAGU DITAMBAHKAN</p>
          </div>
        )}
      </div>

      {/* URL input */}
      {tape.tracks.length < MAX && (
        <div className="url-input-row">
          <input
            className="url-input"
            type="url"
            placeholder="Tempel tautan YouTube..."
            value={url}
            onChange={e => { setUrl(e.target.value); setErr(""); }}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button className="btn-url-add" onClick={addSong} disabled={loading || !url.trim()}>
            {loading ? <Loader2 size={14} className="spin" /> : "Tambah"}
          </button>
        </div>
      )}

      {err && <p className="song-error">{err}</p>}

      <p className={`min-songs-hint${tape.tracks.length >= 2 ? " met" : ""}`}>
        {tape.tracks.length >= 2
          ? `✓ ${tape.tracks.length} lagu ditambahkan`
          : `Minimal 2 lagu diperlukan · ${tape.tracks.length}/2`}
      </p>
    </div>
  );
}

// ─── Step 4: Tulis pesan ──────────────────────────────────────────────────────
function StepMessage({ tape, update, share, onGenerate, onCopy, copied }: {
  tape: Mixtape;
  update: (k: keyof Mixtape, v: Mixtape[keyof Mixtape]) => void;
  share: string; onGenerate: () => void; onCopy: () => void; copied: boolean;
}) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [camError, setCamError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function startCamera() {
    try {
      setCamError("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
      });
      setStream(mediaStream);
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch {
      setCamError("Tidak dapat mengakses kamera. Silakan pilih berkas foto dari perangkatmu.");
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setCameraOpen(false);
  }

  async function capturePhoto() {
    if (!videoRef.current) return;
    try {
      const compressed = await processSelfieImage(videoRef.current);
      update("photo", compressed);
      stopCamera();
    } catch {
      setCamError("Gagal mengambil foto.");
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await processSelfieImage(file);
      update("photo", compressed);
    } catch {
      alert("Gagal memproses gambar.");
    }
  }

  return (
    <div className="step-content">
      <h2 className="step-heading">TULIS PESAN</h2>

      {/* Cassette Case Preview */}
      <div className="case-preview-center">
        <CassetteCase pattern={tape.pattern} stickers={tape.stickers} songTitles={tape.tracks.map(t => t.title)} size={300} />
      </div>

      {/* Note paper & Selfie Polaroid preview */}
      <div className="note-photo-row">
        <Notecard message={tape.note || "Tulis pesan manis untuknya di sini..."} />
        {tape.photo && (
          <PolaroidCard
            photo={tape.photo}
            caption={`Dari ${tape.from || "Aku"} ♡`}
            onRemove={() => update("photo", undefined)}
          />
        )}
      </div>

      {/* Selfie Action Buttons */}
      <div className="selfie-actions-row">
        <button className="btn-selfie" onClick={startCamera}>
          <Camera size={14} /> {tape.photo ? "Foto Ulang (Selfie)" : "Ambil Foto Selfie"}
        </button>
        <button className="btn-selfie" onClick={() => fileInputRef.current?.click()}>
          <Upload size={14} /> {tape.photo ? "Ganti Foto" : "Unggah Foto"}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </div>

      {camError && <p className="song-error text-center">{camError}</p>}

      {/* Form Fields */}
      <div className="song-form">
        <div className="two-col">
          <div>
            <label className="song-label">Dari *</label>
            <input className="song-input" maxLength={40} value={tape.from}
              onChange={e => update("from", e.target.value)} placeholder="Namamu" />
          </div>
          <div>
            <label className="song-label">Untuk *</label>
            <input className="song-input" maxLength={40} value={tape.to}
              onChange={e => update("to", e.target.value)} placeholder="Nama mereka" />
          </div>
        </div>
        <label className="song-label">Judul mixtape *</label>
        <input className="song-input" maxLength={60} value={tape.title}
          onChange={e => update("title", e.target.value)} placeholder="Lagu-lagu untukmu" />
        <label className="song-label">Pesan untuk {tape.to || "mereka"}</label>
        <textarea className="song-textarea" rows={5} maxLength={1200}
          value={tape.note} onChange={e => update("note", e.target.value)} />
        <p className="char-count">{tape.note.length} / 1200</p>
      </div>

      {/* Camera Modal */}
      {cameraOpen && (
        <div className="camera-modal-backdrop">
          <div className="camera-modal-content">
            <h3 style={{ fontSize: "16px", fontWeight: 700 }}>AMBIL FOTO SELFIE</h3>
            <div className="camera-video-wrap">
              <video ref={videoRef} autoPlay playsInline className="camera-video" />
            </div>
            <div className="camera-controls">
              <button className="btn-capture" onClick={capturePhoto}>
                <Camera size={16} /> Jepret Foto
              </button>
              <button className="btn-cancel-cam" onClick={stopCamera}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {cameraOpen && (
        <div className="camera-modal-backdrop">
          <div className="camera-modal-content">
            <h3 style={{ fontSize: "16px", fontWeight: 700 }}>AMBIL FOTO SELFIE</h3>
            <div className="camera-video-wrap">
              <video ref={videoRef} autoPlay playsInline className="camera-video" />
            </div>
            <div className="camera-controls">
              <button className="btn-capture" onClick={capturePhoto}>
                <Camera size={16} /> Jepret Foto
              </button>
              <button className="btn-cancel-cam" onClick={stopCamera}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 5: Berbagi mixtape (Share screen matching Image 2) ──────────────────
function StepShare({ tape, share, onCopy, copied, onReset }: {
  tape: Mixtape;
  share: string;
  onCopy: () => void;
  copied: boolean;
  onReset: () => void;
}) {
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <div className="step-content">
      <h2 className="step-heading">SHARE YOUR MIXTAPE</h2>

      <div className="share-result-container">
        {/* Clean layout: Note card & Polaroid photo side-by-side, Cassette Case below */}
        <div className="result-preview-stage">
          <div className="result-notes-row">
            <Notecard message={tape.note || "Untukmu ♡"} />
            {tape.photo && (
              <PolaroidCard photo={tape.photo} caption={`Dari ${tape.from} ♡`} />
            )}
          </div>
          <div className="result-cassette-box">
            <CassetteCase
              pattern={tape.pattern}
              stickers={tape.stickers}
              songTitles={tape.tracks.map(t => t.title)}
              size={300}
            />
          </div>
        </div>

        {/* Music Player Widget */}
        <MusicPlayer tracks={tape.tracks} />

        {/* Share Link Input + Donasi Button */}
        <div className="share-section">
          <label className="share-section-label">Share this mixtape:</label>
          <div className="share-input-row">
            <input
              className="share-url-input"
              readOnly
              value={share}
              onFocus={e => e.target.select()}
            />
            <button className="btn-share-copy" onClick={onCopy}>
              <Copy size={14} />
              {copied ? "Tersalin!" : "Copy"}
            </button>
            <button className="btn-share-donate" onClick={() => setDonateOpen(true)}>
              <Coffee size={14} />
              Donasi
            </button>
          </div>
        </div>

        <button
          className="btn-selfie"
          style={{ marginTop: 8 }}
          onClick={onReset}
        >
          ✨ Buat Mixtape Baru
        </button>
      </div>

      <DonationModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [started, setStarted]   = useState(false);
  const [step, setStep]         = useState(0);
  const [tape, setTape]         = useState<Mixtape>({ ...initialMixtape, tracks: [] });
  const [share, setShare]       = useState("");
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState("");

  function update<K extends keyof Mixtape>(key: K, value: Mixtape[K]) {
    setTape(prev => ({ ...prev, [key]: value }));
    setShare(""); setError("");
  }

  function goNext() {
    if (step === 2 && tape.tracks.length < 2) {
      setError("Tambahkan minimal 2 lagu sebelum melanjutkan."); return;
    }
    if (step === 3) {
      if (!tape.title.trim() || !tape.from.trim() || !tape.to.trim()) {
        setError("Isi judul, nama pengirim, dan penerima dulu."); return;
      }
      if (!tape.photo) {
        setError("Ambil foto selfie atau unggah foto terlebih dahulu sebelum melanjutkan."); return;
      }
      generateLink();
      setError("");
      setStep(4);
      return;
    }
    setError(""); setStep(s => s + 1);
  }

  function generateLink() {
    if (!tape.tracks.length) { setError("Tambahkan setidaknya 1 lagu."); return; }
    const payload = encodeMixtape(tape);
    setShare(`${window.location.origin}/listen#${payload}`);
    setError("");
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(share); setCopied(true); }
    catch { setError("Salin tautan di bawah secara manual."); }
  }

  function resetAll() {
    setTape({ ...initialMixtape, tracks: [] });
    setStep(0);
    setShare("");
    setError("");
  }

  const nextLabels = ["Lanjut", "Lanjut", "Lanjut", "✨ Buat Tautan"];
  const bg = getBgValue(tape.bgColor);

  // ── Landing ───────────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="landing" style={{ background: bg }}>
        <div className="landing-hero">
          <div className="landing-logo-wrap">
            <img src="/logo.png" alt="Dearloop" className="landing-logo-img" />
          </div>
            <Notecard message="Aku membuat ini untukmu! Selamat menikmati ♡" />
          </div>
          <div className="hero-cassettes">
            <div className="hero-cassette hero-cassette-back">
              <CassetteCase stickers={["daun-maple", "kopi"]} songTitles={[]} size={240} />
            </div>
            <div className="hero-cassette hero-cassette-front">
              <CassetteSVG pattern="cokelat-daun" stickers={[]} size={260} />
            </div>
          </div>
          <button className="btn-start" onClick={() => setStarted(true)}>Buat Mixtape</button>
        <footer className="landing-footer">
          <span>
            Dibuat dengan ♡ oleh{" "}
            <a
              href="https://www.instagram.com/mochalifsurya/?__pwa=1#"
              target="_blank"
              rel="noopener noreferrer"
              className="creator-link"
            >
              Alif Surya
            </a>
          </span>
        </footer>
      </div>
    );
  }

  // ── Wizard ────────────────────────────────────────────────────────────────
  return (
    <div className="wizard" style={{ background: bg, transition: "background 0.4s ease" }}>
      <button className="wizard-logo" onClick={() => { setStarted(false); setStep(0); }}>
        <img src="/logo.png" alt="Dearloop" className="wizard-logo-img" />
      </button>

      <StepDots step={step > 3 ? 3 : step} total={4} />

      <div className="wizard-body">
        {step === 0 && (
          <StepPattern tape={tape} update={update} />
        )}
        {step === 1 && <StepStickers tape={tape} update={update} />}
        {step === 2 && <StepSongs tape={tape} update={update} />}
        {step === 3 && (
          <StepMessage tape={tape} update={update}
            share={share} onGenerate={generateLink} onCopy={copyLink} copied={copied} />
        )}
        {step === 4 && (
          <StepShare tape={tape} share={share} onCopy={copyLink} copied={copied} onReset={resetAll} />
        )}

        {error && <p className="wizard-error" role="alert">{error}</p>}

        {step < 4 && (
          <NavButtons
            step={step}
            onBack={() => { setStep(s => s - 1); setError(""); }}
            onNext={goNext}
            nextLabel={nextLabels[step]}
            disabled={step === 3 && !tape.tracks.length}
          />
        )}
      </div>
    </div>
  );
}
