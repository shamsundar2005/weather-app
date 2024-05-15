import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState("london");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    ifClicked();
  }, []);

  function ifClicked() {
    const weatherApiKey = "3f039b6221dec660233b8d8ae716d3b9";
    const unsplashApiKey = "7o-dOJ00pncSSBK5guo6JIQDbXcHzpbypfkZiIHmJJ4";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${weatherApiKey}&units=metric`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status === 404) {
            alert("Oops, there seems to be an error! (wrong location)");
            return;
          }
          alert("Oops, there seems to be an error!");
          throw new Error("You have an error");
        }
      })
      .then((object) => {
        setWeather(object);
        saveWeatherToDatabase(object); // Save weather data to MongoDB
      })
      .catch((error) => console.log(error));

    fetch(`https://api.unsplash.com/search/photos?query=${location}&client_id=${unsplashApiKey}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("You made a mistake");
        }
      })
      .then((data) => {
        if (data.results.length > 0) {
          setPhoto(data.results[0].urls.raw);
        }
      })
      .catch((error) => console.log(error));
  }

  async function saveWeatherToDatabase(weatherData) {
    try {
      const response = await fetch("http://localhost:3000/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: location,
          temperatureFahrenheit: celsiusToFahrenheit(weatherData?.main?.temp),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save weather data to database");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
  }

  return (
    <div className={`app ${getWeatherClass()}`}>
      {/* Background animation based on weather condition */}
      <div className="background" />

      <div className="wrapper">
        <div className="search">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="location_input"
          />
          <button className="location_searcher" onClick={ifClicked}>
            Search Location
          </button>
        </div>
        <div className="app__data">
          <p className="temp">Current Temperature: {weather?.main?.temp}°C</p>
          <p className="condition">Condition: {weather?.weather?.[0]?.description}</p>
        </div>
        {photo && <img className="app__image" src={photo} alt="Weather" />}
      </div>
    </div>
  );

  function getWeatherClass() {
    const main = weather?.weather?.[0]?.main?.toLowerCase();
    switch (main) {
      case "rain":
        return "rain";
      case "clear":
        return "sunny";
      case "snow":
        return "winter";
      case "clouds":
        return "cloudy";
      default:
        return "";
    }
  }
}

export default App;
