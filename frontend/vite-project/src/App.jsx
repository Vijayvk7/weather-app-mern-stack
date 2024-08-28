import React from "react";
import Register from "./Pages/RegisterPage/Register";
import Login from "./Pages/LoginPage/Login";
import { Routes, Route } from "react-router-dom";
import weather from "./Pages/Weather/weather";
import PrivateRoute from "./Pages/Route/PrivateRoute";

const App = () => {
  return (
    <div>
      <Routes>
        <Route index element={<Register />}></Route>
        <Route path="/vk/register" element={<Register />}></Route>
        <Route path="/vk/login" element={<Login />}></Route>
        <Route path="/vk/main" element={<PrivateRoute element={weather} />} />
      </Routes>
    </div>
  );
};

export default App;
