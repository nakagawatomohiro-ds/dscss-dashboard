import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSCSS ダッシュボード",
  description: "学習アプリ使用状況ダッシュボード",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
