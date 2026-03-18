"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { 
    Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, 
    Image as ImageIcon, Link as LinkIcon, Search, Sparkles,
    Heading3, Heading4
} from "lucide-react";
import { useState, useEffect } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<{id: string, url: string, title: string, type: string}[]>([]);
    const [searching, setSearching] = useState(false);
    
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),

            Underline,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-foreground underline decoration-foreground/30 hover:decoration-foreground transition-all cursor-pointer font-bold',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Write something amazing...',
            }),
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }: { editor: any }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-lg dark:prose-invert focus:outline-none min-h-[400px] max-w-none p-10 text-foreground font-sans leading-relaxed custom-editor',
            },
        },
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Handle Search for Internal Links
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                return;
            }
            
            setSearching(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/search/suggestions?q=${searchQuery}`);
                const data = await res.json();
                setSuggestions(data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setSearching(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    if (!isMounted || !editor) return (
        <div className="border border-border bg-background p-6 min-h-[400px] animate-pulse">
            <div className="h-4 bg-muted w-1/4 mb-4 rounded" />
            <div className="h-4 bg-muted w-full mb-2 rounded" />
            <div className="h-4 bg-muted w-full mb-2 rounded" />
        </div>
    );

    const addImage = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setInternalLink = (url: string) => {
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        setIsLinkModalOpen(false);
        setSearchQuery("");
    };

    const setExternalLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="border border-border bg-background transition-all">
            {/* Toolbar */}
            <div className="border-b-2 border-border p-2 flex flex-nowrap overflow-x-auto gap-1 bg-muted/30 sticky top-0 z-10 scrollbar-hide shrink-0">
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleBold().run()} 
                    active={editor.isActive('bold')}
                    label="Bold"
                >
                    <Bold className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleItalic().run()} 
                    active={editor.isActive('italic')}
                    label="Italic"
                >
                    <Italic className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleUnderline().run()} 
                    active={editor.isActive('underline')}
                    label="Underline"
                >
                    <span className="font-serif underline font-black text-sm">U</span>
                </MenuButton>
                
                <div className="w-px h-6 bg-border mx-1 my-auto" />

                {/* Heading Dropdown/Expansion */}
                <div className="flex gap-1 group relative">
                    <MenuButton 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
                        active={editor.isActive('heading', { level: 1 })}
                        label="H1 - Main Title"
                    >
                        <Heading1 className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
                        active={editor.isActive('heading', { level: 2 })}
                        label="H2 - Section Header"
                    >
                        <Heading2 className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
                        active={editor.isActive('heading', { level: 3 })}
                        label="H3"
                    >
                        <Heading3 className="w-4 h-4" />
                    </MenuButton>
                    <div className="hidden sm:flex gap-1">
                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} 
                            active={editor.isActive('heading', { level: 4 })}
                            label="H4"
                        >
                            <Heading4 className="w-4 h-4" />
                        </MenuButton>
                    </div>
                </div>
                
                <div className="w-px h-6 bg-border mx-1 my-auto" />
                
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleBulletList().run()} 
                    active={editor.isActive('bulletList')}
                    label="Bullet List"
                >
                    <List className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleOrderedList().run()} 
                    active={editor.isActive('orderedList')}
                    label="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleBlockquote().run()} 
                    active={editor.isActive('blockquote')}
                    label="Quote"
                >
                    <Quote className="w-4 h-4" />
                </MenuButton>
                
                <div className="w-px h-6 bg-border mx-1 my-auto" />
                
                <MenuButton 
                    onClick={() => {
                        editor.chain().focus()
                            .insertContent('<h1>Article Title</h1>')
                            .insertContent('<h2>Real-World Relevance</h2><p>Explain why this matters to the average person...</p>')
                            .insertContent('<h2>How it Works</h2><p>Break down the technical aspect simply...</p>')
                            .run();
                    }} 
                    label="Apply Mandatory Structure"
                >
                    <div className="flex items-center gap-1 text-primary">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase">Structure</span>
                    </div>
                </MenuButton>

                <div className="w-px h-6 bg-border mx-1 my-auto" />
                
                <MenuButton onClick={addImage} label="Add Image URL">
                    <ImageIcon className="w-4 h-4" />
                </MenuButton>
                
                <MenuButton 
                    onClick={() => setIsLinkModalOpen(true)}
                    active={editor.isActive('link')}
                    label="Search Internal Content"
                >
                    <Search className="w-4 h-4" />
                </MenuButton>
                
                <MenuButton onClick={setExternalLink} label="External Link">
                    <LinkIcon className="w-4 h-4" />
                </MenuButton>
            </div>

            {/* Editor Content */}
            <div className="relative">
                <style jsx global>{`
                    .custom-editor h1 {
                        font-size: 2.5rem !important;
                        font-weight: 800 !important;
                        margin-top: 2rem !important;
                        margin-bottom: 1.5rem !important;
                        line-height: 1.1 !important;
                        border-bottom: 2px solid currentColor;
                        padding-bottom: 0.5rem;
                    }
                    .custom-editor h2 {
                        font-size: 1.8rem !important;
                        font-weight: 700 !important;
                        margin-top: 2rem !important;
                        margin-bottom: 1rem !important;
                        line-height: 1.2 !important;
                    }
                    .custom-editor h3 {
                        font-size: 1.4rem !important;
                        font-weight: 700 !important;
                        margin-top: 1.5rem !important;
                        margin-bottom: 0.75rem !important;
                    }
                    .custom-editor p {
                        margin-bottom: 1.25rem !important;
                        line-height: 1.7 !important;
                    }
                `}</style>

                {editor && (
                    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex bg-foreground text-background shadow-xl border border-border overflow-hidden">
                        <button 
                            type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`p-2 hover:bg-muted/20 ${editor.isActive('bold') ? 'bg-muted/30' : ''}`}
                        >
                            <Bold className="w-4 h-4" />
                        </button>
                        <button 
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`p-2 hover:bg-muted/20 ${editor.isActive('heading', { level: 2 }) ? 'bg-muted/30' : ''}`}
                        >
                            <Heading2 className="w-4 h-4" />
                        </button>
                        <button 
                            type="button"
                            onClick={() => setIsLinkModalOpen(true)}
                            className={`p-2 hover:bg-muted/20 ${editor.isActive('link') ? 'bg-muted/30' : ''}`}
                        >
                            <LinkIcon className="w-4 h-4" />
                        </button>
                    </BubbleMenu>
                )}

                <EditorContent editor={editor} className="min-h-[300px] max-h-[600px] overflow-y-auto w-full p-4 custom-editor" />
                
                {/* Internal Link Modal */}
                {isLinkModalOpen && (
                    <div className="absolute top-12 left-2 right-2 bg-background border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-4 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Link Internal Post</h4>
                            <button onClick={() => setIsLinkModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Type to find related articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-4 bg-transparent border-2 border-border focus:border-foreground focus:outline-none text-sm mb-2 font-medium"
                        />
                        <div className="max-h-60 overflow-y-auto space-y-1">
                            {searching && <div className="p-2 text-xs italic text-muted-foreground animate-pulse">Scanning Library...</div>}
                            {!searching && searchQuery.length >= 2 && suggestions.length === 0 && (
                                <div className="p-2 text-xs text-muted-foreground">No matches found in your articles.</div>
                            )}
                            {suggestions.map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setInternalLink(s.url)}
                                    className="w-full p-3 text-left hover:bg-foreground hover:text-background flex justify-between items-center transition-all border border-transparent hover:border-foreground"
                                >
                                    <span className="text-sm font-black">{s.title}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-muted group-hover:bg-background/20">{s.type}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="border-t-2 border-border p-3 bg-muted/10 flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                        Guided Writing Active
                    </div>
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                    {editor.storage.characterCount?.words?.() || 0} words
                </div>
            </div>
        </div>
    );
}

function MenuButton({ onClick, active, children, label }: { onClick: () => void, active?: boolean, children: React.ReactNode, label?: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            className={`px-3 py-2 transition-all flex items-center justify-center hover:translate-y-[-1px] ${active ? "bg-foreground text-background shadow-md" : "text-foreground hover:bg-muted"}`}
        >
            {children}
            {label && <span className="sr-only">{label}</span>}
        </button>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    )
}
