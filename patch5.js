const fs = require('fs');
const file = 'frontend/src/components/ShareModal/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// handleWhatsApp
const handleWhatsAppString = `    const handleWhatsApp = async () => {
        setIsSharing(true);
        setLoadingAction('whatsapp');
        try {
            const file = await generateImageFile();
            if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: title,
                    text: \`\${title}\\n\\nRead more at: \${url}\`,
                    files: [file]
                });
            } else {
                window.open(\`https://api.whatsapp.com/send?text=\${encodeURIComponent(\`\${title}\\n\\n\${url}\`)}\`, '_blank');
            }
        } catch (err) {
            console.error("WhatsApp share failed", err);
            window.open(\`https://api.whatsapp.com/send?text=\${encodeURIComponent(\`\${title}\\n\\n\${url}\`)}\`, '_blank');
        } finally {
            setIsSharing(false);
            setLoadingAction(null);
        }
    };`;
content = content.replace(/    const handleWhatsApp = async \(\) => \{[\s\S]*?    \};/, handleWhatsAppString);

// handleNativeShare
const handleNativeShareString = `    const handleNativeShare = async () => {
        setIsSharing(true);
        setLoadingAction('native');
        try {
            const file = await generateImageFile();
            if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: title,
                    text: url,
                    files: [file]
                });
            } else if (navigator.share) {
                await navigator.share({
                    title: title,
                    url: url
                });
            } else {
                 handleCopy();
            }
        } catch (err) {
            console.error("Native share failed", err);
        } finally {
            setIsSharing(false);
            setLoadingAction(null);
        }
    };`;
content = content.replace(/    const handleNativeShare = async \(\) => \{[\s\S]*?    \};/, handleNativeShareString);

// handleDownload
const handleDownloadString = `    const handleDownload = async () => {
        setIsSharing(true);
        setLoadingAction('download');
        try {
            let fileToDownload = preloadedFile;
            if (!fileToDownload) {
               fileToDownload = await generateImageFile();
            }
            if (!fileToDownload) return;

            const dataUrl = URL.createObjectURL(fileToDownload);
            const link = document.createElement('a');
            link.download = \`AI_Portal_\${title.substring(0, 15).replace(/\\s+/g, '_')}.png\`;
            link.href = dataUrl;
            link.click();
            URL.revokeObjectURL(dataUrl);
        } catch (err) {
            console.error('Error generating image:', err);
        } finally {
            setIsSharing(false);
            setLoadingAction(null);
        }
    };`;
content = content.replace(/    const handleDownload = async \(\) => \{[\s\S]*?    \};/, handleDownloadString);

fs.writeFileSync(file, content);
