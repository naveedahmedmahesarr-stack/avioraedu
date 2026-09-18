/**
 * AVIORA EDU brand photography — the supplied files in /public/brand, untouched.
 *
 * `fx` marks where a globe / world-map detail sits inside each photo, in percent of
 * the image box (x, y = centre; r / w / h relative to image width / height).
 * Only these details receive motion; the photographs themselves never move.
 */
export type GlobeFx =
  | { kind: "globe"; x: number; y: number; r: number } // physical desk globe → rotating light + orbit
  | { kind: "icon"; x: number; y: number; r: number } // small engraved globe symbol → glow + orbit ring
  | { kind: "map"; x: number; y: number; w: number; h: number; hubs?: [number, number][] }; // world map → light sweep + city pulses

export type BrandImageData = {
  id: string;
  src: string;
  w: number;
  h: number;
  alt: string;
  caption: string;
  fx: GlobeFx[];
};

export const brandImages = {
  showcase: {
    id: "showcase",
    src: "/brand/showcase-map.webp",
    w: 1672,
    h: 941,
    alt: "AVIORA EDU gold emblem on black marble with a glowing world map — Education beyond borders",
    caption: "Education beyond borders",
    fx: [
      { kind: "icon", x: 49.94, y: 78.64, r: 1.95 },
      { kind: "globe", x: 7.2, y: 57.5, r: 8.4 },
      {
        kind: "map",
        x: 76,
        y: 18,
        w: 46,
        h: 36,
        hubs: [
          [63.4, 9.8],
          [87.1, 14.4],
          [76.7, 19.1],
        ],
      },
    ],
  },
  emblem: {
    id: "emblem",
    src: "/brand/emblem.webp",
    w: 1254,
    h: 1254,
    alt: "AVIORA EDU gold emblem — Education beyond borders",
    caption: "The AVIORA EDU emblem",
    fx: [
      { kind: "icon", x: 48.8, y: 79.6, r: 2.6 },
      { kind: "map", x: 52, y: 36, w: 66, h: 44 },
    ],
  },
  mobileEmblem: {
    id: "mobile-emblem",
    src: "/brand/mobile-emblem.webp",
    w: 941,
    h: 1672,
    alt: "AVIORA EDU gold emblem in a gold ring on black",
    caption: "The AVIORA EDU emblem",
    fx: [{ kind: "icon", x: 49.9, y: 73.1, r: 2.4 }],
  },
  collage: {
    id: "collage",
    src: "/brand/collage.webp",
    w: 1672,
    h: 941,
    alt: "AVIORA EDU brand scenes with a sunset view over Berlin, the TV Tower and the Berliner Dom",
    caption: "Berlin at golden hour",
    fx: [
      { kind: "globe", x: 15.2, y: 26, r: 5 },
      { kind: "globe", x: 41.6, y: 79.5, r: 9.2 },
    ],
  },
  wallSignature: {
    id: "wall-signature",
    src: "/brand/wall-signature.webp",
    w: 1672,
    h: 941,
    alt: "Gold AVIORA EDU sign on black marble beside a window overlooking Berlin",
    caption: "Germany · Europe · The World",
    fx: [
      { kind: "globe", x: 7.2, y: 57.4, r: 7.8 },
      { kind: "icon", x: 59.6, y: 75.2, r: 1.4 },
    ],
  },
  receptionWall: {
    id: "reception-wall",
    src: "/brand/reception-wall.webp",
    w: 1536,
    h: 1024,
    alt: "Illuminated AVIORA EDU marble wall with world map behind the reception desk",
    caption: "Your global education partner",
    fx: [{ kind: "map", x: 71.5, y: 33, w: 18, h: 20 }],
  },
  receptionLounge: {
    id: "reception-lounge",
    src: "/brand/reception-lounge.webp",
    w: 1536,
    h: 1024,
    alt: "AVIORA EDU reception and lounge at dusk with a view of the Berlin TV Tower",
    caption: "More than education",
    fx: [
      { kind: "map", x: 45.5, y: 27, w: 13, h: 18 },
      { kind: "globe", x: 13.3, y: 54.4, r: 2.9 },
      { kind: "icon", x: 56.1, y: 50.1, r: 1.3 },
    ],
  },
  officeAtrium: {
    id: "office-atrium",
    src: "/brand/office-atrium.webp",
    w: 1536,
    h: 1024,
    alt: "AVIORA EDU atrium with consultation, admission, visa and settlement teams",
    caption: "From application to arrival",
    fx: [
      { kind: "map", x: 25, y: 23.5, w: 9.5, h: 11 },
      { kind: "globe", x: 11.1, y: 75.8, r: 2.3 },
    ],
  },
  officeBerlin: {
    id: "office-berlin",
    src: "/brand/office-berlin.webp",
    w: 1536,
    h: 1024,
    alt: "AVIORA EDU reception with the Berlin skyline, German and EU flags",
    caption: "Reception · Berlin view",
    fx: [{ kind: "globe", x: 42.8, y: 43.1, r: 1.4 }],
  },
  officePakistan: {
    id: "office-pakistan",
    src: "/brand/office-pakistan.webp",
    w: 1536,
    h: 1024,
    alt: "AVIORA EDU office with German, EU and Pakistani flags and consultation rooms",
    caption: "Germany · Pakistan · The World",
    fx: [{ kind: "globe", x: 32.2, y: 74.3, r: 2.6 }],
  },
} satisfies Record<string, BrandImageData>;
