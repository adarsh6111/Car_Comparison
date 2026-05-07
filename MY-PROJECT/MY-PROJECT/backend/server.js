const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const carsData = require("./carsData");
const { buildChatResponse } = require("./chatService");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/cars", (req, res) => {
  res.json(carsData);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/my-project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("Mongo error:", error));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, phone, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, memory, user } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const response = await buildChatResponse({
      message: String(message).trim(),
      history: Array.isArray(history) ? history : [],
      memory: memory && typeof memory === "object" ? memory : {},
      user: user && typeof user === "object" ? user : {},
    });

    res.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Unable to process chat right now." });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
