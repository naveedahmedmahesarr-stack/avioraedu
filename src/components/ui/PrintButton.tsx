"use client";

import { Icon } from "@/components/ui/Icon";

/** Opens the browser print dialog (users can choose "Save as PDF"). */
export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-outline !min-h-10 !px-4 !text-[0.8rem] print:hidden">
      <Icon name="file" className="size-4" /> {label}
    </button>
  );
}
