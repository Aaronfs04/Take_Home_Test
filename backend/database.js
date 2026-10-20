const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");
const dbPath = path.join(__dirname, "database.sqlite");
const db = new DatabaseSync(dbPath);
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY,
      productID TEXT NOT NULL,
      productName TEXT NOT NULL,
      amount REAL NOT NULL,
      customerName TEXT NOT NULL,
      status INTEGER NOT NULL,
      transactionDate TEXT NOT NULL,
      createBy TEXT,
      createOn TEXT
    );
  `);

  const countStmt = db.prepare("SELECT COUNT(*) as count FROM transactions");
  const result = countStmt.get();
  if (result.count === 0) {
    console.log("Memasukan data yang sudah disiapkan..");
    const jsonPath = path.join(__dirname, "..", "viewData.json");
    if (fs.existsSync(jsonPath)) {
      try {
        const rawData = fs.readFileSync(jsonPath, "utf-8");
        const parsed = JSON.parse(rawData);
        const transactions = parsed.data || [];
        const insertStmt = db.prepare(`
          INSERT INTO transactions (id, productID, productName, amount, customerName, status, transactionDate, createBy, createOn)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const item of transactions) {
          insertStmt.run(
            item.id,
            item.productID,
            item.productName,
            parseFloat(item.amount) || 0,
            item.customerName,
            item.status,
            item.transactionDate,
            item.createBy,
            item.createOn,
          );
        }
        console.log(
          `data sudah diimpor ${transactions.length} sudah dimasukin ke database`,
        );
      } catch (err) {
        console.error("Json gagal dibaca:", err.message);
      }
    }
  } else {
    console.log(`ℹDatabase sudah siap ${result.count} transaksi.`);
  }
}
initDatabase();
module.exports = db;
