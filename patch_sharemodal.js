const fs = require('fs');
const file = 'frontend/src/components/ShareModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix text overlap awkwardly by adjusting the text clamp and line height in the visual preview shown to user
content = content.replace(/<h4 className="text-white font-bold text-xl leading-tight drop-shadow-md line-clamp-4 mb-4">/g, '<h4 className="text-white font-bold text-lg leading-snug drop-shadow-lg line-clamp-3 mb-3 bg-black/40 backdrop-blur-sm p-2 rounded-lg inline-block">');

// Fix dark mode share UI contrast by changing the modal background
content = content.replace(/className="w-full max-w-sm bg-\[\#121214\] border border-white\/10 rounded-[...]/, 'className="w-full max-w-sm bg-card/95 backdrop-blur-2xl border border-border/50 rounded-3xl overflow-hidden shadow-2xl relative animate-slide-up transform transition-all"');

fs.writeFileSync(file, content);
