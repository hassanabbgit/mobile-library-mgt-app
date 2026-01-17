const QRCode = require("qrcode");

async function generateQR(text) {
  try {
    return await QRCode.toDataURL(text); // returns Base64 image
  } catch (err) {
    console.error("QR Generation Error:", err);
    throw err;
  }
}

module.exports = generateQR;
