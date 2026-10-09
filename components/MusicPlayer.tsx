"use client";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Music, Volume2, VolumeX } from "lucide-react";
import type { Track } from "@/lib/mixtape";

function extractYoutubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function extractSpotifyId(url: string): string | null {
  const m = url.match(/track\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function MusicPlayer({ tracks }: { tracks: Track[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 210; // 3:30 default track duration for seeking

  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!tracks || tracks.length === 0) return null;

  const currentTrack = tracks[currentIndex] ?? tracks[0];
  const ytId = extractYoutubeId(currentTrack.url);
  const spotifyId = extractSpotifyId(currentTrack.url);

  const thumbUrl = ytId
    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    : null;

  // Continuous playback timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            nextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentIndex]);

  // Handle Mute/Unmute postMessage so time never resets
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: isMuted ? "mute" : "unMute",
          args: [],
        }),
        "*"
      );
    }
  }, [isMuted]);

  function togglePlay() {
    setIsPlaying(prev => !prev);
  }

  function toggleMute() {
    setIsMuted(prev => !prev);
  }

  function selectTrack(index: number) {
    setCurrentIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  }

  function prevTrack() {
    setCurrentTime(0);
    setIsPlaying(true);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : tracks.length - 1));
  }

  function nextTrack() {
    setCurrentTime(0);
    setIsPlaying(true);
    setCurrentIndex(prev => (prev < tracks.length - 1 ? prev + 1 : 0));
  }

  // Handle user seeking by clicking on the progress bar line
  function handleBarClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const seekSeconds = Math.floor(pct * duration);
    setCurrentTime(seekSeconds);

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [seekSeconds, true],
        }),
        "*"
      );
    }
  }

  const fillPercentage = Math.min(100, Math.max(0, (currentTime / duration) * 100));

  return (
    <div className="music-player-card">
      {/* Persistent Audio Stream Embed (iframe stays mounted so mute never resets playback time) */}
      {isPlaying && (
        <div style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none", overflow: "hidden" }}>
          {ytId ? (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1`}
              allow="autoplay; encrypted-media; picture-in-picture"
              title="YouTube Audio Player"
            />
          ) : spotifyId ? (
            <iframe
              ref={iframeRef}
              src={`https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0`}
              allow="autoplay; encrypted-media; picture-in-picture"
              title="Spotify Audio Player"
            />
          ) : null}
        </div>
      )}

      {/* Top: Album Art & Active Track Info */}
      <div className="player-top">
        {thumbUrl ? (
          <img src={thumbUrl} alt={currentTrack.title} className="player-thumb" />
        ) : (
          <div className="player-thumb-fallback">
            <Music size={22} color="#fff" />
          </div>
        )}
        <div className="player-info">
          <strong className="player-title">{currentTrack.title}</strong>
          <span className="player-artist">{currentTrack.artist || "Unknown Artist"}</span>
        </div>

        {/* Mute / Unmute Toggle Button */}
        <button
          className={`player-btn-mute${isMuted ? " muted" : ""}`}
          onClick={toggleMute}
          title={isMuted ? "Aktifkan Suara" : "Matikan Suara (Mute)"}
          aria-label={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
        >
          {isMuted ? <VolumeX size={20} color="#e74c3c" /> : <Volume2 size={20} color="#555" />}
        </button>
      </div>

      {/* Progress Bar (Clickable/Seekable by user to jump to any minute/second) */}
      <div className="player-progress-area">
        <div className="player-bar-track" onClick={handleBarClick} title="Klik untuk melompati bagian lagu">
          <div
            className="player-bar-fill"
            style={{ width: `${fillPercentage}%` }}
          >
            <div className="player-bar-knob" />
          </div>
        </div>
        <div className="player-time-row">
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          <span>{currentIndex + 1}/{tracks.length} Lagu</span>
        </div>
      </div>

      {/* Controls */}
      <div className="player-controls">
        <button
          className="player-btn-step"
          onClick={prevTrack}
          disabled={tracks.length <= 1}
          aria-label="Lagu Sebelumnya"
        >
          <SkipBack size={18} />
        </button>

        <button
          className="player-btn-play"
          onClick={togglePlay}
          aria-label={isPlaying ? "Jeda" : "Putar"}
        >
          {isPlaying ? <Pause size={20} fill="#fff" /> : <Play size={20} fill="#fff" style={{ marginLeft: 2 }} />}
        </button>

        <button
          className="player-btn-step"
          onClick={nextTrack}
          disabled={tracks.length <= 1}
          aria-label="Lagu Berikutnya"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Playlist Section */}
      <div className="player-playlist">
        <p className="player-playlist-heading">DAFTAR LAGU ({tracks.length})</p>
        <div className="player-playlist-items">
          {tracks.map((track, i) => (
            <button
              key={i}
              className={`player-playlist-item${i === currentIndex ? " active" : ""}`}
              onClick={() => selectTrack(i)}
            >
              <span className="playlist-num">{i + 1}.</span>
              <span className="playlist-title">{track.title}</span>
              {i === currentIndex && isPlaying && !isMuted && (
                <Volume2 size={13} className="playlist-playing-icon" />
              )}
              {i === currentIndex && isMuted && (
                <VolumeX size={13} color="#e74c3c" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
