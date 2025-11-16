import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resumeRoutes.js";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

/* ================================
   🔐 Secure CORS
================================ */
const allowedOrigins = [
  "http://localhost:19006",   // Expo Web
  "http://localhost:19000",   // Expo Mobile
  "http://127.0.0.1:19000",
  "exp://*",                  // Expo Dev
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

/* ================================
   Global Middlewares
================================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ================================
   Optional static folders
================================ */
app.use("/pdfs", express.static("pdfs"));
app.use("/templates", express.static("templates"));

/* ================================
   Supabase Initialization
================================ */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* ================================
   Root Route
================================ */
app.get("/", (req, res) => {
  res.send("🚀 Resume Builder Backend is running!");
});

/* ================================
   Resume Routes
================================ */
app.use("/api/resumes", resumeRoutes);

/* ================================
   Test Routes (optional)
================================ */

// Insert test user
app.post("/api/test-insert", async (req, res) => {
  const { name, email } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ data });
});

// Fetch all users
app.get("/api/users", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) return res.status(400).json({ error: error.message });
  res.json({ data });
});

/* ================================
   Start Server
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
