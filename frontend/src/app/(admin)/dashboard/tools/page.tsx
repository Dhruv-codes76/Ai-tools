'use client';

import { useState, useEffect } from 'react';

export default function ManageTools() {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '', website: '', pricing: 'free', status: 'draft' });

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setTools(data.data || []);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        setFormData({ name: '', slug: '', description: '', website: '', pricing: 'free', status: 'draft' });
        fetchTools();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        const token = localStorage.getItem('adminToken');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tools/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchTools();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Tools</h1>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
                <h2 className="text-lg font-semibold mb-4">Add New AI Tool</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required placeholder="Tool Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <input className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required placeholder="Slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                    </div>
                    <input className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required placeholder="Website URL" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} />
                    <textarea className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 h-24" required placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <div className="flex gap-4">
                        <select className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" value={formData.pricing} onChange={e => setFormData({ ...formData, pricing: e.target.value })}>
                            <option value="free">Free</option>
                            <option value="freemium">Freemium</option>
                            <option value="paid">Paid</option>
                        </select>
                        <select className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Tool</button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Existing Tools</h2>
                {tools.map((item: any) => (
                    <div key={item._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded flex justify-between items-center bg-white dark:bg-gray-800">
                        <div>
                            <h3 className="font-bold">{item.name} <span className="text-gray-500 font-normal text-sm ml-2">{item.pricing}</span></h3>
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
