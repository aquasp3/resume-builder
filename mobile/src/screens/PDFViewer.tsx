// mobile/src/screens/PDFViewer.tsx

import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  PDFViewer: { pdfUrl: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "PDFViewer">;

export default function PDFViewer({ route }: Props) {
  const { pdfUrl } = route.params;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: pdfUrl }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        )}
        javaScriptEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        originWhitelist={["*"]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
