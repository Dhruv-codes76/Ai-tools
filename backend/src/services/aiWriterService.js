const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIWriterService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("WARNING: GEMINI_API_KEY is missing. AI Writer will fail.");
        }
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }

    /**
     * Uses Gemini to rewrite raw news text into a structured JSON format matching the brand.
     */
    async rewriteNews(rawTitle, rawText) {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            // Clean markdown blocking if Gemini returns ```json
            if (text.startsWith('\`\`\`')) {
                text = text.replace(/^\`\`\`(json)?/, '').replace(/\`\`\`$/, '').trim();
            }

            return JSON.parse(text);
        } catch (error) {
            console.error("AI Rewriter Error:", error);
            throw error;
        }
    }

    /**
     * Uses Gemini Search Grounding to find breaking news today.
     */
    async searchLatestNews() {
        const model = this.genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            // Enable Google Search grounding
            tools: [{ googleSearch: {} }] 
        });

        const prompt = `
        Search Google for the 2 most important and impactful artificial intelligence news announcements from the last 24 hours.
        Return ONLY a JSON array containing the news items. Do not use markdown blocks.
        Format:
        [
            {
                "url": "the original source URL of the news",
                "rawTitle": "The headline",
                "rawText": "A 2 paragraph detailed summary of what was announced based on your search"
            }
        ]
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            if (text.startsWith('\`\`\`')) {
                text = text.replace(/^\`\`\`(json)?/, '').replace(/\`\`\`$/, '').trim();
            }

            return JSON.parse(text);
        } catch (error) {
            console.error("Gemini Search Grounding Error:", error);
            return [];
        }
    }
}

module.exports = new AIWriterService();
