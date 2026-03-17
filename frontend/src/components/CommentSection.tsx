import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { getComments } from "@/lib/commentsApi";

type Comment = {
    id: string;
    anonymous_id: string;
    comment_text: string;
    likes: number;
    created_at: string;
    replies?: Comment[];
};

export default async function CommentSection({ articleId }: { articleId: string }) {
    // Server-side fetch!
    const comments: Comment[] = await getComments(articleId);

    const countAllComments = (list: Comment[]): number => {
        let count = list.length;
        for (const item of list) {
            if (item.replies) count += countAllComments(item.replies);
        }
        return count;
    };

    const totalCommentsCount = countAllComments(comments);

    // Identify the top insight by flattening and checking likes
    let topInsight: Comment | null = null;
    let maxLikes = -1;

    const findTopInsight = (list: Comment[]) => {
        for (const c of list) {
            if (c.likes > maxLikes) {
                maxLikes = c.likes;
                topInsight = c;
            }
            if (c.replies) findTopInsight(c.replies);
        }
    };

    findTopInsight(comments);

    // Only show top insight if it actually has likes
    if (maxLikes === 0) {
        topInsight = null;
    }

    return (
        <section className="mt-16 border-t border-border pt-12">
            <h2 className="text-3xl font-bold font-sans tracking-tight mb-2">Community Insights</h2>
            <p className="text-muted-foreground text-sm mb-8">
                {totalCommentsCount} {totalCommentsCount === 1 ? 'Community Insight' : 'Community Insights'}
            </p>

            <CommentForm articleId={articleId} />

            {comments.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                    Be the first to share an insight anonymously.
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {topInsight && (
                        <div className="mb-8">
                            <CommentItem
                                key={`top-${(topInsight as Comment).id}`}
                                comment={topInsight as Comment}
                                articleId={articleId}
                                isTopInsight={true}
                            />
                        </div>
                    )}

                    {(comments.length > 0 || totalCommentsCount > 0) && (
                        <div className="mt-2 flex flex-col gap-6">
                            <h3 className="text-xl font-bold font-sans tracking-tight mb-2">Discussion</h3>
                            {comments.map(comment => {
                                // Don't show the exact same top insight in the root list if we can help it,
                                // but if it's a child, we still need its parent to render. For simplicity in a threaded view:
                                return (
                                    <div key={comment.id} className={comment.id === (topInsight as Comment | null)?.id ? 'opacity-80' : ''}>
                                        <CommentItem
                                            comment={comment}
                                            articleId={articleId}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
