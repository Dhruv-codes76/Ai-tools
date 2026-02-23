import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                            AI MVP
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <Link href="/news" className="text-gray-900 dark:text-gray-100 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">
                            News
                        </Link>
                        <Link href="/tools" className="text-gray-900 dark:text-gray-100 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">
                            Tools
                        </Link>
                        <Link href="/about" className="text-gray-900 dark:text-gray-100 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">
                            About
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
