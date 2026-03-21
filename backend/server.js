require("dotenv").config();
require('dns').setDefaultResultOrder('ipv4first');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const drinkRoutes = require("./routes/drinks");
const authRoutes = require("./routes/auth");

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
    console.log(process.env.MONGO_URI)
    await mongoose.connect(uri, clientOptions);

    // optional: the "Ping" command just confirms everything is working
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("✅ Pinged the db. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

// execute the connection function
connectDB();

// routes
app.use("/api/drinks", drinkRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
