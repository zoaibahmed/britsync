"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AnimatedReturnTab() {
    return (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] group pointer-events-none">
            <Link
                href="/"
                className="
          pointer-events-auto
          relative flex items-center
          pl-3 pr-6 py-4
          bg-stone-900 border border-l-0 border-white/10
          rounded-r-2xl
          shadow-[20px_0_40px_rgba(0,0,0,0.3)]
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          -translate-x-[calc(100%-48px)] group-hover:translate-x-0
          hover:bg-cyan-950
        "
            >
                {/* Animated Arrow & Icon Group */}
                <div className="flex items-center gap-4">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        {/* Pulsing Aura */}
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping group-hover:block hidden" />
                        <div className="relative z-10 w-8 h-8 bg-white/5 rounded-full flex items-center justify-center border border-white/10 transition-colors group-hover:border-cyan-500/50">
                            <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-cyan-400 transition-all duration-300 group-hover:-translate-x-1" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500/70 leading-none">
                            Back to
                        </span>
                        <span className="text-[15px] font-serif font-black tracking-tight text-white leading-tight">
                            BritSync <span className="text-cyan-400">.</span>
                        </span>
                    </div>
                </div>

                {/* Vertical Label (Visible when docked) */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                    <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 whitespace-nowrap">
                        RETURN
                    </span>
                </div>

                {/* Ambient Glow */}
                <div className="absolute inset-0 rounded-r-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 shadow-[0_0_30px_rgba(6,182,212,0.1)] pointer-events-none" />
            </Link>
        </div>
    );
}
