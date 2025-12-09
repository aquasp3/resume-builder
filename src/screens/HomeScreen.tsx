import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../supabaseClient";

type RootStackParamList = {
  Home: { user: any } | undefined;
  TemplatePicker: { user: any };
  ResumeHistory: { user: any };
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation, route }: Props) {
  const [user, setUser] = useState<any>(route.params?.user || null);

  // Load User
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  // Logout
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Logout Error", error.message);
    else navigation.replace("Login");
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Getting things ready...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome Back 👋</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* MAIN CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Build Your Resume</Text>
          <Text style={styles.cardDesc}>
            Design clean, modern and AI-crafted resumes with ease.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("TemplatePicker", { user })}
          >
            <Text style={styles.primaryButtonText}>
              Create a New Resume →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("ResumeHistory", { user })}
          >
            <Text style={styles.secondaryButtonText}>
              My Saved Resumes
            </Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB" },
  inner: { flex: 1, padding: 22 },

  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },

  // Header
  header: { marginBottom: 28 },
  greeting: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },
  userEmail: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 15,
  },

  // Card
  card: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 20,
    marginBottom: 40,

    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: { fontSize: 24, fontWeight: "700", color: "#111827" },
  cardDesc: {
    marginTop: 8,
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 20,
  },

  // Buttons
  primaryButton: {
    backgroundColor: "#4F46E5",
    marginTop: 25,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },

  secondaryButton: {
    backgroundColor: "#EEF1F5",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  secondaryButtonText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "600",
  },

  // Logout
  logoutButton: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 15,
  },
});
