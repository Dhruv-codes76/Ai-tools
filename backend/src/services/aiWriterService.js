const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIWriterService {
    constructor() {
        const keys = [];
        
        // 1. Check for individual numbered keys (most reliable for Render)
        if (process.env.GEMINI_API_KEY_1) keys.push(process.env.GEMINI_API_KEY_1.trim());
        if (process.env.GEMINI_API_KEY_2) keys.push(process.env.GEMINI_API_KEY_2.trim());
        if (process.env.GEMINI_API_KEY_3) keys.push(process.env.GEMINI_API_KEY_3.trim());

        // 2. Fallback to comma-separated list if no numbered keys found
        if (keys.length === 0) {
            const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
            if (rawKeys) {
                const splitKeys = rawKeys.split(',').map(k => k.trim()).filter(k => k !== '');
                keys.push(...splitKeys);
            }
        }

        // Remove any potential duplicates and save
        this.apiKeys = [
            process.env.GEMINI_API_KEY_1,
            process.env.GEMINI_API_KEY_2,
            process.env.GEMINI_API_KEY_3
        ].filter(Boolean).map(key => key.trim());

        this.currentIndex = 0;
        this.currentModel = 'gemini-2.5-flash'; // High-End Default for Scraping
        
        if (this.apiKeys.length === 0) {
            console.warn("WARNING: No Gemini API keys found (tried GEMINI_API_KEY_1-3). AI Writer will fail.");
        } else {
            console.log(`AI Writer initialized with ${this.apiKeys.length} API keys. Scraper Default: ${this.currentModel}`);
        }
    }

    /**
     * Helper to get a configured GenAI instance with the current key.
     */
    getGenAI() {
        if (this.apiKeys.length === 0) {
            throw new Error("No Gemini API keys found in environment variables.");
        }
        return new GoogleGenerativeAI(this.apiKeys[this.currentIndex]);
    }

    /**
     * Rotates to the next API key.
     */
    rotateKey() {
        if (this.apiKeys.length > 1) {
            this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
            console.log(`Rotating Gemini API Key. New index: ${this.currentIndex}`);
            return this.currentIndex === 0;
        }
        return false;
    }

    /**
     * Executes a Gemini operation with retry and automatic key rotation/fallback.
     */
    async executeWithRetry(operation, modelOverride = null, retryCount = 0) {
        let activeModel = modelOverride || this.currentModel;
        
        // Safety: Map unavailable specific names to their supported aliases in this API version
        if (activeModel.includes('1.5-flash')) {
            activeModel = 'gemini-flash-latest';
        } else if (activeModel === 'gemini-2.5-flash') {
            activeModel = 'gemini-2.5-flash-lite'; // Available variant
        }

        const maxRetries = this.apiKeys.length * 2; 

        try {
            return await operation(this.getGenAI(), activeModel);
        } catch (error) {
            const isDailyQuotaExhausted = error.message?.includes('GenerateRequestsPerDayPerProjectPerModel-FreeTier');
            const isRateLimit = error.status === 429 || error.message?.includes('Minute');

            if (isDailyQuotaExhausted) {
                console.error(`🔴 Key Index ${this.currentIndex} has EXHAUSTED its DAILY limit for ${activeModel}.`);
            } else if (isRateLimit) {
                console.warn(`🕒 Key Index ${this.currentIndex} hit a per-minute limit. Waiting 2 seconds then rotating...`);
            } else {
                console.error(`Gemini Error (${activeModel}):`, error.message);
            }
            
            const isRetriable = error.status === 400 || error.status === 404 || error.status === 429 || error.message?.includes('quota') || error.message?.includes('not found') || error.message?.includes('API_KEY_INVALID');
            
            if (isRetriable && retryCount < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const hasCycledAllKeys = this.rotateKey();

                // FALLBACK: If 2.5 is failing on all keys, downgrade to 1.5 for the scraper
                if (!modelOverride && hasCycledAllKeys && this.currentModel === 'gemini-2.5-flash') {
                    console.log("⚠️ ALL KEYS FAILED for gemini-2.5-flash. Falling back to gemini-1.5-flash...");
                    this.currentModel = 'gemini-1.5-flash';
                }

                return await this.executeWithRetry(operation, modelOverride, retryCount + 1);
            }
            throw error;
        }
    }

    /**
     * Uses Gemini to rewrite raw news text into a structured JSON format with strict SEO optimization.
     */
    async rewriteNews(rawTitle, rawText) {
        return await this.executeWithRetry(async (genAI, activeModel) => {
            const model = genAI.getGenerativeModel({ model: activeModel });

            const prompt = `
            You are a senior SEO journalist for "AI Portal Weekly". 
            Your goal is to write a post that passes a 100/100 SEO Audit.
            
            SEO CONTENT RULES (CRITICAL):
            1. **Keyphrase**: Identify a 2-3 word "focusKeyphrase" (e.g., "OpenAI Sora Shutdown").
            2. **Placement**: You MUST include the exact focusKeyphrase in:
               - The main Title
               - The first 50 words of the Introduction
               - At least one <h2> heading
               - The final Conclusion paragraph
            3. **Meta lengths**: 
               - "seoMetaTitle" MUST be between 45 and 60 characters. 
               - "seoMetaDescription" MUST be between 140 and 155 characters. (NEVER exceed 155)
            4. **Readability**: 
               - Use **Active Voice** only. (e.g., "OpenAI released" NOT "was released by").
               - Use at least 5 **Transition Words** (e.g., Furthermore, Consequently, However, Additionally, Similarly).
            5. **Length**: Total word count MUST be at least 300 words.
            6. **Tone**: Objective, factual, and strictly no-hype.

            Raw Title: ${rawTitle}
            Raw Text: ${rawText}

            Respond ONLY with this JSON structure:
            {
                "title": "Post Title (Must include Focus Keyphrase)",
                "summary": "150-character summary",
                "focusKeyphrase": "the 2-3 word keyword",
                "content": "HTML structure with <h2> and <p>. Ensure Keyphrase is in Intro, H2, and Conclusion. Use transitions.",
                "seoMetaTitle": "Strictly 45-60 chars including Keyphrase",
                "seoMetaDescription": "Strictly 140-155 chars including Keyphrase",
                "featuredImageAlt": "Alt text including Focus Keyphrase",
                "quickTake": "One-sentence impact analysis",
                "hypeLevel": <1-5>
            }
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                text = text.substring(firstBrace, lastBrace + 1);
            }

            return JSON.parse(text);
        });
    }

    /**
     * Uses Gemini Search Grounding to find breaking news today.
     */
    async searchLatestNews() {
        return await this.executeWithRetry(async (genAI, activeModel) => {
            const model = genAI.getGenerativeModel({ 
                model: activeModel,
                tools: [{ googleSearch: {} }] 
            });

            const prompt = `
            Search Google for the 1 most impactful artificial intelligence news announcement from the last 24 hours.
            Return ONLY a JSON array containing the news item.
            Format:
            [
                {
                    "url": "original source URL",
                    "rawTitle": "The headline",
                    "rawText": "A 3 paragraph detailed factual summary of what was announced"
                }
            ]
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

            const firstBracket = text.indexOf('[');
            const lastBracket = text.lastIndexOf(']');
            if (firstBracket !== -1 && lastBracket !== -1) {
                text = text.substring(firstBracket, lastBracket + 1);
            }

            return JSON.parse(text);
        });
    }
}

module.exports = new AIWriterService();
