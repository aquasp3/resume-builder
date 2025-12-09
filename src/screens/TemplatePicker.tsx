// mobile/src/screens/TemplatePicker.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

export type TemplateID = "template1" | "template2" | "template3" | "template4";

type Props = NativeStackScreenProps<RootStackParamList, "TemplatePicker">;

type TemplateItem = {
  id: TemplateID;
  title: string;
  image: number;
};

// Template List
const templates: TemplateItem[] = [
  {
    id: "template1",
    title: "Professional Template",
    image: require("../assets/templates/template1.jpg"),
  },
  {
    id: "template2",
    title: "Modern Template",
    image: require("../assets/templates/template2.jpg"),
  },
  {
    id: "template3",
    title: "Minimal Template",
    image: require("../assets/templates/template3.jpg"),
  },
  {
    id: "template4",
    title: "Classic Elegant Template",
    image: require("../assets/templates/template4.jpg"),
  },
];

export default function TemplatePicker({ navigation, route }: Props) {
  const { user } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* Header */}
      <Text style={styles.title}>Pick Your Resume Style</Text>
      <Text style={styles.subtitle}>
        Choose a template that matches your professional personality.
      </Text>

      {/* Template Cards */}
      {templates.map((tpl) => (
        <TouchableOpacity
          key={tpl.id}
          style={styles.card}
          onPress={() =>
            navigation.navigate("ResumeForm", {
              user,
              template: tpl.id,
            })
          }
        >
          <Image source={tpl.image} style={styles.image} />

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{tpl.title}</Text>
            <Text style={styles.cardSubtitle}>Tap to continue</Text>
          </View>
        </TouchableOpacity>
      ))}

    </ScrollView>
  );
}

// -------------------------
// STYLES — Unified Premium Theme
// -------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 26,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 230,
  },

  cardContent: {
    padding: 18,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
});
