const fs = require('fs');
const file = 'frontend/src/components/ShareModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// The original file uses AI PORTAL and a hardcoded square for logo. We can swap it for the new Logo if we want, but it's captured by html-to-image so SVGs work fine.
// Actually, let's fix the layout issues mentioned in the scripts. The issue was that the "Secondary Action" was fine, but we need to ensure the high-res capture div explicitly sets all colors and background so Tailwind dark mode doesn't mess it up.

// Wait, looking at the code, I see:
// `<div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e1b4b 0%, #000000 100%)' }}></div>`
// and `<div style={{ backgroundColor: '#0a0a0a', fontFamily: 'system-ui...' }}>`

// Let's modify the capture div to ensure the text isn't cut off and everything is completely isolated from next-themes.
// Looking at the trace, the user mentioned:
// "Fix dark mode share UI issues"
// "Include article image, title, and logo"
// "Add gradient overlay"

// Let's inject our new Logo into the ShareModal capture div! This is perfect.
// First, add the import if not there.

if (!content.includes('import Logo')) {
    content = content.replace('import { toPng, toBlob } from \'html-to-image\';', 'import { toPng, toBlob } from \'html-to-image\';\nimport Logo from "./Logo";');
}

// Replace the placeholder logo in capture div:
const placeholderLogo = `<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {/* Simple icon or logo placeholder */}
                                                <div style={{ width: '24px', height: '24px', background: '#000', borderRadius: '4px' }}></div>
                                            </div>
                                            <span style={{ color: '#ffffff', fontSize: '32px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>AI PORTAL</span>
                                        </div>`;

const logoReplacement = `<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ transform: 'scale(1.5)', transformOrigin: 'left center' }}>
                                                <Logo size="lg" disableLink={true} />
                                            </div>
                                        </div>`;

content = content.replace(placeholderLogo, logoReplacement);

// Fix the visual preview to use Logo too
const visualPlaceholder = `<span className="text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-white inline-block"></span>
                                        AI Portal
                                    </span>`;

const visualReplacement = `<div>
                                        <Logo size="sm" disableLink={true} />
                                    </div>`;

content = content.replace(visualPlaceholder, visualReplacement);

// Make sure html-to-image can capture SVG properly by allowing it time to render or by not relying on external stylesheets if possible, but Logo uses inline-ish classes. Actually, html-to-image might struggle with SVG currentColor or external fonts.
// For safety, let's explicitly style the text inside Logo if it's rendered in html-to-image? Logo is a component.
// The capture div is already dark so text-white will apply.

fs.writeFileSync(file, content);
