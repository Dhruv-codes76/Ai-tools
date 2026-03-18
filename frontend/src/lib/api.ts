const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Shared fetch with a 5-second timeout so pages never hang waiting for backend
async function apiFetch(path: string, options: RequestInit = {}) {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            ...options,
            signal: AbortSignal.timeout(5000), // fail after 5s
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null; // backend offline → return null gracefully
    }
}

export async function getNews(page = 1, limit = 12) {
    // Disable caching for news lists to ensure immediate visibility of new articles
    const data = await apiFetch(`/news?page=${page}&limit=${limit}`, { cache: 'no-store' });
    return data ?? { data: [], total: 0, page: 1, totalPages: 1 };
}

export async function getNewsBySlug(slug: string) {
    // Disable caching for single news articles
    return apiFetch(`/news/${slug}`, { cache: 'no-store' });
}

export async function getTools(page = 1, limit = 12, category = '') {
    // Disable caching for tools
    const q = category ? `&category=${category}` : '';
    const data = await apiFetch(`/tools?page=${page}&limit=${limit}${q}`, { cache: 'no-store' });
    return data ?? { data: [], total: 0, page: 1, totalPages: 1 };
}

export async function getToolBySlug(slug: string) {
    return apiFetch(`/tools/${slug}`, { cache: 'no-store' });
}

export async function getCategories() {
    // Categories change rarely, cache for 5 minutes
    const data = await apiFetch('/categories', { next: { revalidate: 300 } });
    return Array.isArray(data) ? data : [];
}
