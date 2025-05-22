import React from "react";
import { useAuthStore } from "../../store/auth";
import { Link } from "react-router-dom";

function Dashboard() {
  const [isLoggedIn] = useAuthStore((state) => [state.isLoggedIn, state.user]);

  return (
    <>
      {isLoggedIn() ? (
        <div>
          <h1>Dashboard</h1>
          <Link to={"/logout"}>Logout</Link>
        </div>
      ) : (
        <div>
          Home Page
          <Link to={"/register"}>Register</Link>
          <Link to={"/login"}>Login</Link>
        </div>
      )}
    </>
  );
}

export default Dashboard;
