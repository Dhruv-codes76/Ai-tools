const aiWriterService = require('../services/aiWriterService');

const optimizeSEO = async (req, res) => {
    try {
        const { content, title, type, focusKeyphrase } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        const seoData = await aiWriterService.executeWithRetry(async (genAI, activeModel) => {
            const model = genAI.getGenerativeModel({ model: activeModel });

            const prompt = `
            You are a Senior SEO Specialist for "AI Portal Weekly". 
            Analyze the following ${type || 'article'} content and provide a perfect SEO metadata set.
            
            SEO AUDIT RULES (STRICT):
            1. **Keyphrase**: Use "${focusKeyphrase || 'Identify a 2-4 word primary keyphrase'}" as the focusKeyphrase.
            2. **Title**: Generate an "seoMetaTitle" (Strictly 45-60 chars) including the keyphrase.
            3. **Slug**: Generate a clean "slug" (max 60 chars) starting with the keyphrase.
            4. **Meta Description**: Generate an "seoMetaDescription" (Strictly 140-155 characters). NEVER exceed 155.
            5. **Alt Text**: Generate "featuredImageAlt" including the keyphrase.
            6. **Readability Metrics**: Evaluate Passive Voice (<10%) and Transitions (>25%).

            Content Overview: "${content.substring(0, 3000)}"
            Published Title: "${title || ''}"

            Respond ONLY with this JSON structure:
            {
                "focusKeyphrase": "the target keyword",
                "seoMetaTitle": "45-60 chars",
                "slug": "url-slug-here",
                "seoMetaDescription": "140-155 chars",
                "summary": "1-2 sentence lead summary (max 180 chars)",
                "featuredImageAlt": "Alt text with keyword",
                "improvementTips": ["Tip 1", "Tip 2"],
                "healthMetrics": {
                    "hasShortParagraphs": boolean,
                    "variedSentenceStarts": boolean,
                    "passiveVoicePercentage": number,
                    "transitionsPercentage": number
                }
            }
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            // Robust JSON extraction
            text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

            // Find the first { and last } to ensure pure JSON
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                text = text.substring(firstBrace, lastBrace + 1);
            }

            return JSON.parse(text);
        }, 'gemini-flash-lite-latest');

        // Backend enforcement to guarantee description is under 160 chars for UI safety
        if (seoData.seoMetaDescription && seoData.seoMetaDescription.length > 160) {
            seoData.seoMetaDescription = seoData.seoMetaDescription.substring(0, 157) + "...";
        }

        res.json(seoData);
    } catch (error) {
        console.error("SEO Optimization Error:", error.message);
        res.status(500).json({ error: "Failed to reach the Magic engine. Try again in a moment." });
    }
};

module.exports = {
    optimizeSEO
};
