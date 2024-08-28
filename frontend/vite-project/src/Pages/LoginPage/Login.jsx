import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
  };
  const navigate = useNavigate();

  const LogNavigation = async () => {
    navigate("/vk/register");
  };

  const loginUser = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is field is empty!!!", toastOptions);
      return;
    }
    if (!password) {
      toast.error("Password is field is empty!!!", toastOptions);
      return;
    }

    if (password.length < 5) {
      toast.error(
        "Password should be minimum of 5 characters or NUmbers",
        toastOptions
      );
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/vk/login", {
        params: {
          email: email,
          password: password,
        },
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        toast.success("Successfully logged in! Redirecting...", toastOptions);
        setTimeout(() => navigate("/vk/main"), 1000);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Email or Password is incorrect", toastOptions);
      } else {
        toast.error("Something went wrong. Please try again.", toastOptions);
      }
    }
    console.log(error);
  };

  return (
    <div>
      <div className="container">
        <form onSubmit={loginUser}>
          <div className="form-group">
            <h1 className="heading">VK Weather App Login</h1>
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
            New User,Register
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
