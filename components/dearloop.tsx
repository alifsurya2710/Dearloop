"use client";
import Link from "next/link";
import { Heart, Music } from "lucide-react";
import { CassetteSVG, CassetteCase } from "@/components/cassette";
import type { Mixtape } from "@/lib/mixtape";

export function Header() {
  return (
    <header className="listen-header">
      <Link href="/" className="listen-wordmark">
        <img src="/logo.png" alt="Dearloop" style={{ height: "54px", width: "auto", objectFit: "contain" }} />
      </Link>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="listen-footer">
      <span>© 2026 Dearloop</span>
      <span>
        Dibuat dengan <Heart className="inline mx-1 text-rose-500 fill-rose-500" size={10} /> oleh{" "}
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
  );
}

export function Preview({ tape, recipient = false }: { tape: Mixtape; recipient?: boolean }) {
  return (
    <div className="listen-preview">
      {recipient && (
        <p className="listen-tag">
          <Heart size={11} className="inline mr-1" />
          sebuah hadiah kecil untuk {tape.to}
        </p>
      )}

      {/* Show cassette + case side by side like the landing */}
      <div className="listen-cassettes">
        <div className="listen-cassette-back">
          <CassetteCase pattern={tape.pattern} stickers={tape.stickers} songTitles={tape.tracks.map(t => t.title)} size={220} />
        </div>
        <div className="listen-cassette-front">
          <CassetteSVG pattern={tape.pattern} stickers={tape.stickers} size={240} />
        </div>
      </div>

      <h1 className="listen-title">{tape.title}</h1>
      <p className="listen-byline">
        Untuk {tape.to} &nbsp;·&nbsp; dari {tape.from}
      </p>
    </div>
  );
}
