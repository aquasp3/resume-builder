// mobile/src/screens/ResumeHistory.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getResumeHistory } from "../services/api";
import RNFS from "react-native-fs";
import Share from "react-native-share";

type ResumeItem = {
  id: string;
  pdf_url: string;
  created_at: string;
  template: string;
};

type RootStackParamList = {
  ResumeHistory: { user: any };
  PDFViewer: { pdfUrl: string };
  Home: { user: any };
};

type Props = NativeStackScreenProps<RootStackParamList, "ResumeHistory">;

export default function ResumeHistory({ navigation, route }: Props) {
  const { user } = route.params;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);

  // -----------------------------
  // Fetch resume history
  // -----------------------------
  const fetchHistory = useCallback(async () => {
    try {
      const result = await getResumeHistory(user.id);

      if (Array.isArray(result)) setResumes(result);
      else setResumes([]);
    } catch {
      Alert.alert("Error", "Failed to fetch resume history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // -----------------------------
  // SHARE PDF (fixed working version)
  // -----------------------------
  const handleShare = async (pdfUrl: string) => {
    try {
      const fileName = pdfUrl.split("/").pop() || "resume.pdf";
      const localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      const downloadResult = await RNFS.downloadFile({
        fromUrl: pdfUrl,
        toFile: localPath,
        cacheable: true,
      }).promise;

      const exists = await RNFS.exists(localPath);
      if (!exists) {
        Alert.alert("Error", "Failed to download PDF for sharing.");
        return;
      }

      await Share.open({
        title: "Share Resume",
        url: "file://" + localPath,
        type: "application/pdf",
        failOnCancel: false,
      });
    } catch (err) {
      console.log("Share error:", err);
      Alert.alert("Error", "Could not share PDF.");
    }
  };

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading your resumes...</Text>
      </View>
    );
  }

  // -----------------------------
  // UI RENDER
  // -----------------------------
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchHistory();
          }}
        />
      }
    >
      <Text style={styles.title}>Your Resume History</Text>

      {resumes.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>No resumes found</Text>
          <Text style={styles.emptySub}>Generate a new one from the Home screen.</Text>
        </View>
      ) : (
        resumes.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.templateTag}>
              <Text style={styles.templateTagText}>{item.template}</Text>
            </View>

            <Text style={styles.dateText}>
              Created on {new Date(item.created_at).toLocaleString()}
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                navigation.navigate("PDFViewer", { pdfUrl: item.pdf_url })
              }
            >
              <Text style={styles.primaryButtonText}>View PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => handleShare(item.pdf_url)}
            >
              <Text style={styles.secondaryButtonText}>Share PDF</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// -----------------------------
// STYLES — Theme Consistent
// -----------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    padding: 20,
  },

  // Loading
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 15,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 22,
    color: "#111827",
  },

  // Empty State
  emptyWrapper: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "700",
  },
  emptySub: {
    marginTop: 6,
    fontSize: 14,
    color: "#9CA3AF",
  },

  // Resume Card
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  // Template Tag
  templateTag: {
    backgroundColor: "#EEF2FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  templateTagText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4F46E5",
    textTransform: "capitalize",
  },

  dateText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 14,
  },

  // Primary Button
  primaryButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  // Secondary Button
  secondaryButton: {
    backgroundColor: "#E0E7FF",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4F46E5",
    fontSize: 16,
    fontWeight: "700",
  },

  // Back Button
  backButton: {
    backgroundColor: "#E5E7EB",
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  backButtonText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "700",
  },
});
