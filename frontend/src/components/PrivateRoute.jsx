import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");

  if (!token || !user_id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
