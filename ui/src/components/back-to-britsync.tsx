"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackToBritsync() {
    return (
        <Link
            href="/"
            className="group flex items-center gap-3 px-5 py-2.5 rounded-full border border-stone-200 bg-white/50 backdrop-blur-sm hover:bg-stone-900 hover:border-stone-900 transition-all duration-500 ease-out"
        >
            <div className="relative flex items-center justify-center">
                {/* Animated Arrow Circle */}
                <div className="absolute inset-0 bg-stone-900 group-hover:bg-cyan-500 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
                <ArrowLeft className="w-4 h-4 text-stone-900 group-hover:text-white relative z-10 transition-colors duration-300 group-hover:-translate-x-0.5" />
            </div>

            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 group-hover:text-cyan-400/80 transition-colors duration-300">
                    Back to
                </span>
                <span className="text-[13px] font-serif font-black tracking-tight text-stone-900 group-hover:text-white transition-colors duration-300">
                    BritSync
                </span>
            </div>

            {/* Subtle Glow Effect */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-700 pointer-events-none" />
        </Link>
    );
}
