// mobile/src/screens/HomeScreen.tsx

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
  const [user, setUser] = useState<any>(null);

  // Load current user from Supabase session
  useEffect(() => {
    const currentUser = supabase.auth.user();
    setUser(currentUser);
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Logout Error", error.message);
    } else {
      navigation.replace("Login");
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* Greeting */}
        <Text style={styles.title}>Welcome 👋</Text>
        <Text style={styles.subtitle}>
          {user.email}, let's build your resume!
        </Text>

        {/* Resume Builder Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resume Builder</Text>
          <Text style={styles.cardText}>
            Create and generate professional AI-enhanced resumes.
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("TemplatePicker", { user })}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Start Building →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ResumeHistory", { user })}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>View Resume History</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// -------------------------
// STYLES
// -------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  inner: {
    flex: 1,
    padding: 22,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 10,
    color: "#111827",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginTop: 10,
    marginBottom: 40,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  cardText: {
    marginTop: 6,
    color: "#6B7280",
    lineHeight: 20,
    fontSize: 15,
  },

  primaryButton: {
    marginTop: 20,
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    marginTop: 12,
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
  },

  logoutButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
  },

  logoutText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "700",
  },
});
