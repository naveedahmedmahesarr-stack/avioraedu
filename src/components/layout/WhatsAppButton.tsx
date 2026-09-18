"use client";

import { usePathname } from "next/navigation";
import { whatsappLink } from "@/lib/config";

/**
 * Floating WhatsApp contact. Number and message come from Admin → Business settings
 * (passed down from the root layout); hidden when no number is saved.
 * Navy disc, fine gold ring, label that slides out on hover/focus (desktop).
 */
export function WhatsAppButton({ number, message }: { number: string; message: string }) {
  const pathname = usePathname();
  const href = whatsappLink(number, message);
  if (!href || pathname.startsWith("/admin")) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with AVIORA EDU on WhatsApp (opens WhatsApp)"
      className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 flex items-center rounded-full bg-navy-950/95 p-1 text-ivory shadow-[0_18px_40px_-18px_rgba(5,13,28,.9)] ring-1 ring-gold-300/35 backdrop-blur-md transition-[box-shadow,transform,background-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:ring-gold-300/70 focus-visible:ring-2 focus-visible:ring-gold-300 sm:bottom-7 sm:right-7"
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap pl-0 text-[0.78rem] font-medium tracking-[0.06em] opacity-0 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] sm:group-hover:max-w-40 sm:group-hover:pl-4 sm:group-hover:pr-1 sm:group-hover:opacity-100 sm:group-focus-visible:max-w-40 sm:group-focus-visible:pl-4 sm:group-focus-visible:pr-1 sm:group-focus-visible:opacity-100">
        WhatsApp us
      </span>
      <span className="relative flex size-12 items-center justify-center rounded-full bg-gradient-to-b from-[#1e8a57] to-[#146b42] sm:size-[3.25rem]">
        <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />
        {/* WhatsApp glyph */}
        <svg viewBox="0 0 32 32" className="size-6" aria-hidden fill="currentColor">
          <path d="M16.02 3C8.84 3 3 8.8 3 15.95c0 2.29.6 4.52 1.75 6.49L3 29l6.72-1.75a13.07 13.07 0 0 0 6.3 1.6h.01C23.2 28.85 29 23.05 29 15.9 29 8.8 23.2 3 16.02 3Zm0 23.66h-.01a10.8 10.8 0 0 1-5.5-1.5l-.4-.23-3.99 1.04 1.07-3.87-.26-.4a10.7 10.7 0 0 1-1.66-5.75c0-5.95 4.86-10.8 10.84-10.8 5.97 0 10.83 4.85 10.83 10.8 0 5.94-4.86 10.71-10.92 10.71Zm5.94-8.06c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.16-.22.33-.84 1.06-1.03 1.28-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.62-1.62a9.8 9.8 0 0 1-1.82-2.25c-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.54.11-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.41-.27-.63-.54-.55-.73-.56h-.62c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.7 0 1.6 1.17 3.14 1.33 3.36.16.22 2.3 3.5 5.57 4.9.78.34 1.39.54 1.86.69.78.25 1.5.21 2.06.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.14-.3-.22-.62-.38Z" />
        </svg>
      </span>
    </a>
  );
}
