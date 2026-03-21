const fs = require('fs');
const file = 'frontend/src/components/Navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add Logo import
content = content.replace(
    'import { Home, Newspaper, Wrench, Menu, Search, X, Clock, TrendingUp } from "lucide-react";',
    'import { Home, Newspaper, Wrench, Menu, Search, X, Clock, TrendingUp } from "lucide-react";\nimport Logo from "./Logo";'
);

// Replace existing logo link with Logo component
const oldLogo = `<Link href="/" className="flex items-center group shrink-0">
                            <span className="font-sans font-bold text-lg md:text-xl tracking-tight text-gray-900 dark:text-white transition-transform duration-300 group-hover:scale-[1.02]">
                                AI Portal
                            </span>
                        </Link>`;
const newLogo = `<Logo size="md" className="shrink-0" />`;
content = content.replace(oldLogo, newLogo);

fs.writeFileSync(file, content);
