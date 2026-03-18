"use client";

import { Image as ImageIcon, X, Upload } from "lucide-react";
import { useRef } from "react";

interface FeaturedImagePortalProps {
    imageUrl: string;
    imageAlt: string;
    onChange: (data: { featuredImage?: string; featuredImageAlt?: string; featuredImageFile?: File }) => void;
}

export default function FeaturedImagePortal({ imageUrl, imageAlt, onChange }: FeaturedImagePortalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            onChange({ 
                featuredImage: previewUrl, 
                featuredImageFile: file 
            });
        }
    };

    const handleRemove = () => {
        onChange({ featuredImage: "", featuredImageFile: undefined });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="border border-border p-6 bg-card/30 space-y-4">
            <h3 className="text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Featured Image Portal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="aspect-video bg-muted border border-border flex items-center justify-center relative overflow-hidden group">
                        {imageUrl ? (
                            <>
                                <img src={imageUrl} alt={imageAlt || "Featured image preview"} className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={handleRemove}
                                    className="absolute top-2 right-2 p-1 bg-background border border-border text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">No Image Selected</p>
                            </div>
                        )}
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full mt-3 py-2 border-2 border-dashed border-border hover:border-foreground transition-colors flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                        <Upload className="w-3.5 h-3.5" />
                        {imageUrl ? "Change Picture" : "Upload Picture"}
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </div>
                
                <div className="md:col-span-2 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase block text-muted-foreground">Featured Image URL (Optional if Uploading)</label>
                        <input
                            type="text"
                            placeholder="https://..."
                            value={imageUrl.startsWith('blob:') ? "" : imageUrl}
                            onChange={(e) => onChange({ featuredImage: e.target.value, featuredImageFile: undefined })}
                            className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none text-sm"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase block text-muted-foreground">SEO Alt Text (Critical for Rankings)</label>
                        <input
                            type="text"
                            placeholder="Describe the image for search engines..."
                            value={imageAlt}
                            onChange={(e) => onChange({ featuredImageAlt: e.target.value })}
                            className="w-full p-3 bg-transparent border border-border focus:border-foreground focus:outline-none text-sm"
                        />
                        <p className="text-[10px] text-muted-foreground italic">
                            Alt text helps this article appear in Image Search and improves accessibility.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
