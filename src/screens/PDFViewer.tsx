// mobile/src/screens/PDFViewer.tsx

import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { WebView } from "react-native-webview";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  PDFViewer: { pdfUrl: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "PDFViewer">;

export default function PDFViewer({ route }: Props) {
  const { pdfUrl } = route.params;

  // Best Android-compatible PDF viewer wrapper
  const googleViewerUrl =
    "https://docs.google.com/gview?embedded=true&url=" +
    encodeURIComponent(pdfUrl);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: googleViewerUrl }}
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Loading your resume...</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  // Loading state UI (consistent across app)
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: "#6B7280",
    letterSpacing: 0.2,
  },
});
