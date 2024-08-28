const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { format } = require("date-fns");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.status(401).json({ message: "Authentication token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(email);
  console.log(password);

  try {
    const alreadyUserThere = await User.findOne({ email: email });
    if (alreadyUserThere) {
      res.status(400).json({ message: "User with That email already Exists" });
      return;
    }
    const hashedpassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email: email,
      password: hashedpassword,
    });
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "User Successfully Created :", user, token });
  } catch (err) {
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.query;
  console.log(email);
  console.log(password);
  try {
    const user = await User.findOne({ email: email });
    const verification = await bcrypt.compare(password, user.password);
    if (user && verification) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: "Login Successfully ", user, token });
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchWeather = async (req, res) => {
  const { city } = req.query;

  try {
    const weatherData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`
    );
    const data = await weatherData.json();
    if (data.cod === "404") {
      res.status(200).json({ message: "city not found" });
    } else {
      const temp = await (data.main.temp - 273.15).toFixed(2);
      const temp_min = await (data.main.temp_min - 273.15).toFixed(2);
      const temp_max = await (data.main.temp_max - 273.15).toFixed(2);

      const sunriseTime = new Date(data.sys.sunrise * 1000);
      const sunsetTime = new Date(data.sys.sunset * 1000);

      // Format sunrise and sunset times
      const formattedSunrise = format(sunriseTime, "yyyy-MM-dd HH:mm:ss");
      const formattedSunset = format(sunsetTime, "yyyy-MM-dd HH:mm:ss");

      res.status(200).json({
        message: "Successfully fetched ",
        data: {
          temperature: temp,
          temp_min,
          temp_max,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          name: data.name,
          description: data.weather[0].description,
          clouds: data.weather[0].description,
          sunrise: formattedSunrise,
          sunset: formattedSunset,
          pressure: data.main.pressure,
        },
      });
    }
  } catch (error) {
    console.log(error);
    if (error.cod === 404) {
      res.status(200).json({ message: "city not found" });
    }
  }
};

module.exports = { registerUser, loginUser, fetchWeather, authenticateToken };
