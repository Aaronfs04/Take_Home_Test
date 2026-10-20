# Full Stack Developer Test

Aplikasi web transaksi full-stack yang mengonsumsi data transaksi dari `viewData.json`, menyimpannya ke database SQLite, menyediakan REST API menggunakan Express.js, dan menampilkan antarmuka modern interaktif berbasis React + TypeScript.

---

## 🛠️ Tech Stack
- **Database:** SQLite (menggunakan `node:sqlite` bawaan Node.js tanpa dependensi eksternal)
- **Backend API:** Node.js, Express.js, CORS (Port `5000`)
- **Frontend UI:** React.js, TypeScript, Vite, CSS Modules (Port `5173`)

---

## 📋 Fitur & Persyaratan yang Dipenuhi
1. **Database & Seeder:** Otomatis membaca dan memasukkan 12 data dari `viewData.json` ke dalam tabel SQLite saat pertama kali dijalankan.
2. **Grid Table (Halaman Data):** Menampilkan daftar transaksi yang dikelompokkan berdasarkan **Tahun & Bulan** (`transactionDate`) lengkap dengan badge status dan format Rupiah.
3. **Tambah Data (Input Page):** Form validasi untuk menambahkan transaksi baru dengan tanggal otomatis lokal/manual.
4. **Edit & Hapus Data (Edit Page):** Pencarian berdasarkan ID atau klik baris tabel untuk memuat form edit, memperbarui data (`PUT`), atau menghapus transaksi (`DELETE`).
5. **Lihat Detail Data (Detail Page):** Pencarian ID transaksi atau klik baris tabel untuk melihat seluruh rincian transaksi (termasuk `createBy` dan `createOn`).

---

## 🚀 Cara Menjalankan Project

### 1. Menjalankan Backend API
Buka terminal pertama:
```bash
cd backend
npm install
node server.js
```
> Server backend akan berjalan di `http://localhost:5000` dan otomatis menginisialisasi SQLite database `database.sqlite`.

### 2. Menjalankan Frontend
Buka terminal kedua:
```bash
cd frontend
npm install
npm run dev
```
> Akses aplikasi web melalui browser di `http://localhost:5173`.

---

## 📡 Daftar Endpoint REST API
- `GET /api/transactions` — Mengambil seluruh data transaksi
- `GET /api/transactions/:id` — Mengambil detail 1 transaksi berdasarkan ID
- `POST /api/transactions` — Menambahkan transaksi baru
- `PUT /api/transactions/:id` — Mengubah data transaksi berdasarkan ID
- `DELETE /api/transactions/:id` — Menghapus transaksi berdasarkan ID

