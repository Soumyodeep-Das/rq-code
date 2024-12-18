require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const UserData = require("./models/UserData");

app.post("/generate", async (req, res) => {
  const { userId, data } = req.body;

  try {
    // Check if userId already exists
    let userData = await UserData.findOne({ userId });

    if (!userData) {
      userData = new UserData({ userId, data });
      await userData.save();
    } else {
      userData.data = data; // Update data
      await userData.save();
    }

    res.status(200).json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
