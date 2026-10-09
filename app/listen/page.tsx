"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ExternalLink, Heart, ArrowLeft, Coffee, Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { Header, Footer, Preview } from "@/components/dearloop";
import { PolaroidCard } from "@/components/cassette";
import { MusicPlayer } from "@/components/MusicPlayer";
import { DonationModal } from "@/components/DonationModal";
import { initialMixtape, decodeMixtape, getBgValue, type Mixtape } from "@/lib/mixtape";

export default function Listen() {
  const [demo, setDemo] = useState<boolean | null>(null);
  const [tape, setTape] = useState<Mixtape | null>(null);
  const [error, setError] = useState("");
  const [donateOpen, setDonateOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDemo(new URLSearchParams(window.location.search).get("demo") === "true");
  }, []);

  useEffect(() => {
    if (demo === null) return;
    try {
      if (demo) {
        setTape({
          ...initialMixtape,
          pattern: "cokelat-daun",
          stickers: ["daun-maple", "kopi"],
          bgColor: "krem",
          tracks: [
            { title: "Best Part", artist: "Daniel Caesar, H.E.R.", url: "https://www.youtube.com/watch?v=hKgl5-lkT8U" },
            { title: "Nothing", artist: "Bruno Major", url: "https://www.youtube.com/watch?v=ucRVDoFkcxc" },
          ],
        });
      } else {
        setTape(decodeMixtape(window.location.hash.slice(1)));
      }
    } catch {
      setError("Mixtape ini tidak ditemukan atau tautannya tidak lengkap.");
    }
  }, [demo]);

  async function downloadHDImage() {
    if (!downloadRef.current || isDownloading || !tape) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(downloadRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 1,
        style: {
          padding: "24px",
          borderRadius: "24px",
          background: getBgValue(tape.bgColor),
        },
      });

      const link = document.createElement("a");
      link.download = `${tape.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "mixtape"}-dearloop.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mengunduh gambar:", err);
      alert("Gagal mengunduh gambar. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  }

  // Derive the background colour as soon as tape is available (client-only, no hydration mismatch)
  const bgValue = tape ? getBgValue(tape.bgColor) : undefined;

  return (
    <div style={{ minHeight: "100dvh", background: bgValue, transition: "background 0.4s ease" }}>
      <Header />
      <main className="listen-main">
        {error ? (
          <div className="listen-error">
            <Heart size={28} />
            <h1>Tautan tidak lengkap.</h1>
            <p>{error}</p>
            <Link href="/" className="btn-back-home">Buat mixtape baru</Link>
          </div>
        ) : tape ? (
          <>
            <div ref={downloadRef} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Preview tape={tape} recipient />

              <div className="listen-content">
                <div className="note-photo-row">
                  <div className="listen-note-block" style={{ flex: "1 1 260px" }}>
                    <p className="listen-eyebrow">
                      <Heart size={11} className="inline mr-1" />
                      CATATAN UNTUK {tape.to.toUpperCase()}
                    </p>
                    <p className="listen-note-text">{tape.note}</p>
                    <p className="listen-from">Dengan sayang, {tape.from}</p>
                  </div>

                  {tape.photo && (
                    <PolaroidCard photo={tape.photo} caption={`Dari ${tape.from} ♡`} />
                  )}
                </div>
              </div>
            </div>

            <div className="listen-content" style={{ marginTop: "20px" }}>
              <div style={{ margin: "12px 0 24px" }}>
                <MusicPlayer tracks={tape.tracks} />
              </div>

              <h2 className="listen-songs-heading">{tape.title}</h2>
              <div className="listen-songs">
                {tape.tracks.map((track, i) => (
                  <div className="listen-track" key={i}>
                    <span className="listen-track-num">{String(i + 1).padStart(2, "0")}</span>
                    <div className="listen-track-info">
                      <strong>{track.title}</strong>
                      {track.artist && <small>{track.artist}</small>}
                    </div>
                    <a
                      href={track.url} target="_blank" rel="noopener noreferrer"
                      className="listen-track-open" title={`Dengarkan ${track.title}`}
                    >
                      <ExternalLink size={15} />
                    </a>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <Link href="/" className="btn-make-own" style={{ flex: 1, justifyContent: "center" }}>
                  <ArrowLeft size={14} /> Buat mixtapemu sendiri
                </Link>
                <button
                  className="btn-share-download"
                  onClick={downloadHDImage}
                  disabled={isDownloading}
                >
                  {isDownloading ? <Loader2 size={15} className="spin" /> : <Download size={15} />}
                  {isDownloading ? "Mengunduh..." : "Unduh HD"}
                </button>
                <button
                  className="btn-share-donate"
                  onClick={() => setDonateOpen(true)}
                >
                  <Coffee size={15} /> Donasi
                </button>
              </div>
            </div>

            <DonationModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
          </>
        ) : (
          <p className="listen-loading">Membuka hadiah kecilmu…</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
