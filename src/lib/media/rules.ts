/** Upload rules shared by the admin UI (pre-checks) and the server routes (enforcement). */
export const MB = 1024 * 1024;

export const UPLOAD_RULES: Record<string, { ext: string; max: number; kind: "image" | "video" }> = {
  "image/jpeg": { ext: "jpg", max: 15 * MB, kind: "image" },
  "image/png": { ext: "png", max: 15 * MB, kind: "image" },
  "image/webp": { ext: "webp", max: 15 * MB, kind: "image" },
  "image/avif": { ext: "avif", max: 15 * MB, kind: "image" },
  "video/mp4": { ext: "mp4", max: 500 * MB, kind: "video" },
  "video/webm": { ext: "webm", max: 500 * MB, kind: "video" },
  "video/quicktime": { ext: "mov", max: 500 * MB, kind: "video" },
};

export const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/avif";
export const ACCEPT_VIDEOS = "video/mp4,video/webm,video/quicktime";

/** Returns an error message, or null when the file is acceptable. */
export function checkFile(file: { type: string; size: number; name: string }) {
  const rule = UPLOAD_RULES[file.type];
  if (!rule) return `“${file.name}”: unsupported type. Use JPG, PNG, WebP, AVIF, MP4, WebM or MOV.`;
  if (file.size > rule.max) return `“${file.name}” is ${(file.size / MB).toFixed(1)} MB — the limit for ${rule.kind}s is ${rule.max / MB} MB.`;
  if (file.size === 0) return `“${file.name}” is empty.`;
  return null;
}
