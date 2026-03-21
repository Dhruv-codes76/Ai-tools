const AppError = require('../src/utils/AppError');

const BLACKLIST = ['casino', 'loan', 'crypto', 'adult', 'bet'];
const BLACKLIST_REGEX = new RegExp(BLACKLIST.join('|'), 'i');

function validateCommentText(text) {
    if (!text || text.length < 25) throw new AppError('Comment must be at least 25 characters long.', 400);
    if (text.length > 500) throw new AppError('Comment must be no more than 500 characters long.', 400);

    if (BLACKLIST_REGEX.test(text)) throw new AppError('Comment contains prohibited words.', 400);

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex) || [];
    if (urls.length > 2) throw new AppError('Comment contains too many links (max 2 allowed).', 400);

    return text;
}

const assert = require('assert');

async function testValidation() {
    console.log("Starting functional verification...");

    const validText = "This is a valid comment that is long enough to pass validation and has no bad words.";
    const blacklistedText = "This comment contains casino which is a blacklisted word and it should be blocked.";
    const blacklistedTextCaps = "This comment contains CRYPTO which is a blacklisted word and it should be blocked.";
    const tooShortText = "Too short.";
    const tooManyLinks = "Check out https://example.com and https://google.com and https://bing.com - too many links!";

    // Test valid text
    try {
        validateCommentText(validText);
        console.log("✅ Valid text passed");
    } catch (e) {
        console.error("❌ Valid text failed:", e.message);
        process.exit(1);
    }

    // Test blacklisted text
    try {
        validateCommentText(blacklistedText);
        console.error("❌ Blacklisted text failed to be caught");
        process.exit(1);
    } catch (e) {
        assert.strictEqual(e.message, 'Comment contains prohibited words.');
        console.log("✅ Blacklisted text caught");
    }

    // Test blacklisted text with caps
    try {
        validateCommentText(blacklistedTextCaps);
        console.error("❌ Blacklisted text (caps) failed to be caught");
        process.exit(1);
    } catch (e) {
        assert.strictEqual(e.message, 'Comment contains prohibited words.');
        console.log("✅ Blacklisted text (caps) caught");
    }

    // Test too short text
    try {
        validateCommentText(tooShortText);
        console.error("❌ Too short text failed to be caught");
        process.exit(1);
    } catch (e) {
        assert.strictEqual(e.message, 'Comment must be at least 25 characters long.');
        console.log("✅ Too short text caught");
    }

    // Test too many links
    try {
        validateCommentText(tooManyLinks);
        console.error("❌ Too many links text failed to be caught");
        process.exit(1);
    } catch (e) {
        assert.strictEqual(e.message, 'Comment contains too many links (max 2 allowed).');
        console.log("✅ Too many links text caught");
    }

    console.log("Functional verification completed successfully!");
}

testValidation().catch(err => {
    console.error(err);
    process.exit(1);
});
