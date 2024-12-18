import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>
      <Link to="/dashboard" className="p-2 bg-green-500 text-white rounded">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Home;
