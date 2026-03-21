const fs = require('fs');
const file = 'frontend/src/components/ShareModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'className="relative bg-[#111] border border-white/10 w-full max-w-md rounded-[24px] shadow-2xl animate-slide-up overflow-hidden z-10 flex flex-col max-h-[90vh]"',
    'className="relative bg-card/95 backdrop-blur-2xl border border-border/50 w-full max-w-md rounded-3xl shadow-2xl animate-slide-up overflow-hidden z-10 flex flex-col max-h-[90vh]"'
);

// Fix WhatsApp sharing (send image + link together) is already handled in the component
//      await navigator.share({
//          title: title,
//          text: \`\${title}\\n\\nRead more at: \${url}\`,
//          files: [file]
//      });

fs.writeFileSync(file, content);
