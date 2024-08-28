import { React, useEffect, useState } from "react";
import "./weather.css";
import search from "../../images/search.png";
import rain from "../../images/rain.png";
import clear from "../../images/clear.png";
import mist from "../../images/mist.png";
import haze from "../../images/haze.png";
import drizzle from "../../images/drizzle.png";
import clouds from "../../images/clouds.png";
import heavyrain from "../../images/heavyrain.png";
import humidity from "../../images/humidity.png";
import wind from "../../images/wind.png";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import axios from "axios";
const weather = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [icon, setIcon] = useState("");
  const [searchAttempted, setsearchAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",

    limit: 10,
  };

  useEffect(() => {
    if (data && data.clouds) {
      if (data.clouds.includes("snow")) {
        setIcon(snow);
      } else {
        switch (data.clouds) {
          case "scattered clouds":
            setIcon(clouds);
            break;
          case "broken clouds":
            setIcon(clouds);
            break;
          case "few clouds":
            setIcon(clouds);
            break;
          case "overcast clouds":
            setIcon(rain);
            break;
          case "clear sky":
            setIcon(clear);
            break;
          case "light rain":
            setIcon(drizzle);
            break;
          case "light intensity shower rain":
            setIcon(drizzle);
            break;
          case "mist":
            setIcon(mist);
            break;
          case "heavy intensity rain":
            setIcon(heavyrain);
            break;
          case "moderate rain":
            setIcon(heavyrain);
            break;
          case "haze":
            setIcon(haze);
            break;
          default:
            setIcon("");
            break;
        }
      }
    }
  }, [data, icon]);

  const fetchData = async () => {
    if (!city || city == "") {
      toast.error("Enter City Name !!!!", toastOptions);
      setsearchAttempted(true);
      return;
    }
    setsearchAttempted(true);
    setCityNotFound(false);
    setLoading(true);

    try {
      const response = await axios.get("https://weather-app-mern-stack.onrender.com", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          city: city,
        },
      });
      if (response.data && response.data.data) {
        setData(response.data.data);
        setCity("");
        setCityNotFound(false);
      } else {
        setCityNotFound(true);
        setData(null);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cityNotFound) {
      toast.error("City Not Found!!!", toastOptions);
    }
  }, [cityNotFound]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };

  const handlelogout = () => {
    localStorage.removeItem("token");
    navigate("/vk/login");
  };

  return (
    <div>
      <button onClick={handlelogout} className="Logout">
        Logout
      </button>
      <p className="Main">VK Weather App</p>
      <div className="card">
        <div className="search">
          <input
            type="text"
            placeholder="Enter City Name"
            value={city}
            onKeyDown={handleKeyDown}
            onChange={(e) => setCity(e.target.value)}
            className="input"
          />
          <button onClick={fetchData}>
            <img src={search} alt="" className="search-btn" />
          </button>
          <ToastContainer className="custom-toast-container" />
        </div>

        {searchAttempted &&
          (loading ? (
            <div className="loader"></div>
          ) : data ? (
            <div className="weather">
              <div className="upper-details">
                <img src={icon} className="weather-icon" />
                <h1 className="temp">{data.temperature}°C</h1>
                <h2 className="city">{data.name}</h2>
              </div>
              <div className="lower-details">
                <div className="col-humidity">
                  <img src={humidity} className="image" />
                  <div>
                    <p className="humidity">{data.humidity}%</p>
                    <p className="sub">Humidity</p>
                  </div>
                </div>
                <div className="col">
                  <img src={wind} alt="wind" className="image" />
                  <div>
                    <p className="Wind">{data.wind}m/s</p>
                    <p className="sub">Wind Speed</p>
                  </div>
                </div>
              </div>
              <div className="More-details">
                <ul className="Desc">
                  Description : {data.description.toUpperCase()}
                </ul>
                <ul>Temperature Minimum : {data.temp_min}</ul>
                <ul>Temperature Maximum : {data.temp_max}</ul>
                <ul>Sunrise : {data.sunrise}</ul>
                <ul>Sunset : {data.sunset}</ul>
              </div>
            </div>
          ) : (
            <>
              <h2 className="city">City Not Found !!!!</h2>
            </>
          ))}
      </div>
    </div>
  );
};

export default weather;
