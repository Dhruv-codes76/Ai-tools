const fs = require('fs');
const file = 'frontend/src/components/ShareModal/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Import Loader2
if (!content.includes('Loader2')) {
    content = content.replace(
        /import \{ X, Copy, Download, MessageCircle, Share2, Check, ExternalLink \} from "lucide-react";/,
        'import { X, Copy, Download, MessageCircle, Share2, Check, ExternalLink, Loader2 } from "lucide-react";'
    );
}

// 2. Add State for Preloaded File and Loading Action
const stateAddString = `    const [copied, setCopied] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [preloadedFile, setPreloadedFile] = useState<File | null>(null);
    const [loadingAction, setLoadingAction] = useState<'whatsapp' | 'native' | 'download' | 'copy' | null>(null);`;

content = content.replace(
    /    const \[copied, setCopied\] = useState\(false\);\n    const \[isSharing, setIsSharing\] = useState\(false\);/,
    stateAddString
);

// 3. Add useEffect to preload the file when the modal opens
const preloadEffect = `    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // Pre-generate background image
            setPreloadedFile(null);
            setTimeout(async () => {
                if (!previewRef.current) return;
                try {
                    const blob = await toBlob(previewRef.current, {
                        cacheBust: true,
                        pixelRatio: 2,
                        style: {
                            transform: 'scale(1)',
                            transformOrigin: 'top left',
                            background: '#0a0a0a',
                            margin: '0',
                        }
                    });
                    if (blob) {
                        setPreloadedFile(new File([blob], \`AI_Portal_\${title.substring(0, 15).replace(/\\s+/g, '_')}.png\`, { type: 'image/png' }));
                    }
                } catch (err) {
                    console.error('Error preloading image blob:', err);
                }
            }, 50); // Small delay to ensure the DOM is rendered before capture
        } else {
            document.body.style.overflow = "";
            setPreloadedFile(null);
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, title]);`;

content = content.replace(
    /    useEffect\(\(\) => \{\n        if \(isOpen\) \{\n            document.body.style.overflow = "hidden";\n        \} else \{\n            document.body.style.overflow = "";\n        \}\n        return \(\) => \{\n            document.body.style.overflow = "";\n        \};\n    \}, \[isOpen\]\);/,
    preloadEffect
);

// 4. Modify generateImageFile to await the preloaded file if it's still generating
const newGenerateImageFile = `    const generateImageFile = async (): Promise<File | null> => {
        if (preloadedFile) return preloadedFile;
        if (!previewRef.current) return null;
        try {
            const blob = await toBlob(previewRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                    background: '#0a0a0a',
                    margin: '0',
                }
            });
            if (!blob) return null;
            return new File([blob], \`AI_Portal_\${title.substring(0, 15).replace(/\\s+/g, '_')}.png\`, { type: 'image/png' });
        } catch (err) {
            console.error('Error generating image blob:', err);
            return null;
        }
    };`;

content = content.replace(
    /    const generateImageFile = async \(\): Promise<File \| null> => \{[\s\S]*?    \};/,
    newGenerateImageFile
);


fs.writeFileSync(file, content);
