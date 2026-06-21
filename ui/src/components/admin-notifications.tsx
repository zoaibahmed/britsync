"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminNotification {
    type: string;
    section?: string;
    message: string;
}

export function AdminNotifications() {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/main/api/admin/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) return null;
    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 max-w-xs w-full animate-in slide-in-from-right-10 duration-500">
            {notifications.map((notif, i) => (
                <div
                    key={i}
                    className="bg-red-950/90 border border-red-500/50 backdrop-blur-md p-4 text-stone-100 shadow-2xl relative group"
                >
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">
                                {notif.type === "STALE_SECTION" ? `${notif.section} Section` : "General Alert"}
                            </p>
                            <p className="text-xs leading-relaxed font-medium">
                                {notif.message}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
            <Button
                variant="ghost"
                size="sm"
                onClick={fetchNotifications}
                className="self-end text-stone-400 hover:text-white uppercase tracking-widest text-[9px] font-bold"
            >
                <RefreshCw className="w-3 h-3 mr-2" /> Refresh Alerts
            </Button>
        </div>
    );
}
