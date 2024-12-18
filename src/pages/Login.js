import React, { useState } from "react";
import { account } from "../services/appwriteConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await account.createEmailSession(email, password);
      alert("Login successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-4 bg-white rounded shadow">
        <h2 className="mb-4 text-xl font-bold text-center">Login</h2>
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
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
