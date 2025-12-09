// mobile/src/screens/SignupScreen.tsx

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

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    if (!email || !password)
      return Alert.alert("Missing Fields", "Email and password are required.");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return Alert.alert("Signup Error", error.message);

      Alert.alert(
        "Success 🎉",
        "Your account has been created! You may need to verify via email."
      );

      navigation.replace("Login");
    } catch (err: any) {
      Alert.alert("Unexpected Error", err.message || String(err));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        
        {/* Title */}
        <Text style={styles.title}>Create Your Account ✨</Text>
        <Text style={styles.subtitle}>
          Join us and start building stunning resumes
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
            placeholder="Create a password"
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={signUp}>
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace("Login")}>
            <Text style={styles.loginLink}>
              Already have an account?{" "}
              <Text style={styles.loginBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

// -------------------------
// STYLES — Unified Theme
// -------------------------
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

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    color: "#111827",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 34,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  label: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    fontSize: 14.5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 18,
  },

  primaryButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 17,
  },

  loginLink: {
    marginTop: 20,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
  },
  loginBold: {
    color: "#4F46E5",
    fontWeight: "700",
  },
});
