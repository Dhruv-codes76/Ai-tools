const fs = require('fs');
const file = 'frontend/src/components/NewsReelItem.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the image structure to include a blurred background layer behind the main image
// to fill empty spaces when images are horizontally oriented, while maintaining object-fit: contain
// for the main image so it's not cropped awkwardly, or we keep cover but with better centering.
// User requested "Fix stretched horizontal images", "Use object-fit: cover", "Apply gradient overlay on images to fill empty space", "Auto-adjust image position (center focus)", "Add blur background behind image for better UI"

const newImgSection = `                {/* Full Screen Background Image */}
                <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
                    {news.featuredImage ? (
                        <>
                            {/* Blurred background to fill empty space for horizontal images */}
                            <img
                                src={news.featuredImage}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110"
                            />
                            {/* Main image */}
                            <img
                                src={news.featuredImage}
                                alt=""
                                className={\`relative w-full h-full object-cover object-center transition-transform duration-[40s] ease-out \${isActive && !isInteracting ? 'scale-105' : 'scale-100'}\`}
                                loading={isActive ? "eager" : "lazy"}
                            />
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black"></div>
                    )}`;

content = content.replace(/\{\/\* Full Screen Background Image \*\/\}(.|\n)*?<\/div>/m, newImgSection);

// Fix gradient overlay to fill empty space
const oldGradient = `{/* Top overlay - transparent to dark */}
                <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none h-40" />
                {/* Bottom overlay - dark gradient for text readability with backdrop blur to soften the image below the text */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none h-[70vh] backdrop-blur-[2px] mask-gradient" />`;

const newGradient = `{/* Gradient Overlays for Readability */}
                <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none h-48" />
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none h-[80vh] backdrop-blur-[4px] mask-gradient" />`;

content = content.replace(/\{\/\* Top overlay - transparent to dark \*\/\}(.|\n)*?mask-gradient" \/>/m, newGradient);

fs.writeFileSync(file, content);
