// Simplified, geometry-accurate flag renderings (national flags are public symbols).
export const countryNames: Record<string, string> = {
  DE: "Germany",
  IT: "Italy",
  PL: "Poland",
  PT: "Portugal",
  AT: "Austria",
  PK: "Pakistan",
  IN: "India",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  BD: "Bangladesh",
};

function Body({ code }: { code: string }) {
  switch (code) {
    case "DE":
      return (
        <>
          <rect width="30" height="6.67" fill="#000" />
          <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
          <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
        </>
      );
    case "IT":
      return (
        <>
          <rect width="10" height="20" fill="#009246" />
          <rect x="10" width="10" height="20" fill="#fff" />
          <rect x="20" width="10" height="20" fill="#CE2B37" />
        </>
      );
    case "PL":
      return (
        <>
          <rect width="30" height="10" fill="#fff" />
          <rect y="10" width="30" height="10" fill="#DC143C" />
        </>
      );
    case "AT":
      return (
        <>
          <rect width="30" height="20" fill="#C8102E" />
          <rect y="6.67" width="30" height="6.67" fill="#fff" />
        </>
      );
    case "PT":
      return (
        <>
          <rect width="12" height="20" fill="#046A38" />
          <rect x="12" width="18" height="20" fill="#DA291C" />
          <circle cx="12" cy="10" r="4" fill="none" stroke="#FFE900" strokeWidth="1.3" />
          <rect x="10.4" y="8" width="3.2" height="4" rx="1" fill="#fff" stroke="#DA291C" strokeWidth=".4" />
        </>
      );
    case "PK":
      return (
        <>
          <rect width="30" height="20" fill="#01411C" />
          <rect width="7.5" height="20" fill="#fff" />
          <circle cx="19.5" cy="10" r="5" fill="#fff" />
          <circle cx="21" cy="8.8" r="4.3" fill="#01411C" />
          <path d="m22.6 6.6.5 1.4 1.5-.1-1.2.9.5 1.4-1.2-.9-1.2.9.5-1.4-1.2-.9 1.5.1z" fill="#fff" />
        </>
      );
    case "IN":
      return (
        <>
          <rect width="30" height="6.67" fill="#FF9933" />
          <rect y="6.67" width="30" height="6.67" fill="#fff" />
          <rect y="13.33" width="30" height="6.67" fill="#138808" />
          <circle cx="15" cy="10" r="2.4" fill="none" stroke="#000080" strokeWidth=".6" />
          <circle cx="15" cy="10" r=".5" fill="#000080" />
        </>
      );
    case "AE":
      return (
        <>
          <rect width="30" height="6.67" fill="#00732F" />
          <rect y="6.67" width="30" height="6.67" fill="#fff" />
          <rect y="13.33" width="30" height="6.67" fill="#000" />
          <rect width="8" height="20" fill="#FF0000" />
        </>
      );
    case "SA":
      return (
        <>
          <rect width="30" height="20" fill="#006C35" />
          <path d="M8 7.5h14M9 9.2h12" stroke="#fff" strokeWidth=".9" strokeLinecap="round" />
          <path d="M8.5 13.5h12l1.2-.8" stroke="#fff" strokeWidth=".8" strokeLinecap="round" fill="none" />
        </>
      );
    case "BD":
      return (
        <>
          <rect width="30" height="20" fill="#006A4E" />
          <circle cx="13.5" cy="10" r="5.5" fill="#F42A41" />
        </>
      );
    default:
      return <rect width="30" height="20" fill="#1a3357" />;
  }
}

export function Flag({ code, className = "h-4 w-6", decorative = false }: { code: string; className?: string; decorative?: boolean }) {
  const name = countryNames[code] ?? code;
  return (
    <svg
      viewBox="0 0 30 20"
      className={`${className} shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10`}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `Flag of ${name}`}
    >
      <Body code={code} />
    </svg>
  );
}
