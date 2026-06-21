"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function AdminReportActions() {
    const [loading, setLoading] = useState(false);

    const handleSendReport = async () => {
        setLoading(true);
        try {
            const res = await fetch("/main/api/cron/daily-report");
            const data = await res.json();
            if (res.ok) {
                toast.success("Daily report sent successfully");
            } else {
                toast.error(data.error || "Failed to send report");
            }
        } catch {
            toast.error("Error sending report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleSendReport}
            disabled={loading}
            className="w-full mt-4 border-stone-300 uppercase tracking-widest text-xs font-bold gap-2"
        >
            <Send className="w-3 h-3" />
            {loading ? "Sending..." : "Send Report Now"}
        </Button>
    );
}
