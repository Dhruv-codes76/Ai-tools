export default function NewsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-[calc(100vh-64px)] overflow-hidden bg-black text-white">
            {children}
        </div>
    );
}
