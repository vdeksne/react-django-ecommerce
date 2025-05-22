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
          <Link to={"/register"} className="btn btn-primary me-2">
            Register
          </Link>
          <br />
          <Link to={"/login"} className="btn btn-success">
            Login
          </Link>
        </div>
      )}
    </>
  );
}

export default Dashboard;
