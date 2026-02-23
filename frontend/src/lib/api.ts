const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Shared fetch with a 5-second timeout so pages never hang waiting for backend
async function apiFetch(path: string, revalidate = 60) {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            next: { revalidate },
            signal: AbortSignal.timeout(5000), // fail after 5s, not 30s
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null; // backend offline → return null gracefully
    }
}

export async function getNews(page = 1, limit = 12) {
    const data = await apiFetch(`/news?page=${page}&limit=${limit}`);
    return data ?? { data: [], total: 0, page: 1, totalPages: 1 };
}

export async function getNewsBySlug(slug: string) {
    return apiFetch(`/news/${slug}`);
}

export async function getTools(page = 1, limit = 12, category = '') {
    const q = category ? `&category=${category}` : '';
    const data = await apiFetch(`/tools?page=${page}&limit=${limit}${q}`);
    return data ?? { data: [], total: 0, page: 1, totalPages: 1 };
}

export async function getToolBySlug(slug: string) {
    return apiFetch(`/tools/${slug}`);
}

export async function getCategories() {
    const data = await apiFetch('/categories', 300);
    return Array.isArray(data) ? data : [];
}
