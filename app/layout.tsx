import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Challengenya Kang Fathur",
  description: "Special Challenge Kang Fathur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}