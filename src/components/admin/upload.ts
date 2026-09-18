"use client";

import { upload as blobUpload } from "@vercel/blob/client";
import { MB, UPLOAD_RULES } from "@/lib/media/rules";

export type StorageDriver = "blob" | "disk";

export async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, { ...init, headers: init?.body instanceof FormData ? undefined : { "Content-Type": "application/json" } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error([json.error, ...(json.issues ?? [])].filter(Boolean).join("\n") || `Request failed (${res.status})`);
  return json;
}

/**
 * Uploads one file and returns its public URL.
 * - blob: browser → Vercel Blob directly (multipart for big videos), token from /api/admin/blob-upload
 * - disk: multipart form POST to /api/admin/upload (local / VPS hosting)
 */
export async function uploadFile(file: Blob, type: string, storage: StorageDriver, onProgress?: (pct: number) => void): Promise<string> {
  const rule = UPLOAD_RULES[type];
  if (!rule) throw new Error("Unsupported file type");
  if (storage === "blob") {
    const res = await blobUpload(`media/${crypto.randomUUID()}.${rule.ext}`, file, {
      access: "public",
      handleUploadUrl: "/api/admin/blob-upload",
      contentType: type,
      multipart: file.size > 40 * MB,
      onUploadProgress: (e) => onProgress?.(e.percentage),
    });
    return res.url;
  }
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    fd.append("file", file instanceof File ? file : new File([file], `upload.${rule.ext}`, { type }));
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.((e.loaded / e.total) * 100);
    xhr.onload = () => {
      let json: { url?: string; error?: string } = {};
      try {
        json = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && json.url) resolve(json.url);
      else reject(new Error(json.error || `Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error — check your connection and try again."));
    xhr.send(fd);
  });
}

const MAX_EDGE = 2560;

/** Downscales very large photos to 2560px WebP (q .88) in the browser; small ones pass through untouched. */
export async function prepareImage(file: File): Promise<{ blob: Blob; type: string; width: number; height: number }> {
  try {
    const bmp = await createImageBitmap(file);
    const { width, height } = bmp;
    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    if (scale === 1 && file.size <= 4 * MB) {
      bmp.close();
      return { blob: file, type: file.type, width, height };
    }
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.88));
    if (!blob || blob.size >= file.size) return { blob: file, type: file.type, width, height };
    return { blob, type: "image/webp", width: w, height: h };
  } catch {
    return { blob: file, type: file.type, width: 1600, height: 1000 };
  }
}

/** Reads duration/size and grabs a poster frame (WebP, ≤1280px) from a local video file. */
export function prepareVideo(file: File): Promise<{ poster: Blob | null; width: number; height: number; duration: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    let done = false;
    const finish = (r: { poster: Blob | null; width: number; height: number; duration: number }) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      v.removeAttribute("src");
      v.load();
      resolve(r);
    };
    // Some codecs (e.g. HEVC .mov in Chrome) cannot be decoded — upload still works, just without a poster.
    const timer = setTimeout(() => finish({ poster: null, width: v.videoWidth || 1920, height: v.videoHeight || 1080, duration: v.duration || 0 }), 15000);
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.onloadedmetadata = () => {
      v.currentTime = Math.min(1.2, (v.duration || 2) * 0.15);
    };
    v.onseeked = () => {
      const width = v.videoWidth || 1920;
      const height = v.videoHeight || 1080;
      const scale = Math.min(1, 1280 / width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      canvas.getContext("2d")!.drawImage(v, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((poster) => finish({ poster, width, height, duration: v.duration || 0 }), "image/webp", 0.85);
    };
    v.onerror = () => finish({ poster: null, width: 1920, height: 1080, duration: 0 });
    v.src = url;
  });
}
