import React, { useState, useEffect } from 'react';
import styles from './detail.module.css';

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

interface DetailProps {
  onBack?: () => void;
}

const DetailPage: React.FC<DetailProps> = ({ onBack }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchId, setSearchId] = useState('');
  const [selectedItem, setSelectedItem] = useState<Transaction | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/transactions')
      .then((res) => res.json())
      .then((res) => setTransactions(res.data || []))
      .catch((err) => console.error('Gagal mengambil data:', err));
  }, []);

  const formatRupiah = (val: number): string => {
    return `Rp ${Number(val || 0).toLocaleString('id-ID')}`;
  };

  const handleSelectTransaction = (item: Transaction) => {
    setSelectedItem(item);
    setErrorMsg(null);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${searchId.trim()}`);
      const result = await res.json();

      if (res.ok && result.data) {
        setSelectedItem(result.data);
      } else {
        setSelectedItem(null);
        setErrorMsg(`Transaksi dengan ID #${searchId} tidak ditemukan`);
      }
    } catch (err) {
      setErrorMsg('Gagal terhubung ke backend server');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={onBack} className={styles.backBtn}>
          Kembali ke Beranda
        </button>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>Detail Data Transaksi</h1>
        <p className={styles.subtitle}>
          Ketik ID transaksi atau klik langsung pada baris tabel di bawah untuk melihat rincian lengkap transaksi
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className={styles.searchBox}>
        <input
          type="text"
          placeholder="Ketik ID Transaksi yang ingin dilihat detailnya Contoh 1372"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value.replace(/[^0-9]/g, ''))}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>
          Lihat Detail ID Ini
        </button>
      </form>

      {errorMsg && <div className={styles.alertError}>{errorMsg}</div>}

      {selectedItem && (
        <div className={styles.detailCard}>
          <div className={styles.detailCardHeader}>
            <div className={styles.detailCardTitle}>
              <span>Rincian Lengkap Transaksi</span>
              <span className={selectedItem.status === 0 ? styles.badgeSuccess : styles.badgeFailed}>
                {selectedItem.status === 0 ? 'SUCCESS' : 'FAILED'}
              </span>
            </div>
            <button onClick={() => setSelectedItem(null)} className={styles.closeBtn}>
              Tutup
            </button>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>ID Transaksi</div>
              <div className={styles.detailValue}>#{selectedItem.id}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Kode Produk</div>
              <div className={styles.detailValue}>{selectedItem.productID}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nama Produk</div>
              <div className={styles.detailValue}>{selectedItem.productName}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nominal Pembayaran</div>
              <div className={styles.detailValue} style={{ color: '#16a34a' }}>
                {formatRupiah(selectedItem.amount)}
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nama Pelanggan</div>
              <div className={styles.detailValue}>{selectedItem.customerName}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Waktu Transaksi</div>
              <div className={styles.detailValue}>{selectedItem.transactionDate}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Dibuat Oleh (Create By)</div>
              <div className={styles.detailValue}>{selectedItem.createBy || '-'}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Waktu Dibuat (Create On)</div>
              <div className={styles.detailValue}>{selectedItem.createOn || '-'}</div>
            </div>
          </div>
        </div>
      )}

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
                    <td>{formatRupiah(t.amount)}</td>
                    <td>{t.customerName}</td>
                    <td>
                      <span className={t.status === 0 ? styles.badgeSuccess : styles.badgeFailed}>
                        {t.status === 0 ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </td>
                    <td>{t.transactionDate}</td>
                    <td>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTransaction(t);
                        }}
                        className={styles.viewBtn}
                      >
                        {isSelected ? 'Sedang Dilihat' : 'Lihat Detail'}
                      </button>
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

export default DetailPage;
