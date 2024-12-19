import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeList = ({ qrCodes, handleEdit, handleDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {qrCodes.map((qr, index) => (
        <div
          key={qr.qrCodeId || index}
          className="p-4 border rounded shadow-md bg-white"
        >
          <p className="text-sm font-bold text-gray-600 mb-2">
            QR Code ID: {qr.qrCodeId}
          </p>
          <QRCodeCanvas value={qr.qrData} size={100} className="mb-4" />
          {/* <QRCodeDisplay qrCodeUrl={qr.qrData} /> */}
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
  );
};

export default QRCodeList;
