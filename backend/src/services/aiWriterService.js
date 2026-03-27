const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIWriterService {
    constructor() {
        // Robust check: Support both plural (keys) and singular (key) env names
        const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
        this.apiKeys = rawKeys ? rawKeys.split(',').map(k => k.trim()) : [];
        this.currentIndex = 0;
        
        if (this.apiKeys.length === 0) {
            console.warn("WARNING: GEMINI_API_KEYS or GEMINI_API_KEY is missing. AI Writer will fail.");
        } else {
            console.log(`AI Writer initialized with ${this.apiKeys.length} API keys.`);
        }
    }

    /**
     * Gets a new GenAI instance using the current rotation index.
     */
    getGenAI() {
        if (this.apiKeys.length === 0) throw new Error("No Gemini API keys configured.");
        const key = this.apiKeys[this.currentIndex].trim();
        return new GoogleGenerativeAI(key);
    }

    /**
     * Rotates to the next API key (internal use).
     */
    rotateKey() {
        if (this.apiKeys.length > 1) {
            this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
            console.log(`Rotating Gemini API Key. New index: ${this.currentIndex}`);
        }
    }

    /**
     * Public method to pre-rotate before each cron run.
     * With 3 keys and 3 daily runs, each run uses a different primary account.
     */
    rotateApiKey() {
        this.rotateKey();
    }

    /**
     * Executes a Gemini request with automatic key rotation on failure.
     */
    async executeWithRetry(operation, retryCount = 0) {
        const maxRetries = this.apiKeys.length * 2;
        try {
            return await operation(this.getGenAI());
        } catch (error) {
            console.error(`Gemini Operation Failed (Key Index ${this.currentIndex}):`, error.message);
            
            // Rotate and retry on: 400 (invalid key/model), 404, 429 (rate limit), quota errors
            const isRetriable = error.status === 400 || error.status === 404 || error.status === 429 || error.message?.includes('quota') || error.message?.includes('not found') || error.message?.includes('API_KEY_INVALID');
            
            if (isRetriable && retryCount < maxRetries) {
                this.rotateKey();
                return await this.executeWithRetry(operation, retryCount + 1);
            }
            throw error;
        }
    }

    /**
     * Uses Gemini to rewrite raw news text into a structured JSON format matching the brand.
     */
    async rewriteNews(rawTitle, rawText) {
        return await this.executeWithRetry(async (genAI) => {
            // gemini-2.0-flash-lite is the correct lightweight model for fast rewrites
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

            const prompt = `
            You are a senior tech journalist for "AI Portal Weekly". 
            Your brand's core rule is "No Hype. Down-to-Reality".
            
            Rewrite the following news announcement. 
            Explain what changed and why it matters to a normal person in plain English.
            Do not use marketing jargon or words like "revolutionary" or "game-changer".

            Raw Title: ${rawTitle}
            Raw Text: ${rawText}

            Respond ONLY with a valid JSON block containing:
            {
                "title": "A clear, factual title without hype",
                "summary": "One sentence summary of the news",
                "content": "The full rewritten article formatted as beautiful HTML using <h2>, <p>, and <ul> tags. Do NOT use markdown. Start directly with the content. Structure: <h2>Real-World Relevance</h2><p>...</p><h2>How it Works</h2><p>...</p>",
                "quickTake": "One honest sentence summarizing the actual impact",
                "hypeLevel": <integer between 1 and 5, rating how overhyped the original announcement was>
            }
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            if (text.startsWith('\`\`\`')) {
                text = text.replace(/^\`\`\`(json)?/, '').replace(/\`\`\`$/, '').trim();
            }

            return JSON.parse(text);
        });
    }

    /**
     * Uses Gemini Search Grounding to find breaking news today.
     */
    async searchLatestNews() {
        return await this.executeWithRetry(async (genAI) => {
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.0-flash-lite",
                tools: [{ googleSearch: {} }] 
            });

            const prompt = `
            Search Google for the 1 most important and impactful artificial intelligence news announcement from the last 24 hours.
            Return ONLY a JSON array containing the news item. Do not use markdown blocks.
            Format:
            [
                {
                    "url": "the original source URL of the news",
                    "rawTitle": "The headline",
                    "rawText": "A 2 paragraph detailed summary of what was announced based on your search"
                }
            ]
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            if (text.startsWith('\`\`\`')) {
                text = text.replace(/^\`\`\`(json)?/, '').replace(/\`\`\`$/, '').trim();
            }

            return JSON.parse(text);
        }).catch(err => {
            console.error("Gemini Search Grounding Final Error:", err.message);
            return [];
        });
    }
}

module.exports = new AIWriterService();
