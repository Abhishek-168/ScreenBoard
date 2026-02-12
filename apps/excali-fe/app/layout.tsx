import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Finger_Paint,
  Boldonse,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const fingerPaint = Finger_Paint({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-finger-paint",
  display: "swap",
});

const boldonse = Boldonse({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-boldonse",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScreenBoard - Real-time Collaborative Drawing",
  description: "The real-time drawing platform",
  icons: {
    icon: "/weblogo.png",
    apple: "/weblogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fingerPaint.variable} ${boldonse.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
