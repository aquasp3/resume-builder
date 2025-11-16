// backend/routes/resumeRoutes.js
import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import { generateResumePDF } from "../services/pdfgenerator.js";
import { sendResumeEmail } from "../services/mailer.js";

dotenv.config();
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// all 4 templates
const allowedTemplates = ["template1", "template2", "template3", "template4"];

/* POST /api/resumes */
router.post("/", async (req, res) => {
  try {
    const { user_id, resumeData, template, useAI } = req.body;

    if (!user_id || !resumeData) {
      return res.status(400).json({ error: "user_id and resumeData required" });
    }

    // extract fields (accept flexible payload)
    const {
      name,
      email,
      phone,
      summary,
      technical_skills,
      projects,
      experience,
      education,
      certifications,
      linkedin,
      github,
    } = resumeData;

    if (!name || !email || !summary) {
      return res.status(400).json({ error: "name, email and summary required" });
    }

    // validate template
    let chosenTemplate = template || "template1";
    if (!allowedTemplates.includes(chosenTemplate)) chosenTemplate = "template1";

    // store record (store raw fields, no AI by default unless useAI true and you wire enhance)
    const { data, error } = await supabase
      .from("resumes")
      .insert([
        {
          user_id,
          name,
          email,
          phone,
          template: chosenTemplate,
          summary,
          technical_skills: technical_skills || [],
          projects: projects || [],
          experience: experience || [],
          education: education || [],
          certifications: certifications || [],
          linkedin: linkedin || null,
          github: github || null,
        },
      ])
      .select();

    if (error) {
      console.error("DB insert error:", error);
      return res.status(400).json({ error: error.message });
    }

    const resumeEntry = data[0];

    // generate pdf
    const { pdfPath, filename } = await generateResumePDF({
      name,
      email,
      phone,
      linkedin,
      github,
      summary,
      technical_skills,
      projects,
      experience,
      education,
      certifications,
      template: chosenTemplate,
    });

    // upload to supabase storage
    const fileBuffer = fs.readFileSync(pdfPath);
    const storageFilePath = `pdfs/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(storageFilePath, fileBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(storageFilePath);

    const pdfUrl = urlData.publicUrl;

    // update db record
    await supabase.from("resumes").update({ pdf_url: pdfUrl }).eq("id", resumeEntry.id);

    // optional email
    try {
      await sendResumeEmail(email, pdfPath, name);
    } catch (e) {
      console.warn("Email failed:", e);
    }

    // remove temp
    try { fs.unlinkSync(pdfPath); } catch(e) {}

    return res.status(200).json({
      success: true,
      pdf_url: pdfUrl,
      resume_id: resumeEntry.id,
      template: chosenTemplate,
    });
  } catch (err) {
    console.error("Error /api/resumes:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* GET /api/resumes/history/:user_id */
router.get("/history/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true, data });
  } catch (err) {
    console.error("Error GET history:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
