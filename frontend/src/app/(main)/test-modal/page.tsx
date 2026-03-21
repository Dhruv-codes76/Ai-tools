"use client";
import { useState } from "react";
import ShareModal from "@/components/ShareModal";

export default function TestModalPage() {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="p-20">
            <button id="open-modal-btn" onClick={() => setIsOpen(true)}>Open Modal</button>
            <ShareModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Test Premium Modal Redesign"
                url="https://aiportalweekly.com/test-article"
                imageUrl="https://picsum.photos/seed/test/800/600"
            />
        </div>
    );
}
