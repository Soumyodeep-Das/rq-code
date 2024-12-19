import React, { useState, useEffect } from "react";
import axios from "axios";
import { account } from "../services/appwriteConfig";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";  // Using the QRCodeCanvas to render the QR code

const Dashboard = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");  // For displaying QR code
  const [showQR, setShowQR] = useState(false);
  const [userInput, setUserInput] = useState("");  // For storing user input (text or URL)
  const [qrCodes, setQrCodes] = useState([]);  // For storing fetched QR codes from the backend
  const [loading, setLoading] = useState(false);  // For loading state
  const [error, setError] = useState("");  // For error handling
  const [userId, setUserId] = useState("");  // For storing user ID

  // Fetch user ID dynamically from Appwrite
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
      } catch (err) {
        console.error("Failed to fetch user ID", err);
        toast.error("Failed to fetch user details.");
      }
    };

    fetchUserId();
  }, []);

  // Fetch QR Codes with analytics for the logged-in user
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/user/${userId}/qrcodes`)
      .then((response) => {
        setQrCodes(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch QR codes", err);
        toast.error("Failed to fetch QR code analytics.");
        setError("Failed to fetch QR code analytics.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Handle the form submission to generate a QR code
  const handleGenerateQR = async () => {
    if (!userId || !userInput) {
      toast.error("Please provide valid data!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/generate", {
        userId: userId,
        data: userInput,
      });

      const { qrCodeId, qrCodeImage, data } = response.data;
      setQrCodeUrl(qrCodeImage);  // Set the base64 string for QR code
      setShowQR(true);
      toast.success("QR Code generated successfully!");

      // Optionally, add new QR code to the list
      setQrCodes((prev) => [...prev, { qrCodeId, data }]);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Error generating QR code.");
    }
  };

  // Handle deleting a QR code
  const handleDelete = async (qrCodeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/qr/${qrCodeId}`, {
        headers: { Authorization: "Bearer valid_token" }, // Replace with actual token
      });
      setQrCodes(qrCodes.filter((code) => code.qrCodeId !== qrCodeId));
      toast.success("QR Code deleted successfully!");
    } catch (err) {
      console.error("Failed to delete QR code:", err);
      toast.error("Failed to delete QR code.");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      window.location.href = "/login"; // Redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">QR Code Generator & Analytics</h1>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter URL or text"
        className="p-2 border mb-4"
      />

      <button
        onClick={handleGenerateQR}
        className="p-2 bg-blue-500 text-white rounded mb-4"
      >
        Generate QR Code
      </button>

      {showQR && (
        <div className="mt-4">
          <p>Your QR Code:</p>
          {/* Use <QRCodeCanvas /> to render the QR code */}
          <QRCodeCanvas value={qrCodeUrl} size={200} />
          <p className="mt-2">Scan this code: {qrCodeUrl}</p>
        </div>
      )}

      <h2 className="text-xl font-bold mt-6">Your QR Codes</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && qrCodes.length === 0 && <p>No QR codes available.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {qrCodes.map((qr) => (
          <div key={qr.qrCodeId} className="p-4 border rounded shadow">
            <p className="text-lg">QR Code ID: {qr.qrCodeId}</p>
            <p className="text-sm text-gray-600">Data: {qr.data}</p>
            {/* Render stored QR code images */}
            <QRCodeCanvas value={qr.data} size={100} />
            <button
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => handleDelete(qr.qrCodeId)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

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
