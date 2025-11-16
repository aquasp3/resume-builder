import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  try {
    // ✅ Use your available model
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const result = await model.generateContent([
      {
        role: "user",
        parts: [{ text: "Write a one-line bio for an AI student named Sathvik." }],
      },
    ]);

    console.log("✅ Gemini response:", result.response.text());
  } catch (error) {
    console.error("❌ Gemini error:", error);
  }
}

testGemini();
