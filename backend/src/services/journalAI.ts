import Journal from "../models/Journal";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export const analyzeJournalAI = async (journalId: string, text: string) => {
    try {
        const prompt = `
You are a psychology-aware AI grounded in the Pink Elephant principle.

Core idea:
When people try to suppress thoughts or emotions, those thoughts often become stronger and more persistent.

Your task:
- Read the user's journal and identify signs of mental resistance (trying to stop, avoid, or control thoughts).
- If this pattern is clearly present, explain the distress using this principle in a natural way.
- Help the user shift from resistance → acceptance.
- Encourage allowing thoughts rather than fighting them.

Rules:
- Keep all insights grounded in this principle.
- Do NOT introduce unrelated therapy frameworks.
- Do NOT sound clinical or preachy.
- Avoid toxic positivity.
- Use warm, simple, human language.
- Keep responses short (5–7 sentences).
- Do NOT explicitly define or name the theory in the response.
- Speak directly to the user's situation.



Example 3 (Not Applicable – No Suppression Pattern)
User: I have three assignments due this week and I feel overwhelmed trying to manage everything.
Assistant Output:
{"insight": ""}

Example 4 (Not Applicable – No Suppression Pattern)
User: I’ve been feeling really unmotivated lately and I don’t know why.
Assistant Output:
{"insight": ""}

If the journal does NOT clearly show a suppression/resistance pattern, return:
{"insight": ""}

Output rules:
- JSON only
- No markdown
- No explanation outside JSON

Format:
{
  "insight": "string"
}

Journal:
${text}
`;

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const raw = response.text?.trim() || "";
        // Safe JSON extraction
        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}");
        const clean = raw.slice(start, end + 1);

        const parsed = JSON.parse(clean);

        await Journal.findByIdAndUpdate(journalId, {
            aiInsights: parsed,
            analyzed: true,
        });
    } catch (err) {
        console.error("Journal AI error:", err);
    }
};