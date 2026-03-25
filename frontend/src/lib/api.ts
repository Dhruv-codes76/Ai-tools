const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Wait helper
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Shared fetch with a 5-second timeout and retry logic
async function apiFetch(path: string, options: RequestInit = {}, retries = 3, backoff = 500) {
    let lastError = null;

    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(`${API_BASE}${path}`, {
                ...options,
                signal: AbortSignal.timeout(5000), // fail after 5s
            });

            if (!res.ok) {
                 if (res.status >= 500) {
                      // Server error, try again
                      throw new Error(`Server Error: ${res.status}`);
                 }
                 // Client error (4xx) - usually no point in retrying unless rate limited
                 if (res.status === 429) {
                     throw new Error('Rate limited');
                 }
                 // For 404s or other client errors, fail immediately.
                 throw new Error(`Client Error: ${res.status}`);
            }
            return await res.json();
        } catch (error: unknown) { // Use unknown instead of any
            lastError = error;
            const err = error as Error;
            // Only retry on network errors, timeouts, or 500s
            if (err.name === 'AbortError' || err.message.includes('Server Error') || err.message.includes('Rate limited') || err.message.includes('fetch failed')) {
                console.warn(`Fetch failed for ${path}. Retrying (${i + 1}/${retries})...`);
                await wait(backoff * Math.pow(2, i)); // Exponential backoff
            } else {
                break; // Break early on client errors (like 404) instead of throwing immediately so the SSR fallback handles it
            }
        }
    }

    console.error(`Fetch definitively failed for ${path} after ${retries} retries:`, lastError ? (lastError as Error).message : lastError);
    // When backend is totally offline (e.g., during Vercel build), return null so we don't crash Next.js SSG
    if (typeof window === 'undefined') {
       return null;
    }

    // Throw error so error.tsx can catch it on the client
    throw lastError || new Error(`Failed to fetch data from ${path}`);
}

export async function getNews(page = 1, limit = 12) {
    // Revalidate data every 60 seconds to balance freshness with performance
    const data = await apiFetch(`/news?page=${page}&limit=${limit}`, { next: { revalidate: 60 } });
    return data ?? { data: [], total: 0, page: 1, totalPages: 1 };
}

export async function getNewsBySlug(slug: string) {
    // Revalidate individual news items too
    return apiFetch(`/news/${slug}`, { next: { revalidate: 60 } });
}

export async function getTools(page = 1, limit = 12, category = '') {
    // Revalidate tools catalog every 60 seconds
    const q = category ? `&category=${category}` : '';
    const raw = await apiFetch(`/tools?page=${page}&limit=${limit}${q}`, { next: { revalidate: 60 } });

    // Backend returns a raw array for tools — normalize to { data, total } for consistency
    if (Array.isArray(raw)) return { data: raw, total: raw.length, page, totalPages: 1 };
    return raw ?? { data: [], total: 0, page: 1, totalPages: 1 };
}

export async function getToolBySlug(slug: string) {
    return apiFetch(`/tools/${slug}`, { next: { revalidate: 60 } });
}

export async function getCategories() {
    // Categories change rarely, cache for 5 minutes
    const data = await apiFetch('/categories', { next: { revalidate: 300 } });
    return Array.isArray(data) ? data : [];
}
