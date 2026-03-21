# Check if the user is triggering the generic Share2 button on mobile somehow.
# Wait, look at the screenshot again carefully. The text in the screenshot:
# "AI Portal
# HomeNewsTools
# [Sun/Moon]
# [User]
# [Hamburger]
# Home
# News
# Tools
# Unbiased AI Insights..."

# The screenshot is a screenshot of the *browser* rendering the full app!
# But what is the black box with the 'X'? That box IS the ShareModal that I just modified!
# Ah! In ShareModal.tsx, I added a preview element.
# Look at ShareModal.tsx:
# ```
# <div className="absolute left-[-9999px] top-[-9999px]">
#     <div ref={previewRef} ...>
#        ...
#     </div>
# </div>
# ```
# Wait! This hidden element is probably causing the entire document to scroll or stretch, OR it's not hidden properly?
# No, look at the second `<div className="relative w-full max-w-[280px]...">`
# What if `title` and `url` and `imageUrl` are undefined, and somehow it is rendering the entire HTML document as the `title`? NO, that's impossible.

# Wait, in ShareModal.tsx, line 178:
# `<div className="absolute inset-0 z-0">
#     {imageUrl ? (
#         <img src={imageUrl} ... />
#     ) : (
#         <div className="w-full h-full bg-gradient-to-br from-indigo-950 to-black"></div>
#     )}
# </div>`

# Wait! If you look at the screenshot, the "Unbiased AI Insights. Absolute clarity." is the title of the HOME page.
# That means the user clicked "Share" on the Home page link.
# And they opened the ShareModal.
# AND inside the ShareModal, the `title` prop being passed is the literal TITLE of the page?
# AND wait, what if `html-to-image` is somehow taking a screenshot of the *entire document* because of the way the ref is placed?
# Let's see the screenshot again...
# Oh! The text inside the ShareModal says "AI Portal HomeNewsTools ... Unbiased AI Insights..."
# This means the `title` prop passed to `ShareModal` contains the TEXT CONTENT of the entire page!
# Let's check where `ShareModal` is called!
