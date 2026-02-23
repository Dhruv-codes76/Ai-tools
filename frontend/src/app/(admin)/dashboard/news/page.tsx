'use client';

import { useState, useEffect } from 'react';

export default function ManageNews() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', slug: '', summary: '', content: '', status: 'draft' });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setNews(data.data || []);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        setFormData({ title: '', slug: '', summary: '', content: '', status: 'draft' });
        fetchNews();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        const token = localStorage.getItem('adminToken');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchNews();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage News</h1>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
                <h2 className="text-lg font-semibold mb-4">Add New Article</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required placeholder="Slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                    </div>
                    <textarea className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required placeholder="Summary" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />
                    <textarea className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 h-32" required placeholder="HTML Content" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                    <select className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-4">Publish Article</button>
                </form>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Existing Articles</h2>
                {news.map((item: any) => (
                    <div key={item._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded flex justify-between items-center bg-white dark:bg-gray-800">
                        <div>
                            <h3 className="font-bold">{item.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {item.status}
                            </span>
                        </div>
                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
