"use client";

import { useState, useEffect } from "react";
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
import { useRouter, useParams } from "next/navigation";

export default function EditArticle() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [section, setSection] = useState("AI");
    const [isPremium, setIsPremium] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [editorsNote, setEditorsNote] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`/main/api/articles/${id}`);
                if (!res.ok) throw new Error("Article not found");
                const data = await res.json();

                setTitle(data.title);
                setContent(data.content);
                setSection(data.section);
                setIsPremium(data.isPremium);
                setVideoUrl(data.videoUrl || "");
                setImageUrl(data.thumbnail || "");
                setEditorsNote(data.editorsNote || "");
            } catch (err) {
                toast.error("Failed to load article");
                router.push("/news-admin/articles");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchArticle();
    }, [id, router]);

    const handleUpdate = async () => {
        if (!title || !content) {
            toast.error("Title and Content are required");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/main/api/articles/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    section,
                    isPremium,
                    videoUrl,
                    editorsNote,
                    imageUrl // API route will map this to 'thumbnail' or 'image'
                })
            });

            if (res.ok) {
                toast.success("Article updated successfully!");
                router.push("/news-admin/articles");
                router.refresh();
            } else {
                toast.error("Failed to update");
            }
        } catch {
            toast.error("Error saving article");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-stone-500">Loading editor...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/news-admin/articles">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-serif font-bold">Edit Article</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={handleUpdate} disabled={saving} className="bg-stone-900 text-white rounded-none h-12 px-8 uppercase tracking-widest text-xs font-bold gap-2">
                        {saving ? "Saving..." : <> <Save className="w-4 h-4" /> Update Article </>}
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
                                className="text-2xl font-serif h-16 border-none px-0 focus-visible:ring-0 shadow-none border-b border-stone-100 rounded-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-bold">Content</Label>
                            <TiptapEditor content={content} onChange={setContent} />
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
                            <Label className="text-[10px] uppercase tracking-widest font-bold">Video URL</Label>
                            <Input
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
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
                                className="border-2 border-dashed border-stone-200 aspect-video flex flex-col items-center justify-center text-stone-400 hover:border-stone-400 transition-colors cursor-pointer group relative"
                                onClick={() => {
                                    const url = prompt("Enter Image URL", imageUrl);
                                    if (url !== null) setImageUrl(url);
                                }}
                            >
                                {imageUrl ? (
                                    <>
                                        <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold uppercase tracking-widest text-xs transition-opacity">Change Image</div>
                                    </>
                                ) : (
                                    <>
                                        <Globe className="w-8 h-8 mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Click to upload URL</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
