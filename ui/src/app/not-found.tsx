import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-9xl font-serif font-bold text-stone-100 absolute -z-10 select-none">404</h2>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Lost in the Archives</h1>
                <p className="text-stone-500 mb-12 max-w-md mx-auto leading-relaxed">
                    The story you're looking for seems to have been misplaced or never written.
                    Return to the home page to explore our latest features.
                </p>
                <Link href="/">
                    <Button className="bg-stone-900 text-white rounded-none h-14 px-12 uppercase tracking-widest font-bold text-sm">
                        Back to Home
                    </Button>
                </Link>
            </main>
        </div>
    );
}
