// const mongoose = require("mongoose");

// const QRScheme = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   qrCodeId: { type: String, required: true, unique: true },
//   data: { type: String, required: true }, // Content linked to the QR code
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("QRCode", QRScheme);

const mongoose = require("mongoose");

const QRScheme = new mongoose.Schema({
  userId: { type: String, required: true }, // Change this to String
  qrCodeId: { type: String, required: true, unique: true },
  data: { type: String, required: true }, // Content linked to the QR code
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QRCode", QRScheme);
