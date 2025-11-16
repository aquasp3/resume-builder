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

type RootStackParamList = {
  TemplatePicker: { user: any };
  ResumeForm: { user: any; template: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "TemplatePicker">;

type TemplateItem = {
  id: "template1" | "template2" | "template3" | "template4";
  title: string;
  image: any;
};

// MUST match backend allowed templates
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Choose Your Resume Template</Text>
      <Text style={styles.subtitle}>
        Select a template to begin building your resume.
      </Text>

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
            <Text style={styles.cardSubtitle}>Tap to use this template</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// =====================
// STYLES
// =====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 210,
  },

  cardContent: {
    padding: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
});
