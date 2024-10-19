const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
dotenv.config();

const UserRouter = require("./routers/UserRouter.js");
const DocumentRouter = require("./routers/DocumentRouter.js");
const employeeRouter = require("./routers/employeeRouter.js");
const hrHiringRoutes = require("./routers/hrHiringRoutes");
const hrHousingRoutes = require("./routers/hrHousingRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// third-party tools
app.use(cookieParser());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(":method :url :status :response-time ms"));

// routers
app.use("/user", UserRouter);
app.use("/document", DocumentRouter);
app.use("/employee", employeeRouter);
app.use("/hr/hiring", hrHiringRoutes);
app.use("/hr/housing", hrHousingRoutes);
//
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// handle invalid url
app.all("*", (_req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

// async function to make sure db connected before server running
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to the database", err);
    process.exit(1); // Exit with failure
  }
};

startServer();
