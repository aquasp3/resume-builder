<<<<<<< HEAD
This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
=======
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
>>>>>>> 5244d15a35dffd76dd2034a4621dfd9cf89623f5
