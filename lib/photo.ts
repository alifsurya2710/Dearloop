/**
 * Compresses an image file or HTMLVideoElement into a square base64 JPEG string (240x240, ~10-15KB).
 */
export async function processSelfieImage(source: File | HTMLVideoElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const SIZE = 240;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Gagal membuat konteks canvas."));
      return;
    }

    if (source instanceof HTMLVideoElement) {
      const vw = source.videoWidth;
      const vh = source.videoHeight;
      const minDim = Math.min(vw, vh);
      const sx = (vw - minDim) / 2;
      const sy = (vh - minDim) / 2;

      // Draw mirrored for selfie
      ctx.translate(SIZE, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(source, sx, sy, minDim, minDim, 0, 0, SIZE, SIZE);
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const w = img.width;
          const h = img.height;
          const minDim = Math.min(w, h);
          const sx = (w - minDim) / 2;
          const sy = (h - minDim) / 2;

          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, SIZE, SIZE);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
        img.onerror = () => reject(new Error("Gagal memuat gambar."));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Gagal membaca berkas."));
      reader.readAsDataURL(source);
    }
  });
}
