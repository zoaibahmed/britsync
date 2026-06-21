"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export function Paywall({ section }: { section: string }) {
    // Paywall is now purely presentational, visibility controlled by parent.
    // Cookies check removed to prevent conflicts with server-side logic.

    return (
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/95 to-transparent z-10 flex items-end justify-center pb-20 px-4">
            <div className="max-w-md w-full bg-white border border-stone-200 shadow-2xl p-8 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
                <h3 className="text-3xl font-serif font-bold mb-4">Unlock the Full Story</h3>
                <p className="text-stone-500 mb-8 leading-relaxed">
                    Join our premium membership to access exclusive {section.toLowerCase()} insights,
                    deep-dives, and technical tutorials.
                </p>

                <div className="space-y-6">
                    <Link href="/subscribe">
                        <Button className="w-full bg-stone-900 text-stone-100 hover:bg-stone-800 h-14 rounded-none font-bold uppercase tracking-widest transition-colors">
                            Subscribe to Read
                        </Button>
                    </Link>
                </div>

                <p className="mt-6 text-[10px] text-stone-400 uppercase tracking-widest leading-loose">
                    No credit card required. By subscribing, you agree to our <br />
                    <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                </p>
            </div>
        </div>
    );
}
