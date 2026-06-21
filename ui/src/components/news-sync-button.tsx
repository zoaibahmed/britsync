"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function NewsSyncButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSync = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/main/api/admin/news-sync", {
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                toast.success("News synchronized successfully!", {
                    description: "Your website is now up to date with the latest stories.",
                });
            } else {
                toast.error("News sync failed", {
                    description: data.error || "An unexpected error occurred while syncing.",
                });
            }
        } catch (error) {
            console.error("Sync error:", error);
            toast.error("Connection error", {
                description: "Failed to reach the news sync service.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleSync}
            disabled={isLoading}
            variant="outline"
            className="rounded-none border-stone-300 font-serif italic text-stone-900 gap-2 hover:bg-stone-50"
        >
            {isLoading ? (
                <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Syncing Stories...
                </>
            ) : (
                <>
                    <RefreshCw className="w-4 h-4" />
                    Sync News Now
                </>
            )}
        </Button>
    );
}
