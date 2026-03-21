const fs = require('fs');
const file = 'frontend/src/components/MobileReelsView.tsx';
let content = fs.readFileSync(file, 'utf8');

const newMapReturn = `
            {newsItems.map((item, index) => {
                // Virtualization: only render the active slide and 1 slide above/below.
                // Leave empty divs for others to maintain scroll height and layout.
                const isNearActive = Math.abs(activeIndex - index) <= 1;

                return (
                <div
                    key={item._id || item.id || index}
                    data-index={index}
                    className="h-[100dvh] w-screen snap-start snap-always relative flex items-center justify-center m-0 p-0 overflow-hidden"
                    onDoubleClick={() => handleDoubleTap(item.slug)}
                    style={{ contentVisibility: isNearActive ? 'visible' : 'auto' }}
                >
                    {isNearActive ? (
                        <NewsReelItem
                            news={{...item, trending: index < 2}}
                            isActive={activeIndex === index}
                            handleInteraction={handleInteraction}
                            isInteracting={isInteracting}
                        />
                    ) : (
                        <div className="w-full h-full bg-black"></div>
                    )}
                </div>
                );
            })}
        </div>`;

content = content.replace(/\{newsItems\.map\(\(item, index\).*\}\)\}\n        <\/div>/s, newMapReturn);

fs.writeFileSync(file, content);
