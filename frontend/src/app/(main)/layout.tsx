import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicBackground from "@/components/DynamicBackground";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DynamicBackground />
      <Navbar />
      <main className="flex-grow z-10 relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
    </>
  );
}
