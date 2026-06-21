"use client";

import Link from "next/link";
import { LayoutDashboard, FileText, Users, Mail, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdminNotifications } from "./admin-notifications";

export default function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/news-admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/news-admin/articles", label: "Articles", icon: FileText },
        { href: "/news-admin/subscribers", label: "Subscribers", icon: Users },
        { href: "/news-admin/reports", label: "Daily Reports", icon: Mail },
    ];

    const handleLogout = async () => {
        try {
            await fetch("/main/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <aside className="w-64 bg-stone-900 text-stone-100 flex flex-col h-screen sticky top-0">
            <div className="p-8 border-b border-stone-800">
                <Link href="/news-admin/articles" className="flex items-center gap-2 mb-8">
                    <h2 className="text-xl font-serif font-black tracking-tight">
                        Zyphra <span className="italic text-stone-400">Admin</span>
                    </h2>
                </Link>
            </div>
            <nav className="flex-1 p-6 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                                isActive
                                    ? "bg-stone-800 text-white"
                                    : "text-stone-400 hover:bg-stone-800 hover:text-white"
                            )}
                        >
                            <link.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-6 border-t border-stone-800">
                <Link
                    href="/news-admin/settings"
                    className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors mb-2",
                        pathname === "/news-admin/settings"
                            ? "bg-stone-800 text-white"
                            : "text-stone-400 hover:bg-stone-800 hover:text-white"
                    )}
                >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Settings</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/20 transition-colors text-red-400"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
            <AdminNotifications />
        </aside>
    );
}
