const fs = require('fs');

// Fix NewsCard.tsx parsing error
const newsCardFile = 'frontend/src/components/NewsCard.tsx';
let newsCardContent = fs.readFileSync(newsCardFile, 'utf8');

// The issue in NewsCard is line 59:
// The JSX was broken when I added gradient, likely messed up the return or nested tags.
const expectedGoodImageBlock = `                {/* Image Placeholder Container (16:9) */}
                <div className="relative w-full aspect-[16/9] bg-muted/30 overflow-hidden">
                    {(news.image_url || news.featuredImage) ? (
                        <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={news.image_url || news.featuredImage}
                            alt={news.title}
                            loading="lazy"
                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient overlay for premium feel */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </>
                    ) : (`;

// Let's replace the whole block just to be safe
newsCardContent = newsCardContent.replace(/\{\/\* Image Placeholder Container \(16:9\) \*\/\}(.|\n)*?\) : \(/, expectedGoodImageBlock);
fs.writeFileSync(newsCardFile, newsCardContent);
