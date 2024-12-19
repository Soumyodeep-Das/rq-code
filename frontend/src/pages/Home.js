import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
        <h1 className="text-5xl font-extrabold mb-8 text-center shadow-lg shadow-purple-800/50">
          Welcome to the <br /> World of Reuseable QR Codes
        </h1>

        <p className="mb-6 text-lg text-gray-200 max-w-lg text-center">
          Generate, manage, and track your QR codes with ease. A seamless
          experience awaits you.
        </p>

        <div className="flex space-x-6">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>

        <footer className="mt-16 text-sm text-gray-200">
          Crafted with ♥ for seamless QR code experiences.
        </footer>
      </div>
    </>
  );
};

export default Home;
