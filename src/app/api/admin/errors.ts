import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { StorageUnavailableError } from "@/lib/content/store";

export function adminError(err: unknown) {
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", issues: err.issues.map((i) => `${i.path.join(".")}: ${i.message}`) },
      { status: 422 },
    );
  }
  if (err instanceof StorageUnavailableError) {
    return NextResponse.json({ error: err.message, configurationRequired: true }, { status: 503 });
  }
  console.error("[admin]", err);
  return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
}
