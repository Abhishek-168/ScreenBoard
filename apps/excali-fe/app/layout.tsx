import type { Metadata } from "next";
import { Geist, Geist_Mono, Finger_Paint, Boldonse } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fingerPaint = Finger_Paint({
  variable: "--font-finger-paint",
  weight: "400",
  subsets: ["latin"],
});

const boldonse = Boldonse({
  variable: "--font-boldonse",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SLATE",
  description: "The real time drawing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fingerPaint.variable} ${boldonse.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
