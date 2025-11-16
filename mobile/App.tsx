// App.tsx

import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TemplatePicker from "./src/screens/TemplatePicker";
import ResumeForm from "./src/screens/ResumeForm";
import ResumePreview from "./src/screens/ResumePreview";
import ResumeHistory from "./src/screens/ResumeHistory";
import PDFViewer from "./src/screens/PDFViewer";

import { supabase } from "./src/supabaseClient";

console.log("APP STARTED (v1)");
console.log("SUPABASE INSTANCE:", supabase);

// ======================================================
// ✅ UNIFIED ROOT STACK TYPES — ALL SCREENS MATCH THIS
// ======================================================
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;

  Home: { user: any } | undefined;

  TemplatePicker: { user: any };
  ResumeForm: { user: any; template: string };
  ResumePreview: { pdfUrl: string };

  PDFViewer: { pdfUrl: string };
  ResumeHistory: { user: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ======================================================
// APP COMPONENT
// ======================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<"Login" | "Home">("Login");

  useEffect(() => {
    const checkSession = async () => {
      const session = supabase.auth.session();
      console.log("Initial session:", session);

      if (session) setInitialRoute("Home");
      else setInitialRoute("Login");

      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        if (session) setInitialRoute("Home");
        else setInitialRoute("Login");
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        {/* AUTH */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />

        {/* HOME */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Resume Builder" }}
        />

        {/* TEMPLATE PICKER */}
        <Stack.Screen
          name="TemplatePicker"
          component={TemplatePicker}
          options={{ title: "Choose Template" }}
        />

        {/* FORM */}
        <Stack.Screen
          name="ResumeForm"
          component={ResumeForm}
          options={{ title: "Create Resume" }}
        />

        {/* PREVIEW */}
        <Stack.Screen
          name="ResumePreview"
          component={ResumePreview}
          options={{ title: "Preview Resume" }}
        />

        {/* PDF VIEWER */}
        <Stack.Screen
          name="PDFViewer"
          component={PDFViewer}
          options={{ title: "Resume PDF" }}
        />

        {/* HISTORY */}
        <Stack.Screen
          name="ResumeHistory"
          component={ResumeHistory}
          options={{ title: "Resume History" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
