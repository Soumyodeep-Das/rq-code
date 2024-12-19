import React from "react";

const QRCodeInput = ({ userInput, setUserInput, handleGenerateQR }) => {
  return (
    <div className="w-full max-w-md px-4">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter URL (https://website.domain) or text"
        className="w-full p-3 border rounded mb-4 shadow-sm focus:outline-blue-500"
      />
      <button
        onClick={handleGenerateQR}
        className="w-full p-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
      >
        Generate QR Code
      </button>
    </div>
  );
};

export default QRCodeInput;
