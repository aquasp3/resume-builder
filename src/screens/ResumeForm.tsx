// ResumeForm.tsx — Production-ready, Expo-safe, Backend-compatible
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { generateResume, TemplateType, enhanceSection } from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "ResumeForm">;

/* =========================
   Initial form & types
   ========================= */
const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  summary: "",
  skills: "",
  experience: "",
  education: "",
  projects: "",
  certifications: "",
};

type FormKeys = keyof typeof initialForm;

type AISectionKeys = "summary" | "skills" | "experience" | "education" | "projects" | "certifications";

type AISectionState = {
  enabled: boolean;
  enhancing: boolean;
  result: string | string[]; // preview-friendly text lines
};

type AIState = Record<AISectionKeys, AISectionState>;

/* =========================
   Small presentational preview
   ========================= */
const PreviewCard = ({ title, loading, children }: any) => (
  <View style={styles.previewCard}>
    <Text style={styles.previewTitle}>✨ {title}</Text>
    {loading ? <ActivityIndicator size="small" color="#4F46E5" /> : <View style={{ marginTop: 8 }}>{children}</View>}
  </View>
);

/* =========================
   Helpers: convert AI outputs to readable strings
   - Accepts: string | [{...}] | [string]
   - Returns: string[] (readable lines)
   ========================= */
function toReadableArray(value: any, section: AISectionKeys): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item !== null) {
          // Experience object
          if (section === "experience") {
            const role = item.role || item.title || "";
            const comp = item.company ? ` at ${item.company}` : "";
            const dur = item.duration ? ` - ${item.duration}` : "";
            return (role || comp || dur) ? `${role}${comp}${dur}` : JSON.stringify(item);
          }
          // Project object
          if (section === "projects") {
            const title = item.title || item.name || "";
            const tech = item.tech || item.stack || "";
            return tech ? `${title} - ${tech}` : title || JSON.stringify(item);
          }
          // Education
          if (section === "education") {
            const degree = item.degree || item.text || "";
            const college = item.college ? `, ${item.college}` : "";
            const year = item.year ? ` (${item.year})` : "";
            return `${degree}${college}${year}`;
          }
          // Certifications / fallback
          if (item.text) return item.text;
          if (item.name) return item.name;
          return JSON.stringify(item);
        }
        return String(item);
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    // split into lines if multi-line
    return value.split("\n").map((l) => l.trim()).filter(Boolean);
  }

  // fallback
  return [String(value)];
}

/* =========================
   Parse functions — produce canonical objects expected by backend/pdfgen
   - Experience: [{ role, company, duration, location, points: [{text}] }]
   - Projects: [{ title, duration, subtitle, tech, points: [{text}] }]
   - Education: [{ degree, college, year }]
   - Certifications: array of strings
   ========================= */
function parseEducation(text: string) {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(",").map((p) => p.trim()).filter(Boolean);
      return {
        degree: parts[0] || line,
        college: parts[1] || "",
        year: parts.slice(2).join(", ") || "",
      };
    });
}

function parseExperience(text: string) {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      // Try to parse "Role at Company - Duration"
      const atSplit = line.split(" at ");
      let role = "";
      let company = "";
      let duration = "";
      if (atSplit.length > 1) {
        role = atSplit[0].trim();
        const rest = atSplit.slice(1).join(" at ").trim();
        const dashIdx = rest.indexOf(" - ");
        if (dashIdx !== -1) {
          company = rest.slice(0, dashIdx).trim();
          duration = rest.slice(dashIdx + 3).trim();
        } else {
          company = rest;
        }
      } else {
        // fallback: try "Role - Duration" or "Role, Company, Duration"
        if (line.includes(" - ")) {
          const [r, d] = line.split(" - ").map((s) => s.trim());
          role = r;
          duration = d;
        } else if (line.includes(",")) {
          const parts = line.split(",").map((p) => p.trim());
          role = parts[0] || "";
          company = parts[1] || "";
          duration = parts.slice(2).join(", ") || "";
        } else {
          // fallback: put entire line as a point
          return {
            role: "",
            company: "",
            duration: "",
            location: "",
            points: [{ text: line }],
          };
        }
      }

      return {
        role: role || "",
        company: company || "",
        duration: duration || "",
        location: "",
        points: [{ text: "" }], // empty point placeholder — backend/pdfgenerator will show safe block
      };
    });
}

