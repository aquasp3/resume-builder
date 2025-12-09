// mobile/src/screens/LoginScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../supabaseClient";

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: { user: any } | undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // LOGIN — Supabase v2
  const signIn = async () => {
    if (!email || !password)
      return Alert.alert("Error", "Email and password are required");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return Alert.alert("Login Error", error.message);

      navigation.replace("Home", { user: data.user });
    } catch (err: any) {
      Alert.alert("Unexpected Error", err.message || String(err));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        
        {/* Titles */}
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>
          Log in to continue building your AI-powered resume
        </Text>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            style={styles.input}
          />

          {/* MAIN BUTTON */}
          <TouchableOpacity style={styles.primaryButton} onPress={signIn}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          {/* SIGNUP LINK */}
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupLink}>
              Don’t have an account?{" "}
              <Text style={styles.signupBold}>Create one</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

// --------------------------------------------------
// STYLES — MATCHING GLOBAL THEME
// --------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  // Headings
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 34,
  },

  // Card container
  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // Labels & Inputs
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151",
    fontSize: 14.5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    fontSize: 15,
    backgroundColor: "#F9FAFB",
    marginBottom: 20,
  },

  // Buttons
  primaryButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },

  // Signup link
  signupLink: {
    marginTop: 18,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
  },
  signupBold: {
    color: "#4F46E5",
    fontWeight: "700",
  },
});
