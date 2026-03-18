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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message :  'Error posting comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 p-1">
            <div className="relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Share your insights anonymously..."
                    className="w-full min-h-[120px] p-5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-base text-foreground resize-y transition-all shadow-[0_4px_20px_rgb(0,0,0,0.1)] placeholder:text-muted-foreground/50"
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
            </div>

            {error && <p className="text-red-400 text-sm mt-3 font-medium px-1">{error}</p>}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-white/50">?</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                        <span className={text.length < 25 ? 'text-orange-400/80' : 'text-green-400/80'}>
                            {text.length}
                        </span>
                        /500 characters
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={loading || text.length < 25}
                    className="w-full sm:w-auto bg-foreground text-background px-8 py-3 rounded-xl font-bold tracking-wide text-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shadow-md"
                >
                    {loading ? 'Posting...' : 'Post Insight'}
                </button>
            </div>
        </form>
    );
}
