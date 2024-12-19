const QRCodeDisplay = ({ qrCodeUrl }) => {
  if (!qrCodeUrl) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold">Generated QR Code</h3>
      {/* Display the QR code image using the base64 string */}
      <img src={qrCodeUrl} alt="QR Code" className="mt-2" />
    </div>
  );
};

export default QRCodeDisplay;
