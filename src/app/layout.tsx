import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luxor Bidding System",
  description: "A bidding system for collections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-xl font-bold">Luxor Bidding System</h1>
          </div>
        </header>
        <div className="max-w-5xl mx-auto p-4">{children}</div>
        <footer className="border-t mt-10">
          <div className="max-w-5xl mx-auto p-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Luxor Bidding System. All rights
            reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
