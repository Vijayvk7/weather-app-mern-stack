const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  fetchWeather,
  authenticateToken,
} = require("../controllers/userControllers");

router.post("/register", registerUser);
router.get("/login", loginUser);
router.get("/main", authenticateToken, fetchWeather);

module.exports = router;
