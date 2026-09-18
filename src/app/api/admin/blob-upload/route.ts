import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { UPLOAD_RULES } from "@/lib/media/rules";

/**
 * Issues short-lived client tokens so the browser uploads straight to Vercel Blob
 * (serverless request bodies are capped at ~4.5 MB, far below video sizes).
 * Also guarded by src/proxy.ts; checked again here because tokens grant write access.
 */
export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "CONFIGURATION REQUIRED: BLOB_READ_WRITE_TOKEN is not set." }, { status: 503 });
  }
  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value))) throw new Error("Unauthorized");
        if (!/^media\/[\w-]+\.(jpg|png|webp|avif|mp4|webm|mov)$/.test(pathname)) throw new Error("Invalid file name");
        return {
          allowedContentTypes: Object.keys(UPLOAD_RULES),
          maximumSizeInBytes: Math.max(...Object.values(UPLOAD_RULES).map((r) => r.max)),
          addRandomSuffix: false,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
        };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    const msg = (err as Error).message;
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 400 });
  }
}
