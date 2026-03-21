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
      <main className="flex-grow z-10 relative w-full h-full pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
    </>
  );
}
