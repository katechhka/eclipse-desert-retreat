import { assetPath } from "../data/assets";
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.scss";
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});
const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://katechhka.github.io"),
  title: "ECLIPSE — Desert Retreat",
  description:
    "Where silence becomes a luxury. A fictional retreat in Wadi Rum.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "ECLIPSE — Desert Retreat",
    images: [assetPath("/images/hero-desert.webp")],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
