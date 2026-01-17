const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Public (logged-in users)
router.get("/get-books", auth, bookController.getBooks);
router.get("/search-books", auth, bookController.searchBooks);
router.get("/qr/:code", auth, bookController.getBookByQR);
router.get("/book-detail/:id", auth, bookController.getBookDetail);

// Admin-managed books
router.post("/add-book", auth, admin, bookController.addBook);
router.put("/update-book/:id", auth, admin, bookController.updateBook);
router.delete("/delete-book/:id", auth, admin, bookController.deleteBook);

module.exports = router;
