/**
 * Compresses an image file or HTMLVideoElement into a high quality square base64 JPEG string (400x400).
 */
export async function processSelfieImage(source: File | HTMLVideoElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const SIZE = 400;
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
      resolve(canvas.toDataURL("image/jpeg", 0.78));
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
          resolve(canvas.toDataURL("image/jpeg", 0.78));
        };
        img.onerror = () => reject(new Error("Gagal memuat gambar."));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Gagal membaca berkas."));
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Compresses an uploaded image into a high-definition base64 JPEG string (up to 500px).
 */
export async function processCustomPatternImage(file: File, targetSize = 500): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const w = img.width;
        const h = img.height;
        const maxDim = Math.max(w, h);
        const scale = Math.min(1, targetSize / maxDim);
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Gagal membuat konteks canvas."));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      img.onerror = () => reject(new Error("Gagal memuat gambar."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca berkas."));
    reader.readAsDataURL(file);
  });
}
