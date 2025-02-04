require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const ScoreSchema = new mongoose.Schema({
  name: String,
  score: Number,
});

const Score = mongoose.model("Score", ScoreSchema);

// Отримання топ-10 гравців
app.get("/leaderboard", async (req, res) => {
  const topScores = await Score.find().sort({ score: -1 }).limit(10);
  res.json(topScores);
});

// Додавання нового результату
app.post("/leaderboard", async (req, res) => {
  const { name, score } = req.body;
  const newScore = new Score({ name, score });
  await newScore.save();
  res.json({ message: "Score saved!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
