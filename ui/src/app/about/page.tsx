import { Navbar } from "@/components/navbar";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-20 max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-12 border-b border-stone-200 pb-8">Our Mission</h1>
                <div className="prose prose-stone lg:prose-xl font-serif text-stone-700 space-y-8">
                    <p className="text-2xl leading-relaxed italic text-stone-900">
                        "In an era of rapid information, Zyphra stands as a bastion of quality journalism, tech mastery, and curated living."
                    </p>
                    <p>
                        Founded in 2026, Zyphra was born out of a desire for a deeper, more meaningful connection with the stories that shape our world. We believe that journalism should not just inform, but inspire
                        and educate.
                    </p>
                    <div className="grid md:grid-cols-2 gap-12 py-12">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">Quality Journalism</h3>
                            <p className="text-sm font-sans text-stone-500">
                                Our correspondents across the globe are dedicated to bringing you the most
                                rigorous and factual reporting on World News.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">Technical Insight</h3>
                            <p className="text-sm font-sans text-stone-500">
                                Our AI & Technology desk provides deep-dives and tutorials that demystify the
                                most complex advancements of our time.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
