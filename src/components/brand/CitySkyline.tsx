/**
 * Original line-art skylines used as destination identity artwork until licensed
 * photography is uploaded (Destination.heroImage). Landmarks are stylised, not traced.
 */
const skylines: Record<string, React.ReactNode> = {
  DE: (
    <>
      {/* Fernsehturm */}
      <path d="M300 250V70M292 250l8-180 8 180" />
      <circle cx="300" cy="92" r="16" />
      <path d="M284 92h32M300 40v36" />
      {/* Brandenburger Tor */}
      <path d="M110 250v-58h120v58M104 192h132M118 180h104v12M150 170h40v10M162 160h16v10" />
      {[124, 144, 164, 176, 196, 216].map((x) => (
        <path key={x} d={`M${x} 250v-58`} />
      ))}
      {/* Reichstag dome */}
      <path d="M380 250v-60h140v60M380 190h140M420 190a30 30 0 0 1 60 0M430 190v-10h40v10" />
      {/* City blocks */}
      <path d="M20 250v-40h40v40M60 250v-70h30v70M540 250v-80h40v80M580 250v-50h50v50M240 250v-30h30v30" />
    </>
  ),
  IT: (
    <>
      <path d="M60 250v-80h220v80M60 170h220M60 210h220" />
      {[80, 110, 140, 170, 200, 230, 260].map((x) => (
        <path key={x} d={`M${x - 10} 250v-25a10 10 0 0 1 20 0v25M${x - 10} 205v-20a10 10 0 0 1 20 0v20`} />
      ))}
      <path d="M360 250v-70h120v70M360 180a60 60 0 0 1 120 0M420 120v-20M410 100h20M540 250V90l14-20 14 20v160" />
    </>
  ),
  PL: (
    <>
      <path d="M270 250V120h60v130M280 120V90h40v30M290 90V60h20v30M300 60V20M240 250v-60h120v60" />
      <path d="M60 250v-90l40-30 40 30v90M100 130V90M400 250v-70h40v70M440 250v-100h30v100M480 250v-60h60v60M160 250v-50h50v50" />
    </>
  ),
  PT: (
    <>
      <path d="M90 250V110h60v140M84 110h72M100 110V80h40v30M110 80V60h20v20M90 170h60" />
      <path d="M230 250c30-40 70-60 120-60s90 20 120 60" />
      <path d="M330 190v-40h70v40M340 150v-20h50v20M480 250v-60h60v60M540 210l30-40 30 40v40" />
      <path d="M250 232h40v-20h-40zM262 212v-10" />
    </>
  ),
  AT: (
    <>
      <path d="M200 250V100l20-60 20 60v150M185 250v-80h70v80M205 140h30" />
      <circle cx="440" cy="160" r="70" />
      <path d="M440 90v140M370 160h140M390 110l100 100M490 110 390 210M410 250l30-20 30 20" />
      <path d="M40 250v-60h80v60M80 190v-30M280 250v-50h60v50" />
    </>
  ),
};

export function CitySkyline({ code, className = "" }: { code: string; className?: string }) {
  return (
    <svg viewBox="0 0 640 260" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden>
      <path d="M0 250h640" strokeOpacity=".6" />
      {skylines[code] ?? skylines.DE}
    </svg>
  );
}
