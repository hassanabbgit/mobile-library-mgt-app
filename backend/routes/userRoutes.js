const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// User profile
router.get("/me", auth, userController.getProfile);

// Get all students (admin only)
router.get("/students", auth, admin, userController.getAllStudents);

// Admin-only: recently registered students
router.get("/recent-students", auth, admin, userController.getRecentStudents);

// Update profile
router.put("/update-profile", auth, userController.updateProfile);

// Change password
router.put("/change-password", auth, userController.changePassword);



module.exports = router;
