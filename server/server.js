const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

const hrHiringRoutes = require("./routers/hrHiringRoutes");

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/hr/hiring", hrHiringRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
