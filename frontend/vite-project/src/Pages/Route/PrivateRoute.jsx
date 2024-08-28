import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const token = localStorage.getItem("token");
  return token ? <Element {...rest} /> : <Navigate to="/vk/login" />;
};

export default PrivateRoute;
