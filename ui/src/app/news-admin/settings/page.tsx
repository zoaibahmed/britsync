"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
    const [breakingNews, setBreakingNews] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetch("/main/api/admin/settings")
            .then(res => res.json())
            .then(data => {
                setBreakingNews(data.breakingNews || "");
                setFetching(false);
            })
            .catch(() => setFetching(false));
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/main/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ breakingNews })
            });
            if (res.ok) {
                toast.success("Settings updated successfully");
            } else {
                toast.error("Failed to update settings");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-stone-300" /></div>;

    return (
        <div className="max-w-4xl space-y-8">
            <h1 className="text-3xl font-serif font-bold">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Site Content</CardTitle>
                    <CardDescription>Manage global content like the Breaking News bar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Breaking News Message</Label>
                        <Input
                            value={breakingNews}
                            onChange={(e) => setBreakingNews(e.target.value)}
                            placeholder="Breaking news text..."
                        />
                    </div>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage your website configuration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Site Title</Label>
                        <Input defaultValue="Zyphra" disabled />
                    </div>
                    <div className="space-y-2">
                        <Label>Contact Email</Label>
                        <Input defaultValue="contact@zyphra.com" disabled />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
