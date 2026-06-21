"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
    Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2,
    Link as LinkIcon, Image as ImageIcon, Video, Code, Undo, Redo
} from "lucide-react";

import Youtube from "@tiptap/extension-youtube";

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addYoutubeVideo = () => {
        const url = window.prompt("Enter YouTube URL");
        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
                width: 640,
                height: 480,
            });
        }
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-stone-200 bg-stone-50">
            <Button
                variant="ghost" size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-stone-200" : ""}
            >
                <Bold className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost" size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-stone-200" : ""}
            >
                <Italic className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost" size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive("heading", { level: 1 }) ? "bg-stone-200" : ""}
            >
                <Heading1 className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost" size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive("heading", { level: 2 }) ? "bg-stone-200" : ""}
            >
                <Heading2 className="w-4 h-4" />
            </Button>
            <div className="w-[1px] h-6 bg-stone-200 mx-1 self-center" />
            <Button
                variant="ghost" size="icon"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-stone-200" : ""}
            >
                <List className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost" size="icon"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-stone-200" : ""}
            >
                <ListOrdered className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost" size="icon"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "bg-stone-200" : ""}
            >
                <Quote className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost" size="icon"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive("codeBlock") ? "bg-stone-200" : ""}
            >
                <Code className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost" size="icon"
                onClick={() => {
                    const url = window.prompt('URL');
                    if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
                className={editor.isActive('link') ? 'bg-stone-200' : ''}
            >
                <LinkIcon className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost" size="icon"
                onClick={() => {
                    const url = window.prompt('Image URL');
                    if (url) editor.chain().focus().setImage({ src: url }).run();
                }}
            >
                <ImageIcon className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost" size="icon"
                onClick={addYoutubeVideo}
            >
                <Video className="w-4 h-4" />
            </Button>
            <div className="flex-1" />
            <Button
                variant="ghost" size="icon"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                <Undo className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost" size="icon"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
            >
                <Redo className="w-4 h-4" />
            </Button>
        </div>
    );
};

export default function TiptapEditor({ content, onChange }: { content?: string, onChange?: (html: string) => void }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // The StarterKit sometimes includes things that clash with manual extensions
                // but usually not link. However, let's be safe.
            }),
            Image,
            Link.configure({ 
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                },
            }),
            Placeholder.configure({ placeholder: "Start writing the story..." }),
            Youtube.configure({
                controls: true,
                nocookie: true,
                // Youtube extension often includes its own link logic
            }),
        ],
        content: content || "",
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-stone max-w-none min-h-[500px] p-8 focus:outline-none font-serif text-lg",
            },
        },
        immediatelyRender: false,
    });

    return (
        <div className="border border-stone-200 bg-white">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
