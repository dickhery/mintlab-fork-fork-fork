import { c as createLucideIcon } from "./index-BscUpFOm.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const MODERATION_MAX_IMAGE_DATA_URL_CHARS = 45e4;
async function compressModerationImage(dataUrl) {
  if (!dataUrl.startsWith("data:image/jpeg") && !dataUrl.startsWith("data:image/jpg") && !dataUrl.startsWith("data:image/png")) {
    throw new Error(
      "Unsupported image format. Please upload a JPG or PNG image."
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
            new Error("Could not create canvas context for image compression.")
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
          "Uploaded image is too large for moderation. Please use a smaller JPG or PNG image."
        )
      );
    };
    img.onerror = () => reject(new Error("Failed to load image for compression."));
    img.src = dataUrl;
  });
}
export {
  Sparkles as S,
  compressModerationImage as c
};
