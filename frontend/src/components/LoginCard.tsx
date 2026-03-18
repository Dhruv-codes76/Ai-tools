import GoogleLoginButton from "@/components/GoogleLoginButton";
import Link from "next/link";

export default function LoginCard() {
    return (
        <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center min-h-[500px] sm:min-h-0 sm:h-auto bg-[#1A1B1E] backdrop-blur-2xl rounded-[32px] sm:rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 relative overflow-hidden animate-[slideUp_0.4s_ease-out]">
            {/* Lanyard Top - Mobile Only Detail */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/40 rounded-b-xl sm:hidden flex justify-center items-end pb-1 border-x border-b border-white/5">
                <div className="w-8 h-1 bg-white/20 rounded-full"></div>
            </div>

            <div className="mb-10 mt-4 sm:mt-0 flex flex-col items-start w-full gap-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 shadow-lg shadow-purple-500/20"></div>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white leading-tight mb-2 font-sans">
                        Start <br /> Collaborating
                    </h1>
                    <p className="text-[#888888] text-base font-medium">Sign In to Continue</p>
                </div>
            </div>

            <div className="w-full space-y-4">
                <GoogleLoginButton />

                <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-white/5"></div>
                    <span className="text-xs text-white/20 uppercase tracking-widest font-semibold">or</span>
                    <div className="flex-1 h-px bg-white/5"></div>
                </div>

                <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-[#222325] hover:bg-[#2A2B2D] border border-white/5 text-white/80 py-3 px-4 rounded-full font-medium shadow-sm transition-all duration-200 cursor-not-allowed opacity-50"
                >
                    <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Continue with Email
                </button>
            </div>

            <div className="mt-8">
                <Link href="/" className="text-xs text-white/40 hover:text-white/80 transition-colors">
                    Return to Directory &rarr;
                </Link>
            </div>
        </div>
    );
}
