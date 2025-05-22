import React from "react";
import { useAuthStore } from "../../store/auth";
import { Link } from "react-router-dom";

function Dashboard() {
  const [isLoggedIn] = useAuthStore((state) => [state.isLoggedIn, state.user]);

  return (
    <>
      {isLoggedIn() ? (
        <div>
          <h1>Home</h1>
          <Link to={"/logout"}>Logout</Link>
        </div>
      ) : (
        <div>
          Home Page
          <Link to={"/login"}>Login</Link>
          <Link to={"/register"}>Register</Link>
        </div>
      )}
    </>
  );
}

export default Dashboard;
