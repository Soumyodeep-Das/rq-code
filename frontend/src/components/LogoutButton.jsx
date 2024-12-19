import React from "react";

const LogoutButton = ({ handleLogout }) => {
  return (
    <button
      onClick={handleLogout}
      className="mt-12 px-6 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
