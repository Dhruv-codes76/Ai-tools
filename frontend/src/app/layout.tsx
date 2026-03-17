import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeRegistry from "@/components/ThemeRegistry";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "AI Portal Weekly | Intelligence & Tools",
  description: "Your daily dose of AI News and the best AI Tools available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} font-sans flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <ThemeRegistry>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ThemeRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
