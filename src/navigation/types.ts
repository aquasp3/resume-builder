// mobile/src/navigation/types.ts

import { TemplateType } from "../services/api";

export type RootStackParamList = {
  // One-time welcome screen
  Welcome: undefined; // You don't need params here

  // Auth
  Login: undefined;
  Signup: undefined;

  // Main Home screen
  Home: { user: any };

  // Resume creation flow
  TemplatePicker: { user: any };
  ResumeForm: { user: any; template: TemplateType };

  // After generation
  ResumePreview: { pdfUrl: string };

  // PDF Viewer
  PDFViewer: { pdfUrl: string };

  // History screen
  ResumeHistory: { user: any };
};
