const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/weatherDB")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if unable to connect
  });

// Define schema and model for weather data
const weatherSchema = new mongoose.Schema({
  city: { type: String, required: true },
  temperatureFahrenheit: { type: Number, required: true },
});

const Weather = mongoose.model("Weather", weatherSchema);

// Middleware for parsing JSON requests
app.use(express.json());

// Endpoint to save city and temperature
app.post("/weather", async (req, res) => {
  const { city, temperatureFahrenheit } = req.body;

  try {
    // Save weather data to MongoDB
    const weather = new Weather({
      city,
      temperatureFahrenheit,
    });
    const savedWeather = await weather.save();
    console.log("Weather data saved successfully:", savedWeather);
    res.status(201).send("Weather data saved successfully");
  } catch (error) {
    console.error("Error saving weather data:", error);
    res.status(500).send("Error saving weather data");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
