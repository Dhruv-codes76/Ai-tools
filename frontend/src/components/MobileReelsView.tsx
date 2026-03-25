/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import NewsReelItem from "@/components/NewsReelItem";
import EmptyState from "@/components/EmptyState";
import { useRouter } from "next/navigation";

export default function MobileReelsView({ newsItems }: { newsItems: any[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isInteracting, setIsInteracting] = useState(false);
    const interactionTimeout = useRef<NodeJS.Timeout>(null);
    const interactingRef = useRef(false);
    const router = useRouter();

    // Intersection Observer to track active slide
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute("data-index") || "0");
                        setActiveIndex(index);
                    }
                });
            },
            { threshold: 0.6 }
        );

        const children = containerRef.current?.children;
        if (children) {
            Array.from(children).forEach((child) => observer.observe(child));
        }

        return () => observer.disconnect();
    }, [newsItems]);

    // Handle interaction pause
    const handleInteraction = useCallback(() => {
        if (!interactingRef.current) {
            interactingRef.current = true;
            setIsInteracting(true);
        }

        if (interactionTimeout.current) {
            clearTimeout(interactionTimeout.current);
        }

        interactionTimeout.current = setTimeout(() => {
            interactingRef.current = false;
            setIsInteracting(false);
        }, 15000); // Resume auto-scroll after 15s of inactivity
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        if (!newsItems || newsItems.length === 0 || isInteracting) return;

        const interval = setInterval(() => {
            if (containerRef.current) {
                const nextIndex = (activeIndex + 1) % newsItems.length;
                const nextChild = containerRef.current.children[nextIndex] as HTMLElement;
                if (nextChild) {
                    nextChild.scrollIntoView({ behavior: "smooth" });
                }
            }
        }, 30000); // Auto scroll every 30 seconds

        return () => clearInterval(interval);
    }, [activeIndex, newsItems, isInteracting]);

    const handleDoubleTap = (slug: string) => {
        router.push(`/news/${slug}`);
    };

    if (!newsItems || newsItems.length === 0) {
        return (
            <div className="flex items-center justify-center h-[100dvh] w-screen bg-background">
                 <EmptyState message="No transmissions available." />
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="h-[100dvh] w-screen overflow-y-scroll snap-y snap-mandatory bg-background hide-scrollbar fixed top-0 left-0 right-0 bottom-0 z-0 m-0 p-0"
            onScroll={handleInteraction}
            onTouchStart={handleInteraction}
            onMouseDown={handleInteraction}
            style={{
                scrollBehavior: 'smooth',
                overscrollBehaviorY: 'contain',
                WebkitOverflowScrolling: 'touch'
            }}
        >
            {newsItems.map((item, index) => (
                <div
                    key={item._id || item.id || index}
                    data-index={index}
                    className="h-[100dvh] w-screen snap-start snap-always relative flex items-center justify-center m-0 p-0 overflow-hidden"
                    onDoubleClick={() => handleDoubleTap(item.slug)}
                >
                    <NewsReelItem
                        news={{...item, trending: index < 2}}
                        isActive={activeIndex === index}
                        handleInteraction={handleInteraction}
                        isInteracting={isInteracting}
                    />
                </div>
            ))}
        </div>
    );
}
