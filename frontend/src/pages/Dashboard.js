import React, { useState, useEffect } from "react";
import axios from "axios";
import { account } from "../services/appwriteConfig";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react"; // Render QR codes

const Dashboard = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [editData, setEditData] = useState({ id: null, data: "" });

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
      setQrCodeUrl(qrCodeImage);
      setShowQR(true);
      toast.success("QR Code generated successfully!");

      setQrCodes((prev) => [...prev, { qrCodeId, data }]);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Error generating QR code.");
    }
  };

  const handleDelete = async (qrCodeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/qr/${qrCodeId}`);
      setQrCodes(qrCodes.filter((code) => code.qrCodeId !== qrCodeId));
      toast.success("QR Code deleted successfully!");
    } catch (err) {
      console.error("Failed to delete QR code:", err);
      toast.error("Failed to delete QR code.");
    }
  };

  const handleEdit = (qrCode) => {
    setEditData({ id: qrCode.qrCodeId, data: qrCode.data });
  };

  const handleUpdate = async () => {
    if (!editData.data) {
      toast.error("Please provide valid data!");
      return;
    }
  
    try {
      // Use a PUT or PATCH request to update the existing QR code
      const response = await axios.put(`http://localhost:5000/api/qr/${editData.id}`, {
        userId: userId,
        data: editData.data,
      });
  
      const updatedQrCode = response.data;
  
      // Update the local state with the updated QR code data
      setQrCodes((prev) =>
        prev.map((qr) =>
          qr.qrCodeId === editData.id ? { ...qr, data: updatedQrCode.data } : qr
        )
      );
  
      setEditData({ id: null, data: "" });
      toast.success("QR Code updated successfully!");
    } catch (error) {
      console.error("Error updating QR code:", error);
      toast.error("Error updating QR code.");
    }
  };
  

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">QR Code Dashboard</h1>

      <div className="w-full max-w-md px-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter URL or text"
          className="w-full p-3 border rounded mb-4 shadow-sm focus:outline-blue-500"
        />

        <button
          onClick={handleGenerateQR}
          className="w-full p-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
        >
          Generate QR Code
        </button>
      </div>

      {showQR && (
        <div className="mt-6 text-center">
          <p className="font-semibold">Your QR Code:</p>
          <QRCodeCanvas value={qrCodeUrl} size={200} className="my-4" />
          <p className="text-sm text-gray-500">{qrCodeUrl}</p>
        </div>
      )}

      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-xl font-bold mb-4">Your QR Codes</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && qrCodes.length === 0 && <p>No QR codes available.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {qrCodes.map((qr) => (
            <div
              key={qr.qrCodeId}
              className="p-4 border rounded shadow-md bg-white"
            >
              <p className="text-sm font-bold text-gray-600 mb-2">
                QR Code ID: {qr.qrCodeId}
              </p>
              <QRCodeCanvas value={qr.data} size={100} className="mb-4" />
              <p className="text-sm text-gray-500 mb-4">{qr.data}</p>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  onClick={() => handleEdit(qr)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => handleDelete(qr.qrCodeId)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editData.id && (
        <div className="mt-8 w-full max-w-md">
          <h3 className="text-lg font-bold mb-4">Edit QR Code</h3>
          <input
            type="text"
            value={editData.data}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, data: e.target.value }))
            }
            className="w-full p-3 border rounded mb-4 focus:outline-blue-500"
          />
          <button
            onClick={handleUpdate}
            className="w-full p-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
          >
            Update QR Code
          </button>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-12 px-6 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
