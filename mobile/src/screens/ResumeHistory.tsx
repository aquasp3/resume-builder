// mobile/src/screens/ResumeHistory.tsx

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getResumeHistory } from "../services/api";

type ResumeItem = {
  id: string;
  pdf_url: string;
  created_at: string;
  template: string;
  user_id?: string;
};

type RootStackParamList = {
  Home: { user: any };
  ResumeHistory: { user: any };
  PDFViewer: { pdfUrl: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "ResumeHistory">;

export default function ResumeHistory({ navigation, route }: Props) {
  const { user } = route.params;

  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);

  const fetchHistory = async () => {
    try {
      const result = await getResumeHistory(user.id);

      if (!result || !result.success) {
        Alert.alert("Error", result?.error || "Unable to load history.");
        setLoading(false);
        return;
      }

      setResumes(result.data || []);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      Alert.alert("Error", "Network error fetching history.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Resume History</Text>

      {/* No History */}
      {resumes.length === 0 ? (
        <Text style={styles.emptyText}>No resumes generated yet.</Text>
      ) : (
        resumes.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.templateText}>Template: {item.template}</Text>
            <Text style={styles.dateText}>
              {new Date(item.created_at).toLocaleString()}
            </Text>

            <TouchableOpacity
              style={styles.viewButton}
              onPress={() =>
                navigation.navigate("PDFViewer", { pdfUrl: item.pdf_url })
              }
            >
              <Text style={styles.viewButtonText}>View PDF</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },

  emptyText: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 18,
    elevation: 3,
  },

  templateText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  dateText: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 14,
  },

  viewButton: {
    marginTop: 14,
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  viewButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },

  backButton: {
    marginTop: 25,
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },

  backButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
});
