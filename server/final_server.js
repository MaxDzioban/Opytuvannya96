import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- MongoDB ---
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  tls: true,
  serverApi: {
    version: ServerApiVersion.v1
    // ❌ Забрати ці: strict: true, deprecationErrors: true
  }
});

let db, users, logs;

// --- Завантаження питань з db.json ---
const questions = JSON.parse(fs.readFileSync("db.json", "utf8")).questions;

// --- /api/questions (JSON-server заміна) ---
app.get("/api/questions", (req, res) => {
  res.json(questions);
});

// --- /api/evaluate (OpenAI оцінка) ---
app.post("/api/evaluate", async (req, res) => {
  const { question, answer } = req.body;
  const prompt = `
Ти виконуєш роль асистента, який оцінює відповіді студентів на питання з комп’ютерної інженерії.

Оціни наведену відповідь за шкалою від -4 до +2 балів, згідно з такими критеріями:
- Якщо не зроблено чесної спроби відповісти або відповідь не має стосунку до питання — оцінка < 0.
- Якщо відповідь хоча б частково доречна — оцінка має бути 0.0 і вище.
- Оцінки >1 ставляться лише за винятково детальні, точні та добре сформульовані відповіді.

Питання: "${question}"

Відповідь студента: "${answer}"

Формат виводу — **JSON**:
{
  "score": <число від -4 до 2>,
  "comment": "<короткий коментар: сильні та слабкі сторони відповіді (2–3 речення)>,
  "ideal_answer": "<Дуже детальна ідеальна відповідь на це запитання, приблизно 120 - 150 слів.>""
}    `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    const parsed = JSON.parse(reply);
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// --- MongoDB Auth / Logging / Points ---
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const exists = await users.findOne({ username });
    if (exists) {
      res.json({ success: false, error: "User already exists" });
    } else {
      await users.insertOne({ username, password, points: 0 });
      res.json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await users.findOne({ username, password });
    res.json({ success: !!user });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/log", async (req, res) => {
  const { username, question, answer, score } = req.body;
  try {
    await logs.insertOne({ username, question, answer, score, timestamp: new Date() });
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: "Logging failed" });
  }
});

app.post("/api/points", async (req, res) => {
  const { username, delta } = req.body;
  if (typeof username !== "string" || typeof delta !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }
  try {
    const result = await users.updateOne(
      { username },
      { $inc: { points: delta } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: "Points update failed" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await users.find().toArray();
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/user/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await users.findOne({ username });
    if (user) {
      res.json({ points: user.points });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});


const clientBuildPath = path.join(__dirname, "client-build");

app.use(express.static(clientBuildPath));

app.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "robots.txt"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});


// --- Запуск ---
async function startServer() {
  try {
    await client.connect();
    db = client.db("web");
    users = db.collection("users");
    logs = db.collection("logs");

    app.listen(PORT, () => {
      console.log(`✅ Уніфікований сервер запущено на http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

startServer();
