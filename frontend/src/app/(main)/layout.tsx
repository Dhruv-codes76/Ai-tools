import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicBackground from "@/components/DynamicBackground";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Removed global max-width and horizontal padding to allow full-width mobile reels
  // Components that need constraints (like Home/Desktop News) must now apply them internally.
  return (
    <>
      <DynamicBackground />
      <Navbar />
      <main className="flex-grow z-10 relative w-full h-full pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
    </>
  );
}
