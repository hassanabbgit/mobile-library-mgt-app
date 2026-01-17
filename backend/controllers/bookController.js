const db = require("../db");
const generateQR = require("../utils/qrGenerator");
const { v4: uuidv4 } = require("uuid");

/**
 * GET /books
 * List all books
 */
exports.getBooks = async (req, res) => {
  try {
    const books = await db("books").select("*");
    return res.json(books);
  } catch (err) {
    console.error("Get books error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /books/search?q=
 * Search books by title or author
 */
exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query required" });
    }

    const books = await db("books")
      .where("title", "like", `%${q}%`)
      .orWhere("author", "like", `%${q}%`);

    return res.json(books);
  } catch (err) {
    console.error("Search books error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /books/qr/:code
 * Get book by QR code
 */
exports.getBookByQR = async (req, res) => {
  try {
    const { code } = req.params;

    const book = await db("books").where({ qr_code: code }).first();
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json(book);
  } catch (err) {
    console.error("Get book by QR error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /books
 * Add new book (admin only)
 */
exports.addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      description,
      quantity_total,
    } = req.body;

    if (!title || !quantity_total) {
      return res.status(400).json({ message: "Title and quantity required" });
    }

    const qrValue = `BOOK-${uuidv4()}`;

    const [id] = await db("books").insert({
      title,
      author,
      category,
      description,
      quantity_total,
      quantity_available: quantity_total,
      qr_code: qrValue,
    });

    const qrImage = await generateQR(qrValue);

    return res.status(201).json({
      message: "Book added successfully",
      bookId: id,
      qr_code: qrValue,
      qr_image: qrImage,
    });
  } catch (err) {
    console.error("Add book error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /books/:id
 * Update book (admin only)
 */
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await db("books").where({ id }).update(req.body);
    if (!updated) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json({ message: "Book updated successfully" });
  } catch (err) {
    console.error("Update book error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /books/:id
 * Delete book (admin only)
 */
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db("books").where({ id }).del();
    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Delete book error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};





/**
 * GET /books/:id
 * Get full details of a single book by ID
 */
exports.getBookDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await db("books")
      .select(
        "id",
        "title",
        "author",
        "category",
        "description",
        "quantity_total",
        "quantity_available",
        "qr_code",
        "created_at"
      )
      .where({ id })
      .first();

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json(book);
  } catch (err) {
    console.error("Get book detail error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
