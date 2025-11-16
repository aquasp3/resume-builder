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
    if (!email || !password) {
      return Alert.alert("Missing Fields", "Email and password are required.");
    }

    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return Alert.alert("Signup Error", error.message);
      }

      Alert.alert("Success 🎉", "Account created! Please log in.");
      navigation.replace("Login");
    } catch (err: any) {
      Alert.alert("Unexpected Error", err.message || String(err));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Create Account ✨</Text>
        <Text style={styles.subtitle}>Join and start building your resume</Text>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
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

          {/* Signup Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={signUp}>
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Login Redirect */}
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
// STYLES
// -------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  inner: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 40,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  label: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: 18,
    fontSize: 15,
  },

  primaryButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  loginLink: {
    marginTop: 18,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
  },

  loginBold: {
    color: "#6366F1",
    fontWeight: "700",
  },
});
