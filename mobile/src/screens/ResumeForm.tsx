// mobile/src/screens/ResumeForm.tsx

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
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { generateResume, TemplateType } from "../services/api";

type RootStackParamList = {
  TemplatePicker: undefined;
  ResumeForm: { user: any; template: string };
  ResumePreview: { pdfUrl: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "ResumeForm">;

export default function ResumeForm({ navigation, route }: Props) {
  const { user, template } = route.params;

  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    experience: "",
    education: "",
    projects: "",
  });

  const update = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleGenerate = async () => {
    setLoading(true);

    // =============================
    // SAFE TEMPLATE VALIDATION
    // =============================
    const safeTemplate = (
      ["template1", "template2", "template3", "template4"].includes(template)
        ? template
        : "template1"
    ) as TemplateType;

    // =============================
    // BUILD BACKEND-COMPATIBLE DATA
    // =============================
    const resumeData = {
      name: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      summary: form.summary.trim(),

      // technical_skills (backend required name)
      technical_skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      experience: form.experience
        .split("\n")
        .map((line) => ({
          role: "",
          duration: "",
          company: "",
          points: [line.trim()],
        }))
        .filter((e) => e.points[0]),

      education: form.education
        .split("\n")
        .map((ed) => {
          const [degree, college, year] = ed.split(",").map((t) => t.trim());
          return { degree, college, year };
        })
        .filter((e) => e.degree),

      projects: form.projects
        .split("\n")
        .map((p) => ({
          title: p.trim(),
          duration: "",
          subtitle: "",
          tech: "",
          points: [],
        }))
        .filter((p) => p.title),
    };

    const result = await generateResume(user.id, resumeData, safeTemplate, useAI);

    setLoading(false);

    if (result.success && result.pdf_url) {
      navigation.navigate("ResumePreview", {
        pdfUrl: result.pdf_url,
      });
    } else {
      Alert.alert("Error", result.error || "Unknown error");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* PERSONAL DETAILS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Details</Text>

        <TextInput
          placeholder="Full Name"
          value={form.fullName}
          onChangeText={(t) => update("fullName", t)}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(t) => update("email", t)}
          style={styles.input}
        />

        <TextInput
          placeholder="Phone"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(t) => update("phone", t)}
          style={styles.input}
        />
      </View>

      {/* SUMMARY */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Professional Summary</Text>
        <TextInput
          placeholder="Write a brief summary..."
          multiline
          value={form.summary}
          onChangeText={(t) => update("summary", t)}
          style={[styles.input, styles.multiline]}
        />
      </View>

      {/* AI ENHANCEMENT */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Enhance with AI?</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 16, marginRight: 10 }}>Use AI Enhancement</Text>
          <Switch value={useAI} onValueChange={setUseAI} />
        </View>
      </View>

      {/* SKILLS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Skills</Text>
        <TextInput
          placeholder="Comma separated (React, Node, Python)"
          value={form.skills}
          onChangeText={(t) => update("skills", t)}
          style={styles.input}
        />
      </View>

      {/* EXPERIENCE */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Experience</Text>
        <TextInput
          placeholder={"Each line = one achievement\nExample:\n• Built AI resume generator"}
          multiline
          value={form.experience}
          onChangeText={(t) => update("experience", t)}
          style={[styles.input, styles.multiline]}
        />
      </View>

      {/* EDUCATION */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Education</Text>
        <TextInput
          placeholder={"degree, college, year\nExample:\nB.Tech CSE, IIT Delhi, 2025"}
          multiline
          value={form.education}
          onChangeText={(t) => update("education", t)}
          style={[styles.input, styles.multiline]}
        />
      </View>

      {/* PROJECTS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Projects</Text>
        <TextInput
          placeholder={"Each line = one project\nExample:\nAI Resume Builder App"}
          multiline
          value={form.projects}
          onChangeText={(t) => update("projects", t)}
          style={[styles.input, styles.multiline]}
        />
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        onPress={handleGenerate}
        disabled={loading}
        style={[styles.button, loading && { opacity: 0.6 }]}
      >
        <Text style={styles.buttonText}>
          {loading ? "Generating..." : "Generate Resume →"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
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
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  multiline: {
    height: 110,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});
