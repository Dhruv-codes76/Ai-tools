"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

type Comment = {
    id: string;
    news_id: string;
    user_id: string;
    content: string;
    is_anonymous: boolean;
    created_at: string;
    user_name: string;
    user_avatar: string;
};

export default function CommentSection({ articleId }: { articleId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        setLoading(true);
        // Use the view to get the joined data
        const { data, error } = await supabase
            .from('comments_with_profiles')
            .select('*')
            .eq('news_id', articleId)
            .order('created_at', { ascending: false });

        if (data) setComments(data as Comment[]);
        if (error) console.error(error);
        setLoading(false);
    };

    useEffect(() => {
        fetchComments(); // eslint-disable-line react-hooks/exhaustive-deps

        // Listen for new comments on the base table
        const channel = supabase
            .channel(`public:comments:news_id=eq.${articleId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments',
                    filter: `news_id=eq.${articleId}`
                },
                () => {
                    // Re-fetch to get the joined profile data
                    fetchComments(); // eslint-disable-line react-hooks/exhaustive-deps
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [articleId]);

    const totalCommentsCount = comments.length;

    return (
        <section className="mt-16 border-t border-border pt-12">
            <h2 className="text-3xl font-bold font-sans tracking-tight mb-2">Community Insights</h2>
            <p className="text-muted-foreground text-sm mb-8">
                {totalCommentsCount} {totalCommentsCount === 1 ? 'Community Insight' : 'Community Insights'}
            </p>

            <CommentForm articleId={articleId} />

            {loading ? (
                <div className="py-12 flex justify-center">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : comments.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                    Be the first to share an insight.
                </div>
            ) : (
                <div className="flex flex-col gap-6 mt-8">
                    <h3 className="text-xl font-bold font-sans tracking-tight mb-2">Discussion</h3>
                    {comments.map(comment => (
                        <div key={comment.id}>
                            <CommentItem comment={comment} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
