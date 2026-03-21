const fs = require('fs');
const file = 'frontend/src/components/ShareModal/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Buttons
content = content.replace(
    /className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-[^"]+"/g,
    'className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/10 hover:border-white/30 group-active:scale-95"'
);
content = content.replace(
    /className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-[^"]+"/g,
    'className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/10 hover:border-white/30 group-active:scale-95"'
);
content = content.replace(
    /className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-[^"]+"/g,
    'className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/10 hover:border-white/30 group-active:scale-95"'
);
content = content.replace(
    /className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-[^"]+"/g,
    'className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/10 hover:border-white/30 group-active:scale-95"'
);

fs.writeFileSync(file, content);
