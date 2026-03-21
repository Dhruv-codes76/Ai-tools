"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";

type Comment = {
    id: string;
    news_id: string;
    user_id: string;
    user_name: string;
    user_avatar: string;
    content: string;
    created_at: string;
};

export default function ReelComments({ newsId }: { newsId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [text, setText] = useState("");
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUser();
        fetchComments(); // eslint-disable-line react-hooks/exhaustive-deps

        const channel = supabase
            .channel(`public:comments:news_id=eq.${newsId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments',
                    filter: `news_id=eq.${newsId}`
                },
                (payload) => {
                    setComments(prev => [payload.new as Comment, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [newsId]);

    const fetchUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
    };

    const fetchComments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('news_id', newsId)
            .order('created_at', { ascending: false });

        if (data) setComments(data);
        if (error) console.error(error);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !user) return;
        setPosting(true);
        setError("");

        try {
            const { error: insertError } = await supabase.from('comments').insert({
                news_id: newsId,
                user_id: user.id,
                user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                user_avatar: user.user_metadata?.avatar_url || '',
                content: text.trim()
            });

            if (insertError) throw insertError;
            setText("");
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.message || 'Error posting comment');
        } finally {
            setPosting(false);
        }
    };

    const handleLogin = async () => {
        window.location.href = "/login";
        return;

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` }
        });
    };

    return (
        <div className="flex flex-col h-full bg-[#111]">
            {/* Comments List */}
            <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar pr-2 space-y-4">
                {loading ? (
                    <div className="flex justify-center p-4">
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center p-8 text-white/50 border border-white/5 rounded-xl border-dashed">
                        Be the first to comment.
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                                {comment.user_avatar ? (
                                    <img
                                        src={comment.user_avatar}
                                        alt={comment.user_name}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white/70">
                                        {comment.user_name?.substring(0, 1).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between gap-2 mb-1">
                                    <span className="font-semibold text-sm text-white/90 truncate">
                                        {comment.user_name}
                                    </span>
                                    <span className="text-[10px] text-white/40 shrink-0">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-white/70 break-words leading-relaxed">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 bg-[#111] pt-2 border-t border-white/10">
                {user ? (
                    <form onSubmit={handleSubmit} className="flex gap-2 items-end relative">
                        {error && <p className="absolute -top-6 left-2 text-xs text-red-400">{error}</p>}
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-white/10 border border-white/10 rounded-2xl py-2.5 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 resize-none overflow-hidden h-[45px] max-h-[120px]"
                            rows={1}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = '45px';
                                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!text.trim() || posting}
                            className="h-[45px] px-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            {posting ? '...' : 'Post'}
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-sm text-white/60 mb-3">Login to comment</p>
                        <button
                            onClick={handleLogin}
                            className="w-full sm:w-auto px-6 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 active:scale-95 transition-all"
                        >
                            Continue with Google
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
