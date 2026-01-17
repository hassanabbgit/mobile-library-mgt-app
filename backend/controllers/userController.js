const db = require("../db");
const { hashPassword, comparePassword } = require("../utils/password");
/**
 * GET /users/me
 * Get logged-in user's profile
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db("users")
      .select("id", "name", "email", "role", "created_at")
      .where({ id: userId })
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET /users/students
 * Get all users with role 'user' (students)
 * Admin-only route
 */
exports.getAllStudents = async (req, res) => {
  try {
    const students = await db("users")
      .select("id", "name", "email", "created_at")
      .where({ role: "user" })
      .orderBy("name", "asc");

    return res.json(students);
  } catch (err) {
    console.error("Get all students error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



/**
 * GET /users/recent-students
 * Get recently registered students
 * Admin-only route
 * Optional query param: ?limit=5
 */
exports.getRecentStudents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5; // default 5

    const students = await db("users")
      .select("id", "name", "email", "created_at")
      .where({ role: "user" })
      .orderBy("created_at", "desc")
      .limit(limit);

    return res.json(students);
  } catch (err) {
    console.error("Get recent students error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



/**
 * PUT /users/me
 * Update logged-in user's profile (name, email)
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // Optional: check if email already exists for another user
    if (email) {
      const existing = await db("users")
        .where({ email })
        .andWhereNot({ id: userId })
        .first();
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    await db("users")
      .where({ id: userId })
      .update({ name, email });

    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /users/change-password
 * Change logged-in user's password
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password are required" });
    }

    const user = await db("users").where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await comparePassword(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const newHash = await hashPassword(newPassword);

    await db("users").where({ id: userId }).update({ password_hash: newHash });

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
