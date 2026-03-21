const fs = require('fs');
const file = 'frontend/src/components/ShareModal/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace standard icons with Loader2 when loadingAction matches the button
content = content.replace(
    /<MessageCircle className="w-6 h-6" \/>/g,
    '{loadingAction === "whatsapp" ? <Loader2 className="w-6 h-6 animate-spin" /> : <MessageCircle className="w-6 h-6" />}'
);

content = content.replace(
    /\{copied \? <Check className="w-6 h-6" \/> : <Copy className="w-6 h-6" \/>\}/g,
    '{loadingAction === "copy" ? <Loader2 className="w-6 h-6 animate-spin" /> : (copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />)}'
);

content = content.replace(
    /<Download className="w-6 h-6" \/>/g,
    '{loadingAction === "download" ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}'
);

content = content.replace(
    /<Share2 className="w-6 h-6" \/>/g,
    '{loadingAction === "native" ? <Loader2 className="w-6 h-6 animate-spin" /> : <Share2 className="w-6 h-6" />}'
);

// We should also set isSharing appropriately in the handlers, which we'll do in the next step, but let's make sure buttons are disabled if `loadingAction` is set.
// The buttons already have `disabled={isSharing}`, which we will set in the next step alongside `loadingAction`.
// Actually, I can just use `isSharing || loadingAction !== null`
content = content.replace(
    /disabled=\{isSharing\}/g,
    'disabled={isSharing || loadingAction !== null}'
);


fs.writeFileSync(file, content);
