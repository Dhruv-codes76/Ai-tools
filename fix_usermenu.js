const fs = require('fs');
const file = 'frontend/src/components/UserMenu.tsx';
let content = fs.readFileSync(file, 'utf8');

// The code `import("next/navigation").then(m => m.useRouter())` is invalid React because it uses a hook inside a promise callback.
content = content.replace('const router = import("next/navigation").then(m => m.useRouter());', '// unused router removed');

fs.writeFileSync(file, content);
