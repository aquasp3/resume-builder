// backend/services/pdfgenerator.js
import fs from "fs-extra";
import latex from "node-latex";
import path from "path";

process.env.PATH += ";D:\\sathvik\\miktex\\bin\\x64"; // adjust if needed

// Prevent LaTeX crashes by ensuring itemize environments always contain at least 1 item
function safeLatexBlock(block) {
  if (!block || block.trim().length === 0) {
    return "\\resumeItem{ }"; // safe blank item
  }
  return block;
}

export async function generateResumePDF(data) {
  try {
    const safeName = (data.name || "resume").replace(/\s+/g, "_");
    const timestamp = Date.now();
    const pdfFileName = `${safeName}_${timestamp}.pdf`;

    const availableTemplates = ["template1", "template2", "template3", "template4"];
    const chosenTemplate = availableTemplates.includes(data.template) ? data.template : "template1";
    const templatePath = path.resolve("templates", `${chosenTemplate}.tex`);

    if (!fs.existsSync(templatePath)) throw new Error(`Template not found: ${templatePath}`);

    const outputFolder = path.resolve("pdfs");
    await fs.ensureDir(outputFolder);
    const outputPath = path.join(outputFolder, pdfFileName);

    let template = await fs.readFile(templatePath, "utf-8");

    // TECHNICAL SKILLS
    const technicalSkillsText = (data.technical_skills || [])
      .map((s) => `\\resumeItem{${escapeLatex(s)}}`)
      .join("\n");

    // PROJECTS
    const projectsText = (data.projects || [])
      .map((p) => {
        if (typeof p === "string") {
          const parts = p.split("|").map(x => x.trim());
          if (parts.length >= 1) {
            const title = parts[0];
            const dur = parts[1] || "";
            const subtitle = parts[2] || "";
            const tech = parts[3] || "";
            const bullets = (parts[4] || "")
              .split(";")
              .map(t => t.trim())
              .filter(Boolean);

            const bulletsTex = bullets
              .map(b => `\\resumeItem{${escapeLatex(b)}}`)
              .join("\n");

            return `\\resumeSubheading{${escapeLatex(title)}}{${escapeLatex(dur)}}{${escapeLatex(subtitle)}}{${escapeLatex(tech)}}
\\resumeSubHeadingList
${safeLatexBlock(bulletsTex)}
\\resumeSubHeadingListEnd`;
          }
          return `\\resumeItem{${escapeLatex(p)}}`;
        } else {
          const title = p.title || "";
          const dur = p.duration || "";
          const subtitle = p.subtitle || "";
          const tech = p.tech || "";
          const points = (p.points || [])
            .map(pt => `\\resumeItem{${escapeLatex(pt)}}`)
            .join("\n");

          return `\\resumeSubheading{${escapeLatex(title)}}{${escapeLatex(dur)}}{${escapeLatex(subtitle)}}{${escapeLatex(tech)}}
\\resumeSubHeadingList
${safeLatexBlock(points)}
\\resumeSubHeadingListEnd`;
        }
      })
      .join("\n");

    // EXPERIENCE
    const experienceText = (data.experience || [])
      .map((exp) => {
        if (typeof exp === "string") return `\\resumeItem{${escapeLatex(exp)}}`;

        const pts = (exp.points || [])
          .map(pt => `\\resumeItem{${escapeLatex(pt)}}`)
          .join("\n");

        return `\\resumeSubheading{${escapeLatex(exp.role || "")}}{${escapeLatex(exp.duration || "")}}{${escapeLatex(exp.company || "")}}{${escapeLatex(exp.location || "")}}
\\resumeSubHeadingList
${safeLatexBlock(pts)}
\\resumeSubHeadingListEnd`;
      })
      .join("\n");

    // EDUCATION
    const educationText = (data.education || [])
      .map((edu) => {
        if (typeof edu === "string")
          return `\\resumeSubheading{${escapeLatex(edu)}}{}{ }{ }`;

        return `\\resumeSubheading{${escapeLatex(edu.degree || "")}}{${escapeLatex(edu.year || "")}}{${escapeLatex(edu.college || "")}}{ }`;
      })
      .join("\n");

    // CERTIFICATIONS
    const certificationsText = (data.certifications || [])
      .map(c => `\\resumeItem{${escapeLatex(c)}}`)
      .join("\n");

    // Insert placeholders safely
    template = template
      .replace(/{{NAME}}/g, escapeLatex(data.name || ""))
      .replace(/{{EMAIL}}/g, escapeLatex(data.email || ""))
      .replace(/{{PHONE}}/g, escapeLatex(data.phone || ""))
      .replace(/{{SUMMARY}}/g, escapeLatex(data.summary || ""))
      .replace(/{{LINKEDIN}}/g, escapeLatex(data.linkedin || ""))
      .replace(/{{GITHUB}}/g, escapeLatex(data.github || ""))

      // SAFE BLOCKS
      .replace(/{{TECHNICAL_SKILLS}}/g, safeLatexBlock(technicalSkillsText))
      .replace(/{{PROJECTS}}/g, safeLatexBlock(projectsText))
      .replace(/{{EXPERIENCE}}/g, safeLatexBlock(experienceText))
      .replace(/{{EDUCATION}}/g, safeLatexBlock(educationText))
      .replace(/{{CERTIFICATIONS}}/g, safeLatexBlock(certificationsText));

    // Compile PDF
    const pdfStream = latex(template, { cmd: "pdflatex" });
    const writeStream = fs.createWriteStream(outputPath);
    pdfStream.pipe(writeStream);

    return await new Promise((resolve, reject) => {
      pdfStream.on("error", err =>
        reject(new Error("LaTeX error:\n" + (err?.message || err)))
      );
      writeStream.on("finish", () =>
        resolve({ pdfPath: outputPath, latexCode: template, filename: pdfFileName })
      );
      writeStream.on("error", reject);
    });
  } catch (err) {
    console.error("generateResumePDF failed:", err);
    throw err;
  }
}

function escapeLatex(str = "") {
  return String(str)
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/#/g, "\\#")
    .replace(/\$/g, "\\$")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\^/g, "\\^{}")
    .replace(/~/g, "\\~{}")
    .replace(/</g, "\\textless{}")
    .replace(/>/g, "\\textgreater{}");
}
