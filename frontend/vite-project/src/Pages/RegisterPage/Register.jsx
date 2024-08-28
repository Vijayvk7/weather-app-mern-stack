import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./RegisterPage.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      if (email == "") {
        toast.error("Email is field is empty!!!", toastOptions);
        return;
      }
      if (password == "") {
        toast.error("Password is field is empty!!!", toastOptions);
        return;
      }
      if (password.length < 5) {
        toast.error(
          "Password should be minimum of 5 characters or Numbers",
          toastOptions
        );
        return;
      }

      const result = await axios.post("https://weather-app-mern-stack.onrender.com", {
        email,
        password,
      });

      if (result.status === 200) {
        toast.success(
          "Registration Successful! Redirecting to login...",
          toastOptions
        );
        setTimeout(() => navigate("/vk/login"), 1000);
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 400) {
        toast.error("User Already exists with same email !!!!", toastOptions);
        toast.error("Try With Other Email !!!!", toastOptions);
        return;
      }
    }
  };
  const LogNavigation = async () => {
    navigate("/vk/login");
  };

  return (
    <div className="container">
      <form onSubmit={registerUser}>
        <div className="form-group">
          <h1 className="heading">VK Weather App Register</h1>
          <label>
            <b>Email address</b>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter email"
          ></input>
        </div>
        <div className="form-group">
          <label>
            <b>Password</b>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Password"
          ></input>
        </div>
        <button type="submit" className="btn-primary">
          Submit
        </button>
        <p className="log" onClick={LogNavigation}>
          Already Registered,Login
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
