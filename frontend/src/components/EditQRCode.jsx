import React from "react";

const EditQRCode = ({ editData, setEditData, handleUpdate }) => {
  return (
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
  );
};

export default EditQRCode;
