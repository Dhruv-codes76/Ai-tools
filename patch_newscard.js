const fs = require('fs');
const file = 'frontend/src/components/NewsCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// The original image container is:
// <div className="relative w-full pt-[56.25%] bg-muted/30 overflow-hidden">
// We need to replace it with aspect-[16/9] to avoid old padding hack.
content = content.replace(
    '<div className="relative w-full pt-[56.25%] bg-muted/30 overflow-hidden">',
    '<div className="relative w-full aspect-[16/9] bg-muted/30 overflow-hidden">'
);

// We need to ensure text overlays and readability on the image if required
// The image has: className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
// Actually, I can also add a gradient overlay inside this container to give it that premium readable look the user asked for.

const imgElementOriginal = `className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />`;

const imgElementNew = `className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient overlay for premium feel */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />`;

content = content.replace(imgElementOriginal, imgElementNew);

fs.writeFileSync(file, content);
