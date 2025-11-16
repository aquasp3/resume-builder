import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "models/gemini-2.5-flash";
const URL = `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${API_KEY}`;

const body = {
  contents: [
    {
      role: "user",
      parts: [{ text: "Write a one-line bio for an AI student named Sathvik." }],
    },
  ],
};

const headers = { "Content-Type": "application/json" };

async function main() {
  try {
    const res = await fetch(URL, { method: "POST", headers, body: JSON.stringify(body) });
    const data = await res.json();
    console.log("🔹 Status:", res.status);
    console.log("✅ Gemini response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();
