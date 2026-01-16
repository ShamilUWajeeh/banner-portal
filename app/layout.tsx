import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- THIS LINE IS CRITICAL. WITHOUT IT, NO STYLES LOAD.

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Election Banner Portal",
  description: "Automated Campaign Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}