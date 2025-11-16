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
    <ScrollView style={styles.container}>
      {/* Preview Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Your Resume Is Ready 🎉</Text>

        <Text style={styles.text}>
          Your resume has been successfully generated using the selected
          template. You can now view, download, or share your PDF.
        </Text>
      </View>

      {/* View PDF */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PDFViewer", { pdfUrl })}
      >
        <Text style={styles.buttonText}>View PDF →</Text>
      </TouchableOpacity>

      {/* Back */}
      <TouchableOpacity
        style={styles.outlineButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.outlineText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// -------------------------
// Styles
// -------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    padding: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  text: {
    fontSize: 16,
    color: "#4B5563",
  },

  button: {
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  outlineButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },

  outlineText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
  },
});
