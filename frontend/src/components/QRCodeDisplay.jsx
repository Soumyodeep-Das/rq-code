import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeDisplay = ({ qrCodeUrl }) => {
  return (
    <div className="mt-6 text-center">
      <p className="font-semibold">Your QR Code:</p>
      <QRCodeCanvas value={qrCodeUrl} size={200} className="my-4" />
      <p className="text-sm text-gray-500">{qrCodeUrl}</p>
    </div>
  );
};

export default QRCodeDisplay;
