import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-blue-600 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/">RQ Codes</Link>
        </div>
        <div className="space-x-4">
          <Link
            to="/"
            className="text-white hover:text-blue-200 transition"
          >
            Home
          </Link>
          {/* <Link
            to="/profile"
            className="text-white hover:text-blue-200 transition"
          >
            Profile
          </Link> */}
          {/* <Link
            to="/settings"
            className="text-white hover:text-blue-200 transition"
          >
            Settings
          </Link> */}
          <Link
            to="/login"
            className="text-white hover:text-blue-200 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-white hover:text-blue-200 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
