const fs = require('fs');
const file = 'frontend/src/components/NewsReelItem.tsx';
let content = fs.readFileSync(file, 'utf8');

// The replacement in patch_newsreel.js left an extra ")}" at the end. Let's fix it by exact string replacement.
content = content.replace('                    )}\n                    )}', '                    )}');
fs.writeFileSync(file, content);
