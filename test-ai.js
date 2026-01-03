// Test script to verify AI integration
// Run: node test-ai.js

const testRitualGuide = async () => {
    const testCases = [
        {
            phase: "Full Moon",
            sign: "Cancer",
            illumination: 100,
            intention: "I want to release old emotional patterns"
        },
        {
            phase: "New Moon",
            sign: "Capricorn",
            illumination: 0,
            intention: "I want to set intentions for career growth"
        },
        {
            phase: "Waxing Crescent",
            sign: "Aries",
            illumination: 25,
            intention: "general guidance"
        }
    ];

    console.log("🌙 Testing AI Ritual Guide Integration\n");
    console.log("=".repeat(50));

    for (const testCase of testCases) {
        console.log(`\n📍 Test: ${testCase.phase} in ${testCase.sign}`);
        console.log(`   Intention: "${testCase.intention}"`);
        console.log("-".repeat(50));

        try {
            const response = await fetch("http://localhost:3000/api/ritual-guide", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(testCase)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            console.log("\n✅ Response received:");
            console.log(`\n   Insight: "${data.insight}"`);
            console.log("\n   Rituals:");
            if (data.rituals && Array.isArray(data.rituals)) {
                data.rituals.forEach((r, i) => {
                    console.log(`   ${i + 1}. ${r.icon} ${r.text}`);
                });
            }

        } catch (error) {
            console.log(`\n❌ Error: ${error.message}`);
        }

        console.log("\n" + "=".repeat(50));
    }
};

// Check if server is running first
const checkServer = async () => {
    try {
        const response = await fetch("http://localhost:3000");
        return response.ok;
    } catch {
        return false;
    }
};

const main = async () => {
    const serverRunning = await checkServer();

    if (!serverRunning) {
        console.log("❌ Server not running. Start with: npm start");
        process.exit(1);
    }

    await testRitualGuide();
    console.log("\n✨ Tests complete!\n");
};

main();
