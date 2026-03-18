"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SwipeToBack({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isSwiping, setIsSwiping] = useState(false);
    const [swipeX, setSwipeX] = useState(0);

    useEffect(() => {
        let startX = 0;
        let startY = 0;
        let isEdgeSwipe = false;

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;

            // Only trigger if starting near left edge (0-30px)
            if (startX <= 30) {
                isEdgeSwipe = true;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isEdgeSwipe) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = Math.abs(touch.clientY - startY);

            // Cancel if vertical scroll dominates
            if (deltaY > Math.abs(deltaX)) {
                isEdgeSwipe = false;
                setIsSwiping(false);
                setSwipeX(0);
                return;
            }

            if (deltaX > 0) {
                // Prevent default back behavior of browser if possible
                e.preventDefault();
                setIsSwiping(true);
                setSwipeX(Math.min(deltaX, 100)); // Cap the visual effect
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!isEdgeSwipe) return;

            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startX;

            if (deltaX > 80) {
                // Trigger back navigation
                router.back();
            } else {
                // Reset visual state
                setIsSwiping(false);
                setSwipeX(0);
            }

            isEdgeSwipe = false;
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [router]);

    return (
        <div
            style={{
                transform: isSwiping ? `translateX(${swipeX}px)` : 'translateX(0)',
                transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
            }}
            className="w-full h-full"
        >
            {children}
        </div>
    );
}
