import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

const MODELS = [
  "models/gemini-2.5-flash",
  "models/gemini-2.0-flash",
]; 

async function callGemini(prompt, model) {
  const URL = `https://generativelanguage.googleapis.com/v1/${model}:generateContent?key=${API_KEY}`;

  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || `HTTP ${res.status}`);
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  } catch (err) {
    console.error("❌ Gemini API Error:", err);
    throw err;
  }
}

export async function enhanceResumeData(rawData) {
  console.log("🚀 Sending data to Gemini:", rawData);

  const prompt = `
You are a professional resume writer. Rewrite this resume content professionally.

Enhance:
- Summary (max 3 lines)
- Experience (convert into achievement-based bullet points)
- Skills (clean, ATS-ready)

Input JSON:
${JSON.stringify(rawData, null, 2)}

Return VALID JSON ONLY in this format:
{
  "summary": "Improved summary",
  "experience": ["Bullet 1", "Bullet 2"],
  "skills": ["Skill 1", "Skill 2"],
  "education": ${JSON.stringify(rawData.education || [])}
}

ONLY return JSON. No explanations.
`;

  for (const model of MODELS) {
    try {
      console.log(`🧠 Trying model: ${model}`);
      const output = await callGemini(prompt, model);
      console.log("📄 Gemini Output:", output);

      // Extract JSON safely
      let parsed;
      try {
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        console.warn("⚠️ Could not parse JSON. Using fallback.");
        parsed = {
          summary: rawData.summary,
          experience: rawData.experience,
          skills: rawData.skills,
          education: rawData.education,
        };
      }

      // Ensure fallback values exist
      return {
        summary: parsed.summary || rawData.summary,
        experience: parsed.experience || rawData.experience,
        skills: parsed.skills || rawData.skills,
        education: parsed.education || rawData.education,
      };

    } catch (err) {
      console.warn(`⚠️ ${model} failed:`, err.message);
      if (model === MODELS[MODELS.length - 1]) {
        console.error("❌ All models failed — returning raw data.");
        return rawData;
      }
    }
  }
}
