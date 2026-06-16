import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Animated Globe",
  description: "An interactive 3D globe with animated trade routes built with React Three Fiber and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
