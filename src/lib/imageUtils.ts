/**
 * Resizes and compresses an uploaded image file client-side to a compact Data URL.
 * Keeps storage small (<50KB) while preserving sharp avatar quality.
 */
export function compressImageToDataUrl(
  file: File,
  maxWidth = 320,
  maxHeight = 320,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File harus berupa berkas gambar (JPG, PNG, WEBP)."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio, fit inside bounding box
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Gagal menginisialisasi canvas pemroses gambar."));
          return;
        }

        // Fill background with subtle dark base in case of transparency
        ctx.fillStyle = "#0B071E";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error("Gagal membaca berkas gambar yang dipilih."));
      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Gagal membaca berkas dari perangkat Anda."));
    reader.readAsDataURL(file);
  });
}
