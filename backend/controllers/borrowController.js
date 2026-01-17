const db = require("../db");
const { addDays } = require("../utils/date");


/**
 * POST /borrow/borrow-qr/:qrCode
 * Borrow a book by scanning its QR code
 */
exports.borrowBookByQR = async (req, res) => {
  const trx = await db.transaction();

  try {
    const userId = req.user.id;
    const { qrCode } = req.params;

    // Find book by QR code
    const book = await trx("books").where({ qr_code: qrCode }).first();
    if (!book) {
      await trx.rollback();
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.quantity_available < 1) {
      await trx.rollback();
      return res.status(400).json({ message: "Book not available" });
    }

    // Prevent duplicate borrow
    const existing = await trx("borrow_records")
      .where({ user_id: userId, book_id: book.id, status: "borrowed" })
      .first();

    if (existing) {
      await trx.rollback();
      return res.status(400).json({ message: "You already borrowed this book" });
    }

    // Create borrow record
    await trx("borrow_records").insert({
      user_id: userId,
      book_id: book.id,
      borrowed_at: new Date(),
      due_date: addDays(14),
      status: "borrowed",
    });

    // Decrease available quantity
    await trx("books")
      .where({ id: book.id })
      .update({ quantity_available: book.quantity_available - 1 });

    await trx.commit();

    return res.status(201).json({
      message: "Book borrowed successfully",
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
      },
    });
  } catch (err) {
    await trx.rollback();
    console.error("Borrow by QR error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /borrow/return-qr/:qrCode
 * Return a book by scanning its QR code
 */
exports.returnBookByQR = async (req, res) => {
  const trx = await db.transaction();

  try {
    const userId = req.user.id;
    const { qrCode } = req.params;

    // Find book by QR
    const book = await trx("books").where({ qr_code: qrCode }).first();
    if (!book) {
      await trx.rollback();
      return res.status(404).json({ message: "Book not found" });
    }

    // Find active borrow record
    const record = await trx("borrow_records")
      .where({ user_id: userId, book_id: book.id, status: "borrowed" })
      .first();

    if (!record) {
      await trx.rollback();
      return res.status(400).json({ message: "No active borrow record found for this book" });
    }

    // Mark as returned
    await trx("borrow_records")
      .where({ id: record.id })
      .update({
        returned_at: new Date(),
        status: "returned",
      });

    // Increase available quantity
    await trx("books")
      .where({ id: book.id })
      .update({ quantity_available: book.quantity_available + 1 });

    await trx.commit();

    return res.json({
      message: "Book returned successfully",
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
      },
    });
  } catch (err) {
    await trx.rollback();
    console.error("Return by QR error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



/**
 * GET /borrow/history
 * User borrowing history
 */
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await db("borrow_records as br")
      .join("books as b", "br.book_id", "b.id")
      .select(
        "br.id",
        "b.title",
        "b.author",
        "br.borrowed_at",
        "br.due_date",
        "br.returned_at",
        "br.status"
      )
      .where("br.user_id", userId)
      .orderBy("br.borrowed_at", "desc");

    return res.json(history);
  } catch (err) {
    console.error("Get history error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /borrow/admin/all-borrowed
 * Admin: view all borrowed books
 */
/**
exports.getAllBorrowed = async (req, res) => {
  try {
    const records = await db("borrow_records as br")
      .join("users as u", "br.user_id", "u.id")
      .join("books as b", "br.book_id", "b.id")
      .select(
        "br.id",
        "u.name as user_name",
        "u.email",
        "b.title",
        "b.author",
        "br.borrowed_at",
        "br.due_date",
        "br.returned_at",
        "br.status"
      )
      .orderBy("br.borrowed_at", "desc");

    return res.json(records);
  } catch (err) {
    console.error("Admin borrowed list error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
*/


/**
 * GET /borrows/admin/borrowed
 * Admin: currently borrowed books
 */
exports.getCurrentlyBorrowed = async (req, res) => {
  try {
    const records = await db("borrow_records as br")
      .join("users as u", "br.user_id", "u.id")
      .join("books as b", "br.book_id", "b.id")
      .select(
        "br.id",
        "u.name as user_name",
        "u.email",
        "b.title",
        "b.author",
        "br.borrowed_at",
        "br.due_date"
      )
      .where("br.status", "borrowed")
      .orderBy("br.borrowed_at", "desc");

    return res.json(records);
  } catch (err) {
    console.error("Current borrowed error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};




/**
 * GET /borrows/admin/borrow-history
 * Admin: history of all borrowed books
 */
exports.getAllBorrowHistory = async (req, res) => {
  try {
    const records = await db("borrow_records as br")
      .join("users as u", "br.user_id", "u.id")
      .join("books as b", "br.book_id", "b.id")
      .select(
        "br.id",
        "u.name as user_name",
        "u.email",
        "b.title",
        "b.author",
        "br.borrowed_at",
        "br.returned_at",
        "br.status"
      )
      .orderBy("br.borrowed_at", "desc");

    return res.json(records);
  } catch (err) {
    console.error("Borrow history error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};




/**
 * GET /borrow/recent
 * Get recently borrowed books
 * Admin-only route
 * Default limit: 10
 */
exports.getRecentBorrows = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const recentBorrows = await db("borrow_records as br")
      .join("books as b", "br.book_id", "b.id")
      .join("users as u", "br.user_id", "u.id")
      .select(
        "br.id",
        "b.title",
        "b.author",
        "u.name as user_name",
        "u.email",
        "br.borrowed_at",
        "br.due_date",
        "br.status"
      )
      .where("br.status", "borrowed") // only currently borrowed, optional: include all
      .orderBy("br.borrowed_at", "desc")
      .limit(limit);

    return res.json(recentBorrows);
  } catch (err) {
    console.error("Get recent borrows error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
