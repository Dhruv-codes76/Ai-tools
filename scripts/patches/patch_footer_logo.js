const fs = require('fs');
const file = 'frontend/src/components/Footer.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add Logo import
content = content.replace(
    'import Link from "next/link";',
    'import Link from "next/link";\nimport Logo from "./Logo";'
);

// Replace existing logo span with Logo component
const oldLogo = `<span className="block font-sans font-bold text-2xl tracking-tight text-[#EDEDED] mb-4">
                            AI MVP
                        </span>`;
const newLogo = `<div className="mb-4"><Logo size="lg" /></div>`;
content = content.replace(oldLogo, newLogo);

fs.writeFileSync(file, content);
