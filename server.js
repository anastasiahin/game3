const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Якщо використовуєш .env

const app = express();
app.use(express.json());
app.use(cors());

// Перевірка, чи MONGO_URI завантажено
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined. Check your .env file.");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
  });

const ScoreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true }
}, { timestamps: true });

const Score = mongoose.model("Score", ScoreSchema);

// Збереження результату гравця
app.post("/leaderboard", async (req, res) => {
    const { name, score } = req.body;
    if (!name || score == null) return res.status(400).json({ error: "Invalid data" });

    try {
        const newScore = await Score.create({ name, score });
        res.status(201).json({ message: "Score saved!", data: newScore });
    } catch (err) {
        console.error("❌ Error saving score:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Отримання топ-10 гравців
app.get("/leaderboard", async (req, res) => {
    try {
        const topPlayers = await Score.find().sort({ score: -1 }).limit(10);
        res.json(topPlayers);
    } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
        res.status(500).json({ error: "Database error" });
    }
});

const PORT = 5000;
app.listen(PORT, "192.168.215.53", () => {
    console.log(`Сервер працює на http://http://192.168.215.53:5000${PORT}`);
});
