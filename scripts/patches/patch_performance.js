const fs = require('fs');

const newsPageFile = 'frontend/src/app/(main)/news/page.tsx';
let newsPageContent = fs.readFileSync(newsPageFile, 'utf8');

if (!newsPageContent.includes('import { Suspense } from "react";')) {
    newsPageContent = newsPageContent.replace(
        'import { getNews } from "@/lib/api";',
        'import { getNews } from "@/lib/api";\nimport { Suspense } from "react";'
    );
}

// Wrap MobileReelsView
newsPageContent = newsPageContent.replace(
    '<MobileReelsView newsItems={newsItems || []} />',
    '<Suspense fallback={<div className="w-full h-screen bg-black flex items-center justify-center animate-pulse"><div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div></div>}>\n                    <MobileReelsView newsItems={newsItems || []} />\n                </Suspense>'
);

// Wrap DesktopNewsList
newsPageContent = newsPageContent.replace(
    '<DesktopNewsList newsItems={newsItems || []} />',
    '<Suspense fallback={<div className="max-w-[900px] mx-auto py-12 px-6 flex flex-col gap-10"><div className="w-full h-64 bg-muted animate-pulse rounded-xl"></div><div className="w-full h-64 bg-muted animate-pulse rounded-xl"></div></div>}>\n                    <DesktopNewsList newsItems={newsItems || []} />\n                </Suspense>'
);

fs.writeFileSync(newsPageFile, newsPageContent);


const homePageFile = 'frontend/src/app/(main)/page.tsx';
let homePageContent = fs.readFileSync(homePageFile, 'utf8');

if (!homePageContent.includes('import { Suspense } from "react";')) {
    homePageContent = homePageContent.replace(
        'import { getNews, getTools } from "@/lib/api";',
        'import { getNews, getTools } from "@/lib/api";\nimport { Suspense } from "react";'
    );
}

const newsLoopRegex = /\{latestNews && latestNews\.length > 0 \? \(\s*latestNews\.map\(\(news: any\) => \(\s*<NewsCard key=\{news\._id\} news=\{news\} \/>\s*\)\s*\)\s*\) : \(\s*<p className="text-muted-foreground py-8 italic font-sans col-span-full text-center">No transmissions currently active\.<\/p>\s*\)\}/;

const newsSuspenseFallback = `<Suspense fallback={<><div className="w-full h-80 bg-muted animate-pulse rounded-2xl"></div><div className="w-full h-80 bg-muted animate-pulse rounded-2xl hidden md:block"></div><div className="w-full h-80 bg-muted animate-pulse rounded-2xl hidden lg:block"></div></>}>
              {latestNews && latestNews.length > 0 ? (
                latestNews.map((news: any) => (
                  <NewsCard key={news._id} news={news} />
                ))
              ) : (
                <p className="text-muted-foreground py-8 italic font-sans col-span-full text-center">No transmissions currently active.</p>
              )}
              </Suspense>`;

homePageContent = homePageContent.replace(newsLoopRegex, newsSuspenseFallback);


const toolsLoopRegex = /\{latestTools && latestTools\.length > 0 \? \(\s*latestTools\.map\(\(tool: any\) => \(\s*<ToolCard key=\{tool\._id\} tool=\{tool\} \/>\s*\)\s*\)\s*\) : \(\s*<p className="text-muted-foreground py-8 italic font-sans col-span-full text-center">Catalog currently unavailable\.<\/p>\s*\)\}/;

const toolsSuspenseFallback = `<Suspense fallback={<><div className="w-full h-40 bg-muted animate-pulse rounded-2xl"></div><div className="w-full h-40 bg-muted animate-pulse rounded-2xl"></div><div className="w-full h-40 bg-muted animate-pulse rounded-2xl hidden lg:block"></div><div className="w-full h-40 bg-muted animate-pulse rounded-2xl hidden lg:block"></div></>}>
              {latestTools && latestTools.length > 0 ? (
                latestTools.map((tool: any) => (
                  <ToolCard key={tool._id} tool={tool} />
                ))
              ) : (
                <p className="text-muted-foreground py-8 italic font-sans col-span-full text-center">Catalog currently unavailable.</p>
              )}
              </Suspense>`;

homePageContent = homePageContent.replace(toolsLoopRegex, toolsSuspenseFallback);

fs.writeFileSync(homePageFile, homePageContent);
