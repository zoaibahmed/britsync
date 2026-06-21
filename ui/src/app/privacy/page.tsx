import { Navbar } from "@/components/navbar";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-20 max-w-3xl">
                <div className="prose prose-stone max-w-none">
                    <h1 className="text-4xl font-serif font-bold mb-8">Privacy Policy</h1>
                    <p className="text-stone-500 italic mb-12">Last updated: January 26, 2026</p>

                    <div className="space-y-8 font-serif text-stone-700 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-stone-900 mb-4">1. Information We Collect</h2>
                            <p>
                                At Zyphra, we value your privacy. We collect minimal information required to deliver premium content to your inbox and provide a personalized experience.s, primarily your email address and name when you subscribe.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-900 mb-4">2. How We Use Data</h2>
                            <p>
                                Your information is used only to manage your subscription, provide access to premium
                                content, and send our daily editorial newsletters. We never sell your data to third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-900 mb-4">3. Security</h2>
                            <p>
                                We implement industry-standard security measures to ensure your personal information
                                remains protected. All communication with our servers is encrypted using SSL/TLS.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
