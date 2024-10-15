const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Route example
const Route = require("./routers/");

dotenv.config();
connectDB();

const app = express();

// Use route example
app.use("/", Route);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
