// mobile/src/services/api.ts — Cleaned, Expo-Safe, Logic Preserved
// -----------------------------------------------------------------------------
// IMPORTANT:
// No node libraries, no backend imports, no unsupported features.
// Only uses fetch + Expo-safe APIs.
// -----------------------------------------------------------------------------

import { API_URL } from "../config";

export type TemplateType =
  | "template1"
  | "template2"
  | "template3"
  | "template4";

// ----------------------------
// Helper: Parse API JSON Error
// ----------------------------
async function parseApiError(response: Response): Promise<string> {
  try {
    const errJson = await response.json();
    return errJson?.error || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

// ----------------------------
// 🤖 enhanceSection — AI Enhancement for Each Section
// ----------------------------
export async function enhanceSection(
  section:
    | "summary"
    | "skills"
    | "experience"
    | "projects"
    | "education"
    | "certifications",
  text: string
): Promise<{ success: boolean; enhanced?: any; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/resumes/enhance-section`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ section, text }),
    });

    if (!response.ok) {
      return { success: false, error: await parseApiError(response) };
    }

    const json = await response.json().catch(() => null);
    if (!json || typeof json !== "object") {
      return { success: false, error: "Invalid JSON from server" };
    }

    return {
      success: true,
      enhanced: json.enhanced || text,
    };
  } catch (err: any) {
    console.log("❌ enhanceSection error:", err?.message || err);
    return { success: false, error: err?.message || "Network error" };
  }
}

// ----------------------------
// 📄 generateResume — Save + AI-enhance + PDF Export
// ----------------------------
export async function generateResume(
  user_id: string,
  resumeData: any,
  template: TemplateType,
  useAI: boolean
): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(`${API_URL}/api/resumes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user_id,
        resumeData,
        template,
        useAI,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    const json = await response.json().catch(() => null);
    if (!json || typeof json !== "object") {
      throw new Error("Invalid JSON from server");
    }

    return json;
  } catch (err: any) {
    console.error("❌ generateResume error:", err?.message || err);
    throw new Error(err?.message || "Network error");
  }
}

// ----------------------------
// 📜 getResumeHistory — Fetch all saved resumes
// ----------------------------
export async function getResumeHistory(userId: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/api/resumes/history/${userId}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("❌ History API error", await parseApiError(response));
      return [];
    }

    const json = await response.json().catch(() => null);

    if (!json || typeof json !== "object") {
      return [];
    }

    return json.data || [];
  } catch (err: any) {
    console.error("❌ getResumeHistory error:", err?.message || err);
    return [];
  }
}