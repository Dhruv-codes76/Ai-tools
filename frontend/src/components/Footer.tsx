import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="bg-[#070707] border-t border-[#1A1A1A] mt-auto">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-4"><Logo size="lg" /></div>
                        <p className="text-[#A1A1A1] text-sm leading-relaxed max-w-sm">
                            Clear, verified AI news and tools. No hype.
                        </p>
                    </div>

                    {/* Explore Section */}
                    <div>
                        <h3 className="font-sans font-semibold text-[#EDEDED] text-sm uppercase tracking-wider mb-4">
                            Explore
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/news" className="text-[#A1A1A1] text-sm hover:text-[#EDEDED] hover:underline decoration-1 underline-offset-4 transition-colors">
                                    News
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools" className="text-[#A1A1A1] text-sm hover:text-[#EDEDED] hover:underline decoration-1 underline-offset-4 transition-colors">
                                    Tools
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div>
                        <h3 className="font-sans font-semibold text-[#EDEDED] text-sm uppercase tracking-wider mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/privacy" className="text-[#A1A1A1] text-sm hover:text-[#EDEDED] hover:underline decoration-1 underline-offset-4 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-8 border-t border-[#1A1A1A] flex flex-col md:flex-row justify-between items-center text-xs text-[#A1A1A1]">
                    <p>&copy; {new Date().getFullYear()} AI MVP. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
