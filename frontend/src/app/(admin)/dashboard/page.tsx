export default function DashboardOverview() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Welcome to AI MVP Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
                Manage your news articles and tools directory from here.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                    <h2 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-300">News Articles</h2>
                    <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">Create, edit, and publish AI news updates.</p>
                    <a href="/dashboard/news" className="text-blue-700 dark:text-blue-200 font-medium hover:underline">Manage News &rarr;</a>
                </div>

                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl">
                    <h2 className="text-xl font-semibold mb-2 text-purple-800 dark:text-purple-300">AI Tools</h2>
                    <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">Curate the directory of top AI tools and apps.</p>
                    <a href="/dashboard/tools" className="text-purple-700 dark:text-purple-200 font-medium hover:underline">Manage Tools &rarr;</a>
                </div>
            </div>
        </div>
    );
}
