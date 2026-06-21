"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/main/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Welcome back!");
                if (data.role === "admin") {
                    window.location.href = "/main/news-admin/articles";
                } else {
                    router.push("/");
                    router.refresh();
                }
            } else {
                toast.error(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <div className="max-w-md w-full bg-white p-8 border border-stone-200">
                <h1 className="text-3xl font-serif font-bold text-center mb-2">Welcome Back</h1>
                <p className="text-center text-stone-500 mb-8">Sign in to continue reading.</p>
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="submit" className="w-full bg-stone-900 text-white font-bold uppercase tracking-widest h-12" disabled={loading}>
                        {loading ? "Signing In..." : "Log In"}
                    </Button>
                </form>
                <p className="mt-6 text-center text-xs text-stone-400">
                    Don't have an account? <Link href="/register" className="text-stone-900 font-bold underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
