"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ArticleActions({ id }: { id: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this article?")) return;

        try {
            const res = await fetch(`/main/api/articles/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("Article deleted");
                router.refresh();
            } else {
                toast.error("Failed to delete article");
            }
        } catch {
            toast.error("Error deleting article");
        }
    };

    return (
        <>
            <Link href={`/news-admin/articles/${id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                    <Edit className="w-4 h-4" />
                </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={handleDelete}>
                <Trash className="w-4 h-4" />
            </Button>
        </>
    );
}
