import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoatWedding — Thiệp cưới online đẹp, nhanh, dễ chia sẻ",
  description: "Tạo thiệp cưới online không cần đăng nhập. Chọn mẫu, nhập thông tin, xem trước và nhận liên kết thiệp chỉ trong vài bước.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
