import re

with open('./frontend/src/components/NewsCard/index.tsx', 'r') as f:
    content = f.read()

# Replace <time className="... text-muted-foreground ...">
content = content.replace(
    'className="text-xs tracking-widest text-muted-foreground uppercase font-medium"',
    'className="text-xs tracking-widest text-gray-400 uppercase font-medium"'
)

# Replace <h3 className="... text-foreground dark:text-white ...">
content = content.replace(
    'className="font-sans text-xl lg:text-2xl font-bold text-foreground dark:text-white leading-snug mb-4 group-hover:text-blue-500 transition-colors line-clamp-2"',
    'className="font-sans text-xl lg:text-2xl font-bold text-white leading-snug mb-4 group-hover:text-blue-500 transition-colors line-clamp-2"'
)

# Replace summary <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mt-auto mb-6">
content = content.replace(
    'className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mt-auto mb-6"',
    'className="text-gray-300 text-sm leading-relaxed line-clamp-3 mt-auto mb-6"'
)

# Replace <div className="mt-auto flex justify-between items-center relative z-20 pt-4 border-t border-border/30">
content = content.replace(
    'className="mt-auto flex justify-between items-center relative z-20 pt-4 border-t border-border/30"',
    'className="mt-auto flex justify-between items-center relative z-20 pt-4 border-t border-white/10"'
)

# Replace Save button classes
content = content.replace(
    'className={`p-2 rounded-full transition-all duration-200 hover:bg-muted/80 ${isSaved ? \'text-blue-500\' : \'text-muted-foreground hover:text-foreground\'}`}',
    'className={`p-2 rounded-full transition-all duration-200 hover:bg-white/10 ${isSaved ? \'text-blue-500\' : \'text-gray-400 hover:text-white\'}`}'
)

# Replace Share button classes
content = content.replace(
    'className="p-2 rounded-full text-muted-foreground transition-all duration-200 hover:bg-muted/80 hover:text-foreground"',
    'className="p-2 rounded-full text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-white"'
)

with open('./frontend/src/components/NewsCard/index.tsx', 'w') as f:
    f.write(content)
