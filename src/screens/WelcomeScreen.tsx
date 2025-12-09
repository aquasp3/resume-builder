import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type WelcomeProps = NativeStackScreenProps<RootStackParamList, "Welcome"> & {
  onContinue: () => void;
};

const LOGO = require("../assets/images/ufolio_logo.jpg");

const WelcomeScreen: React.FC<WelcomeProps> = ({ onContinue }) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      
      {/* HERO SECTION */}
      <Animated.View
        style={[
          styles.hero,
          { opacity: fade, transform: [{ translateY: slide }] },
        ]}
      >
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>UFOLIO</Text>

        <Text style={styles.subtitle}>
          Build stunning, ATS-friendly resumes powered by AI intelligence.
        </Text>
      </Animated.View>

      {/* BUTTON */}
      <Animated.View style={{ opacity: fade }}>
        <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* FOOTER */}
      <Text style={styles.footer}>
        Powered by Supabase • AI Engine • LaTeX PDF Renderer
      </Text>

    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 26,
  },

  hero: {
    alignItems: "center",
    marginBottom: 48,
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 14,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#e2e8f0",
    marginBottom: 8,
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 15,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 4,
    maxWidth: 300,
    lineHeight: 20,
  },

  primaryButton: {
    backgroundColor: "#4F46E5", // consistent theme purple
    paddingVertical: 15,
    paddingHorizontal: 42,
    borderRadius: 14,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  primaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    position: "absolute",
    bottom: 36,
    color: "#64748b",
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
