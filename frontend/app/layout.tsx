import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neslink AI — A reading panel for your scholarship essays",
  description:
    "Get your scholarship essays read against real assessment criteria before you submit. Rubric-first feedback, never AI-written text.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.svg"],
    apple: ["/favicon.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
