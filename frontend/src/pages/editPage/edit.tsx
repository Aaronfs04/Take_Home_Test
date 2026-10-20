import React, { useState, useEffect } from 'react';
import styles from './edit.module.css';

interface Transaction {
  id: number;
  productID: string;
  productName: string;
  amount: number;
  customerName: string;
  status: number;
  transactionDate: string;
  createBy: string;
  createOn: string;
}

interface EditProps {
  onBack?: () => void;
}

const EditPage: React.FC<EditProps> = ({ onBack }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchId, setSearchId] = useState('');
  const [selectedItem, setSelectedItem] = useState<Transaction | null>(null);

  // Form states untuk data yang sedang diedit
  const [productID, setProductID] = useState('');
  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [status, setStatus] = useState<number>(0);
  const [transactionDate, setTransactionDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Memuat data dari database
  const loadTransactions = () => {
    fetch('http://localhost:5000/api/transactions')
      .then((res) => res.json())
      .then((res) => setTransactions(res.data || []))
      .catch((err) => console.error('Gagal mengambil data:', err));
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Ketika baris tabel diklik atau ID dipilih
  const handleSelectTransaction = (item: Transaction) => {
    setSelectedItem(item);
    setProductID(item.productID);
    setProductName(item.productName);
    setAmount(item.amount.toString());
    setCustomerName(item.customerName);
    setStatus(item.status);
    setTransactionDate(item.transactionDate);
    setMessage(null);
  };

  // Cari ID jika user mengetik di search bar
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = transactions.find((t) => t.id.toString() === searchId.trim());
    if (found) {
      handleSelectTransaction(found);
    } else {
      setMessage({ text: `Transaksi dengan ID #${searchId} tidak ditemukan.`, type: 'error' });
    }
  };

  // Simpan perubahan ke API (PUT /api/transactions/:id)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        productID,
        productName,
        amount: parseFloat(amount),
        customerName,
        status: Number(status),
        transactionDate,
      };

      const res = await fetch(`http://localhost:5000/api/transactions/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage({ text: `🎉 Transaksi #${selectedItem.id} berhasil diperbarui di Database!`, type: 'success' });
        loadTransactions();
      } else {
        setMessage({ text: result.message || 'Gagal mengubah data.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Terjadi kesalahan koneksi ke backend.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Hapus transaksi (DELETE /api/transactions/:id)
  const handleDeleteTransaction = async (id: number) => {
    const isConfirm = window.confirm(
      `Apakah Anda yakin ingin menghapus transaksi #${id}? Data yang dihapus tidak dapat dipulihkan.`
    );
    if (!isConfirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ text: `🗑️ Transaksi #${id} berhasil dihapus dari Database!`, type: 'success' });
        if (selectedItem?.id === id) {
          setSelectedItem(null);
        }
        loadTransactions();
      } else {
        setMessage({ text: data.message || 'Gagal menghapus data.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Gagal terhubung ke backend server.', type: 'error' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={onBack} className={styles.backBtn}>
          ← Kembali ke Beranda
        </button>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>Edit & Kelola Data Transaksi</h1>
        <p className={styles.subtitle}>
          Ketik nomor ID transaksi atau klik langsung pada baris tabel di bawah untuk mengedit atau menghapus data.
        </p>
      </div>

      {/* Input Pencarian ID */}
      <form onSubmit={handleSearchSubmit} className={styles.searchBox}>
        <input
          type="text"
          placeholder="Ketik ID Transaksi yang ingin diedit/dihapus (Contoh: 1372)..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value.replace(/[^0-9]/g, ''))}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.saveBtn} style={{ padding: '0.75rem 1.5rem', flex: 'none' }}>
          Pilih ID Ini
        </button>
      </form>

      {message && (
        <div className={message.type === 'success' ? styles.alertSuccess : styles.alertError}>
          {message.text}
        </div>
      )}

      {/* Form Edit Terbuka jika Ada Item yang Dipilih */}
      {selectedItem && (
        <div className={styles.editCard}>
          <div className={styles.editCardHeader}>
            <div className={styles.editCardTitle}>
              Mengedit Transaksi: <strong>#{selectedItem.id}</strong>
            </div>
            <button onClick={() => setSelectedItem(null)} className={styles.cancelBtn} style={{ padding: '0.4rem 0.8rem' }}>
              ✕ Tutup Form
            </button>
          </div>

          <form onSubmit={handleSaveEdit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Kode Produk</label>
                <input
                  type="text"
                  value={productID}
                  onChange={(e) => setProductID(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Nama Produk</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Nominal Transaksi (Rp)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Nama Pelanggan</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Status Transaksi</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value))}
                  className={styles.select}
                >
                  <option value={0}>SUCCESS (Berhasil)</option>
                  <option value={1}>FAILED (Gagal)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tanggal Transaksi</label>
                <input
                  type="text"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" disabled={loading} className={styles.saveBtn}>
                {loading ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTransaction(selectedItem.id)}
                className={styles.deleteBtn}
              >
                🗑️ Hapus Transaksi Ini
              </button>
              <button type="button" onClick={() => setSelectedItem(null)} className={styles.cancelBtn}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Data Transaksi (Bisa Diklik & Ada Tombol Hapus) */}
      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Kode Produk</th>
                <th>Nama Produk</th>
                <th>Nominal</th>
                <th>Pelanggan</th>
                <th>Status</th>
                <th>Tanggal Transaksi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const isSelected = selectedItem?.id === t.id;
                return (
                  <tr
                    key={t.id}
                    onClick={() => handleSelectTransaction(t)}
                    className={`${styles.clickableRow} ${isSelected ? styles.activeRow : ''}`}
                  >
                    <td><strong>#{t.id}</strong></td>
                    <td>{t.productID}</td>
                    <td>{t.productName}</td>
                    <td>Rp {Number(t.amount).toLocaleString('id-ID')}</td>
                    <td>{t.customerName}</td>
                    <td>
                      <span className={t.status === 0 ? styles.badgeSuccess : styles.badgeFailed}>
                        {t.status === 0 ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </td>
                    <td>{t.transactionDate}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTransaction(t);
                          }}
                          className={styles.editRowBtn}
                        >
                          {isSelected ? 'Sedang Diedit' : 'Edit'}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTransaction(t.id);
                          }}
                          className={styles.deleteRowBtn}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
