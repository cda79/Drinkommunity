require("dotenv").config();
require("dns").setDefaultResultOrder("ipv4first");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const drinkRoutes = require("./routes/drinks");
const authRoutes = require("./routes/auth");
const commentRoutes = require("./routes/comments.js");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:3000" })); // allow requests from localhost:3000
// app.use(cors()); // allow everyone
app.use(express.json());

// database connection
const uri = process.env.MONGO_URI;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function connectDB() {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(uri, clientOptions);

    // optional: the "Ping" command just confirms everything is working
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("✅ Pinged the db. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

// Proxy backend since I got restricted/blocked when directly connecting to the URL
app.get("/api/proxy/cocktails", async (req, res) => {
  try {
    const { c, a, i } = req.query;
    let url = "https://www.thecocktaildb.com/api/json/v1/1/";

    if (c) url += `filter.php?c=${c}`;
    if (a) url += `filter.php?a=${a}`;
    if (i) url += `lookup.php?i=${i}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Backend running on :5000"));

// execute the connection function
connectDB();

// routes
app.use("/api/drinks", drinkRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
