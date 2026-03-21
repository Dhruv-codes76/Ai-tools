"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import ShareModal from "@/components/ShareModal";

export default function ArticleClientControls({ title, slug, imageUrl }: { title: string, slug: string, imageUrl?: string }) {
    const [showShare, setShowShare] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowShare(true)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors active:scale-95"
                title="Share Article"
            >
                <Share2 className="w-5 h-5" />
            </button>

            <ShareModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                title={title}
                url={typeof window !== 'undefined' ? `${window.location.origin}/news/${slug}` : ''}
                imageUrl={imageUrl}
            />
        </>
    );
}
