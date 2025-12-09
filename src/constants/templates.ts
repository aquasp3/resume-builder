// src/constants/templates.ts

export type TemplateID = "template1" | "template2" | "template3" | "template4";

import template1 from "../assets/templates/template1.jpg";
import template2 from "../assets/templates/template2.jpg";
import template3 from "../assets/templates/template3.jpg";
import template4 from "../assets/templates/template4.jpg";

export const TEMPLATES: {
  id: TemplateID;
  title: string;
  image: any;
  description: string;
}[] = [
  {
    id: "template1",
    title: "AI Professional Resume",
    image: template1,
    description: "ATS-friendly resume with a strong professional layout.",
  },
  {
    id: "template2",
    title: "Modern Template",
    image: template2,
    description: "Clean, modern design suitable for tech roles.",
  },
  {
    id: "template3",
    title: "Minimal Template",
    image: template3,
    description: "Simple, elegant, and easy to read.",
  },
  {
    id: "template4",
    title: "Classic Template",
    image: template4,
    description: "Traditional structured resume for all industries.",
  },
];
