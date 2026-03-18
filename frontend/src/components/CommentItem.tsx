"use client";

import { useState } from "react";
import { ThumbsUp, MessageSquare, Link as LinkIcon, Star } from "lucide-react";
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
        <article id={`comment-${comment.id}`} className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 hover:bg-white/[0.03] ${isTopInsight ? 'border-amber-500/30 bg-amber-500/5 shadow-[0_4px_30px_rgba(245,158,11,0.1)]' : 'border-white/10 bg-white/[0.02]'}`}>

            <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                    <span className="text-sm font-bold text-white/70">
                        {comment.anonymous_id.substring(0, 2).toUpperCase()}
                    </span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">
                            Anonymous
                        </span>
                        <span className="text-xs text-muted-foreground/50 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5">
                            {comment.anonymous_id.substring(0, 6)}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
                            {formatDistanceToNow(new Date(comment.created_at))} ago
                        </span>
                    </div>

                    {isTopInsight && (
                        <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase tracking-widest mt-1 mb-3 bg-amber-500/10 w-fit px-2 py-1 rounded-md border border-amber-500/20">
                            <Star className="w-3 h-3 fill-current" /> Top Insight
                        </div>
                    )}
                </div>
            </div>

            <p className="text-gray-300 leading-[1.7] text-sm md:text-base whitespace-pre-wrap mb-6 pl-[3.5rem]">
                {comment.comment_text}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4 pl-[3.5rem]">
                <span className="text-xs text-muted-foreground sm:hidden">
                    {formatDistanceToNow(new Date(comment.created_at))} ago
                </span>

                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={handleLike}
                        disabled={hasLiked}
                        className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all ${hasLiked ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20' : 'text-muted-foreground hover:bg-white/10 hover:text-foreground border border-transparent'}`}
                    >
                        <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                        <span>{comment.likes}</span>
                    </button>
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all border ${showReplyForm ? 'bg-white/10 text-foreground border-white/20' : 'text-muted-foreground hover:bg-white/10 hover:text-foreground border-transparent'}`}
                    >
                        <MessageSquare className="w-4 h-4" /> Reply
                    </button>
                    <a
                        href={`#/comment-${comment.id}`}
                        className="flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all border border-transparent"
                        title="Link to comment"
                    >
                        <LinkIcon className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

            {showReplyForm && (
                <div className="mt-6 pl-[3.5rem] animate-fade-in animate-slide-up">
                    <CommentForm
                        articleId={articleId}
                        parentId={comment.id}
                        onSuccess={() => setShowReplyForm(false)}
                    />
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-6 pl-[3.5rem] flex flex-col gap-5 border-l-2 border-white/5 relative left-5 lg:left-0">
                    {comment.replies.map(reply => (
                        <div key={reply.id} className="-ml-[1.1rem]">
                            <CommentItem
                                comment={reply}
                                articleId={articleId}
                            />
                        </div>
                    ))}
                </div>
            )}
        </article>
    );
}
