const fs = require('fs');

// Patch Navbar Spacing
const navFile = 'frontend/src/components/Navbar.tsx';
let navContent = fs.readFileSync(navFile, 'utf8');

// The original code was:
// <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// That's standard and actually correct. Let's make sure it stretches nicely if they want full width with padding, or keep it max-w-7xl.
// Actually, looking at the user request "Remove unwanted side spacing (full width)" they want it to stretch out to the edges rather than max-w-7xl. Wait, they specifically asked for full width!
// "Remove unwanted side spacing (full width)" -> Change max-w-7xl to w-full.
navContent = navContent.replace(
    'className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"',
    'className="w-full mx-auto px-4 sm:px-6 lg:px-8"'
);
fs.writeFileSync(navFile, navContent);

// Patch DesktopNewsList spacing
const desktopListFile = 'frontend/src/components/DesktopNewsList.tsx';
let desktopListContent = fs.readFileSync(desktopListFile, 'utf8');

// The original was: <div className="max-w-[900px] mx-auto py-12 px-6">
// User wants to remove unwanted side spacing (full width) but still keep it readable. We'll set max-w-7xl so it's wider and fits the grids, or make it w-full max-w-full px-4 sm:px-6 lg:px-8
// Also they asked to fix the bottom navbar alignment (adding pb-24 for mobile).
desktopListContent = desktopListContent.replace(
    'className="max-w-[900px] mx-auto py-12 px-6"',
    'className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pb-32 md:pb-12"'
);
fs.writeFileSync(desktopListFile, desktopListContent);

// Patch Home Page Spacing
const homeFile = 'frontend/src/app/(main)/page.tsx';
let homeContent = fs.readFileSync(homeFile, 'utf8');
homeContent = homeContent.replace(
    'className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20"',
    'className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 pb-32 md:pb-24"'
);
fs.writeFileSync(homeFile, homeContent);
