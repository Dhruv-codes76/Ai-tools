/**
 * Readability Utilities for CRM
 * Enforces Yoast-style readability rules: 
 * - Passive Voice < 10%
 * - Transition Word Density 25-30%
 */

const transitionWords = [
    "accordingly", "as a result", "consequently", "for this reason", "hence", "therefore", "thus",
    "additionally", "also", "furthermore", "in addition", "moreover", "equally important",
    "by comparison", "conversely", "however", "on the other hand", "similarly", "whereas",
    "for example", "for instance", "to illustrate",
    "afterward", "eventually", "meanwhile", "next", "then", "until",
    "primarily", "chiefly", "above all",
    "first", "second", "third", "finally", "lastly"
];

// Simplified passive voice detection: looking for form of "to be" + past participle
// Forms of "to be": am, is, are, was, were, be, being, been
// Past participles usually end in "ed", "en", "t" (heuristic)
const toBeVerbs = ["am", "is", "are", "was", "were", "be", "being", "been"];

export interface ReadabilityResults {
    passiveVoicePercentage: number;
    transitionDensityPercentage: number;
    wordCount: number;
    sentenceCount: number;
}

export function analyzeReadability(html: string): ReadabilityResults {
    // Strip HTML tags
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!text) return { passiveVoicePercentage: 0, transitionDensityPercentage: 0, wordCount: 0, sentenceCount: 0 };

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    const wordCount = words.length;
    const sentenceCount = sentences.length;

    if (wordCount === 0) return { passiveVoicePercentage: 0, transitionDensityPercentage: 0, wordCount: 0, sentenceCount: 0 };

    // 1. Transition Word Density
    let transitionCount = 0;
    const textLower = text.toLowerCase();
    transitionWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const matches = textLower.match(regex);
        if (matches) transitionCount += matches.length;
    });
    
    const transitionDensityPercentage = (transitionCount / sentenceCount) * 100;

    // 2. Passive Voice (Basic Heuristic)
    let passiveCount = 0;
    sentences.forEach(sentence => {
        const s = sentence.toLowerCase();
        toBeVerbs.forEach(verb => {
            const regex = new RegExp(`\\b${verb}\\s+\\w+(ed|en|t)\\b`, 'g');
            const matches = s.match(regex);
            if (matches) passiveCount += matches.length;
        });
    });

    const passiveVoicePercentage = (passiveCount / sentenceCount) * 100;

    return {
        passiveVoicePercentage: Math.round(passiveVoicePercentage),
        transitionDensityPercentage: Math.round(transitionDensityPercentage),
        wordCount,
        sentenceCount
    };
}
