const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrowController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// User actions
// User borrow/return via QR
router.post("/borrow-qr/:qrCode", auth, borrowController.borrowBookByQR);
router.post("/return-qr/:qrCode", auth, borrowController.returnBookByQR);

router.get("/history", auth, borrowController.getHistory);

// Admin-only
//router.get("/admin/all-borrowed", auth, admin, borrowController.getAllBorrowed);
router.get("/admin/borrowed", auth, admin, borrowController.getCurrentlyBorrowed);
router.get("/admin/borrow-history", auth, admin, borrowController.getAllBorrowHistory);
// Admin-only: recently borrowed books
router.get("/admin/recent", auth, admin, borrowController.getRecentBorrows);



module.exports = router;
