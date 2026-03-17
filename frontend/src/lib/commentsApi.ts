const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getComments(articleId: string) {
    try {
        const res = await fetch(`${API_BASE}/comments?article_id=${articleId}`, {
            next: { revalidate: 0 }, // dynamically fetched
        });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export async function postComment(articleId: string, commentText: string, parentId?: string, website?: string) {
    const res = await fetch(`${API_BASE}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            article_id: articleId,
            comment_text: commentText,
            parent_id: parentId,
            website
        })
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || error.error || 'Failed to post comment');
    }

    return res.json();
}

export async function likeComment(commentId: string) {
    const res = await fetch(`${API_BASE}/comment/like/${commentId}`, {
        method: 'POST'
    });

    if (!res.ok) throw new Error('Failed to like comment');
    return res.json();
}
