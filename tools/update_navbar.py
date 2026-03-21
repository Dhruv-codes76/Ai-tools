import re

with open('frontend/src/components/Navbar.tsx', 'r') as f:
    content = f.read()

# Make search full width on mobile
# Find: className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out bg-gray-100/50 dark:bg-white/5 border border-transparent rounded-full ${isSearchOpen ? 'w-[200px] sm:w-[300px] md:w-[340px] px-3 py-1.5 border-gray-200 dark:border-white/10' : 'w-8 h-8 sm:w-10 sm:h-10 justify-center'}`}
# Replace with a version that has absolute positioning and full width on mobile when open
pattern_container = r"className=\{`flex items-center overflow-hidden transition-all duration-300 ease-in-out bg-gray-100/50 dark:bg-white/5 border border-transparent rounded-full \$\{isSearchOpen \? 'w-\[200px\] sm:w-\[300px\] md:w-\[340px\] px-3 py-1\.5 border-gray-200 dark:border-white/10' : 'w-8 h-8 sm:w-10 sm:h-10 justify-center'\}`\}"
replacement_container = r"className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out bg-gray-100/50 dark:bg-white/5 border border-transparent rounded-full ${isSearchOpen ? 'absolute right-0 top-1/2 -translate-y-1/2 w-[calc(100vw-32px)] sm:w-[300px] md:w-[340px] px-3 py-1.5 border-gray-200 dark:border-white/10 z-50 bg-white dark:bg-zinc-900' : 'relative w-8 h-8 sm:w-10 sm:h-10 justify-center'}`}"
content = re.sub(pattern_container, replacement_container, content)

# Adjust dropdown positioning for mobile
pattern_dropdown = r"w-\[100vw\] sm:w-\[340px\] md:w-\[400px\]"
replacement_dropdown = r"w-[calc(100vw-32px)] sm:w-[340px] md:w-[400px]"
content = re.sub(pattern_dropdown, replacement_dropdown, content)

with open('frontend/src/components/Navbar.tsx', 'w') as f:
    f.write(content)
