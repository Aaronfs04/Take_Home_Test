const express = require("express");
const cors = require("cors");
const db = require("./database");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//buat ngambil data
app.get("/api/transactions", (req, res) => {
  try {
    const stmt = db.prepare(
      "SELECT * FROM transactions ORDER BY transactionDate DESC",
    );
    const transactions = stmt.all();
    res.json({
      status: "success",
      total: transactions.length,
      data: transactions,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

//ngambil data
app.get("/api/transactions/:id", (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare("SELECT * FROM transactions WHERE id = ?");
    const item = stmt.get(Number(id));

    if (!item) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaksi gak ditemukan" });
    }

    res.json({ status: "success", data: item });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

//buat data baru
app.post("/api/transactions", (req, res) => {
  try {
    const {
      productID,
      productName,
      amount,
      customerName,
      status,
      transactionDate,
    } = req.body;

    if (!productID || !productName || !amount || !customerName) {
      return res.status(400).json({
        status: "error",
        message:
          "Field productID, productName, amount, dan customerName wajib diisi",
      });
    }

    const maxIdStmt = db.prepare("SELECT MAX(id) as maxId FROM transactions");
    const nextId = (maxIdStmt.get().maxId || 0) + 1;

    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const now = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const finalDate = transactionDate || now;

    const insertStmt = db.prepare(`
      INSERT INTO transactions (id, productID, productName, amount, customerName, status, transactionDate, createBy, createOn)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      nextId,
      productID,
      productName,
      parseFloat(amount),
      customerName,
      status !== undefined ? Number(status) : 0,
      finalDate,
      "User",
      now,
    );

    const newItem = db
      .prepare("SELECT * FROM transactions WHERE id = ?")
      .get(nextId);

    res.status(201).json({
      status: "success",
      message: "Transaksi berhasil ditambahkan",
      data: newItem,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

//edit data yang ada
app.put("/api/transactions/:id", (req, res) => {
  try {
    const { id } = req.params;
    const checkStmt = db.prepare("SELECT * FROM transactions WHERE id = ?");
    const existing = checkStmt.get(Number(id));

    if (!existing) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaksi tidak ditemukan" });
    }

    const {
      productID,
      productName,
      amount,
      customerName,
      status,
      transactionDate,
    } = req.body;

    const updateStmt = db.prepare(`
      UPDATE transactions
      SET productID = ?,
          productName = ?,
          amount = ?,
          customerName = ?,
          status = ?,
          transactionDate = ?
      WHERE id = ?
    `);

    updateStmt.run(
      productID || existing.productID,
      productName || existing.productName,
      amount !== undefined ? parseFloat(amount) : existing.amount,
      customerName || existing.customerName,
      status !== undefined ? Number(status) : existing.status,
      transactionDate || existing.transactionDate,
      Number(id),
    );

    const updatedItem = checkStmt.get(Number(id));

    res.json({
      status: "success",
      message: "Transaksi berhasil diperbarui",
      data: updatedItem,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

//hapus data
app.delete("/api/transactions/:id", (req, res) => {
  try {
    const { id } = req.params;
    const deleteStmt = db.prepare("DELETE FROM transactions WHERE id = ?");
    deleteStmt.run(Number(id));

    res.json({
      status: "success",
      message: `Transaksi ID #${id} berhasil dihapus`,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:5000/api/transactions`);
});
