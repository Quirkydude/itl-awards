export type Nominee = {
  id: string;
  name: string;
  photo: string; // put images in /public/nominees/
};

export type Category = {
  id: string;
  title: string;
  emoji: string;
  nominees: Nominee[];
};

// ─── ADD YOUR REAL NOMINEES BELOW ───────────────────────────────────────────
// Photos go in /public/nominees/  (e.g. /public/nominees/john-doe.jpg)
// Use /nominees/placeholder.jpg as fallback until you have real photos
// ─────────────────────────────────────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: "face-itl-male",
    title: "Face of ITL (Male)",
    emoji: "👑",
    nominees: [
      { id: "fim-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "fim-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "fim-3", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "face-itl-female",
    title: "Face of ITL (Female)",
    emoji: "👑",
    nominees: [
      { id: "fif-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "fif-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "fif-3", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "hardworking-exec-male",
    title: "Most Hardworking Executive (Male)",
    emoji: "💼",
    nominees: [
      { id: "hem-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "hem-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "hardworking-exec-female",
    title: "Most Hardworking Executive (Female)",
    emoji: "💼",
    nominees: [
      { id: "hef-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "hef-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "gentleman-of-the-year",
    title: "Gentleman of the Year",
    emoji: "🎩",
    nominees: [
      { id: "goty-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "goty-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "goty-3", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "lady-of-the-year",
    title: "Lady of the Year",
    emoji: "🌹",
    nominees: [
      { id: "loty-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "loty-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "best-pal-male",
    title: "Best Pal of the Year (Male)",
    emoji: "🤝",
    nominees: [
      { id: "bpm-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "bpm-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "bpm-3", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "best-pal-female",
    title: "Best Pal of the Year (Female)",
    emoji: "🤝",
    nominees: [
      { id: "bpf-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "bpf-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "best-department",
    title: "Best Department",
    emoji: "🏆",
    nominees: [
      { id: "bd-1", name: "Add Department", photo: "/nominees/placeholder.jpg" },
      { id: "bd-2", name: "Add Department", photo: "/nominees/placeholder.jpg" },
      { id: "bd-3", name: "Add Department", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "most-popular-executive",
    title: "Most Popular Executive",
    emoji: "⭐",
    nominees: [
      { id: "mpe-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "mpe-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "most-punctual-prayer",
    title: "Most Punctual & Active in Prayer Meetings",
    emoji: "🙏",
    nominees: [
      { id: "mpp-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "mpp-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "mpp-3", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "most-fashionable",
    title: "Most Fashionable",
    emoji: "✨",
    nominees: [
      { id: "mf-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "mf-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "most-sociable",
    title: "Most Sociable",
    emoji: "🥂",
    nominees: [
      { id: "ms-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "ms-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "ms-3", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
  {
    id: "most-jovial",
    title: "Most Jovial Person",
    emoji: "😄",
    nominees: [
      { id: "mj-1", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
      { id: "mj-2", name: "Add Nominee", photo: "/nominees/placeholder.jpg" },
    ],
  },
];
