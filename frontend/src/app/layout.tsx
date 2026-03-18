import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeRegistry from "@/components/ThemeRegistry";
import { ThemeProvider } from "@/components/ThemeProvider";
import DynamicBackground from "@/components/DynamicBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AI News and Tools MVP",
  description: "Your daily dose of AI News and the best AI Tools available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen bg-transparent relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <ThemeRegistry>
            <DynamicBackground />
            <Navbar />
            <main className="flex-grow z-10 relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-20 md:pb-0">
              {children}
            </main>
            <Footer />
          </ThemeRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