function parseProjects(text: string) {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      // Expect "Title - Tech" or "Title - Tech - Duration"
      const parts = line.split(" - ").map((p) => p.trim());
      return {
        title: parts[0] || line,
        duration: parts.length >= 3 ? parts[2] : "",
        subtitle: "",
        tech: parts[1] || "",
        points: [], // projects points left empty (user can edit)
      };
    });
}

/* =========================
   Convert arrays to form strings
   ========================= */
const arrayToMultiline = (arr: string[]) => (arr || []).join("\n");
const arrayToComma = (arr: string[]) => (arr || []).join(", ");

/* =========================
   Component
   ========================= */
export default function ResumeForm({ navigation, route }: Props) {
  const { user, template } = route.params;

  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [form, setForm] = useState({ ...initialForm });

  const [aiState, setAiState] = useState<AIState>({
    summary: { enabled: false, enhancing: false, result: "" },
    skills: { enabled: false, enhancing: false, result: [] },
    experience: { enabled: false, enhancing: false, result: [] },
    education: { enabled: false, enhancing: false, result: [] },
    projects: { enabled: false, enhancing: false, result: [] },
    certifications: { enabled: false, enhancing: false, result: [] },
  });

  const updateForm = (key: FormKeys, value: string) => setForm((p) => ({ ...p, [key]: value }));

  /* =========================
     Toggle & call enhancer for a section
     - Shows readable preview
     - Stores preview as readable lines in aiState.result
     ========================= */
  const handleToggleEnhance = async (section: AISectionKeys) => {
    const current = aiState[section];
    const enable = !current.enabled;

    // optimistic update
    setAiState((p) => ({ ...p, [section]: { ...p[section], enabled: enable, enhancing: enable } }));

    if (!enable) return;

    const inputText = (form as any)[section] || "";

    try {
      const resp = await enhanceSection(section, inputText);
      if (!resp || !resp.success) {
        setAiState((p) => ({ ...p, [section]: { ...p[section], enhancing: false } }));
        Alert.alert("AI Error", resp?.error || "Enhancement failed");
        return;
      }

      const enhanced = resp.enhanced || {};
      const value = enhanced[section] ?? (section === "summary" ? enhanced.summary : null);

      const readable = toReadableArray(value, section);
      // if summary and readable is empty, also try fallback fields
      if (section === "summary" && readable.length === 0 && typeof enhanced.summary === "string") {
        // ensure summary text if AI returned summary property
        readable.push(enhanced.summary);
      }

      setAiState((p) => ({ ...p, [section]: { ...p[section], result: readable, enhancing: false } }));
    } catch (err: any) {
      setAiState((p) => ({ ...p, [section]: { ...p[section], enhancing: false } }));
      Alert.alert("AI Error", err?.message || "Failed to enhance");
    }
  };

  /* =========================
     Apply previewed AI results to the form fields
     - Converts readable lines back to form-friendly multiline strings
     - For summary -> plain text
     - For skills -> comma string
     - For others -> multiline lines which parse functions will convert to objects on submit
     ========================= */
  const applyEnhanced = (section: AISectionKeys) => {
    const state = aiState[section];
    if (!state.enabled) return;

    if (section === "summary") {
      const text = Array.isArray(state.result) ? (state.result as string[]).join("\n") : (state.result as string);
      updateForm("summary", text);
    } else if (section === "skills") {
      const arr = Array.isArray(state.result) ? (state.result as string[]) : String(state.result || "").split("\n");
      updateForm("skills", arrayToComma(arr));
    } else {
      const arr = Array.isArray(state.result) ? (state.result as string[]) : String(state.result || "").split("\n");
      updateForm(section as FormKeys, arrayToMultiline(arr));
    }

    // disable preview after applying
    setAiState((p) => ({ ...p, [section]: { ...p[section], enabled: false } }));
  };

  /* =========================
     Generate resume (final submit)
     - parse* functions convert form strings into canonical objects
     ========================= */
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const safeTemplate = (["template1", "template2", "template3", "template4"].includes(template)
        ? template
        : "template1") as TemplateType;

      const resumeData = {
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        linkedin: form.linkedin.trim(),
        github: form.github.trim(),
        summary: form.summary.trim(),
        technical_skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience: parseExperience(form.experience), // returns objects with points array
        education: parseEducation(form.education),
        projects: parseProjects(form.projects),
        certifications: form.certifications
          .split("\n")
          .map((c) => c.trim())
          .filter(Boolean),
      };

      const res = await generateResume(user.id, resumeData, safeTemplate, useAI);
      setLoading(false);

      if (res.success && res.pdf_url) {
        navigation.navigate("ResumePreview", { pdfUrl: res.pdf_url });
      } else {
        Alert.alert("Error", res.error || "Unknown error");
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert("Error", err?.message || "Failed to generate resume");
    }
  };

  /* =========================
     Render Section helper
     ========================= */
  const RenderSection = (label: string, key: FormKeys, multiline = true) => {
    const sectionKey = key as AISectionKeys;
    const isAIKey = sectionKey in aiState;
    const aiEnabled = isAIKey ? aiState[sectionKey].enabled : false;
    const aiEnhancing = isAIKey ? aiState[sectionKey].enhancing : false;
    const aiResult = isAIKey ? aiState[sectionKey].result : null;

    return (
      <View style={styles.card} key={key}>
        <Text style={styles.cardTitle}>{label}</Text>

        <TextInput
          placeholder={key === "skills" ? "React, Node, Python" : "Enter details (each line is one item)"}
          multiline={multiline}
          style={[styles.input, multiline && styles.multiline]}
          value={(form as any)[key]}
          onChangeText={(t) => updateForm(key, t)}
        />

        {isAIKey && (
          <View style={styles.toggleRow}>
            <Text style={styles.smallText}>AI Enhance {label}</Text>
            <Switch
              value={aiEnabled}
              onValueChange={() => handleToggleEnhance(sectionKey)}
            />
          </View>
        )}

        {isAIKey && aiEnabled && (
          <PreviewCard title={`AI Enhanced ${label}`} loading={aiEnhancing}>
            {Array.isArray(aiResult)
              ? (aiResult as string[]).map((t, i) => (
                  <Text key={i} style={styles.previewText}>• {t}</Text>
                ))
              : <Text style={styles.previewText}>{String(aiResult)}</Text>
            }

            <TouchableOpacity style={styles.applyButton} onPress={() => applyEnhanced(sectionKey)}>
              <Text style={styles.applyButtonText}>Use Enhanced {label}</Text>
            </TouchableOpacity>
          </PreviewCard>
        )}
      </View>
    );
  };

  /* =========================
     Render JSX
     ========================= */
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Details</Text>

        <TextInput placeholder="Full Name" style={styles.input} value={form.fullName} onChangeText={(t) => updateForm("fullName", t)} />
        <TextInput placeholder="Email" keyboardType="email-address" style={styles.input} value={form.email} onChangeText={(t) => updateForm("email", t)} />
        <TextInput placeholder="Phone" keyboardType="phone-pad" style={styles.input} value={form.phone} onChangeText={(t) => updateForm("phone", t)} />
        <TextInput placeholder="LinkedIn URL" style={styles.input} value={form.linkedin} onChangeText={(t) => updateForm("linkedin", t)} />
        <TextInput placeholder="GitHub URL" style={styles.input} value={form.github} onChangeText={(t) => updateForm("github", t)} />
      </View>

      {RenderSection("Professional Summary", "summary")}
      {RenderSection("Skills", "skills", false)}
      {RenderSection("Experience", "experience")}
      {RenderSection("Education", "education")}
      {RenderSection("Projects", "projects")}
      {RenderSection("Certifications", "certifications")}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Final Resume AI Enhancement</Text>

        <View style={styles.aiRow}>
          <Text style={styles.aiText}>Run full AI enhancement on final generate</Text>
          <Switch value={useAI} onValueChange={setUseAI} />
        </View>

        <Text style={styles.aiNote}>Useful if you skipped applying preview sections.</Text>
      </View>

      <TouchableOpacity
        style={[styles.generateBtn, loading && { opacity: 0.7 }]}
        disabled={loading}
        onPress={handleGenerate}
      >
        <Text style={styles.generateBtnText}>{loading ? "Generating Resume..." : "Generate Resume →"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* =========================
   Styles
   ========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    padding: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 15,
    marginBottom: 12,
  },

  multiline: {
    height: 130,
    textAlignVertical: "top",
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  smallText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },

  previewCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },

  previewTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4338CA",
  },

  previewText: {
    marginTop: 8,
    color: "#0F172A",
    fontSize: 14,
    lineHeight: 20,
  },

  applyButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: "#4F46E5",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  applyButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  aiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  aiText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
  },

  aiNote: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },

  generateBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 40,
  },

  generateBtnText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});
