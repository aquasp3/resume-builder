# 📘 Resume Builder (AI + Supabase + React Native + Node.js + LaTeX)

An AI-powered resume generator with:

- ⚛️ React Native Mobile App  
- 🟦 Node.js + Express Backend  
- 🧪 LaTeX PDF Resume Templates  
- 🧠 AI Enhancement (Gemini / OpenAI)  
- 🗄️ Supabase Database  

Built end-to-end by **Sathvik Konduri**.

---

## ✨ Features

### 📱 Mobile App
- Clean UI for entering resume details  
- 4 Resume Templates to choose from  
- Certifications section support  
- AI Enhancement toggle  
- Stores history of generated resumes  

### 🤖 AI Resume Enhancement
Improves resume by rewriting:
- Summary  
- Experience  
- Projects  
- Skills  
- Certifications  

### 📄 High-Quality PDF Output
- LaTeX-based templates  
- Safe text escaping (no errors)  
- Professional typesetting  
- Consistent formatting  

### ☁️ Supabase Integration
- Stores resume metadata  
- Saves generated PDF links  
- Retrieves resume history  

---

## 🏗️ Project Structure

resume-builder/
│
├── backend/
│ ├── routes/
│ ├── services/
│ ├── templates/ # LaTeX templates
│ ├── pdfgenerator.js
│ └── enhanceAI.js
│
├── mobile/
│ ├── screens/
│ ├── components/
│ ├── services/
│ └── assets/
│
└── README.md

---

## 🚀 Tech Stack

### **Frontend**
- React Native  
- TypeScript  

### **Backend**
- Node.js  
- Express  
- Supabase Client  

### **AI**
- Gemini API or OpenAI API  

### **PDF Templates**
- LaTeX (4 Templates)  
- node-latex  

---

## 📱 Running the Mobile App

```bash
cd mobile
npm install
npm start
🖥️ Running the Backend
cd backend
npm install
node index.js


Requirements:

MikTeX (Windows) or TeXLive (Linux/Mac)

Supabase project

AI API Key

🧠 AI Enhancement

Toggle Enable AI Enhancement in the mobile app.

Backend will enhance:

Summary

Experience bullet points

Projects

Skills

Certifications

Returns cleaned & professional resume content.

📡 API Endpoint
POST /api/resumes

Request body:

{
  "user_id": "USER_ID",
  "resumeData": { ... },
  "template": "template1",
  "useAI": true
}


Response:

PDF file stored in Supabase

File URL

Enhanced data (if AI = true)

📄 Resume Templates

Located in:

backend/templates/


Includes:

Template 1 – Simple

Template 2 – Professional

Template 3 – Modern Left Sidebar

Template 4 – Corporate

🔐 Environment Variables
backend/.env
SUPABASE_URL=...
SUPABASE_KEY=...
AI_API_KEY=...

mobile/.env
API_URL=http://<YOUR-IP>:3000

🔧 Common Fixes
LF/CRLF warnings

Run once:

git config core.autocrlf true

Mobile folder acting like submodule

Delete nested git folder:

rmdir /s /q mobile/.git

👤 Author

Sathvik Konduri
AI + Automation Engineer
3rd Year Engineering Student
⭐ Support the Project

If you like this project, give it a star on GitHub!

⭐ https://github.com/aquasp3/resume-builder

🚀 Future Enhancements

ATS Score Analyzer

Resume Quality Feedback

Live Preview Mode

More templates

Multi-language resume support