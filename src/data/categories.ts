export type Nominee = {
  id: string;
  name: string;
  photo: string;
};

export type Category = {
  id: string;
  title: string;
  emoji: string;
  nominees: Nominee[];
};

/**
 * Populated from the nomination form CSV (22 rows).
 * Each CSV upload is matched 1:1 to its image via submission timestamp.
 */
export const categories: Category[] = [
  {
    id: "face-itl-male",
    title: "Face of ITL (Male)",
    emoji: "👑",
    nominees: [
      { id: "n23", name: "Raphael", photo: "/nominees/28-Raphael.png" },
    ],
  },
  {
    id: "face-itl-female",
    title: "Face of ITL (Female)",
    emoji: "👑",
    nominees: [
      { id: "n11", name: "Stella Frimponmaah", photo: "/nominees/11-stella-frimponmaah.webp" },
      { id: "n14", name: "Juliet Mensah", photo: "/nominees/14-juliet-mensah.jpg" },
      { id: "n16", name: "Ohemaa", photo: "/nominees/16-ohemaa.jpeg" },
      { id: "n17", name: "Precious Yeboah Ati", photo: "/nominees/17-precious-yeboah-ati.jpg" },
    ],
  },
  {
    id: "hardworking-exec-male",
    title: "Most Hardworking Executive (Male)",
    emoji: "💼",
    nominees: [
      { id: "n01", name: "Frimpong", photo: "/nominees/01-frimpong.jpg" },
      { id: "n08", name: "Peter Ababio Mensah", photo: "/nominees/08-peter-ababio-mensah.jpg" },
    ],
  },
  {
    id: "hardworking-exec-female",
    title: "Most Hardworking Executive (Female)",
    emoji: "💼",
    nominees: [
      { id: "n18", name: "Precious Yeboah Ati", photo: "/nominees/18-precious-yeboah-ati.jpg" },
      { id: "n22", name: "Sarah Seidu", photo: "/nominees/22-sarah-seidu.jpg" },
    ],
  },
  {
    id: "gentleman-of-the-year",
    title: "Gentleman of the Year",
    emoji: "🎩",
    nominees: [
      { id: "n09", name: "Peter Ababio Mensah", photo: "/nominees/09-peter-ababio-mensah.jpg" },
      { id: "n23", name: "Frimpong", photo: "/nominees/01-frimpong.jpg" },
      { id: "n24", name: "Nana Appiah", photo: "/nominees/24-Nana-Appiah.png" },
    ],
  },
  {
    id: "lady-of-the-year",
    title: "Lady of the Year",
    emoji: "🌹",
    nominees: [
      { id: "n20", name: "Precious Yeboah Ati", photo: "/nominees/20-precious-yeboah-ati.jpg" },
      { id: "n29", name: "Christabel", photo: "/nominees/29-Christabel.png" },
    ],
  },
  {
    id: "best-pal-male",
    title: "Best Pal of the Year (Male)",
    emoji: "🤝",
    nominees: [
      { id: "n12", name: "Elikem and Nathaniel", photo: "/nominees/12-elikem-and-nathaniel.jpg" },
    ],
  },
  {
    id: "best-pal-female",
    title: "Best Pal of the Year (Female)",
    emoji: "🤝",
    nominees: [
      { id: "n13", name: "Christabel and Juliet", photo: "/nominees/13-christabel-and-juliet.jpg" },
      {
        id: "n21",
        name: "Blessing and Sarah",
        photo: "/nominees/21-blessing-antwiwaa-kwarteng.jpg",
      },
    ],
  },
  {
    id: "best-department",
    title: "Best Department",
    emoji: "🏆",
    nominees: [
      { id: "n02", name: "Prayer Team", photo: "/nominees/02-prayer-team.jpg" },
      {
        id: "n04",
        name: "Content Creation and Blogging",
        photo: "/nominees/04-content-creation-and-blogging.jpeg",
      },
    ],
  },
  {
    id: "most-popular-executive",
    title: "Most Popular Executive",
    emoji: "⭐",
    nominees: [
      { id: "n05", name: "Apostle Dove", photo: "/nominees/05-apostle-dove.png" },
      { id: "n10", name: "Gelina Duah Tuffour", photo: "/nominees/10-gelina-duah-tuffour.jpg" },
      { id: "n15", name: "Christabel Nimako", photo: "/nominees/15-christabel-nimako.jpg" },
      { id: "n19", name: "Precious Yeboah Ati", photo: "/nominees/19-precious-yeboah-ati.jpg" },
    ],
  },
  {
    id: "most-punctual-prayer",
    title: "Most Punctual & Active in Prayer Meetings",
    emoji: "🙏",
    nominees: [
      { id: "n24", name: "Makafui", photo: "/nominees/24-Makafui.png" },
      { id: "n25", name: "Akosua", photo: "/nominees/25-Akosua.png" },
    ],
  },
  {
    id: "most-fashionable",
    title: "Most Fashionable",
    emoji: "✨",
    nominees: [
      { id: "n26", name: "Ohemaa", photo: "/nominees/26-Ohemaa.webp" },
      { id: "n27", name: "Berry", photo: "/nominees/27-Berry.png" },
      { id: "n28", name: "Raphael", photo: "/nominees/28-Raphael.png" },
    ],
  },
  {
    id: "most-sociable",
    title: "Most Sociable",
    emoji: "🥂",
    nominees: [
      { id: "n03", name: "Elvis Konadu", photo: "/nominees/03-elvis-konadu.png" },
    ],
  },
  {
    id: "most-jovial",
    title: "Most Jovial Person",
    emoji: "😄",
    nominees: [
      { id: "n06", name: "Elvis Konadu", photo: "/nominees/06-elvis-konadu.png" },
    ],
  },
];

/** Categories that currently have nominees (used for voting). */
export const voteCategories = categories.filter((c) => c.nominees.length > 0);
