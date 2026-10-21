import React, { useState } from 'react';
import styles from './input.module.css';

interface InputProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

const InputData: React.FC<InputProps> = ({ onBack, onSuccess }) => {
  const [productID, setProductID] = useState('');
  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [status, setStatus] = useState<number>(0);
  const [transactionDate, setTransactionDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!productID || !productName || !amount || !customerName) {
      setMessage({ text: 'Mohon lengkapi semua data yang wajib diisi', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const formattedDate = transactionDate
        ? transactionDate.replace('T', ' ') + ':00'
        : undefined;

      const payload = {
        productID,
        productName,
        amount: parseFloat(amount),
        customerName,
        status: Number(status),
        transactionDate: formattedDate,
      };

      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Transaksi sudah ditambahkan', type: 'success' });
        setProductID('');
        setProductName('');
        setAmount('');
        setCustomerName('');
        setStatus(0);
        setTransactionDate('');

        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1200);
      } else {
        setMessage({ text: data.message || 'Gagal menyimpan transaksi', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: 'Tidak dapat terhubung ke server backend', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={onBack} className={styles.backBtn}>
          Kembali ke Beranda
        </button>
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>Tambah Transaksi Baru</h1>
        <p className={styles.subtitle}>
          Isi formulir di bawah ini untuk menambahkan transaksi baru
        </p>

        {message && (
          <div className={message.type === 'success' ? styles.alertSuccess : styles.alertError}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Kode Produk *</label>
              <input
                type="text"
                placeholder="Contoh: 10003"
                value={productID}
                onChange={(e) => setProductID(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Produk *</label>
              <input
                type="text"
                placeholder="Contoh: Kopi Susu Aren"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nominal Transaksi (Rp) *</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 25000"
                value={amount}
                onChange={(e) => {
                  const numericOnly = e.target.value.replace(/[^0-9]/g, '');
                  setAmount(numericOnly);
                }}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Pelanggan *</label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
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
              <label className={styles.label}>Tanggal Transaksi (Opsional)</label>
              <input
                type="datetime-local"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className={styles.cancelBtn}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputData;

