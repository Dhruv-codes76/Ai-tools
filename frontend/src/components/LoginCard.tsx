import GoogleLoginButton from "@/components/GoogleLoginButton";
import Link from "next/link";

export default function LoginCard() {
    return (
        <div className="relative w-full max-w-[340px] mx-auto animate-[floating_3s_ease-in-out_infinite] transform perspective-[1000px] rotate-x-[2deg] scale-[1.02]">
            {/* Hanging Hook & Lanyard Illusion */}
            <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                {/* Lanyard Strap with realistic texture */}
                <div
                    className="w-10 h-[100px] bg-[#E8C4A3] shadow-md relative overflow-hidden"
                    style={{
                        clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0% 100%)',
                        background: 'linear-gradient(to bottom, #dcb387 0%, #ebb68b 50%, #957692 100%)'
                    }}
                >
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)' }}></div>
                </div>

                {/* Lanyard Loop around ring */}
                <div className="w-10 h-3 bg-[#8c6b89] rounded-b-md shadow-inner relative z-20" style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)' }}></div>

                {/* Metal Clip Ring (Carabiner style top) */}
                <div className="w-6 h-6 border-[3px] border-[#222] rounded-full -mt-2 z-10 shadow-[0_4px_10px_rgba(0,0,0,0.5)] relative">
                     <div className="absolute inset-0 rounded-full border border-white/10"></div>
                </div>

                {/* Metal Clip Mechanism */}
                <div className="w-4 h-8 bg-gradient-to-b from-[#333] to-[#1a1a1a] rounded-sm -mt-1 z-0 relative shadow-xl flex flex-col justify-start items-center pt-1 border border-[#444] border-t-0">
                    <div className="w-2 h-2 rounded-full bg-[#111] shadow-inner mb-1"></div>
                    <div className="w-1 h-3 bg-[#444] rounded-full"></div>
                </div>
            </div>

            {/* Main ID Card */}
            <div className="relative w-full flex flex-col min-h-[500px] bg-[#131313] backdrop-blur-3xl rounded-[24px] border border-white/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden p-8 pb-10 mt-16 animate-[slideUp_0.4s_ease-out]">

                {/* Top Hole Punch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-14 h-3 bg-[#080808] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border-b border-white/10"></div>

                <div className="mb-8 mt-6 flex flex-col items-start w-full gap-4">
                    {/* Small Icon/Logo */}
                    <div className="w-10 h-14 relative opacity-80 mb-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500 rounded-md transform rotate-12 opacity-50 blur-sm"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 rounded-md backdrop-blur-sm flex items-center justify-center transform -rotate-12 overflow-hidden shadow-lg">
                             <div className="w-full h-1/2 bg-gradient-to-t from-transparent to-white/10 absolute top-0"></div>
                             <div className="w-2 h-4 border border-white/30 rounded-sm absolute top-1"></div>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-[32px] font-bold tracking-tight text-white leading-[1.1] mb-2 font-sans">
                            AI Portal <br /> Weekly
                        </h1>
                        <p className="text-[#666] text-sm font-medium">Sign In to Continue</p>
                    </div>
                </div>

                <div className="w-full space-y-3 mt-auto">
                    <GoogleLoginButton />

                    <div className="flex items-center gap-4 py-2 opacity-60">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">or</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                    </div>

                    <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#222] border border-white/5 text-white/50 py-3.5 px-4 rounded-[16px] font-medium text-sm transition-all duration-200 cursor-not-allowed shadow-inner"
                    >
                        <svg className="w-5 h-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Continue with Email
                    </button>
                </div>
            </div>

            {/* Bottom Glow / Shadow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120%] h-20 bg-black/80 blur-2xl rounded-[100%] z-[-1] transform -rotate-2"></div>
        </div>
    );
}
