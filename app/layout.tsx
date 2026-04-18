<<<<<<< HEAD
  import type { Metadata } from "next";
  import { DM_Sans } from "next/font/google";
  import "./globals.css";

  const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
    display: "swap",
  });

  export const metadata: Metadata = {
    title: "InteriorBill Pro",
    description: "Proposal, Quotation & Invoicing System for Interior Design Firms",
  };

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en" className={dmSans.variable}>
        <body className="antialiased font-sans">{children}</body>
      </html>
    );
  }
=======
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "InteriorBill Pro",
  description: "Proposal, Quotation & Invoicing System for Interior Design Firms",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
