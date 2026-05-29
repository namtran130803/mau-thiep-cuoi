import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mẫu thiệp cưới online",
  description: "Thiệp mời cưới trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
