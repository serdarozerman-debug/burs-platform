import type { Metadata } from "next";
import "../public/assets/css/style.css";
import "@/styles/globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jobbox - Job Portal HTML Template",
  description: "Jobbox - Job Portal HTML Template",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className}`}>{children}</body>
    </html>
  );
}
