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

// API Route for Cosmic Wisdom
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
