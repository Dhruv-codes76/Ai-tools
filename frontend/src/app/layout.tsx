import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLevelThemeController from "@/components/AppLevelThemeController";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    template: "%s | AI Intelligence Portal",
    default: "AI Intelligence Portal | Daily News & Tools",
  },
  description: "Your daily dose of unbiased AI News and the best AI Tools available on the market.",
  keywords: ["AI news", "artificial intelligence", "machine learning", "tech news", "AI tools", "ChatGPT"],
  openGraph: {
    title: "AI Intelligence Portal",
    description: "Your daily dose of unbiased AI News and the best AI Tools available on the market.",
    url: "https://www.aiportalweekly.com",
    siteName: "AI Intelligence Portal",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Intelligence Portal",
    description: "Your daily dose of unbiased AI News and the best AI Tools available on the market.",
  },
  metadataBase: new URL("https://www.aiportalweekly.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans flex flex-col min-h-[100dvh] bg-background text-foreground antialiased relative`}>
        <AppLevelThemeController>
          {children}
        </AppLevelThemeController>
      </body>
    </html>
  );
}
