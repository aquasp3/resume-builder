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

  const signIn = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Email and password required");
    }

    try {
      const { user, error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) {
        return Alert.alert("Login Error", error.message);
      }

      // Fetch the logged-in user again
      const currentUser = supabase.auth.user();

      navigation.replace("Home", { user: currentUser });
    } catch (err: any) {
      Alert.alert("Unexpected Error", err.message || String(err));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Log in to continue</Text>

        {/* Login Card */}
        <View style={styles.card}>
          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            style={styles.input}
          />

          {/* Login Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={signIn}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Signup Redirect */}
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupLink}>
              Don't have an account?{" "}
              <Text style={styles.signupBold}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ----------------------
// Styles
// ----------------------
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
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
    fontSize: 15,
    backgroundColor: "#F9FAFB",
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
    fontWeight: "700",
    fontSize: 16,
  },
  signupLink: {
    marginTop: 18,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
  },
  signupBold: {
    color: "#6366F1",
    fontWeight: "700",
  },
});
