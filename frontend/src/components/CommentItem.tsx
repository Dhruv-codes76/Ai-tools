"use client";

import { useState } from "react";
import { ThumbsUp, MessageSquare, Link as LinkIcon } from "lucide-react";
import CommentForm from "./CommentForm";
import { formatDistanceToNow } from "date-fns";
import { likeComment as likeCommentApi } from "@/lib/commentsApi";
import { useRouter } from "next/navigation";

type Comment = {
    id: string;
    anonymous_id: string;
    comment_text: string;
    likes: number;
    created_at: string;
    replies?: Comment[];
};

export default function CommentItem({ comment, articleId, isTopInsight = false }: { comment: Comment, articleId: string, isTopInsight?: boolean }) {
    const [hasLiked, setHasLiked] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const router = useRouter();

    const handleLike = async () => {
        if (hasLiked) return;
        try {
            await likeCommentApi(comment.id);
            setHasLiked(true);
            router.refresh(); // re-fetch the server component
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <article id={`comment-${comment.id}`} className={`p-4 md:p-5 rounded-xl border ${isTopInsight ? 'border-amber-500/50 bg-amber-500/5 shadow-sm' : 'border-border bg-card'}`}>
            {isTopInsight && (
                <div className="flex items-center gap-2 mb-3 text-amber-500 text-xs font-bold uppercase tracking-wider">
                    ⭐ Top Insight
                </div>
            )}
            <p className="text-foreground leading-relaxed text-sm md:text-base whitespace-pre-wrap mb-4">
                {comment.comment_text}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-3">
                <span className="text-xs text-muted-foreground font-medium">
                    By Anonymous ({comment.anonymous_id}) • {formatDistanceToNow(new Date(comment.created_at))} ago
                </span>

                <div className="flex items-center gap-3">
                    <a
                        href={`#/comment-${comment.id}`}
                        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Link to comment"
                    >
                        <LinkIcon className="w-3.5 h-3.5" />
                    </a>
                    <button
                        onClick={handleLike}
                        disabled={hasLiked}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md transition-colors ${hasLiked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} /> {comment.likes}
                    </button>
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <MessageSquare className="w-3.5 h-3.5" /> Reply
                    </button>
                </div>
            </div>

            {showReplyForm && (
                <div className="mt-4 pl-4 border-l-2 border-primary/20">
                    <CommentForm
                        articleId={articleId}
                        parentId={comment.id}
                        onSuccess={() => setShowReplyForm(false)}
                    />
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-5 pl-4 md:pl-6 border-l-2 border-border flex flex-col gap-4">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            articleId={articleId}
                        />
                    ))}
                </div>
            )}
        </article>
    );
}
