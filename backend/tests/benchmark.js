const { performance } = require('perf_hooks');
const AppError = require('../src/utils/AppError');

// Mocking CommentService since we want to test the current implementation first
// We'll use the actual code from src/services/commentService.js to be accurate
const BLACKLIST = ['casino', 'loan', 'crypto', 'adult', 'bet'];

function validateCommentTextCurrent(text) {
    if (!text || text.length < 25) throw new AppError('Comment must be at least 25 characters long.', 400);
    if (text.length > 500) throw new AppError('Comment must be no more than 500 characters long.', 400);

    const lowerText = text.toLowerCase();
    for (const word of BLACKLIST) {
        if (lowerText.includes(word)) throw new AppError('Comment contains prohibited words.', 400);
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex) || [];
    if (urls.length > 2) throw new AppError('Comment contains too many links (max 2 allowed).', 400);

    return text; // xss(text) is not relevant for this benchmark
}

const BLACKLIST_REGEX = new RegExp(BLACKLIST.join('|'), 'i');
function validateCommentTextOptimized(text) {
    if (!text || text.length < 25) throw new AppError('Comment must be at least 25 characters long.', 400);
    if (text.length > 500) throw new AppError('Comment must be no more than 500 characters long.', 400);

    if (BLACKLIST_REGEX.test(text)) throw new AppError('Comment contains prohibited words.', 400);

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex) || [];
    if (urls.length > 2) throw new AppError('Comment contains too many links (max 2 allowed).', 400);

    return text;
}

const testText = "This is a very long comment that should pass validation and not contain any prohibited words. It needs to be at least 25 characters long, so here I am writing more stuff.";
const maliciousText = "This is a very long comment that should fail validation because it contains the word casino. It needs to be at least 25 characters long.";

const iterations = 1000000;

function runBenchmark(fn, text, name) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        try {
            fn(text);
        } catch (e) {
            // expected for maliciousText
        }
    }
    const end = performance.now();
    console.log(`${name}: ${end - start}ms`);
    return end - start;
}

console.log(`Running benchmark with ${iterations} iterations...`);

console.log("\n--- Valid Text ---");
const currentValid = runBenchmark(validateCommentTextCurrent, testText, "Current (Valid)");
const optimizedValid = runBenchmark(validateCommentTextOptimized, testText, "Optimized (Valid)");

console.log("\n--- Malicious Text ---");
const currentMalicious = runBenchmark(validateCommentTextCurrent, maliciousText, "Current (Malicious)");
const optimizedMalicious = runBenchmark(validateCommentTextOptimized, maliciousText, "Optimized (Malicious)");

console.log("\n--- Summary ---");
console.log(`Valid text improvement: ${((currentValid - optimizedValid) / currentValid * 100).toFixed(2)}%`);
console.log(`Malicious text improvement: ${((currentMalicious - optimizedMalicious) / currentMalicious * 100).toFixed(2)}%`);
