const { config } = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");

//app.use(cors({ origin: "*" })); // Allow all origins (for development)

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

require("dotenv").config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}"`);
});

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use("/vk", userRoutes);
