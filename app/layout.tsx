import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLM Simulator | From Day 0 to Production",
  description:
    "An interactive, professional guide to understanding how Large Language Models are built — from research and data collection to production deployment and continuous learning.",
  keywords: [
    "LLM",
    "Large Language Models",
    "Machine Learning",
    "AI",
    "Transformer",
    "GPT",
    "Claude",
    "Deep Learning",
    "NLP",
  ],
  authors: [{ name: "LLM Simulator" }],
  openGraph: {
    title: "LLM Simulator | From Day 0 to Production",
    description:
      "An interactive journey through building Large Language Models",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <TooltipProvider delayDuration={200}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
