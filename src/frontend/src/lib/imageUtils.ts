/**
 * Compresses an image data URL for use with OpenAI moderation.
 * Resizes the longest side to at most 768px and exports as JPEG.
 * Ensures the result stays under the backend moderation outcall limit.
 * Only supports JPG/PNG input formats.
 */
export const MODERATION_MAX_IMAGE_DATA_URL_CHARS = 450_000;

export async function compressModerationImage(
  dataUrl: string,
): Promise<string> {
  if (
    !dataUrl.startsWith("data:image/jpeg") &&
    !dataUrl.startsWith("data:image/jpg") &&
    !dataUrl.startsWith("data:image/png")
  ) {
    throw new Error(
      "Unsupported image format. Please upload a JPG or PNG image.",
    );
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX_SIDE = 768;
      const MIN_SIDE = 320;
      let scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      let width = Math.max(1, Math.round(img.width * scale));
      let height = Math.max(1, Math.round(img.height * scale));
      let quality = 0.82;
      let attempts = 0;

      while (attempts < 8) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(
            new Error("Could not create canvas context for image compression."),
          );
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        while (quality >= 0.45) {
          const compressed = canvas.toDataURL("image/jpeg", quality);
          if (compressed.length <= MODERATION_MAX_IMAGE_DATA_URL_CHARS) {
            resolve(compressed);
            return;
          }
          quality -= 0.1;
        }

        if (Math.max(width, height) <= MIN_SIDE) {
          break;
        }
        scale *= 0.82;
        width = Math.max(1, Math.round(img.width * scale));
        height = Math.max(1, Math.round(img.height * scale));
        quality = 0.72;
        attempts += 1;
      }

      reject(
        new Error(
          "Uploaded image is too large for moderation. Please use a smaller JPG or PNG image.",
        ),
      );
    };
    img.onerror = () =>
      reject(new Error("Failed to load image for compression."));
    img.src = dataUrl;
  });
}
