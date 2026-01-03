require('dotenv').config();
const express = require('express');
const path = require('path');
const Groq = require('groq-sdk');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Groq SDK
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Route for Lunar Ritual Guide
app.post('/api/ritual-guide', async (req, res) => {
    try {
        const { phase, sign, illumination, intention } = req.body;

        if (!phase || !sign) {
            return res.status(400).json({ error: "Moon phase and zodiac sign are required." });
        }

        const prompt = `You are a wise lunar astrologer and ritual guide. The current moon is a ${phase} at ${illumination}% illumination, positioned in ${sign}.

The user's intention is: "${intention}"

Respond with ONLY valid JSON in this exact format (no markdown, no code blocks):
{
    "insight": "A profound 2-sentence mystical insight connecting the current lunar energy to their intention. Be poetic but practical.",
    "rituals": [
        {"icon": "🕯️", "text": "First ritual suggestion (specific action)"},
        {"icon": "🌿", "text": "Second ritual suggestion (specific action)"},
        {"icon": "📝", "text": "Third ritual suggestion (specific action)"}
    ]
}

Choose appropriate emoji icons for each ritual. Make rituals specific and actionable for this exact moon phase and intention.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.8,
            max_tokens: 500
        });

        const content = chatCompletion.choices[0]?.message?.content || "";

        // Parse JSON from response
        let parsed;
        try {
            // Try to extract JSON if wrapped in code blocks
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
        } catch (parseError) {
            // Fallback response
            parsed = {
                insight: "The lunar energies align with your path. Trust the wisdom of this celestial moment.",
                rituals: [
                    { icon: "🕯️", text: "Light a candle and set your intention" },
                    { icon: "🌙", text: "Spend time in quiet reflection under the moon" },
                    { icon: "📓", text: "Journal your thoughts and desires" }
                ]
            };
        }

        res.json(parsed);

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ error: "Failed to consult the lunar realm." });
    }
});

// Legacy API Route for Cosmic Wisdom (keeping for backwards compatibility)
app.post('/api/wisdom', async (req, res) => {
    try {
        const { phase, sign } = req.body;

        if (!phase || !sign) {
            return res.status(400).json({ error: "Moon phase and zodiac sign are required." });
        }

        const prompt = `
            Role: You are a mystical astrologer.
            Context: The current moon phase is ${phase} and the moon is in the sign of ${sign}.
            Task: Provide a short, profound, and mystical insight or advice for this specific celestial combination.
            Constraint: Keep it under 2 sentences. Be poetic but clear. Do not use hashtags.
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 150
        });

        const wisdom = chatCompletion.choices[0]?.message?.content || "The stars are silent.";

        res.json({ wisdom });

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ error: "Failed to consult the ether." });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
