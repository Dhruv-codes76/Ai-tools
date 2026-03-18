export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-extrabold mb-6">About AI MVP</h1>
            <div className="prose prose-lg dark:prose-invert">
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    AI MVP is your curated hub for the latest news and tools in the artificial intelligence ecosystem.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    We manually review and publish every article and tool listing to ensure quality coverage. No scrapers, no noise — just signal.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                    Our goal is to help developers, researchers, and curious minds stay ahead in the rapidly evolving AI landscape.
                </p>
            </div>
        </div>
    );
}
