// App.tsx — Always show Welcome screen on every app launch

import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TemplatePicker from "./src/screens/TemplatePicker";
import ResumeForm from "./src/screens/ResumeForm";
import ResumePreview from "./src/screens/ResumePreview";
import ResumeHistory from "./src/screens/ResumeHistory";
import PDFViewer from "./src/screens/PDFViewer";

import { supabase } from "./src/supabaseClient";
import { RootStackParamList } from "./src/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Loading state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>

        {/* Always show Welcome first */}
        <Stack.Screen name="Welcome">
          {props => (
            <WelcomeScreen
              {...props}
              onContinue={() => {
                if (session && session.user) {
                  props.navigation.replace("Home", { user: session.user });
                } else {
                  props.navigation.replace("Login");
                }
              }}
            />
          )}
        </Stack.Screen>

        {/* Auth screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Main authenticated screens */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: true, title: "Resume Builder" }}
        />

        <Stack.Screen
          name="TemplatePicker"
          component={TemplatePicker}
          options={{ headerShown: true, title: "Choose Template" }}
        />

        <Stack.Screen
          name="ResumeForm"
          component={ResumeForm}
          options={{ headerShown: true, title: "Create Resume" }}
        />

        <Stack.Screen
          name="ResumePreview"
          component={ResumePreview}
          options={{ headerShown: true, title: "Preview Resume" }}
        />

        <Stack.Screen
          name="PDFViewer"
          component={PDFViewer}
          options={{ headerShown: true, title: "Resume PDF" }}
        />

        <Stack.Screen
          name="ResumeHistory"
          component={ResumeHistory}
          options={{ headerShown: true, title: "Resume History" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
