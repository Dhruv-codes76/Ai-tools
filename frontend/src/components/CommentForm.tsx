"use client";

import { useState } from "react";
import { postComment } from "@/lib/commentsApi";
import { useRouter } from "next/navigation";

export default function CommentForm({ articleId, parentId, onSuccess }: { articleId: string, parentId?: string, onSuccess?: () => void }) {
    const [text, setText] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await postComment(articleId, text, parentId, honeypot);
            setText('');
            if (onSuccess) onSuccess();
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error posting comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 mb-8 bg-card border border-border rounded-lg p-4">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts anonymously..."
                className="w-full min-h-[100px] p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-y"
                required
                minLength={25}
                maxLength={500}
            />
            {/* Honeypot field - visually hidden */}
            <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden opacity-0 absolute w-0 h-0"
                tabIndex={-1}
                autoComplete="off"
            />
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted-foreground">
                    {text.length}/500 • Min 25 chars
                </span>
                <button
                    type="submit"
                    disabled={loading || text.length < 25}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    {loading ? 'Posting...' : 'Post Insight'}
                </button>
            </div>
        </form>
    );
}
