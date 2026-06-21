"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function RobotBackButton() {
    return (
        <Link
            href="/"
            className="group flex items-center gap-3 px-4 py-2 border border-stone-200 rounded-full hover:bg-stone-900 hover:text-white transition-all duration-500 text-stone-900 bg-stone-50/50 overflow-hidden relative"
        >
            {/* --- Robot Container --- */}
            <div className="relative w-8 h-8 flex items-center justify-center">
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full fill-current transition-transform duration-500 group-hover:scale-110"
                >
                    {/* Head */}
                    <rect x="30" y="20" width="40" height="30" rx="10" className="animate-float" />
                    {/* Eyes */}
                    <circle cx="40" cy="35" r="4" fill="white" className="group-hover:fill-cyan-400 transition-colors animate-blink" />
                    <circle cx="60" cy="35" r="4" fill="white" className="group-hover:fill-cyan-400 transition-colors animate-blink" />
                    {/* Body */}
                    <rect x="35" y="52" width="30" height="30" rx="5" />
                    {/* Legs */}
                    <rect x="40" y="82" width="8" height="10" rx="2" />
                    <rect x="52" y="82" width="8" height="10" rx="2" />

                    {/* Left Arm (Point Action) */}
                    <g className="origin-[35%_55%] group-hover:-rotate-[30deg] transition-all duration-500">
                        <rect x="15" y="55" width="20" height="6" rx="3" className="group-hover:fill-cyan-400 transition-colors" />
                        {/* Pointing finger detail */}
                        <path d="M 15 58 L 10 58" className="stroke-stone-900 group-hover:stroke-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-500 stroke-[2]" />
                    </g>

                    {/* Right Arm */}
                    <rect x="65" y="55" width="15" height="6" rx="3" className="origin-[35%_55%] group-hover:rotate-12 transition-transform duration-500" />
                </svg>
            </div>

            <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-50 group-hover:text-cyan-400 transition-colors">Return To</span>
                <span className="text-[11px] font-serif font-black tracking-tight">BritSync</span>
            </div>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes blink {
          0%, 45%, 55%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 4s infinite;
        }
      `}</style>
        </Link>
    );
}
