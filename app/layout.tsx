import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Botanische Tuin Den Boterlaer - Privé Hobbytuin",
    template: "%s | Botanische Tuin Den Boterlaer",
  },
  description:
    "Welkom in mijn privé botanische hobbytuin. Ontdek mijn plantencollectie en maak een virtuele wandeling door de tuin. Een persoonlijk project uit passie voor planten en natuur.",
  keywords: ["botanische tuin", "planten", "hobbytuin", "plantencollectie", "tuinieren"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className="scroll-smooth">
      <body className={`${manrope.variable} ${cormorant.variable}`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
