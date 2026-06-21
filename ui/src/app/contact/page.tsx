import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "@/components/globe";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 transition-colors duration-500">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 md:py-20 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100">
                                Connect with Us
                            </h1>
                            <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed max-w-lg">
                                Whether you have a news tip, a technical query, or wish to inquire about partnership
                                opportunities, our editorial team is ready to listen.
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-stone-200 to-stone-100 dark:from-stone-800 dark:to-stone-900 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <Globe />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-stone-200 dark:border-stone-800">
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100 opacity-60">General Inquiries</h3>
                                <p className="font-serif italic text-stone-600 dark:text-stone-400">contact@zyphra.digital</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100 opacity-60">Editorial Desk</h3>
                                <p className="font-serif italic text-stone-600 dark:text-stone-400">editorial@zyphra.digital</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-stone-200/50 dark:bg-stone-800/30 blur-3xl -z-10 rounded-full"></div>
                        <div className="bg-white dark:bg-stone-900 p-8 md:p-12 border border-stone-200 dark:border-stone-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 dark:text-stone-400">Your Name</Label>
                                    <Input placeholder="Alexander Hamilton" className="rounded-none border-stone-200 dark:border-stone-800 h-14 bg-transparent focus-visible:ring-stone-400 dark:focus-visible:ring-stone-600" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 dark:text-stone-400">Email Address</Label>
                                    <Input type="email" placeholder="alex@gmail.com" className="rounded-none border-stone-200 dark:border-stone-800 h-14 bg-transparent focus-visible:ring-stone-400 dark:focus-visible:ring-stone-600" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 dark:text-stone-400">Your Message</Label>
                                    <textarea
                                        className="w-full min-h-[160px] p-4 border border-stone-200 dark:border-stone-800 rounded-none focus:outline-none focus:ring-1 focus:ring-stone-400 dark:focus:ring-stone-600 font-serif italic bg-transparent text-stone-900 dark:text-stone-100"
                                        placeholder="How can we help you today?"
                                    />
                                </div>
                                <Button className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors duration-300 rounded-none h-16 uppercase tracking-widest text-xs font-bold">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
