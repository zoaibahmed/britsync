"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";

interface SubscribeClientProps {
    session: any;
    initialSubscriptions: string[];
}

// Custom visual checkbox to avoid "Maximum update depth" conflicts with card click
function VisualCheckbox({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
    return (
        <div
            className={`h-4 w-4 shrink-0 rounded-[4px] border border-stone-200 shadow-sm flex items-center justify-center transition-colors
            ${checked ? "bg-stone-900 border-stone-900 text-white" : "bg-transparent"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
        >
            {checked && <Check className="h-3 w-3" />}
        </div>
    );
}

export function SubscribeClient({ session, initialSubscriptions }: SubscribeClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Subscription State
    const [selectedSections, setSelectedSections] = useState<string[]>(initialSubscriptions);

    useEffect(() => {
        setSelectedSections(initialSubscriptions);
    }, [initialSubscriptions]);

    const handleSectionChange = (section: string) => {
        if (section === "ALL") {
            if (selectedSections.includes("ALL")) {
                setSelectedSections([]); // Deselect all
            } else {
                setSelectedSections(["ALL"]); // Select ONLY all, clear others
            }
        } else {
            // If "ALL" was selected, remove it first
            let newSections = selectedSections.filter(s => s !== "ALL");

            if (newSections.includes(section)) {
                newSections = newSections.filter(s => s !== section);
            } else {
                newSections.push(section);
            }
            setSelectedSections(newSections);
        }
    };

    const isAllSelected = selectedSections.includes("ALL");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (selectedSections.length === 0) {
            toast.error("Please select at least one subscription plan.");
            setLoading(false);
            return;
        }

        try {
            const endpoint = session ? "/api/subscribe/update" : "/api/auth/register-subscribe";
            const payload = session
                ? { sections: selectedSections }
                : { name, email, password, sections: selectedSections };

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(session ? "Subscriptions updated!" : "Welcome! Registration & Subscription successful.");
                router.refresh();
                if (!session) router.push("/login"); // Or auto-login if handled
                else router.push("/profile");
            } else {
                toast.error(data.error || "Operation failed");
            }
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 container mx-auto px-4 py-12 flex justify-center">
            <div className="w-full max-w-2xl bg-white border border-stone-200 shadow-xl p-8 md:p-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                        {session ? "Manage Your Subscriptions" : "Join Zyphra"}
                    </h1>
                    <p className="text-stone-500">
                        {session
                            ? "Update your reading preferences below."
                            : "Create an account and select your subscription plan."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Registration Fields (Only if not logged in) */}
                    {!session && (
                        <div className="space-y-6 border-b border-stone-100 pb-8">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Doe"
                                    required
                                    className="rounded-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="jane@example.com"
                                    required
                                    className="rounded-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="rounded-none h-12"
                                />
                            </div>
                            <div className="text-center text-sm text-stone-500 pt-2">
                                Already have an account? <span onClick={() => router.push("/login")} className="underline cursor-pointer hover:text-stone-900">Log in</span>
                            </div>
                        </div>
                    )}

                    {/* Subscription Options */}
                    <div className="space-y-4">
                        <Label className="uppercase tracking-widest font-bold text-xs text-stone-400">Select Plans</Label>

                        <div className="grid gap-4">
                            {/* All Access Option */}
                            <div
                                className={`flex items-start space-x-4 border p-4 transition-all cursor-pointer ${isAllSelected
                                    ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900"
                                    : "border-stone-200 hover:border-stone-400"
                                    }`}
                                onClick={() => handleSectionChange("ALL")}
                            >
                                <div className="mt-1">
                                    <VisualCheckbox checked={isAllSelected} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="font-bold text-lg cursor-pointer">All Access</label>
                                    </div>
                                    <p className="text-sm text-stone-500">
                                        Unlimited access to AI, Lifestyle, World News, and all future sections. Best value.
                                    </p>
                                </div>
                            </div>

                            {/* Individual Sections */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { id: "AI", label: "AI & Tech", price: "$5/mo" },
                                    { id: "LIFESTYLE", label: "Lifestyle", price: "$5/mo" },
                                    { id: "WORLD_NEWS", label: "World News", price: "$5/mo" },
                                ].map((section) => (
                                    <div
                                        key={section.id}
                                        className={`flex items-start space-x-3 border p-4 transition-all cursor-pointer ${selectedSections.includes(section.id)
                                            ? "border-stone-900 bg-stone-50"
                                            : isAllSelected
                                                ? "opacity-50 pointer-events-none border-stone-100 bg-stone-50" // Disabled look
                                                : "border-stone-200 hover:border-stone-400"
                                            }`}
                                        onClick={() => !isAllSelected && handleSectionChange(section.id)}
                                    >
                                        <div className="mt-1">
                                            <VisualCheckbox
                                                checked={selectedSections.includes(section.id)}
                                                disabled={isAllSelected}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-baseline gap-2">
                                                <label className="font-bold cursor-pointer">{section.label}</label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-stone-900 text-white font-bold uppercase tracking-widest text-sm hover:bg-stone-800 rounded-none"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (session ? "Update Subscriptions" : "Register & Subscribe")}
                    </Button>
                </form>
            </div>
        </div>
    );
}
