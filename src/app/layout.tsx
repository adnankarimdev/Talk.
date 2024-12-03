import type { Metadata } from "next";
import { Inter, Staatliches } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });
const staatliches = Staatliches({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talk.",
  description: "Instant Insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={staatliches.className}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
