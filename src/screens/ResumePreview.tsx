// mobile/src/screens/ResumePreview.tsx

import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  ResumePreview: { pdfUrl: string };
  PDFViewer: { pdfUrl: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "ResumePreview">;

export default function ResumePreview({ route, navigation }: Props) {
  const { pdfUrl } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Success Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Your Resume Is Ready 🎉</Text>

        <Text style={styles.subtitle}>
          Your resume has been successfully generated using your selected template.
        </Text>

        <Text style={styles.description}>
          You can now open, download or share your PDF anytime.
        </Text>
      </View>

      {/* View PDF */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("PDFViewer", { pdfUrl })}
      >
        <Text style={styles.primaryText}>Open Resume PDF →</Text>
      </TouchableOpacity>

      {/* Back */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.secondaryText}>← Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// -------------------------
// Styles — Perfect Theme Match
// -------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    padding: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 20,
    marginBottom: 28,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 6,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
  },

  primaryButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 14,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  secondaryButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  secondaryText: {
    color: "#1F2937",
    fontSize: 15,
    fontWeight: "700",
  },
});
