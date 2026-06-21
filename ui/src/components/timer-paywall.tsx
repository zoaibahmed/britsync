"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

export function TimerPaywall({ section, isPremium, hasAccess }: { section: string, isPremium: boolean, hasAccess: boolean }) {
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isPremium || hasAccess) return;

        // Check if already blocked from a previous session
        const blockedUntil = localStorage.getItem("zyphra_blocked_until");
        if (blockedUntil && Date.now() < parseInt(blockedUntil)) {
            setShowPopup(true);
            return;
        }

        // Otherwise, start the 1-minute timer for this specific article session
        const timer = setTimeout(() => {
            setShowPopup(true);
            // Lock access for 24 hours starting now
            const lockExpiry = Date.now() + 24 * 60 * 60 * 1000;
            localStorage.setItem("zyphra_blocked_until", lockExpiry.toString());
        }, 60000); // 1 minute

        return () => clearTimeout(timer);
    }, [isPremium, hasAccess]);

    if (!showPopup) return null;

    const handleClose = () => {
        // "if user try to close that pop up take him out of screen"
        router.push("/");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="max-w-md w-full bg-white border border-stone-200 shadow-2xl p-8 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 hover:bg-stone-100 transition-colors"
                >
                    <X className="w-5 h-5 text-stone-400" />
                </button>

                <div className="text-center">
                    <h3 className="text-3xl font-serif font-bold mb-4">Subscription Required</h3>
                    <p className="text-stone-500 mb-8 leading-relaxed">
                        To continue reading this premium {section.toLowerCase()} article and others,
                        please join our membership.
                    </p>

                    <div className="space-y-4">
                        <Link href="/subscribe">
                            <Button className="w-full bg-stone-900 text-stone-100 hover:bg-stone-800 h-14 rounded-none font-bold uppercase tracking-widest transition-colors text-xs">
                                Subscribe Now
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={handleClose}
                            className="w-full text-stone-400 uppercase tracking-widest text-[10px] font-bold"
                        >
                            Return to Homepage
                        </Button>
                    </div>

                    <p className="mt-8 text-[10px] text-stone-300 uppercase tracking-widest leading-loose">
                        Unlimited access to all sections. <br />
                        Cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
}
