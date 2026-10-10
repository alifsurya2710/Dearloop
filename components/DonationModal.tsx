"use client";
import { useState } from "react";
import { Coffee, Copy, Check, X, Heart, ExternalLink } from "lucide-react";

export function DonationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const DONATION_NUMBER = "089674935980";

  async function handleCopy(field: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      alert(`Nomor ${field}: ${text}`);
    }
  }

  // Smart Deep Link function
  function handleDeepLink(app: "dana" | "gopay") {
    const isAndroid = /android/i.test(navigator.userAgent);
    
    let url = "";
    if (app === "dana") {
      if (isAndroid) {
        url = `intent://transfer?destination=${DONATION_NUMBER}#Intent;scheme=dana;package=id.dana;end`;
      } else {
        // iOS or others
        url = `dana://transfer?destination=${DONATION_NUMBER}`;
      }
    } else if (app === "gopay") {
      if (isAndroid) {
        url = `intent://gopay/transfer?phone=${DONATION_NUMBER}#Intent;scheme=gojek;package=com.gojek.app;end`;
      } else {
        // iOS or others
        url = `gojek://gopay/transfer?phone=${DONATION_NUMBER}`;
      }
    }

    // Attempt to open
    window.location.href = url;

    // Fallback if not opened within 2 seconds (for non-Android platforms where intent isn't supported)
    if (!isAndroid) {
      const fallbackUrl = app === "dana" ? "https://link.dana.id" : "https://www.gojek.com/gopay/";
      setTimeout(() => {
        if (!document.hidden) {
          window.open(fallbackUrl, "_blank", "noopener,noreferrer");
        }
      }, 2000);
    }
  }

  return (
    <div className="camera-modal-backdrop" onClick={onClose}>
      <div
        className="camera-modal-content"
        style={{ maxWidth: "360px", padding: "24px 20px" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Coffee size={20} color="#d48806" />
            <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>Dukung Dearloop</h3>
          </div>
          <button onClick={onClose} style={{ padding: 4, borderRadius: 6, color: "#888" }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#666", textAlign: "center", margin: "4px 0 12px" }}>
          Dukunganmu sangat berarti untuk menjaga Dearloop tetap gratis! <Heart size={10} className="inline text-rose-500 fill-rose-500" />
        </p>

        {/* DANA Box */}
        <div className="donation-card dana">
          <div className="donation-top">
            <span className="donation-badge dana-badge">DANA</span>
            <span className="donation-number">{DONATION_NUMBER}</span>
          </div>
          <div className="donation-actions-row">
            <button
              className="btn-donation-action"
              onClick={() => handleCopy("DANA", DONATION_NUMBER)}
            >
              {copiedField === "DANA" ? <Check size={13} /> : <Copy size={13} />}
              {copiedField === "DANA" ? "Tersalin!" : "Salin Nomor"}
            </button>
            <button
              onClick={() => handleDeepLink("dana")}
              className="btn-donation-action btn-open-app dana-btn"
            >
              <ExternalLink size={13} /> Buka DANA
            </button>
          </div>
        </div>

        {/* GOPAY Box */}
        <div className="donation-card gopay">
          <div className="donation-top">
            <span className="donation-badge gopay-badge">GOPAY</span>
            <span className="donation-number">{DONATION_NUMBER}</span>
          </div>
          <div className="donation-actions-row">
            <button
              className="btn-donation-action"
              onClick={() => handleCopy("GoPay", DONATION_NUMBER)}
            >
              {copiedField === "GoPay" ? <Check size={13} /> : <Copy size={13} />}
              {copiedField === "GoPay" ? "Tersalin!" : "Salin Nomor"}
            </button>
            <button
              onClick={() => handleDeepLink("gopay")}
              className="btn-donation-action btn-open-app gopay-btn"
            >
              <ExternalLink size={13} /> Buka GoPay
            </button>
          </div>
        </div>

        <button
          className="btn-cancel-cam"
          style={{ width: "100%", marginTop: "8px" }}
          onClick={onClose}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
