// ======================================================
// 🌐 API CONFIG — SET YOUR LOCAL/DEPLOYED URL
// ======================================================

export const API_URL = "http://192.168.1.6:3000"; 
// For production: https://your-backend-url.com


// ======================================================
// 📌 TYPE DEFINITIONS
// ======================================================

export type TemplateType = "template1" | "template2" | "template3" | "template4";

export interface ResumeData {
  name: string;
  email: string;
  phone?: string;
  summary: string;

  technical_skills?: string[];
  projects?: any[];
  experience?: any[];
  education?: any[];
  certifications?: string[];

  linkedin?: string;
  github?: string;
}

export interface GenerateResumeResponse {
  success: boolean;
  pdf_url?: string;
  resume_id?: string;
  template?: TemplateType;
  error?: string;
}

export interface ResumeHistoryResponse {
  success: boolean;
  data?: any[];
  error?: string;
}


// ======================================================
// 🔥 generateResume — FULLY TYPED & BACKEND-COMPATIBLE
// ======================================================

export async function generateResume(
  userId: string,
  resumeData: ResumeData,
  template: TemplateType,
  useAI: boolean = false
): Promise<GenerateResumeResponse> {
  try {
    // Validate template on frontend (extra safety)
    const safeTemplate: TemplateType = ["template1", "template2", "template3", "template4"].includes(
      template
    )
      ? template
      : "template1";

    const response = await fetch(`${API_URL}/api/resumes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        resumeData,
        template: safeTemplate,
        useAI,
      }),
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const json = (await response.json().catch(() => null)) as GenerateResumeResponse | null;

    if (!json) {
      return { success: false, error: "Invalid JSON from server" };
    }

    return json;
  } catch (err: any) {
    console.log("❌ generateResume error:", err.message);
    return { success: false, error: "Network error" };
  }
}


// ======================================================
// 📜 getResumeHistory — TYPED & COMPATIBLE
// ======================================================

export async function getResumeHistory(
  userId: string
): Promise<ResumeHistoryResponse> {
  try {
    const response = await fetch(`${API_URL}/api/resumes/history/${userId}`);

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const json = (await response.json().catch(() => null)) as ResumeHistoryResponse | null;

    if (!json) {
      return { success: false, error: "Invalid JSON from server" };
    }

    return json;
  } catch (err: any) {
    console.log("❌ getResumeHistory error:", err.message);
    return { success: false, error: "Network error" };
  }
}
