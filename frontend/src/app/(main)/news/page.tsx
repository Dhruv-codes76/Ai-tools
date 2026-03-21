import MobileReelsView from "@/components/MobileReelsView";
import DesktopNewsList from "@/components/DesktopNewsList";
import { getNews } from "@/lib/api";
import { Suspense } from "react";

export const metadata = {
    title: "Latest AI News | Editorial",
    description: "Read the latest beginner-friendly, unbiased AI news.",
};

// Ensure page is always dynamic (no stale caching)
export const revalidate = 0;

export default async function NewsPage() {
    const { data: newsItems } = await getNews();

    return (
        <>
            {/* Mobile View (< 768px) */}
            <div className="block md:hidden">
                <Suspense fallback={<div className="w-full h-screen bg-black flex items-center justify-center animate-pulse"><div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div></div>}>
                    <MobileReelsView newsItems={newsItems || []} />
                </Suspense>
            </div>

            {/* Desktop View (>= 768px) */}
            <div className="hidden md:block">
                <Suspense fallback={<div className="max-w-[900px] mx-auto py-12 px-6 flex flex-col gap-10"><div className="w-full h-64 bg-muted animate-pulse rounded-xl"></div><div className="w-full h-64 bg-muted animate-pulse rounded-xl"></div></div>}>
                    <DesktopNewsList newsItems={newsItems || []} />
                </Suspense>
            </div>
        </>
    );
}
