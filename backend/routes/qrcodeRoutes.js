// routes/qrcodeRoutes.js
const express = require("express");
const QRCode = require("qrcode");
const QRCodeData = require("../models/QRCodeData");

const router = express.Router();

// GET all QR codes by userId
router.get("/user/:userId/qrcodes", async (req, res) => {
  try {
    const qrCodes = await QRCodeData.find({ userId: req.params.userId });
    res.json(qrCodes);
  } catch (err) {
    console.error("Error fetching QR codes:", err);
    res.status(500).json({ error: "Failed to fetch QR codes" });
  }
});

// POST to generate a new QR code
router.post("/generate", async (req, res) => {
  const { userId, data } = req.body;
  try {
    const qrCodeImage = await QRCode.toDataURL(data);
    const qrCode = new QRCodeData({
      userId,
      data,
      qrCodeImage,
      qrCodeId: `qr_${new Date().getTime()}`,
    });
    await qrCode.save();
    res.status(200).json({ success: true, message: "QR Code created", qrCode });
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

// PUT to update an existing QR code
router.put("/qr/:qrCodeId", async (req, res) => {
  const { qrCodeId } = req.params;
  const { data, userId } = req.body;
  try {
    const qrCode = await QRCodeData.findOne({ qrCodeId });
    if (!qrCode) return res.status(404).json({ message: "QR Code not found" });
    if (qrCode.userId !== userId) return res.status(403).json({ message: "Unauthorized" });
    qrCode.data = data;
    qrCode.qrCodeImage = await QRCode.toDataURL(data);
    await qrCode.save();
    res.json({ success: true, message: "QR Code updated", qrCode });
  } catch (err) {
    console.error("Error updating QR code:", err);
    res.status(500).json({ error: "Failed to update QR code" });
  }
});

// DELETE a QR code
router.delete("/qr/:qrCodeId", async (req, res) => {
  try {
    const deletedQRCode = await QRCodeData.findOneAndDelete({ qrCodeId: req.params.qrCodeId });
    if (!deletedQRCode) return res.status(404).json({ message: "QR Code not found" });
    res.json({ message: "QR Code deleted successfully" });
  } catch (err) {
    console.error("Error deleting QR code:", err);
    res.status(500).json({ error: "Failed to delete QR code" });
  }
});

module.exports = router;
