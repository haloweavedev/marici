const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

module.exports = async (req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('[ritual-guide] Request received:', JSON.stringify(req.body));

    try {
        const { phase, sign, illumination, intention } = req.body;

        if (!phase || !sign) {
            console.log('[ritual-guide] Error: Missing phase or sign');
            return res.status(400).json({ error: "Moon phase and zodiac sign are required." });
        }

        console.log('[ritual-guide] Checking GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Present (length: ' + process.env.GROQ_API_KEY.length + ')' : 'MISSING');

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

        console.log('[ritual-guide] Calling Groq API...');

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.8,
            max_tokens: 500
        });

        console.log('[ritual-guide] Groq API response received');

        const content = chatCompletion.choices[0]?.message?.content || "";
        console.log('[ritual-guide] Raw content:', content.substring(0, 200) + '...');

        // Parse JSON from response
        let parsed;
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
            console.log('[ritual-guide] JSON parsed successfully');
        } catch (parseError) {
            console.log('[ritual-guide] JSON parse error, using fallback:', parseError.message);
            parsed = {
                insight: "The lunar energies align with your path. Trust the wisdom of this celestial moment.",
                rituals: [
                    { icon: "🕯️", text: "Light a candle and set your intention" },
                    { icon: "🌙", text: "Spend time in quiet reflection under the moon" },
                    { icon: "📓", text: "Journal your thoughts and desires" }
                ]
            };
        }

        console.log('[ritual-guide] Sending response');
        return res.status(200).json(parsed);

    } catch (error) {
        console.error('[ritual-guide] ERROR:', error.message);
        console.error('[ritual-guide] Stack:', error.stack);
        return res.status(500).json({ error: "Failed to consult the lunar realm.", details: error.message });
    }
};
