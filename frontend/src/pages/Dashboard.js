import React, { useState, useEffect } from "react";
import axios from "axios";
import { account } from "../services/appwriteConfig";
import { toast } from "react-toastify";
import QRCodeInput from "../components/QRCodeInput";
import QRCodeDisplay from "../components/QRCodeDisplay";
import QRCodeList from "../components/QRCodeList";
import EditQRCode from "../components/EditQRCode";
import LogoutButton from "../components/LogoutButton";


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
      const response = await axios.put(`http://localhost:5000/api/qr/${editData.id}`, {
        userId: userId,
        data: editData.data,
      });

      const updatedQrCode = response.data;
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
      
      <QRCodeInput userInput={userInput} setUserInput={setUserInput} handleGenerateQR={handleGenerateQR} />

      {showQR && <QRCodeDisplay qrCodeUrl={qrCodeUrl} />}

      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-xl font-bold mb-4">Your QR Codes</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && qrCodes.length === 0 && <p>No QR codes available.</p>}
        <QRCodeList qrCodes={qrCodes} handleEdit={handleEdit} handleDelete={handleDelete} />
      </div>

      {editData.id && <EditQRCode editData={editData} setEditData={setEditData} handleUpdate={handleUpdate} />}

      <LogoutButton handleLogout={handleLogout} />
    </div>
  );
};

export default Dashboard;
