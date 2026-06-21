"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/main/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Account created successfully!");
                router.push("/");
                router.refresh(); // Refresh to update Navbar
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <div className="max-w-md w-full bg-white p-8 border border-stone-200">
                <h1 className="text-3xl font-serif font-bold text-center mb-2">Join Zyphra</h1>
                <p className="text-center text-stone-500 mb-8">Create an account to access premium stories.</p>
                <form onSubmit={handleRegister} className="space-y-4">
                    <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="submit" className="w-full bg-stone-900 text-white font-bold uppercase tracking-widest h-12" disabled={loading}>
                        {loading ? "Creating..." : "Sign Up"}
                    </Button>
                </form>
                <p className="mt-6 text-center text-xs text-stone-400">
                    Already have an account? <Link href="/login" className="text-stone-900 font-bold underline">Log In</Link>
                </p>
            </div>
        </div>
    );
}
