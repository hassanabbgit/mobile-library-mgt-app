const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Public
router.post("/register-user", authController.registerUser);   // users create accounts
router.post("/login", authController.login);             // shared for user & admin

// Admin only
router.post("/create-admin", auth, admin, authController.createAdmin);

module.exports = router;
