import React, { useState } from "react";
import { account } from "../services/appwriteConfig";
import Navbar from "../components/Navbar";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await account.create("unique()", email, password, name);
      alert("Signup successful! Please log in.");
    } catch (error) {
      console.error("Signup failed:", error);
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-sm p-4 bg-white rounded shadow"
        >
          <h2 className="mb-4 text-xl font-bold text-center">Signup</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Signup
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;
