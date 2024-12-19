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

  // Fetch the user ID on initial render
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

  // Fetch QR codes when the userId changes
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_GET_QR_CODES_URL}/${userId}/qrcodes`)
      .then((response) => {
        setQrCodes(response.data); // This updates the qrCodes state and triggers re-render
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
      const response = await axios.post(process.env.REACT_APP_GENERATE_QR_URL, {
        userId: userId,
        data: userInput,
      });
  
      // Destructure the necessary data from the response
      const { qrCodeId, qrCodeImage, data, qrCodeUrl } = response.data.qrCode;
  
      // Validate that we have the necessary data
      if (!qrCodeId || !qrCodeImage || !data) {
        throw new Error("Missing QR code data in the response.");
      }
  
      // Log the values to check what's returned
      console.log("QR Code generated:", qrCodeId, qrCodeImage, data, qrCodeUrl );
  
      // Set the QR code URL (base64 string) to be displayed
      setQrCodeUrl(qrCodeImage);
      setShowQR(true);  // Show the QR code once it's generated
      toast.success("QR Code generated successfully!");
  
      // Update the list of QR codes with the new data
      setQrCodes((prevQrCodes) => [...prevQrCodes, { qrCodeId, data, qrCodeImage }]);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Error generating QR code.");
    }
  };
  
  
  

  const handleDelete = async (qrCodeId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_DELETE_QR_URL}/${qrCodeId}`);
      setQrCodes((prevQrCodes) => prevQrCodes.filter((code) => code.qrCodeId !== qrCodeId));
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
      const response = await axios.put(`${process.env.REACT_APP_UPDATE_QR_URL}/${editData.id}`, {
        userId: userId,
        data: editData.data,
      });

      const updatedQrCode = response.data;

      // Use functional update to ensure the qrCodes state is updated correctly
      setQrCodes((prevQrCodes) =>
        prevQrCodes.map((qr) =>
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
