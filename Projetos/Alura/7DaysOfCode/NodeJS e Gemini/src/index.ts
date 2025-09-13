import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Pega a chave da variável de ambiente
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/v1/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt é obrigatório" });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ resposta: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao chamar a API Gemini" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

app.get("/", (_req, res) => {
  res.send("✅ API do #7DaysOfCode com Gemini está no ar!");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});