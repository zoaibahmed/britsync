"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import TiptapEditor from "@/components/editor";
import { ArrowLeft, Save, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewArticle() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [section, setSection] = useState("AI");
    const [isPremium, setIsPremium] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [imageUrl, setImageUrl] = useState(""); // Simplified for now

    const [editorsNote, setEditorsNote] = useState("");

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        if (!title || !content) {
            toast.error("Title and Content are required");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/main/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    section,
                    isPremium,
                    videoUrl,
                    editorsNote,
                    imageUrl: imageUrl || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" // Default placeholder
                })
            });

            if (res.ok) {
                toast.success("Article published successfully!");
                router.push("/news-admin/articles");
                router.refresh();
            } else {
                toast.error("Failed to publish");
            }
        } catch {
            toast.error("Error saving article");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/news-admin/articles">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-serif font-bold">New Article</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="rounded-none h-12 px-6 uppercase tracking-widest text-xs font-bold border-stone-300">
                        Save Draft
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-stone-900 text-white rounded-none h-12 px-8 uppercase tracking-widest text-xs font-bold gap-2">
                        {loading ? "Publishing..." : <> <Save className="w-4 h-4" /> Publish Article </>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                    <div className="bg-white border border-stone-200 p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-bold">Article Title</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a compelling headline..."
                                className="text-2xl font-serif h-16 border-none px-0 focus-visible:ring-0 shadow-none border-b border-stone-100 rounded-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-bold">Content</Label>
                            <TiptapEditor onChange={setContent} />
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white border border-stone-200 p-6 space-y-6">
                        <h3 className="font-bold uppercase tracking-widest text-xs border-b border-stone-100 pb-4">Settings</h3>

                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase tracking-widest font-bold">Section</Label>
                            <Select value={section} onValueChange={setSection}>
                                <SelectTrigger className="rounded-none border-stone-200 h-12">
                                    <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AI">AI & Technology</SelectItem>
                                    <SelectItem value="LIFESTYLE">Lifestyle</SelectItem>
                                    <SelectItem value="WORLD_NEWS">World News</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between py-4 border-y border-stone-50">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold">Premium Content</Label>
                                <p className="text-[10px] text-stone-500 uppercase tracking-widest">Require subscription</p>
                            </div>
                            <Switch checked={isPremium} onCheckedChange={setIsPremium} />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-bold">Video URL (Optional)</Label>
                            <Input
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="YouTube or Vimeo link"
                                className="rounded-none border-stone-200 h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-bold">Editor's Note</Label>
                            <textarea
                                value={editorsNote}
                                onChange={(e) => setEditorsNote(e.target.value)}
                                placeholder="Final thoughts or author note..."
                                className="w-full min-h-[100px] p-3 border border-stone-200 rounded-none focus:outline-none focus:ring-1 focus:ring-stone-400 text-sm font-serif italic"
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase tracking-widest font-bold">Featured Image</Label>
                            <div
                                className="border-2 border-dashed border-stone-200 aspect-video flex flex-col items-center justify-center text-stone-400 hover:border-stone-400 transition-colors cursor-pointer group"
                                onClick={() => {
                                    const url = prompt("Enter Image URL");
                                    if (url) setImageUrl(url);
                                }}
                            >
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Globe className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Click to upload URL</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-stone-900 text-stone-100 p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            {isPremium ? <Lock className="w-5 h-5 text-red-500" /> : <Globe className="w-5 h-5 text-green-500" />}
                            <span className="text-xs font-bold uppercase tracking-widest">
                                Status: {isPremium ? "Subscriber Only" : "Public Access"}
                            </span>
                        </div>
                        <p className="text-[10px] text-stone-400 leading-relaxed">
                            {isPremium
                                ? "This article will be hidden behind the paywall. Users must provide their contact information to read the full content."
                                : "This article will be freely accessible to all visitors."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
