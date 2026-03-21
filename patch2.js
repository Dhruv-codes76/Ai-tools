const fs = require('fs');
const file = 'frontend/src/components/ShareModal/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Change ai-portal.app to aiportalweekly.com in the generateImageFile hidden preview
content = content.replace(
    /<span style={{ color: 'rgba\(255,255,255,0\.6\)', fontSize: '28px', fontWeight: 600 }}>ai-portal\.app<\/span>/g,
    "<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '28px', fontWeight: 600 }}>aiportalweekly.com</span>"
);

// Link Copy Bar Polish: Clean up the URL link field at the bottom. Make the background slightly darker than the modal background for inset contrast.
content = content.replace(
    /className="flex items-center justify-between gap-3 px-4 py-3 bg-black\/40 rounded-xl border border-white\/10 overflow-hidden"/g,
    'className="flex items-center justify-between gap-3 px-4 py-3 bg-black/60 rounded-xl border border-white/10 overflow-hidden"'
);

fs.writeFileSync(file, content);
