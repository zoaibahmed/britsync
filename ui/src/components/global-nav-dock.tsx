"use client";

import Link from "next/link";
import { ArrowLeft, Globe, Cpu, Sparkles, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
    { name: "News", href: "/news", icon: Globe },
    { name: "AI & Tech", href: "/ai", icon: Cpu },
    { name: "Lifestyle", href: "/lifestyle", icon: Sparkles },
];

export function GlobalNavDock() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1000);
        
        let scrollTimeout: any;
        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] lg:hidden ${isVisible && !isScrolling ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
        >
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl">

                {/* Portal Back Link */}
                <Link
                    href="https://britsync.co.uk"
                    className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-cyan-500 transition-all duration-500 w-full sm:w-auto justify-center"
                >
                    <div className="relative flex items-center justify-center">
                        <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform duration-500" />
                        {/* Subtle Pulse */}
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping group-hover:hidden" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400 group-hover:text-white transition-colors">Port Out</span>
                        <span className="text-[12px] font-serif font-black text-white">BritSync</span>
                    </div>
                </Link>

                {/* Vertical Divider */}
                <div className="hidden sm:block w-[1px] h-10 bg-white/10 mx-1" />

                {/* Category Navigation */}
                <nav className="relative hidden sm:flex items-center gap-1">
                    {links.map((link, idx) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="relative px-4 py-2.5 z-10 flex items-center gap-2 group/item"
                        >
                            <link.icon className={`w-3.5 h-3.5 transition-all duration-500 ${hoveredIndex === idx ? 'text-cyan-400 scale-110' : 'text-stone-500'}`} />
                            <span className={`
                text-[11px] font-bold uppercase tracking-widest transition-all duration-500
                ${hoveredIndex === idx ? 'text-white' : 'text-stone-400'}
              `}>
                                {link.name}
                            </span>
                        </Link>
                    ))}

                    {/* Liquid Morphing Highlight */}
                    <div
                        className="absolute top-0 bottom-0 bg-white/5 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-inner pointer-events-none"
                        style={{
                            left: hoveredIndex !== null ? `${idxToOffset(hoveredIndex)}%` : '0%',
                            width: hoveredIndex !== null ? '31%' : '0%',
                            opacity: hoveredIndex !== null ? 1 : 0,
                            transform: hoveredIndex !== null ? 'scale(1)' : 'scale(0.8)',
                        }}
                    />
                </nav>

                {/* Edge Detail */}
                <div className="px-3 opacity-20 hidden sm:block">
                    <ChevronRight className="w-4 h-4 text-white" />
                </div>
            </div>

            {/* Gloss Effect */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        </div>
    );
}

function idxToOffset(idx: number) {
    if (idx === 0) return 1;
    if (idx === 1) return 34.5;
    if (idx === 2) return 68;
    return 0;
}
