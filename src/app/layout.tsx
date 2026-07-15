import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cena a la Lus — ITL Awards Night",
  description: "Cast your vote for the Invitation to Light Dinner and Awards Night",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Cena a la Lus — ITL Awards Night",
    description: "Vote for your favourites at the ITL Dinner and Awards Night",
    images: ["/itl-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="relative">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1c100a",
              color: "#f7f0e6",
              border: "1px solid rgba(232,200,122,0.3)",
              fontFamily: "var(--font-outfit)",
            },
          }}
        />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
