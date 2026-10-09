"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink, Heart, ArrowLeft, Coffee } from "lucide-react";
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

              <div style={{ margin: "24px 0" }}>
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

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/" className="btn-make-own" style={{ flex: 1 }}>
                  <ArrowLeft size={14} /> Buat mixtapemu sendiri
                </Link>
                <button
                  className="btn-share-donate"
                  style={{ borderRadius: "12px", padding: "12px 20px" }}
                  onClick={() => setDonateOpen(true)}
                >
                  <Coffee size={15} /> Dukung / Donasi
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
