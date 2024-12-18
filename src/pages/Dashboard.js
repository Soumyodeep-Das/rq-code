import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { account } from "../services/appwriteConfig";

const Dashboard = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQR, setShowQR] = useState(false);

  const handleGenerateQR = async () => {
    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "unique_userid",
          data: "User-specific data goes here",
        }),
      });

      const result = await response.json();
      if (result.success) {
        const userId = "unique_userid"; // Replace dynamically
        const url = `https://websitename.com/${userId}`;
        setQrCodeUrl(url);
        setShowQR(true);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current"); // Logout user
      window.location.href = "/login"; // Redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
      <button
        onClick={handleGenerateQR}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Generate QR Code
      </button>

      {showQR && (
        <div className="mt-4">
          <p>Your QR Code:</p>
          <QRCodeCanvas value={qrCodeUrl} size={200} />
          <p className="mt-2">Scan this code: {qrCodeUrl}</p>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
