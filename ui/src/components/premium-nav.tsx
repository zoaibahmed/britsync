"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
    { name: "World News", href: "/news" },
    { name: "AI & Tech", href: "/ai" },
    { name: "Lifestyle", href: "/lifestyle" },
];

export function PremiumNav() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <nav className="relative flex items-center gap-1 p-1 rounded-full bg-stone-100/50 border border-stone-200/50">
            {links.map((link, idx) => (
                <Link
                    key={link.name}
                    href={link.href}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative px-5 py-2 z-10"
                >
                    <span className={`
            text-[11px] font-bold uppercase tracking-widest transition-colors duration-500
            ${hoveredIndex === idx ? 'text-stone-900' : 'text-stone-500'}
          `}>
                        {link.name}
                    </span>
                </Link>
            ))}

            {/* Morphing Highlight */}
            <div
                className="absolute top-1 bottom-1 bg-white rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-sm pointer-events-none border border-stone-200/50"
                style={{
                    left: hoveredIndex !== null ? `${idxToOffset(hoveredIndex)}%` : '0%',
                    width: hoveredIndex !== null ? '33%' : '0%',
                    opacity: hoveredIndex !== null ? 1 : 0,
                    transform: hoveredIndex !== null ? 'scale(1)' : 'scale(0.8)',
                }}
            />
        </nav>
    );
}

function idxToOffset(idx: number) {
    // Rough estimate for 3 items
    if (idx === 0) return 1;
    if (idx === 1) return 33.5;
    if (idx === 2) return 66;
    return 0;
}
